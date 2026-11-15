# AgriMatch

Farm planning and climate-resilient crop-rotation comparisons for the Albay pilot. The app evaluates a farmer's three-period current rotation against two alternatives using supplied NASA POWER-derived climate history and SoilGrids-derived soil layers.

## Development

```sh
npm ci
npm run dev
```

The repository includes an npm lockfile. The existing pnpm workflow is also supported; keep dependency lockfiles synchronized when changing dependencies.

## Interface architecture

Read [DESIGN.md](./DESIGN.md) before changing the interface.

The approved [redesign plan](./UI-REDESIGN-PLAN.md) uses a compact 1200px workspace: location and map beside a 400px setup column on desktop, with a location-first flow and reachable comparison action on phones. Location selection combines equal-width shadcn results and search controls; search runs explicitly through Enter or its icon action. Comparison summaries disclose farm details and an optional map so rotation options stay near the top.

- `src/app/`: Next.js route entry points, the shared root layout, loading, error, and not-found boundaries.
- `src/components/ui/`: official shadcn/ui components generated with the Base UI-backed Nova registry; shared sizes, semantic variants, and focus treatments live here.
- `src/components/farm/`: farm form, location search, map adapter, and the farm-state provider.
- `src/components/analysis/`: comparison, farm snapshot, and rotation-detail compositions.
- `src/lib/`: shared farm types, validation, location-response parsing, and the demo rotation dataset.
- `public/farm-landscape.svg`: the original landscape illustration extracted from the former CSS drawing.

The root layout owns one shared page shell. Route files select and compose views. Rotation IDs resolve against the shared dataset; unknown IDs use the rotation not-found boundary. Farm inputs live in a root React provider and survive client navigation; a full reload starts a fresh draft.

Use imported shadcn controls and shared `buttonVariants` for navigation links. Keep content in open semantic sections; avoid decorative cards and nested containers. Leaflet owns only specialist map rendering and built-in map controls.

## Validation

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests run the production build on port 3100, cover desktop and mobile, and include accessibility checks with axe. They mock the existing external search and map services for deterministic workflow checks. On Windows, an installed Edge can be used with `$env:PLAYWRIGHT_CHANNEL='msedge'` before running the browser tests.

## Data and external services

Climate and soil datasets are sampled locally from supplied NASA POWER-derived 2015–2025 climate CSVs and SoilGrids-derived Albay rasters. Rotation scores are screening estimates: they combine crop suitability with sequence diversity and legume-like soil-building contributions, not measured yield, profit, or guaranteed soil-carbon change. Farm summaries use the user's actual selections.

Location search retains the existing [Nominatim service](https://operations.osmfoundation.org/policies/nominatim/) and runs only after an explicit search action. Its public service prohibits keystroke autocomplete, limits combined application traffic to one request per second, and requires attribution and an identifiable Referer. Production deployment needs an appropriately configured provider/proxy, caching, and application-wide rate limiting; this interface migration does not add that infrastructure. Map tiles retain OpenStreetMap attribution. Coordinate entry remains available when external services fail.
