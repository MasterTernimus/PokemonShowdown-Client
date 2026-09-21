# Field move tooltip audit

Implemented for both battle tooltips and Team Builder.

## Coverage

- 47 fields: 43 custom field/stage entries and four customized standard terrains.
- Preview rules exported from the server, including field-specific hooks stored on moves.
- Battle tooltips apply field power multipliers and show field changes to type, category, accuracy, priority, stat changes, secondary effects, recoil, healing and move failure where represented by the preview hooks.
- Both Team Builder renderers have expandable field-effect references. These are computed on expansion and cached, keeping move search responsive.
- Existing standard-terrain calculations are bypassed when the server-derived preview is available, avoiding duplicate boosts and the incorrect standard Gen 9 1.3x boost.

## Verified examples

| Field | Move | Displayed power / effect |
| --- | --- | --- |
| Rocky | Accelerock | 40 x 2.25 = 90 |
| Electric | Thunderbolt | 90 x 1.5 = 135 |
| Psychic | Expanding Force | 80 x 2.25 = 180 |
| Misty | Misty Explosion, grounded user | 100 x 4.5 = 450 |
| Big Top | Acrobatics | 165 with or without a held item; no duplicate itemless bonus |
| Cold Eclipse | Power Trip, +1 positive stat stage | 60 |
| Fairy Tale | Slash | Steel type, 135 |
| Psychic | Calm Mind | +2 Special Attack and +2 Special Defense |

## Validation

- Client build passes. Its optional news-fetch step warns that PHP is unavailable.
- `node tools/test-field-move-tooltips.cjs` passes 97,614 field/move/state evaluations, verifies cached moves are not mutated, and checks integrated battle power calculations and Team Builder text.
- All 986 move references generated successfully in an additional sweep.
- Browser checked the actual legacy move-row renderer, expansion event and stylesheet with Accelerock and Calm Mind.
- Broad client suite: 2,948 passing, one pending, zero failures.
- Full-project TypeScript checking passes with `tsc --noEmit`; the modern Team Builder integration builds successfully.
- Regression checks cover Swamp drain effects, Rainbow random typing and single hook application, unique alert popup IDs, and format-aware ability components. The suspected duplicate field hook was a false positive and was left unchanged.

## Limits

Field counters/history and chess roles are not all transmitted to the client. Battle previews label ranges or conditional effects rather than asserting an exact hidden state. Random types are labeled as random. References describe direct preview-hook modifiers; they are not a damage calculator or an exhaustive simulation of on-hit events, field transitions, defensive abilities and every combination of conditions.

## Regeneration

After changing server field or move mechanics, build the server and run:

```
node tools/export-client-field-rules.cjs <client-root>
```

Then build the client and run the focused test above. Do not manually edit `src/battle-field-rules.ts`.
