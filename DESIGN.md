---
name: AgriMatch
description: A compact, accessible farm-planning workspace built with official shadcn/ui imports and the original agricultural palette.
colors:
  background: "#f5f7f0"
  foreground: "#17352b"
  card: "#ffffff"
  card-foreground: "#17352b"
  popover: "#ffffff"
  popover-foreground: "#17352b"
  primary: "#2b6b4a"
  primary-foreground: "#ffffff"
  secondary: "#edf4e7"
  secondary-foreground: "#17352b"
  muted: "#f8faf5"
  muted-foreground: "#477052"
  accent: "#eaf3e6"
  accent-foreground: "#2b6b4a"
  border: "#dce5d9"
  input: "#6c7e73"
  ring: "#2b6b4a"
  destructive: "#81544b"
  destructive-foreground: "#ffffff"
  success: "#477052"
  success-surface: "#eef5e9"
  warning: "#9a7a42"
  warning-surface: "#fff5dc"
  warning-foreground: "#17352b"
  explanation-surface: "#fff0ed"
  explanation-foreground: "#81544b"
  info: "#2f6974"
  chart-1: "#2f64d7"
  chart-2: "#477b6b"
  chart-3: "#d95091"
  brand-mark: "#8eaf52"
typography:
  brand:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  display:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.375
  action:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.428571
  mono:
    fontFamily: "var(--font-geist-mono), monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "10px"
  panel: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  4xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    height: "48px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: "48px"
  button-ghost:
    textColor: "{colors.foreground}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
  button-link:
    textColor: "{colors.primary}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.panel}"
    padding: "{spacing.xl}"
  badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
---

# Design System: AgriMatch

## Overview

**Creative North Star: "The farm planning workspace"**

This document defines the required interface system for every route and shared component. MUST means required; SHOULD permits a documented, concrete reason to deviate. Read this file before implementing or reviewing interface changes.

AgriMatch is calm, practical, and trustworthy: cream page backgrounds, white controls, forest-green actions, and restrained sage accents. Readable farm inputs, clear comparisons, and honest explanations provide the hierarchy. The agricultural palette and Geist fonts are durable brand commitments from `PRODUCT.md`.

**Key Characteristics:**
- Open working sections with aligned controls and restrained divisions.
- One shared product scale, light palette, and official component vocabulary.
- Visible farm state, explicit requests, and clearly labeled demo results.
- Responsive document flow with reachable actions and unobscured focus.

**Status:** Updated before the approved implementation, then reconciled with the completed planner, comparison, and detail in `UI-REDESIGN-PLAN.md`. The original palette and workflow are retained. Route composition and captured viewport evidence live in `.impeccable/surfaces/src-app-page-tsx.md` and `.impeccable/review/`; subsequent changes still require the verification protocol below.

**The Official Imports Rule.** All application controls and styled UI surfaces MUST use official shadcn/ui components imported from the project's shared UI directory. Domain components MUST compose those imports. A custom HTML/CSS recreation of an available shadcn component is noncompliant.

## Colors

The frontmatter is the normative token definition. Every listed color already occurs in the current stylesheet; semantic assignments improve consistency without introducing a new palette.

### Semantic usage

| Token family | Use |
| --- | --- |
| `background`, `foreground` | Cream page canvas and dark forest body text. |
| `card`, `popover` and their foregrounds | White working panels and floating content. |
| `primary`, `primary-foreground` | Main action, selected emphasis, and its white label. |
| `secondary`, `secondary-foreground` | Sage supporting surfaces and lower-emphasis actions. |
| `muted`, `muted-foreground` | Quiet surfaces and readable descriptions, helper text, and placeholders. |
| `accent`, `accent-foreground` | Soft-green hover and selection treatment. |
| `border` | Subtle, nonessential panel divisions. |
| `input` | Stronger control boundaries that remain visible against white. |
| `ring` | Keyboard focus indicator. |
| `destructive`, `destructive-foreground` | Error emphasis and destructive actions, using the existing earth-red tone. |
| `success`, `success-surface` | Confirmed completion or a valid farm selection. |
| `warning-surface`, `warning-foreground` | Pending data and trade-off notices with readable text. |
| `warning` | Amber decorative accents; use `warning-foreground` for small warning text. |
| `explanation-surface`, `explanation-foreground` | Explanations and contextual cautions. |
| `info` | Location tools and informational icons. |
| `chart-1`, `chart-2`, `chart-3` | Stable blue, green, and pink rotation identifiers and chart series. |
| `brand-mark` | Existing brand symbol; decorative use only. |

### Token implementation protocol

- Define semantic CSS variables centrally in `src/app/globals.css`. Match their names to the frontmatter, for example `colors.primary` becomes `--primary`.
- Use shadcn's CSS-variable theme and Tailwind v4 `@theme inline` mappings. Map colors to `--color-*` utilities so pages use `bg-background`, `text-foreground`, `bg-primary`, and `border-input`. Include mappings for the application-specific status and chart tokens when used.
- Hex values are valid token values. Keep them intact unless a tooling requirement needs an equivalent color conversion. Do not replace the palette with a CLI preset's neutral theme.
- Keep color literals in the central token definitions. Component and route files MUST reference tokens, including arbitrary utilities only when they refer to a named token.
- Preserve foreground/background pairs when changing a variant. Keep theme definitions synchronized with this document in the same change.
- `--muted` is a surface color; supporting text uses `--muted-foreground`. Preserve that distinction when changing callers or importing registry updates.
- Light mode is the required theme. Introduce dark mode only with a complete semantic palette and verification of every surface and state.
- Scope Tailwind's `dark` variant to an explicit `.dark` ancestor; operating-system dark preference must not activate an incomplete theme. Select triggers, Combobox input groups, and dropdown arrow buttons stay white `card`, including hover, expanded/pressed states and inherited dark classes. Dropdown popups and menu options stay white `popover` when hovered, highlighted, focused, or selected. Use green item indicators, text, and inset focus outlines to distinguish states. Checkbox and Radio surfaces stay white in both unchecked and checked states, with forest-green checkmarks or dots, borders, and focus rings.

### Contrast and accent limits

Normal text MUST meet 4.5:1 contrast; large text and essential non-text indicators MUST meet 3:1. Verify rendered hover, selected, disabled, and overlay combinations as applicable, including any opacity applied by a component.

The existing gray-green text fails normal-text contrast on cream (3.99:1) and white (4.31:1). `muted-foreground` therefore reuses the darker existing supporting green. The old amber warning text on its pale surface also fails (3.69:1); warnings use dark forest text instead. Keep pale borders for decorative divisions; use the stronger `input` token where a boundary identifies a control.

Retain blue, green, and pink as secondary comparison accents. Use them for a series, stripe, icon, or small identifier on a neutral surface. White text on the current pink fails normal-text contrast (3.81:1); do not reproduce full pink cards with small white labels. Always pair series colors and status colors with names or symbols. The implemented pink rotation Badge uses forest text with a pink border.

## Typography

Use Geist Sans for all shared sans-serif roles, including the brand, headings, body, controls, and dropdown menus. Load it once through `next/font` in the root layout and use `--font-geist-sans` through the shared font tokens. Geist Mono serves coordinates and numeric metadata. Keep font choices centralized rather than overriding individual pages.

- **Display:** reserved for an actual introduction outside the working planner; it shares the restrained 32px product scale.
- **Headline:** one 32px page heading per route; one semantic `h1`. Use fixed rem sizes rather than viewport-fluid display headings.
- **Title:** major sections. Card titles use a consistent smaller tier (20px, weight 600).
- **Body:** instructions, input values, descriptions, and results. Keep prose to roughly 65 characters per line.
- **Label:** field labels use 14px at weight 500; field legends use the same tier with weight 600 when emphasized. Small secondary text may use 14px; instructions and actionable information must remain comfortably readable.
- **Action:** standard buttons and badges use 14px at weight 600. The main comparison button uses the shared large size with a 16px label. A button's 48px height is a minimum; wrapping and larger text must be allowed to increase it.
- Use sentence case for actions and field labels. Small uppercase eyebrows are optional and supplementary, never the only label for a task.
- Maintain heading order. Use shared typography utilities on semantic headings, paragraphs, and lists; use `CardTitle`, `CardDescription`, `FieldLabel`, and related imported components in their intended contexts.
- Use tabular numerals for comparable scores. Keep units and score denominators visible; never substitute an icon or a color for their meaning.

## Layout

### Shared geometry

- Use one centered working canvas across planner, comparison, and detail, with a maximum content width of 1200px, excluding outer gutters. Gutters are 16px on small screens, 24px from 640px, and 32px from 1024px.
- Keep the shared header approximately 64px high while its contents fit. Use a compact brand and truthful pilot/demo label. Main content starts 24–32px below it.
- Use 8–12px within field groups, 16–24px between related groups, and 24–32px between major regions. Give a divider one shared gap; do not double large margins around it. Larger spacing tokens remain available for exceptional content, not routine workspace layout.
- Bounded surfaces use 16px padding on small screens and 24px on larger screens. The planner itself is an open layout, without a padded outer Card.
- Align labels, controls, headings, and actions to shared edges. Use grid and flex layout with `min-width: 0` for shrinking content.
- Use open semantic sections, alignment, whitespace, and imported Separators for the default layout. Do not wrap heroes, steps, fields, summaries, or rotation options in decorative boxes or repeated containers. Use an imported Card only when a feature actually requires a bounded surface; never nest Cards for page layout. This open, flat treatment applies to existing screens as well as new work.

### Responsive behavior

- Build mobile-first. Use Tailwind's shared breakpoints (`sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px); do not introduce competing 750px and 800px layout rules.
- Start with one column. From `lg`, put location/map beside a width-constrained 400px setup column with a 24px gap; neither column is a Card. At a 1440px viewport the 1200px inner canvas leaves a 776px map column. Soil and season may share a row when labels fit; wrap crop and priority choices without hiding options. Comparison uses three open aligned columns from `lg`.
- Stack search and location actions when their labels no longer fit. Allow chips and long labels to wrap without covering controls or clipping focus indicators.
- Location selection uses equal 50/50 columns for the results Combobox and an actual search InputGroup when its region is at least 24rem wide; stack them below that width. Both controls fill their column. The search placeholder is left-aligned, with a labeled submit action inside the input group; the dropdown selects results. Submit or Enter performs one explicit request, never a request per keystroke.
- Use a 280px planner map on small screens and 430px on desktop. The labeled mobile expand/reduce action changes the viewport to 480px without resetting map state. Skeletons match the viewport height, and Leaflet remains below app overlays.
- On mobile, order location controls, map, conditions, then priorities. Keep one form-associated comparison action in a bottom dock, reserve space and safe-area padding, and return it to normal flow while a text input or on-screen keyboard is active. It must never obscure focused fields or errors. At large text sizes let the action area grow and use natural document scrolling.
- Use a minimum 44px by 44px target for touch controls, including icon buttons and chip removal actions. Standard form controls and main buttons are 48px high.
- At 320px width and 200% browser zoom, content must remain operable without page-wide horizontal scrolling. Put genuinely wide tables in a labeled local scroll region.

### Route composition

- **Planner `/`:** compact Farm planner heading, short explanation, and semantic location → conditions → comparison orientation above the workspace. Put search, geolocation, map, selected location, and coordinate disclosure together. Put crops, irrigation, paired soil/season, and priorities in setup, with Compare at its foot. Keep essential location input above the fold on a 390×844 phone. Aim to show the full working setup and action at 1440×900 with optional help collapsed; allow normal scrolling when content grows.
- Use one location instruction and contextual feedback. Soil/season help uses a touch-accessible shadcn disclosure. Checked crops already communicate selection; avoid a duplicate removable-chip summary. Explain existing presets as editable demo examples without changing their values or validation.
- **Comparison `/analysis`:** Compare rotations heading, edit-farm link, compact state-derived farm snapshot, concise demo disclosure, and three open options. Align name, sequence, score, rationale/trade-off, and detail action in the same order. Stack options on narrow screens. A large snapshot map must not push the comparison out of view.
- Keep the selected location and coordinates visible in the comparison snapshot. Disclose conditions, crops, priorities, and the optional map through an imported Accordion so the comparison remains near the top on phones.
- **Detail `/analysis/[rotation]`:** return link, compact name and demo score, crop sequence first, then strengths and trade-offs. Use readable prose measures and the same heading scale. Keep valid direct links and genuine not-found/loading/error states.
- Keep all fabricated recommendations clearly labeled as fixed examples. Do not add real-scoring claims, persistence, new routes, or new field values as part of this layout redesign.

## Elevation & Depth

Use tonal surfaces and subtle borders for resting content. Cards and ordinary buttons remain flat; avoid per-page shadow styles. Floating Popovers, Select menus, and Dialogs use the shared shadcn overlay treatment, customized centrally if necessary. Focus rings indicate keyboard position; shadows never substitute for them.

**The Flat Workspace Rule.** Ordinary workspace, snapshot, rotation, and detail content stays open. A border or tonal Alert identifies a meaningful boundary; it does not justify another Card.

Use component-managed portals and layering for floating UI so menus and Dialogs appear above Leaflet panes and remain within the viewport. Do not solve layering by scattering arbitrary z-index values through routes.

Shared controls use short color transitions (150ms); Select entrance uses 150ms and Combobox entrance uses 100ms. Map movement uses 200ms and switches to an immediate view update for reduced motion. Respect `prefers-reduced-motion` for all interaction effects. Farm analysis and navigation must never wait for decorative animation.

## Shapes

Use the frontmatter's three radius roles: controls, panels, and pills. Apply them centrally through shadcn's radius variables or shared component variants; pages must not each round the same component differently. Keep the registry's radius scale internally coherent when mapping these roles.

Cards have a subtle one-pixel border and the panel radius. Inputs and buttons share the control radius. Badges and selection chips may use the pill radius; ordinary action buttons retain the control radius. Match nested shapes to their container without adding extra chrome.

Preserve existing brand artwork as an asset. New illustrations, icons, and markers must not become a parallel system of CSS-drawn controls. Reserve marker-specific styling for the map adapter.

## Components

### Required sourcing and imports

1. Install and configure official shadcn/ui using its CLI before migrating a UI feature. Keep the configuration in `components.json`, use CSS variables, and preserve the repository's package manager. For initial setup, use the official Base UI-backed registry; retain that one base consistently.
2. Add primitives through the official registry. Store them in `src/components/ui/` and import through the existing `@/` alias, for example `import { Button } from "@/components/ui/button";`.
3. shadcn distributes component source into the repository. Those generated files ARE the shared import layer. Do not invent a general `shadcn/ui` package import or hand-write a lookalike file under `components/ui` and call it shadcn.
4. Keep page files focused on composition, state, data, and navigation. Put reusable domain compositions in `src/components/`; they MUST import the shared primitives rather than implement new controls.
5. Choose an existing component and its documented props first. Adjust shared tokens and variants centrally for repeated needs. One-off layout utilities are allowed; new per-page component skins, inline style blocks, and duplicate control CSS are not.
6. Use the selected registry base's documented composition API. Do not mix Base UI and Radix snippets, providers, state contracts, or trigger APIs. Import behavior through the generated shadcn components rather than bypassing them with direct primitive-library imports.
7. Every form of a primitive, including its loading, disabled, selected, invalid, and mobile state, follows this policy. Existing custom controls are migration debt, not precedents for new code.

### Required component mapping

| Interface need | Required shadcn component or composition |
| --- | --- |
| Actions, icon actions, retry, geolocation | `Button`; use its shared variants and sizes. |
| Text, number, or multiline entry | `Input` or `Textarea` inside `Field` with `FieldLabel`, description, and errors. |
| Single-choice dropdowns, including soil and season | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem`, with associated labeling. Menus MUST render the themed shadcn popup; `NativeSelect` and browser-native option menus are not allowed. |
| Irrigation choice | `RadioGroup` with labeled `RadioGroupItem` options; exactly one value. |
| Crop and priority multi-selection | Labeled `Checkbox` items or a multiple-value `ToggleGroup`; use one pattern consistently for each field. |
| Selected crop summary | `Badge`; removal uses a labeled imported `Button`, never a clickable Badge alone. |
| Searchable location results | Official `Combobox` with asynchronous results, loading, empty, and error states. |
| A feature that actually needs a bounded panel | `Card` and its supplied parts. Use open semantic sections for ordinary workspace, summary, rotation, and detail layout. |
| Pilot, demo, pending, or completed label | `Badge` with centrally defined semantic variants. |
| Persistent warning, error, or explanation | `Alert` with `AlertTitle` and `AlertDescription`. |
| Loading or determinate progress | `Skeleton`, `Spinner`, or `Progress`; progress requires a real measurement. |
| Empty or unavailable content | `Empty`, with a recovery `Button` when an action is possible. |
| Modal, mobile panel, or destructive confirmation | `Dialog`, `Sheet`, or `AlertDialog` with accessible titles and descriptions. |
| Menus and contextual help | `DropdownMenu`, `Popover`, or `Tooltip`; help remains available on touch and keyboard. |
| Section switches, disclosure, or navigation | `Tabs`, `Accordion`, `Breadcrumb`, or `NavigationMenu` when the matching behavior is needed. |
| Comparison tables and charts | Official `Table`/Data Table pattern and `Chart` wrappers with their documented dependencies. |
| Dividers and constrained scrolling | `Separator` and `ScrollArea` when those UI behaviors are needed. |

Use only installed, documented exports. Check the official component API before implementation; if a listed component is missing, add it from the official registry instead of substituting raw HTML. Adopt only components needed by actual features.

### Implemented shared vocabulary

The installed registry style is `base-nova` in `components.json`. The following describes the shipped shared source rather than permission to create another UI kit:

- **Buttons:** `Button` and `buttonVariants` provide primary, outline, ghost, and link treatments used by this workflow. Standard and large actions have a minimum height of 48px; small and small icon actions retain a 44px target. Labels wrap. Outline actions use the white `card` surface and stronger `input` border. Shared green focus rings are 3px; state transitions are 150ms with reduced-motion overrides.
- **Inputs and InputGroup:** `Input` is a white, full-width 48px control with 12px horizontal padding, the control radius, and a strong semantic border. Search uses the actual imported `InputGroupInput`, `InputGroupAddon`, and `InputGroupButton`; the icon submit is 44px and has an accessible Search name. Group disabled tint follows the input's disabled state only: an unavailable submit button must not gray an editable input. InputGroup focus surrounds the group; errors use the semantic destructive border and message.
- **Select and Combobox:** soil/season use imported Select popups; location results use a nonmodal Combobox with a read-only selection input beside the explicit search field. Triggers, arrow buttons, popup surfaces, and options stay white through hover/open/selected states. Green checkmarks, text, and inset focus outlines communicate selection and keyboard position. Popup positioning is managed through the shared Base UI portal/positioner, not page CSS.
- **Checkbox and RadioGroup:** compact 16px indicators sit beside persistent labels with at least 44px interaction height. Checkbox corners are 4px; radio indicators are circular. Both checked and unchecked states use white surfaces: a checked box adds a forest-green checkmark and border, while a selected radio adds a forest-green dot and border. Preserve the semantic checked state and visible keyboard focus; color is never the sole signal.
- **Badges:** imported `Badge` variants provide wrapping, pill-shaped labels with 12px horizontal and 4px vertical padding. Crop, success, warning, secondary, and outlined rotation identifiers use their centrally defined semantic pairs. The pilot label uses the outline variant. Badges are labels unless deliberately composed with an appropriate interactive primitive.
- **Accordion:** optional coordinate entry, soil/season help, farm conditions/priorities, and the nested optional snapshot map use the imported disclosure. Its trigger keeps a visible label, chevron, focus ring, and 44px or 48px minimum target. A nested disclosure is functional hierarchy; it is not a nested Card.
- **Cards and feedback:** `Card` is installed for genuinely bounded features, with a 20px radius, subtle border, no resting shadow, and responsive 16/24px content spacing. The three working routes use open sections instead. `Alert`, `Empty`, `Skeleton`, and `Spinner` supply real feedback and recovery states; the map has a defined viewport because it is an interactive canvas.
- **Navigation:** one shared shell contains the compact brand/home link, outline pilot Badge, skip link, and quiet footer. Destination links that need action presentation use imported `buttonVariants`. The skip link moves focus to the main landmark; page headings keep the shared 32px tier.

`.impeccable/design.json` contains development-only, self-contained preview HTML/CSS derived from these shared imports. Those snippets are documentation artifacts, never application components, an alternate UI kit, or an exception to the Official Imports Rule. Its tonal ramps are documentation metadata, not additional application colors.

### Limited structural and specialist exceptions

- **Document structure and text:** semantic `main`, `header`, `nav`, `section`, `footer`, `form`, `fieldset`, headings, paragraphs, lists, `span`, and layout-only `div` elements are allowed where shadcn has no appropriate component. Use them for structure and content, never to recreate a Button, Card, Badge, input, menu, or other supplied primitive.
- **Framework elements:** Next.js `Link` and `Image` are allowed for navigation and optimized media. Compose links with shadcn navigation or button presentation using the selected base's supported API. Render one interactive element; never nest a link and a button as separate interactive controls.
- **Map engine:** Leaflet may own the map container, tiles, marker rendering, attribution, and built-in map controls. Keep this isolated in the map adapter. All surrounding application controls, search, messages, and panels MUST use shadcn imports. Keep map CSS limited to engine integration and marker styling.
- **Icons and media:** use imported Lucide React icons consistently, with a normal size of 16-20px and a consistent stroke. Icons, brand assets, and meaningful data visualizations are content, not replacement control systems. Decorative icons are hidden from assistive technology; icon-only actions need an accessible name.

These are the complete standing exceptions. If a capability has no official component, first compose imported primitives. Document any additional specialist rendering need in this file with its scope and reason before introducing it; convenience is not a reason to create custom UI primitives.

### Interaction and accessibility protocol

- Every input has a persistent visible label and programmatic association. Connect helper text and errors, expose invalid state, and group related choices semantically. A placeholder is supplementary.
- Use controlled React state and component callbacks for user interaction. Submit forms through their submit handler. Do not find a rendered button with `querySelector`, remove `disabled`, or attach a DOM click listener to override React's state.
- Use `Button` for actions and Next.js `Link` for destinations. Apply the imported `buttonVariants` to links that need button presentation; preserve native link semantics instead of giving navigation a button role. Specify `type="button"` for non-submit buttons in forms; use `type="submit"` for the form action.
- Keep one visually primary action per task. Its availability follows actual prerequisites. Explain a disabled action nearby; when enabled, its label and helper text must describe the real current state.
- Keep loading, empty results, no selection, missing data, request failure, and success distinct. Use a persistent Alert for blocking failures and preserve the user's inputs for recovery. Prevent duplicate submission while a request is pending.
- Announce asynchronous outcomes without stealing focus. Use appropriate live status/error announcements. Keep the initiating action stable while it loads; do not replace its label with an unexplained symbol. Search may focus/open results only if focus is still within its form when the request completes. If the user has moved to crops or another task, preserve that focus and announce the available results. The search submit uses Base UI's documented `focusableWhenDisabled` during loading so focus remains stable while repeat submission is blocked; never remove disabled semantics manually.
- Location search supports arrow keys, Enter, Escape, a visible active option, and an explicit empty result. Prevent stale network responses from replacing newer results. Validate returned coordinates and the supported farm area before accepting a location.
- Provide a keyboard-accessible route to choose a location. Map clicking and dragging must not be the only way to complete the farm task. Geolocation denial must leave search and other valid entry paths usable.
- Preserve the library's focus management, keyboard behavior, semantics, and disabled handling. Dialogs return focus to the trigger; visible focus must remain unobscured by sticky or floating elements. Never remove focus outlines without an equivalent visible focus ring.
- Provide all meaningful selection and validation feedback through text or shape as well as color. Tooltip-only instructions and hover-only actions are insufficient.

### App-specific consistency

- Home, analysis, and detail share the same shell, brand treatment, token roles, and component variants. Do not create separate design systems for the three routes.
- Keep the workflow order clear: choose a farm, describe conditions and priorities, compare rotations, inspect trade-offs. Preserve farm selections when moving between these steps.
- Crop order, irrigation labels, season labels, priority names, units, and score formatting must match across forms, summaries, and detail screens. Render summaries from the chosen state rather than independently hard-coded values.
- Keep demo or placeholder labeling adjacent to every fabricated score or recommendation. Missing environmental data is a pending or unavailable state, not a successful analysis. Explain score meaning, sources, and limitations when real results are available.
- Rotation options share an open layout and align their name, crop sequence, score, and imported detail link. Use an explicit link rather than making an entire content block an oversized button.
- Invalid or missing rotation identifiers render an appropriate unavailable/not-found state; never silently show a different recommendation.

### Migration and verification protocol

1. Read the relevant local Next.js guides, inspect the route and its callers, and check current official shadcn documentation. Verify the chosen registry supports the installed React/Next versions before setup.
2. Configure the shared UI import directory, semantic tokens, and shared variants first. This document defines the target; avoid partially applying a token rename that changes unrelated legacy screens.
3. Migrate a complete feature, including its loading, error, disabled, and responsive behavior. Remove its superseded custom primitive markup and CSS only after replacement. Keep specialist map integration isolated.
4. Review imports and JSX: every supplied control or styled surface uses a shared shadcn import, with raw elements limited to the standing exceptions. Merely renaming a custom control or placing it under `ui/` does not satisfy this check.
5. Run the repository's lint and production build for UI code changes. Check the changed workflow at mobile and desktop widths, with keyboard navigation, visible focus, long content, and applicable network/data failure states. Use targeted behavior tests where the change warrants them.
6. Verify contrast for the actual rendered color pairs and inspect for layout overflow and map/overlay conflicts. Report checks actually performed and any remaining limitations.

References: [shadcn/ui introduction](https://ui.shadcn.com/docs), [Next.js setup](https://ui.shadcn.com/docs/installation/next), [component catalog](https://ui.shadcn.com/docs/components), [semantic theming](https://ui.shadcn.com/docs/theming), and [Base UI registry default](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default). Keep this protocol aligned with the selected installed API rather than copying examples from a different registry base.

## Do's and Don'ts

- **Do** import official shared shadcn components for all supplied UI roles and compose them into domain features.
- **Do** preserve the palette through semantic tokens, readable color pairs, and consistent variants.
- **Do** use semantic HTML for document structure and ordinary text, with the specialist exceptions kept narrow.
- **Do** make every state honest, labeled, keyboard-accessible, and recoverable where recovery is possible.
- **Don't** hand-build a control, Card, Badge, menu, or overlay that already has an official shadcn implementation.
- **Don't** introduce another UI kit, direct primitive-library implementations, or a second component base.
- **Don't** add route-level color literals, inline CSS skins, `!important` patches, or broad selectors that restyle shared primitives.
- **Don't** hide meaningful content in CSS pseudo-elements or rely on emoji, arbitrary glyphs, color, or hover alone to explain an action.
- **Don't** treat registry updates, new routes, or documentation previews as exempt from import, state, accessibility, and rendered verification requirements.
