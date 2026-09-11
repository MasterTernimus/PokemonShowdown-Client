# Sprite and icon review — 2026-09-11

Reviewed the pending client sprite/icon changes without reverting supplied assets or unrelated work. Changes are local; not committed, pushed, or deployed by this review.

## Findings fixed

1. **Furfrou back sprites lost the trim.** `CUSTOM_DEFAULT_BACK_SPRITES` forced all trim and gender entries back to untrimmed Furfrou. Removed those overrides; the existing complete custom front/back metadata now selects the correct files.
2. **Furfrou Team Builder palettes differed from battles.** Native dedicated artwork took precedence over supplied custom trims and their distinct female shiny palettes. All ten Furfrou forms now use their existing Gen 5 custom assets in modern and BW Team Builder views, preserving gender and shiny selection.
3. **Furfrou icons ignored palette variants.** Official sheet icons did not represent the supplied female/shiny artwork. Furfrou menu slots now use their matching custom front image, fitted within the existing icon slot. These are scaled sprite icons, not newly drawn miniature icon artwork. Fainted styling and temporary form changes are preserved.
4. **Mega Scizor gender mapping corrected (follow-up).** The initial review incorrectly assumed its female assets were missing after checking hyphenated filenames. The supplied files are scizormega.png and scizormega-f.png. Restored distinct male/female routing for normal/shiny front/back sprites and Team Builder; existing gender-specific menu icons remain intact.
5. **G-Max Cinderace selected missing modern animations.** Its animation flag was active while graphics generation remained modern. Routed it to the existing BW animations, including shiny and back views.
6. **Some tests asserted outdated routing.** Updated the Furfrou base-back expectation. Native-art checks now explicitly exclude the supplied Furfrou, Dusknoir, and Reuniclus art overrides; dedicated Furfrou tests verify the replacement behavior.

## Verification

- Client build succeeded; git diff whitespace check passed.
- 2,857 focused source tests passed (sprite/icon and Team Builder suites).
- 1,717 rebuilt-browser-bundle tests passed independently.
- 41 Furfrou tests cover all ten forms × male/female × normal/shiny, plus fainting and temporary forms. Each combination checks both battle directions, both menu orientations, dimensions against the actual PNG headers, and Team Builder selection in generations 0/5/9 with BW on/off.
- Two further regressions cover female Mega Scizor and G-Max Cinderace.
- `build-tools/audit-changed-sprites.cjs` inspected 115 changed species/form mappings, 2,300 selected asset paths, and 838 unique assets. No missing, empty, or placeholder files remained in that scan. It reads the current working-tree source diff against HEAD, so its scope changes after commits.
- Visually inspected the actual custom Heart Trim front/back and female shiny images alongside native dedicated artwork; confirmed the blue female shiny palette was being lost through the old routing.

## Limits and remaining observations

- The broader battle suite still has two previously documented failures: old Lopunny width expectations (108 versus the current 106) and old Friend Guard description wording. The stale Roserade-Mega expectation has since been corrected to True Devotion. Those are not newly introduced by these changes. One existing test is pending.
- File-existence and routing checks do not certify the pixel content of every supplied icon. No blanket claim of visual identity across all 115 forms is made. Furfrou identity is ensured by selecting the same existing front image for its menu icon and Team Builder, with the matching trim's back image in battle.
- Existing unrelated custom-icon choices remain intact, including Banette-Mega-Z's shared shiny Mega icon; a distinct supplied shiny Z icon would be needed to change that choice reliably.
- No live deployment/browser battle was tested. Source and rebuilt bundle were exercised through the client APIs.

## Reproduce

```text
node build
node node_modules/mocha/bin/mocha test/furfrou-sprites.test.js test/menu-icons.test.js test/teambuilder-art.test.js
node build-tools/audit-changed-sprites.cjs
```

Set `MENU_ICON_BUNDLE=1` when running the Furfrou and menu-icon suites to verify the browser bundle.