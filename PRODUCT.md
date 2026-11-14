# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

AgriMatch supports farm planning and demonstration crop-rotation comparisons for the Albay pilot. The existing workflow is location selection, farm conditions and priorities, comparison, then rotation trade-offs.

## Users

The application addresses Albay farmers. Phone and desktop layouts are required. Primary device, frequency of use, and assisted use by agricultural staff remain open decisions.

## Capabilities and Constraints

Location can be selected through explicit Nominatim search, geolocation, map click/drag, or coordinate entry within the Albay bounds. The draft includes current crops, irrigation, soil, season, and priorities. A root provider preserves it across client navigation; reloading starts a fresh draft.

Three fixed demonstration rotations are shared by comparison and detail routes. Climate and soil datasets are not connected; scores do not respond to farm inputs. Preserve honest demo labeling. New scoring, storage, accounts, and field values are outside the approved interface redesign.

## Brand Commitments

Keep the AgriMatch name, existing agricultural palette, Geist fonts, and strict official shadcn component sourcing. The approved interface direction is recorded in `UI-REDESIGN-PLAN.md` and its implementation protocol in `DESIGN.md`.

## Evidence on Hand

Existing farm options and demo rotation content live in `src/lib/`. The recorded homepage critique provides measured desktop/mobile layout evidence. No production recommendation accuracy or user-study outcomes are established.

## Product Principles

- Make the farm-planning task immediately accessible.
- Preserve direct editing and alternative location methods.
- Distinguish entered selections, editable demo presets, and fixed illustrative results.
- Keep consistent, accessible behavior across the existing routes.
