import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('.impeccable/review/white-controls', {recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
for (const [name,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
  const context=await browser.newContext({viewport,colorScheme:'dark',isMobile:name==='mobile',hasTouch:name==='mobile',reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.route('https://nominatim.openstreetmap.org/search?**',route=>route.fulfill({json:[{place_id:1,display_name:'Legazpi City, Albay, Bicol Region, Philippines',lat:'13.1391',lon:'123.7438'}]}));
  await page.goto('http://127.0.0.1:3200/');
  await page.getByRole('radio',{name:'Adequate',exact:true}).waitFor();
  await page.getByRole('region',{name:'Farm conditions',exact:true}).screenshot({path:'.impeccable/review/white-controls/'+name+'-choices.png',animations:'disabled'});
  for (const [id,value] of [['soil','Sandy loam'],['season','Wet season']]) {
    await page.locator('#'+id).click();
    const option=page.getByRole('option',{name:value,exact:true});
    await option.hover();
    await expect(option).toHaveAttribute('data-highlighted','');
    await expect(option).toHaveCSS('outline-style','solid');
    await page.screenshot({path:'.impeccable/review/white-controls/'+name+'-'+id+'.png',animations:'disabled'});
    await page.keyboard.press('Escape');
  }
  await page.getByRole('searchbox',{name:'Search in Albay',exact:true}).fill('Legazpi');
  await page.getByRole('searchbox',{name:'Search in Albay',exact:true}).press('Enter');
  const location=page.getByRole('option',{name:/Legazpi City/});
  await location.hover();
  await expect(location).toHaveAttribute('data-highlighted','');
  await expect(location).toHaveCSS('outline-style','solid');
  await page.screenshot({path:'.impeccable/review/white-controls/'+name+'-location.png',animations:'disabled'});
  await context.close();
}
await browser.close();
console.log('Captured checked controls and all three open dropdowns on desktop and mobile.');

