# Redesign verification

Scope: approved `UI-REDESIGN-PLAN.md`, plus the user's equal-width search/location controls, actual left-aligned search input, white controls, and functional shadcn dropdown requirements.

## Checks performed

- `npm run build`: passed. Planner, comparison, all three valid rotation details, and not-found output generated successfully.
- `npm run lint`: passed.
- Initial redesign regression run: **32 passed** across desktop and mobile.
- Latest white-control follow-up: `$env:PLAYWRIGHT_CHANNEL='msedge'; npm run test:e2e` — **38 passed** across desktop and mobile in 54.3 seconds. Production build and lint also passed after the final component changes.
- Existing workflow coverage retained: state through comparison/detail/back navigation; explicit keyboard search; search failure/empty/malformed responses; stale-request cancellation; coordinate and geolocation bounds; valid geolocation; direct links and unknown routes; keyboard skip/focus; no overflow and enlarged text; map click/drag and tile failure; themed Select keyboard selection.
- Additional regressions cover initial task/action visibility; missing crop/priority prerequisites; map expansion and contextual help; white control surfaces and closed/open dropdown arrow buttons under a dark OS preference; equal-width location/search regions and left-aligned placeholder; delayed responses preserving focus outside search while retaining manually selectable results.
- Automated axe checks passed in the suite. Popup checks retain the existing visible-popup scope for Base UI's outside focus guards; whole-page checks remain in place.
- Impeccable detector ran once on changed farm/analysis features, shell, and shared CSS: `[]`.
- Compared all 31 documented color values with shared CSS definitions: 31 matches, 0 mismatches. No palette values changed during this redesign.
- Application controls compose imported official shadcn components. Structural HTML and the isolated Leaflet adapter retain the documented exceptions.
- Public asset provenance scan: 0 raster assets, 0 missing records. No shipping raster asset was introduced.

## Rendered evidence

Settled desktop and phone captures cover planner, comparison, and a representative rotation detail in `desktop.png`, `mobile.png`, `desktop-analysis.png`, `mobile-analysis.png`, `desktop-detail.png`, and `mobile-detail.png`. All three detail routes are also exercised by the workflow tests. Separate initial viewport and delayed-search captures accompany them.

`layout-metrics.json` records:

| Check | Desktop 1440 × 900 | Phone 390 × 844 |
| --- | ---: | ---: |
| Working canvas / map region width | 1200px / 776px | 358px / 358px |
| Search input top | 284px | 423px |
| Map height | 430px | 280px |
| Comparison action top | 752px | 741px |
| Horizontal overflow | None | None |
| Focus stays on Corn after delayed results | Yes | Yes |
| Results dropdown stays closed after focus leaves search | Yes | Yes |

At 320px with root text enlarged to 200%, document and content widths both remain 320px. Map tiles loaded in the settled captures; tile failure is independently covered by deterministic tests. No page runtime errors were recorded in the capture run.

## Independent finish review

The full review accepted the layout, strict component policy, white surfaces, restrained palette, compact snapshot, and honest demo limits. It requested one correction: delayed search must not steal focus from another farm field.

The correction checks focus ownership at response time. The submit action uses the installed Base UI's focusable-when-disabled behavior during loading so initiating focus survives correctly. Tests verify both normal search and movement to another field before completion.

Final verdict: **ship — sole finding resolved**. No fix-induced regressions were observed. This verdict scores that correction; the initial review had already accepted the captured composition.

After the user's final white-dropdown refinement, the reviewer also returned **ship — white-dropdown refinement resolved**, with no introduced regressions observed. `DESIGN.md` was reconciled with the finished implementation and `.impeccable/design.json` records development-only component previews and extension metadata.

## Limits

Browser verification used installed Microsoft Edge with desktop and touch/mobile emulation. Physical-device keyboards, iOS/Safari, and a full screen-reader session were not exercised. The large-text check is text enlargement, not a claim of native browser-zoom testing. Farm scores remain fixed demonstrations and draft state remains session-only, as required by the plan.

## White-control follow-up

Audited every application route and domain component. The three dropdowns are the location-results Combobox and soil/season Selects; all import the official shared shadcn components. The two checkbox groups contain eight crop/priority choices; irrigation uses the imported RadioGroup. No browser-native select or custom checkbox replacement is used by these features.

Dropdown triggers, arrow buttons, popup surfaces, hovered/highlighted rows, and selected options are white. Checked and unchecked checkbox/radio surfaces are white; green checkmarks, dots, borders, and solid inset option outlines preserve visible state. All 31 color token values remain unchanged, and farm logic, routing, provider state, map behavior, and external-search contracts are unchanged by this follow-up.

The added desktop/mobile regressions exercise every dropdown's hover/open/selected surface, all eight checkboxes in both states, and radio mutual exclusion with keyboard selection. The visual confirmation is stored under `white-controls/`; the Impeccable detector reported `[]` for the changed shared primitives. `DESIGN.md` and its preview sidecar reflect these states.
