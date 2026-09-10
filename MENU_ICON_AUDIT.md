# Team-strip menu icon audit — 2026-09-10

Scope: the small 40 × 30 icons in the top Team Builder strip and other client views using Dex.getPokemonIcon. This is separate from the larger Team Builder artwork. All changes are local and the client bundle was rebuilt; no deployment or server restart was performed. The draft bot was excluded.

## Results

Audited **1,663 registered species/form entries**. **211 selections changed**:

- 158 battle-art fallbacks now use exact native menu icons, including two resolved sprite aliases.
- 1 legacy-sheet selection now uses the exact native icon (Charizard-Alt intentionally shares Charizard artwork).
- 52 legacy/base/unknown selections now show their exact custom-form artwork, covering 40 canonical mappings plus aliases.
- Display aliases resolve to canonical profiles before icon selection.
- Legacy left-facing and female lookups are guarded when optional index tables have not loaded.
- Existing dedicated custom party icons are preserved, including Raichu Mega X/Y and female Mega Breloom.

Final distribution: **1,510 native menu icons; 6 dedicated custom icons; 146 exact-form battle-art fallbacks; 1 generic placeholder (Raid Boss, which has no local species artwork)**. Counts include aliases registered as separate entries.

Examples corrected: Mega Dragonite, Annihilape, Garchomp Mega Z, Charizard Mega Y, Mega Clefable, Mega Greninja, and Mega Baxcalibur. Divineon, the custom Eeveelutions, Mega Ledian, Mega Clawitzer, and custom Castform forms no longer silently use a base-species icon.

## Behavior preserved

- Raichu Mega X/Y continue using their supplied dedicated menu icon PNGs.
- Banette Mega Z has no exact native menu index or supplied dedicated party icon in this client, so its existing correct form artwork remains. No base Banette icon is substituted.
- Fainted styling, Parasitism, temporary form changes, female native icons, and supplied custom gender variants remain supported.
- Standard native menu icons are not shiny-specific; custom dedicated icons use their existing shiny mappings.
- The BW graphics preference continues controlling the large Team Builder sprites. Native menu icons remain the small native menu icons, as in Showdown.

## Validation

- **2,805 passing** across menu-icon and dedicated-art suites, including the BW toggle regression.
- **1,667 passing** when testing the rebuilt battledata.js browser bundle separately.
- Every registered entry was checked in eight male/female, normal/shiny, and left/right combinations (**13,304 selections**), with local file existence, non-placeholder dimensions, and sprite-sheet bounds checked. This is asset validation, not pixel-by-pixel art-quality certification.
- Existing battle suite remains at **40 passing, 1 pending, 3 pre-existing failures** (Lopunny size expectations, old Friend Guard wording, old Roserade ability expectation).
- Client build succeeded; optional news refresh still warns that PHP is unavailable.
- Browser policy blocked opening the local HTML comparison. The saved comparison uses actual before/after icon CSS, but was not visually inspected in the browser.

## Changed entries

| Pokémon/form | Before | After |
| --- | --- | --- |
| Venusaur-Mega | battle fallback | official menu icon |
| Venusaur-Gmax | battle fallback | official menu icon |
| Charizard-Alt | legacy sheet | official menu icon |
| Charizard-Gmax | battle fallback | official menu icon |
| Blastoise-Gmax | battle fallback | official menu icon |
| Butterfree-Gmax | battle fallback | official menu icon |
| Pidgeot-Mega | battle fallback | official menu icon |
| Pikachu-Gmax | battle fallback | official menu icon |
| Sandslash-Reborn | legacy sheet | battle fallback |
| Nidoqueen-Reborn | legacy sheet | battle fallback |
| Nidoking-Reborn | legacy sheet | battle fallback |
| Clefable-Mega | battle fallback | official menu icon |
| Ninetales-Reborn | legacy sheet | battle fallback |
| Ninetales-Alola | battle fallback | official menu icon |
| Meowth-Gmax | battle fallback | official menu icon |
| Alakazam | battle fallback | official menu icon |
| Alakazam-Mega | battle fallback | official menu icon |
| Machamp-Gmax | battle fallback | official menu icon |
| Victreebel-Mega | battle fallback | official menu icon |
| Slowbro-Mega | battle fallback | official menu icon |
| Slowbro-Galar | battle fallback | official menu icon |
| Gengar-Mega | battle fallback | official menu icon |
| Gengar-Gmax | battle fallback | official menu icon |
| Kingler-Gmax | battle fallback | official menu icon |
| Weezing-Galar | battle fallback | official menu icon |
| Starmie-Mega | battle fallback | official menu icon |
| Tauros-Paldea-Combat | battle fallback | official menu icon |
| Tauros-Paldea-Blaze | battle fallback | official menu icon |
| Tauros-Paldea-Aqua | battle fallback | official menu icon |
| Lapras-Gmax | battle fallback | official menu icon |
| Eevee-Gmax | battle fallback | official menu icon |
| Snorlax-Gmax | battle fallback | official menu icon |
| Dragonite-Mega | battle fallback | official menu icon |
| Meganium-Mega | battle fallback | official menu icon |
| Typhlosion-Hisui | battle fallback | official menu icon |
| Feraligatr-Mega | battle fallback | official menu icon |
| Umbreon-Perfect | legacy sheet | battle fallback |
| Slowking-Galar | battle fallback | official menu icon |
| Steelix-Mega | battle fallback | official menu icon |
| Granbull-Reborn | legacy sheet | battle fallback |
| Heracross-Mega | battle fallback | official menu icon |
| Sneasel-Hisui | battle fallback | official menu icon |
| Corsola-Reborn | legacy sheet | battle fallback |
| Skarmory-Mega | battle fallback | official menu icon |
| Houndoom-Mega | battle fallback | official menu icon |
| Aggron-Mega | battle fallback | official menu icon |
| Sharpedo | battle fallback | official menu icon |
| Sharpedo-Mega | battle fallback | official menu icon |
| Milotic-Reborn | legacy sheet | battle fallback |
| Castform-Sandy | legacy sheet | battle fallback |
| Castform-Windy | legacy sheet | battle fallback |
| Banette-Mega | battle fallback | official menu icon |
| Chimecho-Mega | battle fallback | official menu icon |
| Absol-Mega-Z | battle fallback | official menu icon |
| Salamence-Mega | battle fallback | official menu icon |
| Metagross-Mega | battle fallback | official menu icon |
| Torterra-Reborn | legacy sheet | battle fallback |
| Infernape-Reborn | legacy sheet | battle fallback |
| Empoleon-Reborn | legacy sheet | battle fallback |
| Staraptor-Mega | battle fallback | official menu icon |
| Luxray-Deso | legacy sheet | battle fallback |
| Lopunny | battle fallback | official menu icon |
| Lopunny-Mega | battle fallback | official menu icon |
| Garchomp-Mega | battle fallback | official menu icon |
| Garchomp-Mega-Z | battle fallback | official menu icon |
| Lucario-Mega | battle fallback | official menu icon |
| Lucario-Mega-Z | battle fallback | official menu icon |
| Gallade-Azzy | battle fallback | official menu icon |
| Froslass-Mega | battle fallback | official menu icon |
| Rotom-Heat | battle fallback | official menu icon |
| Rotom-Wash | battle fallback | official menu icon |
| Rotom-Frost | battle fallback | official menu icon |
| Rotom-Fan | battle fallback | official menu icon |
| Rotom-Mow | battle fallback | official menu icon |
| Emboar-Mega | battle fallback | official menu icon |
| Emboar-Reborn | legacy sheet | battle fallback |
| Emboar-Mega-Reborn | legacy sheet | battle fallback |
| Excadrill-Mega | battle fallback | official menu icon |
| Scolipede-Mega | battle fallback | official menu icon |
| Lilligant-Hisui | battle fallback | official menu icon |
| Scrafty-Mega | battle fallback | official menu icon |
| Garbodor-Gmax | battle fallback | official menu icon |
| Zoroark-Hisui | battle fallback | official menu icon |
| Reuniclus | battle fallback | official menu icon |
| Sawsbuck-Spring | battle fallback | official menu icon |
| Sawsbuck-Summer | battle fallback | official menu icon |
| Sawsbuck-Autumn | battle fallback | official menu icon |
| Sawsbuck-Winter | battle fallback | official menu icon |
| Eelektross-Mega | battle fallback | official menu icon |
| Chandelure-Mega | battle fallback | official menu icon |
| Golurk-Mega | battle fallback | official menu icon |
| Volcarona | battle fallback | official menu icon |
| Chesnaught-Mega | battle fallback | official menu icon |
| Delphox-Mega | battle fallback | official menu icon |
| Greninja-Bond | battle fallback | official menu icon |
| Greninja-Ash | battle fallback | official menu icon |
| Greninja-Mega | battle fallback | official menu icon |
| Pyroar-Mega | battle fallback | official menu icon |
| Floette-Eternal | battle fallback | official menu icon |
| Floette-Mega | battle fallback | official menu icon |
| Furfrou-Heart | battle fallback | official menu icon |
| Furfrou-Star | battle fallback | official menu icon |
| Furfrou-Diamond | battle fallback | official menu icon |
| Furfrou-Debutante | battle fallback | official menu icon |
| Furfrou-Matron | battle fallback | official menu icon |
| Furfrou-Dandy | battle fallback | official menu icon |
| Furfrou-La Reine | battle fallback | official menu icon |
| Furfrou-Kabuki | battle fallback | official menu icon |
| Furfrou-Pharaoh | battle fallback | official menu icon |
| Meowstic-M-Mega | battle fallback | official menu icon |
| Meowstic-F-Mega | battle fallback | official menu icon |
| Malamar-Mega | battle fallback | official menu icon |
| Dragalge-Mega | battle fallback | official menu icon |
| Hawlucha-Mega | battle fallback | official menu icon |
| Decidueye-Hisui | battle fallback | official menu icon |
| Crabominable-Mega | battle fallback | official menu icon |
| Oricorio | battle fallback | official menu icon |
| Oricorio-Pom-Pom | battle fallback | official menu icon |
| Oricorio-Pa'u | battle fallback | official menu icon |
| Oricorio-Sensu | battle fallback | official menu icon |
| Golisopod-Mega | battle fallback | official menu icon |
| Silvally | battle fallback | official menu icon |
| Silvally-Bug | battle fallback | official menu icon |
| Silvally-Dark | battle fallback | official menu icon |
| Silvally-Dragon | battle fallback | official menu icon |
| Silvally-Electric | battle fallback | official menu icon |
| Silvally-Fairy | battle fallback | official menu icon |
| Silvally-Fighting | battle fallback | official menu icon |
| Silvally-Fire | battle fallback | official menu icon |
| Silvally-Flying | battle fallback | official menu icon |
| Silvally-Ghost | battle fallback | official menu icon |
| Silvally-Grass | battle fallback | official menu icon |
| Silvally-Ground | battle fallback | official menu icon |
| Silvally-Ice | battle fallback | official menu icon |
| Silvally-Poison | battle fallback | official menu icon |
| Silvally-Psychic | battle fallback | official menu icon |
| Silvally-Rock | battle fallback | official menu icon |
| Silvally-Steel | battle fallback | official menu icon |
| Silvally-Water | battle fallback | official menu icon |
| Drampa-Mega | battle fallback | official menu icon |
| Magearna | battle fallback | official menu icon |
| Magearna-Mega | battle fallback | official menu icon |
| Melmetal-Gmax | battle fallback | official menu icon |
| Rillaboom-Gmax | battle fallback | official menu icon |
| Cinderace-Gmax | battle fallback | official menu icon |
| Inteleon-Gmax | battle fallback | official menu icon |
| Corviknight-Gmax | battle fallback | official menu icon |
| Orbeetle-Gmax | battle fallback | official menu icon |
| Drednaw-Gmax | battle fallback | official menu icon |
| Coalossal-Gmax | battle fallback | official menu icon |
| Flapple-Gmax | battle fallback | official menu icon |
| Appletun-Gmax | battle fallback | official menu icon |
| Sandaconda-Gmax | battle fallback | official menu icon |
| Toxtricity-Gmax | battle fallback | official menu icon |
| Toxtricity-Low-Key-Gmax | battle fallback | official menu icon |
| Centiskorch-Gmax | battle fallback | official menu icon |
| Hatterene-Gmax | battle fallback | official menu icon |
| Grimmsnarl-Gmax | battle fallback | official menu icon |
| Alcremie-Gmax | battle fallback | official menu icon |
| Falinks-Mega | battle fallback | official menu icon |
| Indeedee-F | battle fallback | official menu icon |
| Copperajah-Gmax | battle fallback | official menu icon |
| Duraludon-Gmax | battle fallback | official menu icon |
| Urshifu-Gmax | battle fallback | official menu icon |
| Urshifu-Rapid-Strike-Gmax | battle fallback | official menu icon |
| Ursaluna-Bloodmoon | battle fallback | official menu icon |
| Basculegion-F | battle fallback | official menu icon |
| Maushold-Four | battle fallback | official menu icon |
| Scovillain-Mega | battle fallback | official menu icon |
| Palafin-Hero | battle fallback | official menu icon |
| Glimmora-Mega | battle fallback | official menu icon |
| Tatsugiri-Droopy-Mega | battle fallback | official menu icon |
| Tatsugiri-Stretchy-Mega | battle fallback | official menu icon |
| Baxcalibur-Mega | battle fallback | official menu icon |
| Sinistcha-Masterpiece | battle fallback | official menu icon |
| MissingNo. | legacy sheet | battle fallback |
| Pokestar Smeargle | legacy sheet | battle fallback |
| Pokestar UFO | legacy sheet | battle fallback |
| Pokestar UFO-2 | legacy sheet | battle fallback |
| Pokestar Brycen-Man | legacy sheet | battle fallback |
| Pokestar MT | legacy sheet | battle fallback |
| Pokestar MT2 | legacy sheet | battle fallback |
| Pokestar Transport | legacy sheet | battle fallback |
| Pokestar Giant | legacy sheet | battle fallback |
| Pokestar Humanoid | legacy sheet | battle fallback |
| Pokestar Monster | legacy sheet | battle fallback |
| Pokestar F-00 | legacy sheet | battle fallback |
| Pokestar F-002 | legacy sheet | battle fallback |
| Pokestar Spirit | legacy sheet | battle fallback |
| Pokestar Black Door | legacy sheet | battle fallback |
| Pokestar White Door | legacy sheet | battle fallback |
| Pokestar Black Belt | legacy sheet | battle fallback |
| Pokestar UFO-PropU2 | legacy sheet | battle fallback |
| Tentacruel-Reborn | legacy sheet | battle fallback |
| Cinderace-Mega | legacy sheet | battle fallback |
| Ledian-Mega | legacy sheet | battle fallback |
| Ariados-Mega | legacy sheet | battle fallback |
| Clawitzer-Mega | legacy sheet | battle fallback |
| Divineon | legacy sheet | battle fallback |
| Lilligant-Rift | legacy sheet | battle fallback |
| Lilligant-Hisui-Rift | legacy sheet | battle fallback |
| Braveon | legacy sheet | battle fallback |
| Nimbeon | legacy sheet | battle fallback |
| Toxeon | legacy sheet | battle fallback |
| Dusteon | legacy sheet | battle fallback |
| Basaleon | legacy sheet | battle fallback |
| Ephemeon | legacy sheet | battle fallback |
| Kitsuneon | legacy sheet | battle fallback |
| Titaneon | legacy sheet | battle fallback |
| Byteon | legacy sheet | battle fallback |
| Drekeon | legacy sheet | battle fallback |

## Forms still needing dedicated menu artwork

These entries have valid exact-form artwork, but no dedicated native/supplied menu icon. A distinct hand-drawn menu icon would be an artwork task, not a missing-file fix. Their battle-art fallback is intentional until that art exists.

- Charizard-Mega-X-Alt
- Butterfree-Mega
- Arbok-Mega-X
- Arbok-Mega-Y
- Sandslash-Reborn
- Nidoqueen-Reborn
- Nidoking-Reborn
- Ninetales-Reborn
- Parasect-Parasite
- Parasect-Parasitism
- Arcanine-Alt
- Alakazam-Alt
- Alakazam-Mega-Alt
- Machamp-Alt
- Machamp-Gmax-Alt
- Muk-Pulse
- Hypno-Pulse
- Jynx-Alt
- Lapras-Aevian
- Lapras-Azzy
- Eevee-Starter-Alt
- Auroreon
- Meganium-Mega-Y
- Typhlosion-Alt
- Feraligatr-Gmax
- Crobat-Alt
- Lanturn-Alt
- Bellibolt-Alt
- Umbreon-Perfect
- Granbull-Reborn
- Corsola-Reborn
- Mightyena-Deso
- Gardevoir-Mega-Z
- Gardevoir-Void-Mega
- Flygon-Mega-Z
- Cacturne-Alt
- Zangoose-Reborn
- Seviper-Reborn
- Milotic-Reborn
- Milotic-Aevian
- Castform-Sandy
- Castform-Windy
- Banette-Mega-Z
- Torterra-Reborn
- Infernape-Reborn
- Empoleon-Reborn
- Luxray-Deso
- Gastrodon-Aevian
- Gastrodon-East-Aevian
- Gastrodon-Azzy
- Gastrodon-Azzy2
- Mismagius-Aevian
- Mismagius-Mega
- Bronzong-Rejuv
- Garchomp-Battle-Bond
- Toxicroak-Deso
- Lumineon-Alt
- Gallade-Mega-Azzy
- Serperior-Azzy
- Serperior-Mega
- Chimecho-Mega-Y
- Emboar-Reborn
- Emboar-Mega-Reborn
- Samurott-Alt
- Samurott-Hisui-Alt
- Musharna-Rejuv
- Unfezant-Rejuv
- Scolipede-Azzy
- Scolipede-Mega-Azzy
- Cinccino-Deso
- Jellicent-Azzy
- Haxorus-Mega
- Florges-Reborn
- Aegislash-Gmax
- Goodra-Hisui-Alt
- Decidueye-Alt
- Decidueye-Hisui-Alt
- Incineroar-Alt
- Primarina-Alt
- Tsareena-Alt
- Palossand-Rocky
- Palossand-Fiery
- Palossand-Icy
- Toxtricity-Aevian
- Grimmsnarl-Azzy
- Grimmsnarl-Gmax-Azzy
- Dragapult-Gmax
- Skeledirge-Alt
- MissingNo.
- Pokestar Smeargle
- Pokestar UFO
- Pokestar UFO-2
- Pokestar Brycen-Man
- Pokestar MT
- Pokestar MT2
- Pokestar Transport
- Pokestar Giant
- Pokestar Humanoid
- Pokestar Monster
- Pokestar F-00
- Pokestar F-002
- Pokestar Spirit
- Pokestar Black Door
- Pokestar White Door
- Pokestar Black Belt
- Pokestar UFO-PropU2
- Tentacruel-Reborn
- Cinderace-Mega
- Ledian-Mega
- Ariados-Mega
- Roserade-Mega
- Clawitzer-Mega
- Soluneon
- Abysseon
- Divineon
- Gligar-Alt
- Gliscor-Alt
- Toxtricity-Low-Key-Alt
- Toxtricity-Low-Key-Gmax-Alt
- Luxray-Mega
- Gardevoir-Void
- Noctowl-Mega
- Dusknoir-Mega
- Weavile-Mega
- Noivern-Mega
- Bronzong-Mega
- Sharpedo-Mega-Y
- Bellibolt-Mega
- Sunflora-Mega
- Claydol-Mega
- Lilligant-Rift
- Lilligant-Hisui-Rift
- Dusknoir-Alt
- Spiritomb-Alt
- Dipplin-Gmax
- Floette-Eternal-Mega
- Braveon
- Nimbeon
- Toxeon
- Dusteon
- Basaleon
- Ephemeon
- Kitsuneon
- Titaneon
- Byteon
- Drekeon

## Reproduce

Run `node build-tools/audit-menu-icons.cjs` for current coverage and `node node_modules/mocha/bin/mocha test/menu-icons.test.js test/teambuilder-art.test.js --reporter dot` for validation. `menu-icons-before.json` is the saved pre-change selection snapshot. `MENU_ICON_COMPARISON.html` contains side-by-side examples at actual icon dimensions.
