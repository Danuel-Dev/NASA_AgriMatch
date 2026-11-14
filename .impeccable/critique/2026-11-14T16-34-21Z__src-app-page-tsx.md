---
target: "Current AgriMatch homepage: modern SaaS UI/UX critique and planning"
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\armen\\OneDrive\\Desktop\\AgriMatch\\src\\app\\page.tsx"
target_fingerprint: "sha256:96037dc7eac1c8e20bdcb4a3dbce810d16bc563e6e4d57a55cf162910ac005e7"
target_path: "C:\\Users\\armen\\OneDrive\\Desktop\\AgriMatch\\src\\app\\page.tsx"
timestamp: 2026-11-14T16-34-21Z
slug: src-app-page-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/layout_evidence)

# AgriMatch homepage critique and proposed redesign plan

The current page uses a marketing-page composition around a farm-planning tool. The previous migration standardized the controls but retained that composition. Geist and shadcn are useful foundations; the page needs a different information hierarchy and a tighter working layout.

## Design specificity and overall impression

The Albay location, crops, and farm conditions are product-specific. The oversized slogan, landscape illustration, and three-step explainer are interchangeable agricultural landing-page elements. They receive more attention than the actual task. The strongest identity is the real farm map and the choices a farmer makes.

Measured document positions, in pixels from the top:

| Element | Desktop 1440×900 | Mobile 390×844 |
| --- | ---: | ---: |
| First search input | 748 | 986 |
| Interactive map | 1048 | 1446 |
| Compare action | 2096 | 2733 |

The first editable input sits below the initial mobile viewport. The mobile page is approximately 3494px tall before any coordinate disclosure is expanded. This is a long approach to a small form.

## Design health score

Heuristic judgment, not a user study. All ten heuristics apply to this task interface.

| Heuristic | Score /4 | Main observation |
| --- | ---: | --- |
| System status | 3 | Useful feedback; weak current-task orientation. |
| Real-world language | 3 | Familiar crops; soil and season terms need help. |
| User control | 3 | Several location methods; no explicit draft reset/recovery. |
| Consistency | 3 | Cohesive controls; section labels blur location and conditions. |
| Error prevention | 2 | Validation works; unconfirmed farm defaults remain. |
| Recognition | 3 | Visible choices; some agricultural knowledge assumed. |
| Efficiency | 2 | Excessive scrolling separates related decisions. |
| Aesthetic/minimalist design | 2 | Calm palette; weak task hierarchy and unnecessary vertical bulk. |
| Error recovery | 3 | Correctable errors preserve current work. |
| Contextual help | 2 | Repeated map guidance; little help for harder farm decisions. |
| **Total** | **26/40** | **Acceptable functional foundation; significant design improvement needed.** |

## What works

- Cream, forest green, and sage provide a coherent identity. Keep them and Geist Sans.
- Official shadcn controls, clear field labels, alternative location entry, and validation provide a useful implementation foundation.
- Demo labeling is honest. Preserve that clarity near comparison actions and scores.

## Priority issues

### [P1] The working task starts too late

The hero consumes roughly 394px on desktop and 576px on mobile. Search, map selection, conditions, and comparison then form a long vertical sequence. The primary action is more than three mobile viewport heights from the document top.

Fix: replace the large hero with a compact planner title and short introduction. Put location and farm conditions in a coordinated workspace. Place a persistent comparison action beside the working form, with its prerequisite explanation. Suggested command: `$impeccable shape`.

### [P2] Width and spacing make short content feel stretched

The desktop working content spans approximately 1362px. Short dropdown values and small groups of choices occupy unusually wide rows. `farm-planner.tsx:28` puts 48px gaps on both sides of a standalone Separator, producing 97px of hero-to-workspace separation. `farm-form.tsx:57` creates another 65px divider separation. Nested 24px and 32px gaps amplify the effect.

Fix: propose a 1200px working canvas with a bounded 380–420px form column and a larger map column. Use proximity and alignment: 8–12px within field groups, 16–24px between related sections, and 24–32px between major regions. Keep comfortable control targets. Suggested command: `$impeccable layout`.

### [P2] Process orientation arrives after the process

The three-step journey appears below Compare. The heading “Choose your farm location” also governs crops, irrigation, soil, season, and priorities. The page has sections, but the user's current job is poorly signposted.

Fix: put a compact location → conditions → comparison indicator above the workspace. Give farm conditions their own heading and retain direct editing. Remove the bottom explainer from the working screen. Suggested command: `$impeccable shape`.

### [P2] Routine instructions and notices overpower the decisions

Location alternatives are repeated in the section description, search helper, idle results message, another helper paragraph, map Alert, and coordinate disclosure. On mobile, the search-input-to-map distance is approximately 459px. Soil and season receive less useful explanation despite requiring more domain knowledge.

Fix: retain one short location instruction, contextual asynchronous feedback, and coordinate access. Show meaningful demo status compactly. Add concise, optional soil/season explanations. Let the map and actual farm state supply the visual character. Suggested commands: `$impeccable distill` and `$impeccable clarify`.

## Cognitive load, emotional journey, and personas

Two clear checklist failures—visual hierarchy and progressive disclosure—produce moderate cognitive load. Five familiar crop choices are not inherently excessive; page length and repeated guidance are the larger problems.

Arrival is calm and optimistic. The early data-warning notice and extended approach to the form create a valley; the selected-farm confirmation is a positive peak. Instructions after the main action weaken the ending.

- First-time farmer: reaches search late, then receives little help identifying soil texture or choosing a season.
- Distracted mobile user: must travel a long page to compare, and a full refresh discards the React-held draft.
- Keyboard users: tested skip navigation and coordinate recovery work. Preserve these during the redesign; this critique is not a full screen-reader or overlay audit.

## Minor observations and product risks

- Replace development vocabulary such as “MVP” with a user-facing demo/pilot label.
- Rice, adequate irrigation, clay loam, dry season, and conserve water are prefilled assumptions. Make the demo preset explicit or ask the user to confirm conditions before real scoring is introduced.
- Draft state survives client navigation but not reloads. Consider local draft recovery and explicit reset for a real field-use pilot.
- Avoid duplicating checked crop choices in a second decorative summary row unless that summary serves a distinct task.
- No page-wide horizontal overflow was observed at the inspected desktop and mobile sizes.

## Proposed modern SaaS direction

Use a compact, task-first farm workspace with agricultural character supplied by the real map, precise labels, and restrained green accents.

- Header around 56–64px; one planner heading around 28–32px. Keep the actual route and demo context visible.
- Desktop: map/location on the left, a 380–420px farm-setup column on the right, with the comparison action at its foot. Use shared alignment, separators, and subtle tonal grouping rather than nested cards or decorative containers.
- Mobile: location entry immediately visible; compact map preview with access to refinement; clearly grouped conditions and an accessible persistent action.
- Preserve the existing palette, Geist, shadcn imports, validation, selected-state behavior, and honest demo framing. Introduce only navigation justified by actual product capabilities.
- A smaller title, tighter groups, intentional empty space, and clearer selected/active states should carry the modern feel. Keep decorative illustration out of the primary working viewport.

## Planning sequence and acceptance targets

1. Confirm which users/devices lead the design and choose the workspace topology. Record the confirmed product context before committing a replacement visual system.
2. Produce one desktop and one mobile wireframe covering empty, selected, loading, and error states. Revise DESIGN.md's width, spacing, title, and composition rules around the chosen direction.
3. Implement the homepage composition with the existing shared shadcn components, then apply the same density and hierarchy to comparison and detail routes.
4. Validate task completion, keyboard focus, overlays, content wrapping, mobile keyboard behavior, and viewport use; finish with `$impeccable polish`.

Acceptance targets: at 1440×900, the initial view should expose location, map, core farm fields, and the comparison action. At 390×844, the first useful location control should be visible without scrolling. A persistent action must retain an explicit disabled reason and must not obscure fields or focus. Keep 44px minimum touch targets. These are proposed targets for the redesign, not claims about the current page.

## Decisions for the next planning step

1. With the current map and action buried on mobile, should the redesign primarily serve farmers on phones, agricultural staff on desktop, or both equally?
2. Should the working flow use map plus setup side by side on desktop, or a guided location → conditions → comparison sequence?

No application code or design tokens were changed during this critique. The proposed direction remains a planning recommendation rather than an approved implementation brief.
