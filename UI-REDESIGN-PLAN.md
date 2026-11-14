# AgriMatch UI/UX redesign plan

Status: implemented across planner, comparison, and detail. `DESIGN.md` was updated before implementation and remains the interface protocol. The final implementation also incorporates the requested equal-width location/search inputs, left-aligned search placeholder, white control surfaces, and functional imported shadcn dropdowns. Verification is recorded in `.impeccable/review/verification.md`.

## 1. Outcome and evidence

Help a farmer locate a farm, describe its conditions, compare the demo rotations, and inspect trade-offs with less scrolling and clearer orientation. Treat these screens as a working product interface. Assume a farmer-facing experience that works on both phones and desktops; primary device and assisted use by agricultural staff remain unconfirmed.

The homepage critique scored 26/40 across ten usability heuristics. Its strongest foundations are the existing palette, official shadcn controls, validation, alternative location entry, and honest demo labeling. The main problem is composition: the marketing introduction and repeated guidance take priority over the actual task.

Measured from the document top in the reviewed build:

| Element | Desktop 1440 × 900 | Mobile 390 × 844 |
| --- | ---: | ---: |
| First search input | 748px | 986px |
| Interactive map | 1048px | 1446px |
| Compare action | 2096px | 2733px |

The full homepage critique is recorded in `.impeccable/critique/2026-11-14T16-34-21Z__src-app-page-tsx.md`. Comparison and detail layouts below are consistency proposals, not claims that those routes received the same measured critique.

## 2. Visual direction and component rules

- Preserve all existing semantic color values: cream canvas, forest text/actions, white controls, sage selection states, and the current comparison accents. Improve hierarchy through placement and emphasis.
- Keep Geist Sans for the entire interface and Geist Mono for coordinates. Use a restrained, fixed product type scale: page titles 28–32px, section headings 18–20px, body/control text 16px, secondary labels 14px. Use rem equivalents and support browser zoom.
- Compose every supplied control and styled UI surface from official shadcn imports under `@/components/ui/*`, retaining the installed Base UI registry. Soil and season continue using themed `Select` popups.
- Use open semantic sections, shared alignment, and occasional `Separator` divisions. A real map needs a defined viewport; ordinary headings, fields, summaries, and results do not need decorative Cards. Avoid nested Cards and repetitive boxed sections.
- Keep one consistent control radius, icon treatment, focus ring, and semantic state system. Reserve elevation for floating menus and overlays. Use short state transitions and reduced-motion support.
- Use the real map, selected farm, crop names, and rotation sequences as the product's visual identity. The large landscape artwork leaves the working screen; retain its asset for a suitable future introduction or help surface.

## 3. Shared shell and information hierarchy

Use a centered working content area with a maximum width of approximately 1200px, plus responsive outer gutters of 16/24/32px. Align the header, task heading, workspace, and footer to its edges.

The header is approximately 56–64px high when its content fits, with the brand and a compact, truthful pilot/demo label. Allow wrapping at narrow widths. Keep navigation limited to the existing workflow and preserve the skip link.

Each page begins with one clear task heading and one short explanation. On the planner, replace the large slogan/hero with **Farm planner**. Place a compact location → conditions → comparison orientation above the work. This communicates sequence without introducing a gated wizard or new routes; use semantic text for a noninteractive indicator.

Remove the repeated three-step explanation below the main action. Keep the footer quiet and outside the primary task area.

## 4. Planner layout: `/`

### Desktop, from the existing `lg` breakpoint when both columns fit

One coordinated two-column workspace:

| Left: location and map | Right: farm setup |
| --- | --- |
| Location heading | Conditions heading |
| Search and explicit search action | Current crop choices |
| Use my location alternative | Irrigation choices |
| Interactive map | Soil and season in a paired row |
| Selected place and coordinate disclosure | Priorities |
| Contextual location feedback | Compare action and prerequisite explanation |

The setup column is bounded at approximately 380–420px; the map column uses the remaining width, separated by a 24px gap. At a 1200px working width with a 400px setup column, the map region is approximately 776px wide. Align column tops; keep controls close to the map they affect.

Use a map viewport of roughly 400–440px high, without forcing either column into a fixed-height scrolling panel. Keep all crop and priority options visible with compact wrapping. Remove the duplicate selected-crop chip row if the checked choices already communicate the same state; preserve direct deselection and the empty-crop instruction.

Place Compare at the foot of setup, clearly associated with the form. Show the actual missing prerequisite beside a disabled action. At 1440 × 900, aim to show location entry, map, core conditions, and Compare in the first viewport with optional help collapsed. If content exceeds the available height, allow normal scrolling rather than clipping fields or reducing touch targets.

### Tablet and mobile

Below `lg`, use a single document flow: compact task heading → location controls → map → farm conditions → priorities. The first useful location input must be visible without scrolling at 390 × 844.

Use a compact map of approximately 260–280px on phones, with an accessible expand/refine action when more space is needed. Preserve map click/drag, geolocation, explicit search, and keyboard coordinate entry. Soil and season may share a row only while their labels and selected values fit; otherwise stack them.

Keep Compare reachable in a mobile bottom action area. Reserve space for it and safe-area insets; it must not cover the last field, errors, or keyboard focus. Adapt it when the on-screen keyboard opens. Keep one logical submit action and one validation path.

On wide but short viewports and at zoom, use natural scrolling. Preserve DOM reading and keyboard order as location → conditions → comparison; visual placement must not create a different interaction sequence.

## 5. Density, guidance, and interaction states

Use proximity consistently: 8–12px within a field group, 16–24px between related groups, and 24–32px between major regions. Apply one gap at a divider boundary rather than stacking large margins on both sides. Maintain at least 44px touch targets and the existing 48px standard controls.

Keep one concise location instruction. Display search loading, results, empty results, permission denial, invalid coordinates, and provider failures where they occur. Show confirmation after an actual selection. Retain explicit search submission and stale-request cancellation.

Put optional soil and season explanations beside those decisions using imported touch/keyboard-accessible disclosure or help components. Keep essential instructions and errors inline. Replace developer-facing terms such as “MVP” with plain demo/pilot language.

Retain useful demo disclosure near Compare and every illustrative score. Explain that scores and sequences are fixed examples, without repeating large warning panels throughout the page. Changing farm inputs must never imply that genuine agronomic scoring has run.

Preserve default, hover, focus, selected, disabled, loading, invalid, empty, and recovery states. Keep overlays above the map and within the viewport. Announce asynchronous outcomes without moving focus unexpectedly.

## 6. Comparison and detail layouts

### `/analysis`

Begin with **Compare rotations**, an edit-farm link, and a concise demo explanation. Make the farm snapshot compact and state-derived so it supports comparison without becoming a second large map-led introduction.

On desktop, align the three existing rotation options as open comparison columns. Use the same order in every option: name, crop sequence, demo score, concise rationale/trade-off, and detail link. Align score and action positions where content allows. Keep blue/green/pink as small consistent identifiers with text labels.

On phones and narrower tablets, stack options in the same order, separated clearly. Preserve readable sequences and score denominators. Avoid horizontal page scrolling, oversized score decorations, and whole-block click targets. Keep explanatory detail behind relevant links or disclosures while retaining decision-critical caveats.

### `/analysis/[rotation]`

Use a compact return link and rotation heading with the labeled demo score. Present crop sequence first, then strengths and trade-offs. Desktop may place sequence and supporting explanation side by side; mobile follows that reading order vertically. Keep prose within a readable measure inside the shared shell.

Preserve existing identifiers, direct links, and the genuine not-found state for invalid rotations. Show loading, unavailable, and error states in the same component vocabulary and spacing system.

## 7. Routing, files, and logic

Keep the current route hierarchy and thin route entry points. Share `AppShell` and `FarmProvider` through the root layout. Keep planner compositions in `src/components/farm/`, comparison/detail compositions in `src/components/analysis/`, official primitives in `src/components/ui/`, and shared domain values/validation in `src/lib/`.

Restructure feature composition only where the new layout requires it. Keep map-specific CSS and Leaflet integration inside the map adapter. Centralize shared geometry, typography, and variants; avoid route-specific control skins or duplicated responsive forms.

Preserve farm state across client navigation, comparison gating, coordinate bounds, external-response validation, and existing location-provider behavior. Read the installed Next.js guides before code changes and verify component APIs against the selected registry.

## 8. Product decisions kept explicit

The current draft preselects Rice, Adequate irrigation, Clay loam, Dry season, and Conserve water. A compact demo-preset explanation can clarify that these are editable examples. Requiring confirmation or adding an “I don't know” soil value changes validation/domain behavior and needs a separate product decision.

Reload currently clears the in-memory draft. Local recovery and reset would help field use, but introduce persistence and privacy choices. Track them separately rather than silently adding storage during layout work. Real scoring, environmental datasets, new accounts, and new workflow routes are outside this interface plan.

## 9. Implementation order and completion checks

1. **Record the design contract.** Reconcile this direction with `DESIGN.md`: 1500px shell → approximately 1200px working width; oversized fluid headings → product type scale; repeated 32–64px gaps → the spacing hierarchy above; mobile map height → compact/expanded behavior. Keep palette and component policy unchanged. Record confirmed audience/device context without treating assumptions as facts.
2. **Build the shared shell and planner.** Complete desktop and mobile composition, map refinements, field grouping, guidance, and the comparison action together. Verify every existing location method and prerequisite still works.
3. **Align comparison and detail.** Apply the same shell, typography, spacing, state rules, and open comparison treatment across both analysis routes and their loading/error/not-found screens.
4. **Verify behavior and rendering.** Run lint, production build, and the existing desktop/mobile Playwright suite. Adjust meaningful assertions for intentional layout changes without weakening behavioral coverage. Inspect desktop and mobile together, batch fixes, then perform at most one confirmation pass.

Acceptance criteria:

- At 1440 × 900, the planner prioritizes the working map and setup; the primary action is visible in the initial viewport under the normal collapsed-help state where content fits.
- At 390 × 844, a useful location control is visible immediately and Compare remains reachable while editing. At 320px and 200% zoom, content remains operable without page-wide horizontal scrolling.
- All crops, irrigation values, soil/season choices, and priorities remain editable. Empty crops and missing/invalid location still prevent comparison with a specific explanation.
- Search, geolocation, coordinate entry, map selection/drag, loading, empty results, provider failures, permission denial, and map tile failure retain usable recovery paths.
- Long place names and labels wrap; controls and focus rings are unclipped; mobile actions respect the keyboard and safe areas; Select/Combobox overlays appear above Leaflet.
- Keyboard navigation, skip link, associated labels, visible focus, accessible errors, reduced motion, and rendered contrast remain intact. Run automated accessibility checks and inspect focus/reading order manually.
- Navigation among planner, comparison, and valid details preserves the selected farm. Direct analysis access without a farm and invalid rotation identifiers remain honest and recoverable.
- Shared imports satisfy the shadcn policy throughout. Palette values and demo limitations remain accurate. Report actual build/test outcomes and any unverified cases.
