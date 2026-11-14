import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('.impeccable/review', {recursive:true});
const browser = await chromium.launch({channel:'msedge', headless:true});
const report=[];
for (const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]) {
  const context=await browser.newContext({viewport, colorScheme:'dark', isMobile:name==='mobile', hasTouch:name==='mobile', reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3200/');
  await page.locator('.leaflet-container').waitFor();
  await page.waitForFunction(() => {
    const tiles = [...document.querySelectorAll('.leaflet-tile')];
    return tiles.length > 0 && tiles.every(tile => tile.complete && tile.naturalWidth > 0 && getComputedStyle(tile).opacity === '1');
  }, null, {timeout:20000});
  report.push({name,stage:'planner',errors,metrics:await page.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
    const w=document.documentElement.clientWidth;
    return {width:w,scroll:document.documentElement.scrollWidth,viewport:innerWidth,
      search:box(document.querySelector('#location-search')),
      compare:box(document.querySelector('.compare-action')),
      map:box(document.querySelector('#farm-map-region')),
      tiles:document.querySelectorAll('.leaflet-tile-loaded').length,
      overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>w+1 && !e.closest('.leaflet-pane')).map(e=>({tag:e.tagName,class:e.className,...box(e)})).slice(0,8)};
  })});
  await page.screenshot({path:'.impeccable/review/'+name+'.png',fullPage:true,animations:'disabled'});
  await page.screenshot({path:'.impeccable/review/'+name+'-viewport.png',animations:'disabled'});
  let releaseResponse;
  const responseGate = new Promise(resolve => { releaseResponse = resolve; });
  await page.route('https://nominatim.openstreetmap.org/search?**', async route => {
    await responseGate;
    await route.fulfill({json:[{place_id:1,display_name:'Legazpi City, Albay, Philippines',lat:'13.1391',lon:'123.7438'}]});
  });
  const query=page.getByRole('searchbox',{name:'Search in Albay',exact:true});
  await query.fill('Legazpi');
  const request=page.waitForRequest('https://nominatim.openstreetmap.org/search?**');
  await page.getByRole('button',{name:'Search',exact:true}).click();
  await request;
  const corn=page.getByRole('checkbox',{name:'Corn',exact:true});
  await corn.focus();
  releaseResponse();
  await expect(page.locator('#location-search-status')).toHaveText('1 places found in Albay.');
  await expect(corn).toBeFocused();
  await expect(page.locator('#location-results')).toHaveAttribute('aria-expanded','false');
  report.push({name,stage:'delayed-search',focusedCrop:await corn.evaluate(e=>e===document.activeElement),dropdownOpen:await page.locator('#location-results').getAttribute('aria-expanded')});
  await page.screenshot({path:'.impeccable/review/'+name+'-delayed-search.png',animations:'disabled'});
  await page.getByRole('button',{name:'Enter farm coordinates instead',exact:true}).click();
  await page.getByLabel('Latitude (° N)',{exact:true}).fill('13.1391');
  await page.getByLabel('Longitude (° E)',{exact:true}).fill('123.7438');
  await page.getByRole('button',{name:'Use coordinates',exact:true}).click();
  await page.getByRole('button',{name:'Compare demo rotations',exact:true}).click();
  await page.waitForURL('**/analysis');
  await page.getByRole('heading',{name:'Compare rotations',exact:true}).waitFor();
  await page.screenshot({path:'.impeccable/review/'+name+'-analysis.png',fullPage:true,animations:'disabled'});
  await page.getByRole('link',{name:'View trade-offs for Water-Smart Rotation',exact:true}).click();
  await page.waitForURL('**/analysis/option-1');
  await page.getByRole('heading',{name:'Water-Smart Rotation',exact:true}).waitFor();
  await page.screenshot({path:'.impeccable/review/'+name+'-detail.png',fullPage:true,animations:'disabled'});
  await context.close();
}
const narrow=await browser.newPage({viewport:{width:320,height:800}});
await narrow.goto('http://127.0.0.1:3200/');
await narrow.evaluate(()=>document.documentElement.style.fontSize='200%');
report.push({name:'320-large-text',metrics:await narrow.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}))});
await fs.writeFile('.impeccable/review/layout-metrics.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();

