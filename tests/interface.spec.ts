import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locationResult = {
  place_id: 1,
  display_name: "Legazpi City, Albay, Bicol Region, Philippines",
  lat: "13.1391",
  lon: "123.7438",
};

async function chooseCoordinates(page: Page) {
  await page
    .getByRole("button", { name: "Enter farm coordinates instead" })
    .click();
  await page.getByLabel("Latitude (° N)", { exact: true }).fill("13.1391");
  await page.getByLabel("Longitude (° E)", { exact: true }).fill("123.7438");
  await page
    .getByRole("button", { name: "Use coordinates", exact: true })
    .click();
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
}

async function expectAccessible(page: Page, target?: string) {
  const audit = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21aa",
  ]);
  if (target) audit.include(target);
  const result = await audit.analyze();
  expect(result.violations).toEqual([]);
}

async function expectNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width);
}

test.beforeEach(async ({ page }) => {
  // Keep workflow checks independent of the external tile service.
  await page.route(/https:\/\/[abc]\.tile\.openstreetmap\.org\//, (route) =>
    route.fulfill({
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
        "base64",
      ),
    }),
  );
});

test("farm selections survive comparison, detail, and back navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const compare = page.getByRole("button", {
    name: "Compare demo rotations",
    exact: true,
  });
  await expect(compare).toBeDisabled();
  await chooseCoordinates(page);
  await page.getByRole("checkbox", { name: "Corn", exact: true }).check();
  await page.getByRole("checkbox", { name: "Rice", exact: true }).uncheck();
  await page.getByRole("radio", { name: "Limited", exact: true }).check();
  await page
    .getByRole("combobox", { name: "Soil texture", exact: true })
    .click();
  await page.getByRole("option", { name: "Sandy loam", exact: true }).click();
  await page.getByRole("combobox", { name: "Season", exact: true }).click();
  await page.getByRole("option", { name: "Wet season", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Improve soil health", exact: true })
    .check();
  await compare.click();
  await expect(page).toHaveURL(/\/analysis$/);
  await expect(
    page.getByRole("heading", { name: "Compare rotations", exact: true }),
  ).toBeVisible();
  const snapshot = page.getByRole("region", { name: "Your farm snapshot" });
  await snapshot.getByRole("button", { name: "Farm conditions and priorities", exact: true }).click();
  await expect(snapshot.getByText("13.13910° N, 123.74380° E")).toBeVisible();
  await expect(snapshot.getByText("Sandy loam", { exact: true })).toBeVisible();
  await expect(snapshot.getByText("Limited", { exact: true })).toBeVisible();
  await expect(snapshot.getByText("Wet season", { exact: true })).toBeVisible();
  await expect(snapshot.getByText("Corn", { exact: true })).toBeVisible();
  await expect(snapshot.getByText("Rice", { exact: true })).toHaveCount(0);
  await snapshot.getByRole("button", { name: "View farm map", exact: true }).click();
  await expect(snapshot.getByLabel("Map of the selected farm in Albay", { exact: true })).toBeVisible();
  await snapshot.getByRole("button", { name: "Farm conditions and priorities", exact: true }).click();
  await expectAccessible(page);
  await expectNoOverflow(page);
  for (const name of [
    "Water-Smart Rotation",
    "Soil Builder Rotation",
    "Climate Fit Rotation",
  ]) {
    await page
      .getByRole("link", { name: `View trade-offs for ${name}`, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("note").filter({ hasText: "Placeholder analysis" }),
    ).toBeVisible();
    await expectNoOverflow(page);
    await page
      .getByRole("link", { name: "Back to comparison", exact: true })
      .click();
  }
  await page.getByRole("link", { name: "Edit your farm", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: "Corn", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Rice", exact: true }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Limited", exact: true }),
  ).toBeChecked();
  await expect(
    page
      .getByRole("combobox", { name: "Soil texture", exact: true })
      .locator('[data-slot="select-value"]'),
  ).toHaveText("Sandy loam");
  await expect(
    page.getByRole("button", { name: "Compare demo rotations", exact: true }),
  ).toBeEnabled();
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("manual location search supports keyboard selection without per-keystroke requests", async ({
  page,
}) => {
  let requests = 0;
  await page.route("https://nominatim.openstreetmap.org/search?**", (route) => {
    requests += 1;
    return route.fulfill({ json: [locationResult] });
  });
  await page.goto("/");
  const input = page.getByRole("searchbox", {
    name: "Search in Albay",
    exact: true,
  });
  await input.fill("Legazpi");
  expect(requests).toBe(0);
  await input.press("Enter");
  await expect(
    page.getByRole("option", { name: /Legazpi City/ }),
  ).toBeVisible();
  const results = page.getByRole("combobox", { name: "Choose farm location", exact: true });
  await results.focus();
  await results.press("ArrowDown");
  await results.press("Enter");
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("13.13910° N, 123.74380° E")).toBeVisible();
  expect(requests).toBe(1);
});

test("search handles service errors, empty results, and malformed coordinates", async ({
  page,
}) => {
  await page.route("https://nominatim.openstreetmap.org/search?**", (route) => {
    const query = new URL(route.request().url()).searchParams.get("q") ?? "";
    if (query.startsWith("Unavailable"))
      return route.fulfill({ status: 503, json: {} });
    if (query.startsWith("Missing")) return route.fulfill({ json: [] });
    if (query.startsWith("Malformed"))
      return route.fulfill({ json: [{ ...locationResult, lat: "invalid" }] });
    return route.fulfill({ json: [locationResult] });
  });
  await page.goto("/");
  const input = page.getByRole("searchbox", {
    name: "Search in Albay",
    exact: true,
  });
  await input.fill("Unavailable");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "HTTP 503",
  );
  await input.fill("Missing");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByText("No places found. Try another name or enter coordinates."),
  ).toBeVisible();
  await input.fill("Malformed");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "invalid coordinates",
  );
  await input.fill("Legazpi");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("option", { name: /Legazpi City/ }).click();
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
});

test("typing a new location cancels obsolete search results", async ({
  page,
}) => {
  let releaseFirst: () => void = () => {
    throw new Error("First request not started");
  };
  const firstResponse = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  await page.route(
    "https://nominatim.openstreetmap.org/search?**",
    async (route) => {
      const query = new URL(route.request().url()).searchParams.get("q") ?? "";
      if (query.startsWith("Old")) {
        await firstResponse;
        return route.fulfill({
          json: [{ ...locationResult, display_name: "Old place, Albay" }],
        });
      }
      return route.fulfill({ json: [locationResult] });
    },
  );
  await page.goto("/");
  const input = page.getByRole("searchbox", {
    name: "Search in Albay",
    exact: true,
  });
  await input.fill("Old");
  const firstRequest = page.waitForRequest(
    "https://nominatim.openstreetmap.org/search?**",
  );
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await firstRequest;
  await input.fill("Legazpi");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("option", { name: /Legazpi City/ }),
  ).toBeVisible();
  releaseFirst();
  await page.getByRole("option", { name: /Legazpi City/ }).click();
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Old place, Albay", { exact: true })).toHaveCount(
    0,
  );
});

test("coordinates and geolocation reject locations outside the pilot area", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 14.6, longitude: 120.98 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "outside the Albay pilot area",
  );
  await page
    .getByRole("button", { name: "Enter farm coordinates instead" })
    .click();
  await page.getByLabel("Latitude (° N)", { exact: true }).fill("14.6");
  await page.getByLabel("Longitude (° E)", { exact: true }).fill("120.98");
  await page
    .getByRole("button", { name: "Use coordinates", exact: true })
    .click();
  await expect(
    page.getByText("Enter a latitude from 12.85", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Compare demo rotations", exact: true }),
  ).toBeDisabled();
  await context.setGeolocation({ latitude: 13.1391, longitude: 123.7438 });
  await page
    .getByRole("button", { name: "Use my location", exact: true })
    .click();
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Compare demo rotations", exact: true }),
  ).toBeEnabled();
});

test("direct links and unknown routes render honest empty and not-found states", async ({
  page,
}) => {
  await page.goto("/analysis");
  await expect(
    page.getByText("No farm selected", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Choose a farm", exact: true }),
  ).toBeVisible();
  await page.goto("/analysis/unknown-rotation");
  await expect(
    page.getByRole("heading", { name: "Rotation not found", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Water-Smart Rotation", exact: true }),
  ).toHaveCount(0);
  const response = await page.goto("/unknown-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found", exact: true }),
  ).toBeVisible();
  await expectAccessible(page);
});

test("small screens, large text, and keyboard focus remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("link", { name: "Skip to content", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expectNoOverflow(page);
  await expectAccessible(page);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await expectNoOverflow(page);
  await expect(
    page.getByRole("button", { name: "Use my location", exact: true }),
  ).toBeVisible();
});

test("map clicking and dragging refine the selected farm", async ({ page }) => {
  await page.goto("/");
  const map = page.getByLabel(
    "Interactive Albay map. Use search or coordinate entry for keyboard location selection.",
    { exact: true },
  );
  await map.click();
  await expect(
    page.getByText("Farm location selected", { exact: true }),
  ).toBeVisible();
  const coordinates = page.locator('[role="status"] p.font-mono');
  const original = await coordinates.textContent();
  const box = await map.boundingBox();
  if (!box) throw new Error("Map has no visible bounds");
  await page
    .getByRole("button", {
      name: "Selected farm. Drag to refine its position.",
      exact: true,
    })
    .dragTo(map, {
      targetPosition: { x: box.width / 2 + 35, y: box.height / 2 + 35 },
    });
  await expect(coordinates).not.toHaveText(original ?? "");
  await expect(
    page.getByRole("button", { name: "Compare demo rotations", exact: true }),
  ).toBeEnabled();
});

test("coordinate entry remains usable when map tiles fail", async ({
  page,
}) => {
  await page.route(/https:\/\/[abc]\.tile\.openstreetmap\.org\//, (route) =>
    route.abort(),
  );
  await page.goto("/");
  await expect(
    page.getByText("Map tiles are unavailable", { exact: true }),
  ).toBeVisible();
  await chooseCoordinates(page);
  await expect(
    page.getByRole("button", { name: "Compare demo rotations", exact: true }),
  ).toBeEnabled();
});

test("soil and season use themed popup menus with keyboard selection", async ({
  page,
}) => {
  await page.goto("/");
  const soil = page.getByRole("combobox", {
    name: "Soil texture",
    exact: true,
  });
  await soil.click();
  const menu = page.getByRole("listbox");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("option")).toHaveText([
    "Clay loam",
    "Sandy loam",
    "Clay",
    "Loam",
  ]);
  await expect(
    menu.getByRole("option", { name: "Clay loam", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  // Audit the visible popup; Base UI renders its aria-hidden focus guards outside it.
  await expectAccessible(page, '[data-slot="select-content"]');
  await expectNoOverflow(page);
  await menu.getByRole("option", { name: "Sandy loam", exact: true }).click();
  await expect(soil.locator('[data-slot="select-value"]')).toHaveText(
    "Sandy loam",
  );
  await expect(menu).toHaveCount(0);
  await soil.click();
  await expect(
    menu.getByRole("option", { name: "Sandy loam", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(soil).toBeFocused();
  await expect(soil.locator('[data-slot="select-value"]')).toHaveText(
    "Sandy loam",
  );
  const season = page.getByRole("combobox", { name: "Season", exact: true });
  await season.focus();
  await page.keyboard.press("ArrowDown");
  await expect(menu).toBeVisible();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(season.locator('[data-slot="select-value"]')).toHaveText(
    "Transition season",
  );
  await expect(season).toBeFocused();
});

test("planner exposes the task and comparison action in the first viewport", async ({ page }, testInfo) => {
  if (testInfo.project.name === "desktop") {
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Farm planner", exact: true })).toBeInViewport();
  await expect(page.getByRole("searchbox", { name: "Search in Albay", exact: true })).toBeInViewport();
  await expect(page.getByRole("button", { name: "Compare demo rotations", exact: true })).toBeInViewport();
  await expectNoOverflow(page);
});

test("comparison explains missing crops and priorities without discarding the location", async ({ page }) => {
  await page.goto("/");
  await chooseCoordinates(page);
  const compare = page.getByRole("button", { name: "Compare demo rotations", exact: true });
  await page.getByRole("checkbox", { name: "Rice", exact: true }).uncheck();
  await expect(compare).toBeDisabled();
  await expect(page.locator("#compare-help")).toHaveText("Select at least one current crop to continue.");
  await page.getByRole("checkbox", { name: "Corn", exact: true }).check();
  await page.getByRole("checkbox", { name: "Conserve water", exact: true }).uncheck();
  await expect(compare).toBeDisabled();
  await expect(page.locator("#compare-help")).toHaveText("Choose at least one priority to continue.");
  await page.getByRole("checkbox", { name: "Climate suitability", exact: true }).check();
  await expect(compare).toBeEnabled();
  await expect(page.getByText("13.13910° N, 123.74380° E", { exact: true })).toBeVisible();
});

test("map refinement and contextual help preserve selected values", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await chooseCoordinates(page);
  const map = page.locator("#farm-map-region");
  const initial = await map.boundingBox();
  if (!initial) throw new Error("Planner map is missing");
  await page.getByRole("button", { name: "Expand map", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reduce map", exact: true })).toHaveAttribute("aria-expanded", "true");
  const expanded = await map.boundingBox();
  expect(expanded?.height).toBeGreaterThan(initial.height);
  await page.getByRole("button", { name: "Reduce map", exact: true }).click();
  await expect(page.getByText("13.13910° N, 123.74380° E", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Help with soil and season", exact: true }).click();
  await expect(page.getByText("use the value from your farm records", { exact: false })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Rice", exact: true })).toBeChecked();
  await expectAccessible(page);
});

test("form surfaces remain white when the operating system prefers dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search in Albay", exact: true });
  await expect(search.locator("..")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByRole("combobox", { name: "Soil texture", exact: true })).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByRole("combobox", { name: "Season", exact: true })).toHaveCSS("background-color", "rgb(255, 255, 255)");
  // Base UI hides the external arrow from assistive tech while its popup is open.
  const dropdown = page.locator('button[aria-label="Show location results"]');
  await expect(dropdown).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await dropdown.click();
  await expect(dropdown).toBeVisible();
  await expect(dropdown).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.keyboard.press("Escape");
  const corn = page.getByRole("checkbox", { name: "Corn", exact: true });
  await expect(corn).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.getByRole("radio", { name: "Limited", exact: true })).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await corn.check();
  await expect(corn).toBeChecked();
  await expect(corn).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(corn).toHaveCSS("color", "rgb(43, 107, 74)");
  await expect(corn.locator('[data-slot="checkbox-indicator"]')).toBeVisible();
});

test("location dropdown and real search input share the row equally", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const input = await page.getByRole("combobox", { name: "Choose farm location", exact: true }).locator("..").boundingBox();
  const search = await page.getByRole("searchbox", { name: "Search in Albay", exact: true }).locator("..").boundingBox();
  if (!input || !search) throw new Error("Search controls are missing");
  expect(Math.abs(input.width - search.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(input.y - search.y)).toBeLessThanOrEqual(1);
  await expect(page.getByRole("searchbox", { name: "Search in Albay", exact: true })).toHaveCSS("text-align", "left");
});

test("delayed search results preserve focus after the user moves to another field", async ({ page }) => {
  let releaseResponse: () => void = () => { throw new Error("Search has not started"); };
  const responseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route("https://nominatim.openstreetmap.org/search?**", async (route) => {
    await responseGate;
    return route.fulfill({ json: [locationResult] });
  });
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search in Albay", exact: true }).fill("Legazpi");
  const request = page.waitForRequest("https://nominatim.openstreetmap.org/search?**");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await request;
  await expect(page.getByRole("button", { name: "Search", exact: true })).toBeFocused();
  const crop = page.getByRole("checkbox", { name: "Corn", exact: true });
  await crop.focus();
  releaseResponse();
  await expect(page.locator("#location-search-status")).toHaveText("1 places found in Albay.");
  await expect(crop).toBeFocused();
  const results = page.getByRole("combobox", { name: "Choose farm location", exact: true });
  await expect(results).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Show location results", exact: true }).click();
  await page.getByRole("option", { name: /Legazpi City/ }).click();
  await expect(page.getByText("Farm location selected", { exact: true })).toBeVisible();
});

test("all dropdowns retain white surfaces during hover, open, and selection", async ({ page }) => {
  await page.route("https://nominatim.openstreetmap.org/search?**", (route) =>
    route.fulfill({ json: [locationResult] }),
  );
  await page.goto("/");

  for (const field of [
    { name: "Soil texture", value: "Sandy loam" },
    { name: "Season", value: "Wet season" },
  ]) {
    const trigger = page.getByRole("combobox", { name: field.name, exact: true });
    await trigger.hover();
    await expect(trigger).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(trigger).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator('[data-slot="select-content"][data-open]')).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const option = page.getByRole("option", { name: field.value, exact: true });
    await option.hover();
    await expect(option).toHaveAttribute("data-highlighted", "");
    await expect(option).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(option).toHaveCSS("outline-color", "rgb(43, 107, 74)");
    await expect(option).toHaveCSS("outline-width", "1px");
    await expect(option).toHaveCSS("outline-style", "solid");
    await option.click();
    await expect(trigger.locator('[data-slot="select-value"]')).toHaveText(field.value);
    await trigger.click();
    await expect(option).toHaveAttribute("aria-selected", "true");
    await expect(option).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(option.locator("svg")).toBeVisible();
    await page.keyboard.press("Escape");
  }

  const results = page.getByRole("combobox", { name: "Choose farm location", exact: true });
  const resultSurface = results.locator("..");
  await resultSurface.hover();
  await expect(resultSurface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.getByRole("searchbox", { name: "Search in Albay", exact: true }).fill("Legazpi");
  await page.getByRole("searchbox", { name: "Search in Albay", exact: true }).press("Enter");
  const result = page.getByRole("option", { name: /Legazpi City/ });
  await expect(page.locator('[data-slot="combobox-content"][data-open]')).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(resultSurface).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await result.hover();
  await expect(result).toHaveAttribute("data-highlighted", "");
  await expect(result).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(result).toHaveCSS("outline-width", "1px");
  await expect(result).toHaveCSS("outline-style", "solid");
  await result.click();
  await expect(page.getByText("Farm location selected", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Show location results", exact: true }).click();
  await expect(result).toHaveAttribute("aria-selected", "true");
  await expect(result).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(result.locator("svg")).toBeVisible();
  await page.keyboard.press("Escape");
  await expectNoOverflow(page);
});

test("every crop and priority checkbox stays white in checked and unchecked states", async ({ page }) => {
  await page.goto("/");
  const boxes = page.getByRole("checkbox");
  await expect(boxes).toHaveCount(8);
  for (const box of await boxes.all()) {
    await box.hover();
    await expect(box).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await box.check();
    await expect(box).toBeChecked();
    await expect(box).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(box).toHaveCSS("border-color", "rgb(43, 107, 74)");
    await expect(box.locator('[data-slot="checkbox-indicator"]')).toBeVisible();
    await box.uncheck();
    await expect(box).not.toBeChecked();
    await expect(box).toHaveCSS("background-color", "rgb(255, 255, 255)");
  }
});

test("irrigation radios stay white and preserve mutually exclusive keyboard selection", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const adequate = page.getByRole("radio", { name: "Adequate", exact: true });
  const limited = page.getByRole("radio", { name: "Limited", exact: true });
  await expect(adequate).toBeChecked();
  await expect(adequate).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(adequate.locator('[data-slot="radio-group-indicator"] > span')).toHaveCSS("background-color", "rgb(43, 107, 74)");
  await limited.hover();
  await expect(limited).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await limited.check();
  await expect(limited).toBeChecked();
  await expect(adequate).not.toBeChecked();
  await expect(limited).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(limited.locator('[data-slot="radio-group-indicator"] > span')).toHaveCSS("background-color", "rgb(43, 107, 74)");
  await limited.focus();
  await page.keyboard.press("ArrowUp");
  await expect(adequate).toBeChecked();
  await expect(limited).not.toBeChecked();
  await expect(adequate).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expectAccessible(page);
});


