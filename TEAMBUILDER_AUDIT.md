# Team Builder and server audit — 2026-09-10

The client is in showdown server/PokemonShowdown-Client; the simulator is in Showdown/PokemonShowdown-Reborn. The draft bot was excluded. Changes are local; no production deployment or server restart was performed.

## Fixed

The Team Builder previously treated custom battle/menu sprite metadata as an instruction to use Gen 5 battle art. A second branch preferred Gen 5 art whenever a Pokémon was shiny. Dedicated native artwork now takes priority for modern teams when an exact verified filename is available. Explicit Gen 5 graphics, the BW preference, April Fools graphics, and custom forms without a match retain their existing routes.

- 312 entries with a normal-art fallback corrected.
- 823 additional entries whose shiny setting triggered fallback corrected.
- 1119 distinct filenames imported from the official dex/dex-shiny directories, with PNG dimensions recorded in teambuilder-art-manifest.json.
- Each canvas fits within 96 × 96 pixels; normal and shiny remain a single image layer.
- Battle sprites and menu icons are independent of this Team Builder change.

Official sources: [normal Team Builder artwork](https://play.pokemonshowdown.com/sprites/dex/) and [shiny Team Builder artwork](https://play.pokemonshowdown.com/sprites/dex-shiny/). Availability was checked on the audit date.

## Examples now using dedicated artwork

Mega Dragonite, Mega Clefable, Mega Victreebel, Mega Starmie, Mega Meganium, Mega Feraligatr, Mega Skarmory, Mega Froslass, Mega Emboar, Mega Excadrill, Mega Chandelure, Mega Golurk, Mega Chesnaught, Mega Delphox, Mega Greninja, Mega Floette, Mega Hawlucha, Mega Crabominable, Mega Drampa, Mega Scovillain, and Mega Glimmora.

## Remaining artwork gaps

238 entries from the normal-fallback scan do not have an exact matching filename in the upstream dedicated-art index. This includes custom forms, Gigantamax forms, aliases, and unreleased dedicated artwork. These retain their existing fallback. This is a filename-availability audit, not a claim that every entry lacks all possible artwork; aliases and gender-specific artwork need separate review. The list is limited to species registered in this client, not every hypothetical form.

| Pokémon | Current fallback filename |
| --- | --- |
| Venusaur-Gmax | venusaur-gmax.png |
| Charizard-Mega-X-Alt | charizard-megax-alt.png |
| Charizard-Gmax | charizard-gmax.png |
| Blastoise-Gmax | blastoise-gmax.png |
| Butterfree-Gmax | butterfree-gmax.png |
| Butterfree-Mega | butterfree-mega.png |
| Arbok-Mega-X | arbok-mega-x.png |
| Arbok-Mega-Y | arbok-mega-y.png |
| Pikachu-Rock-Star | pikachu-rockstar.png |
| Pikachu-Belle | pikachu-belle.png |
| Pikachu-Pop-Star | pikachu-popstar.png |
| Pikachu-PhD | pikachu-phd.png |
| Pikachu-Libre | pikachu-libre.png |
| Pikachu-Gmax | pikachu-gmax.png |
| Pikachu-World | pikachu-world.png |
| Raichu-Mega-X | raichu-megax.png |
| Raichu-Mega-Y | raichu-megay.png |
| Sandslash-Reborn | 0.png |
| Nidoqueen-Reborn | 0.png |
| Nidoking-Reborn | 0.png |
| Ninetales-Reborn | 0.png |
| Parasect-Parasite | parasect-parasite.png |
| Parasect-Parasitism | parasect-parasitism.png |
| Meowth-Galar | meowth-galar.png |
| Meowth-Gmax | meowth-gmax.png |
| Growlithe-Hisui | growlithe-hisui.png |
| Arcanine-Alt | arcanine-alt.png |
| Alakazam-Alt | alakazam-alt.png |
| Alakazam-Mega-Alt | alakazam-mega-alt.png |
| Machamp-Alt | machamp-alt.png |
| Machamp-Gmax | machamp-gmax.png |
| Machamp-Gmax-Alt | machamp-gmax-alt.png |
| Ponyta-Galar | ponyta-galar.png |
| Rapidash-Galar | rapidash-galar.png |
| Slowpoke-Galar | slowpoke-galar.png |
| Farfetch’d-Galar | farfetchd-galar.png |
| Muk-Pulse | muk-pulse.png |
| Gengar-Gmax | gengar-gmax.png |
| Hypno-Pulse | hypno-pulse.png |
| Kingler-Gmax | kingler-gmax.png |
| Voltorb-Hisui | voltorb-hisui.png |
| Electrode-Hisui | electrode-hisui.png |
| Weezing-Galar | weezing-galar.png |
| Mr. Mime-Galar | mrmime-galar.png |
| Jynx-Alt | jynx-alt.png |
| Lapras-Gmax | lapras-gmax.png |
| Lapras-Aevian | lapras-aevian.png |
| Lapras-Azzy | lapras-azzy.png |
| Eevee-Starter-Alt | eevee-starter-alt.png |
| Eevee-Gmax | eevee-gmax.png |
| Auroreon | auroreon.png |
| Snorlax-Gmax | snorlax-gmax.png |
| Articuno-Galar | articuno-galar.png |
| Zapdos-Galar | zapdos-galar.png |
| Moltres-Galar | moltres-galar.png |
| Meganium-Mega-Y | meganium-mega-y.png |
| Typhlosion-Alt | typhlosion-alt.png |
| Feraligatr-Gmax | feraligatr-gmax.png |
| Crobat-Alt | crobat-alt.png |
| Lanturn-Alt | lanturn-alt.png |
| Bellibolt-Alt | bellibolt-alt.png |
| Umbreon-Perfect | umbreon-perfect.png |
| Granbull-Reborn | granbull-reborn.png |
| Qwilfish-Hisui | qwilfish-hisui.png |
| Sneasel-Hisui | sneasel-hisui.png |
| Corsola-Galar | corsola-galar.png |
| Corsola-Reborn | 0.png |
| Mightyena-Deso | mightyena-deso.png |
| Zigzagoon-Galar | zigzagoon-galar.png |
| Linoone-Galar | linoone-galar.png |
| Gardevoir-Mega-Z | gardevoir-megaz.png |
| Gardevoir-Void-Mega | gardevoirvoid-mega.png |
| Flygon-Mega-Z | flygon-megaz.png |
| Cacturne-Alt | cacturne-alt.png |
| Zangoose-Reborn | zangoose-reborn.png |
| Seviper-Reborn | seviper-reborn.png |
| Milotic-Reborn | 0.png |
| Milotic-Aevian | milotic-aevian.png |
| Banette-Mega-Z | banette-megaz.png |
| Absol-Mega-Z | absol-megaz.png |
| Torterra-Reborn | 0.png |
| Infernape-Reborn | 0.png |
| Empoleon-Reborn | 0.png |
| Staraptor-Mega | staraptor-mega.png |
| Luxray-Deso | 0.png |
| Gastrodon-Aevian | gastrodon-aevian.png |
| Gastrodon-East-Aevian | gastrodon-east-aevian.png |
| Gastrodon-Azzy | gastrodon-azzy.png |
| Gastrodon-Azzy2 | gastrodon-azzy2.png |
| Mismagius-Aevian | mismagius-aevian.png |
| Mismagius-Mega | mismagius-mega.png |
| Bronzong-Rejuv | bronzong-rejuv.png |
| Garchomp-Mega-Z | garchomp-megaz.png |
| Garchomp-Battle-Bond | garchomp-battlebond.png |
| Lucario-Mega-Z | lucario-megaz.png |
| Drapion-Aevian | drapion-aevian.png |
| Toxicroak-Deso | toxicroak-deso.png |
| Lumineon-Alt | lumineon-alt.png |
| Gallade-Mega-Azzy | gallade-mega-azzy.png |
| Dialga-Origin | dialga-origin.png |
| Palkia-Origin | palkia-origin.png |
| Serperior-Azzy | serperior-azzy.png |
| Serperior-Mega | serperior-mega.png |
| Chimecho-Mega-Y | chimecho-mega-y.png |
| Emboar-Reborn | emboar-alt.png |
| Emboar-Mega-Reborn | emboar-mega-alt.png |
| Samurott-Alt | samurott-alt.png |
| Samurott-Hisui-Alt | samurott-hisui-alt.png |
| Musharna-Rejuv | musharna-rejuv.png |
| Unfezant-Rejuv | unfezant-rejuv.png |
| Scolipede-Azzy | scolipede-azzy.png |
| Scolipede-Mega | scolipede-mega.png |
| Scolipede-Mega-Azzy | scolipede-mega-azzy.png |
| Lilligant-Hisui | lilligant-hisui.png |
| Basculin-White-Striped | basculin-whitestriped.png |
| Darumaka-Galar | darumaka-galar.png |
| Darmanitan-Galar | darmanitan-galar.png |
| Darmanitan-Galar-Zen | darmanitan-galarzen.png |
| Scrafty-Mega | scrafty-mega.png |
| Yamask-Galar | yamask-galar.png |
| Garbodor-Gmax | garbodor-gmax.png |
| Zorua-Hisui | zorua-hisui.png |
| Cinccino-Deso | cinccino-deso.png |
| Jellicent-Azzy | jellicent-azzy.png |
| Eelektross-Mega | eelektross-mega.png |
| Haxorus-Mega | haxorus-alt.png |
| Braviary-Hisui | braviary-hisui.png |
| Volcarona-Aevian | volcarona-aevian.png |
| Pyroar-Mega | pyroar-mega.png |
| Florges-Reborn | florges-reborn.png |
| Aegislash-Gmax | aegislash-gmax.png |
| Malamar-Mega | malamar-mega.png |
| Dragalge-Mega | dragalge-mega.png |
| Sliggoo-Hisui | sliggoo-hisui.png |
| Goodra-Hisui-Alt | goodra-hisui-alt.png |
| Decidueye-Alt | decidueye-alt.png |
| Decidueye-Hisui-Alt | decidueye-hisui-alt.png |
| Incineroar-Alt | incineroar-alt.png |
| Primarina-Alt | primarina-alt.png |
| Tsareena-Alt | tsareena-alt.png |
| Golisopod-Mega | golisopod-mega.png |
| Palossand-Rocky | palossand-rocky.png |
| Palossand-Fiery | palossand-fiery.png |
| Palossand-Icy | palossand-icy.png |
| Magearna-Mega | magearna-mega.png |
| Melmetal-Gmax | melmetal-gmax.png |
| Rillaboom-Gmax | rillaboom-gmax.png |
| Cinderace-Gmax | cinderace-gmax.png |
| Inteleon-Gmax | inteleon-gmax.png |
| Corviknight-Gmax | corviknight-gmax.png |
| Orbeetle-Gmax | orbeetle-gmax.png |
| Drednaw-Gmax | drednaw-gmax.png |
| Coalossal-Gmax | coalossal-gmax.png |
| Flapple-Gmax | flapple-gmax.png |
| Appletun-Gmax | appletun-gmax.png |
| Sandaconda-Gmax | sandaconda-gmax.png |
| Cramorant-Gulping | cramorant-gulping.png |
| Cramorant-Gorging | cramorant-gorging.png |
| Toxtricity-Aevian | toxtricity-aevian.png |
| Toxtricity-Gmax | toxtricity-gmax.png |
| Toxtricity-Low-Key-Gmax | toxtricity-lowkeygmax.png |
| Centiskorch-Gmax | centiskorch-gmax.png |
| Clobbopus | clobbopus.png |
| Grapploct | grapploct.png |
| Sinistea | sinistea.png |
| Sinistea-Antique | sinistea-antique.png |
| Polteageist-Antique | polteageist-antique.png |
| Hatenna | hatenna.png |
| Hattrem | hattrem.png |
| Hatterene-Gmax | hatterene-gmax.png |
| Impidimp | impidimp.png |
| Morgrem | morgrem.png |
| Grimmsnarl | grimmsnarl.png |
| Grimmsnarl-Azzy | grimmsnarl-azzy.png |
| Grimmsnarl-Gmax | grimmsnarl-gmax.png |
| Grimmsnarl-Gmax-Azzy | grimmsnarl-gmax-azzy.png |
| Obstagoon | obstagoon.png |
| Perrserker | perrserker.png |
| Cursola | cursola.png |
| Sirfetch’d | sirfetchd.png |
| Milcery | milcery.png |
| Alcremie-Gmax | alcremie-gmax.png |
| Falinks | falinks.png |
| Falinks-Mega | falinks-mega.png |
| Pincurchin | pincurchin.png |
| Snom | snom.png |
| Frosmoth | frosmoth.png |
| Copperajah-Gmax | copperajah-gmax.png |
| Duraludon | duraludon.png |
| Duraludon-Gmax | duraludon-gmax.png |
| Dragapult-Gmax | dragapult-gmax.png |
| Zacian | zacian.png |
| Zacian-Crowned | zacian-crowned.png |
| Zamazenta | zamazenta.png |
| Zamazenta-Crowned | zamazenta-crowned.png |
| Eternatus | eternatus.png |
| Eternatus-Eternamax | eternatus-eternamax.png |
| Kubfu | kubfu.png |
| Urshifu | urshifu.png |
| Urshifu-Rapid-Strike | urshifu-rapidstrike.png |
| Urshifu-Gmax | urshifu-gmax.png |
| Urshifu-Rapid-Strike-Gmax | urshifu-rapidstrikegmax.png |
| Zarude | zarude.png |
| Zarude-Dada | zarude-dada.png |
| Regieleki | regieleki.png |
| Regidrago | regidrago.png |
| Glastrier | glastrier.png |
| Spectrier | spectrier.png |
| Calyrex | calyrex.png |
| Calyrex-Ice | calyrex-ice.png |
| Calyrex-Shadow | calyrex-shadow.png |
| Ursaluna | ursaluna.png |
| Sneasler-Aevian | sneasler-aevian.png |
| Overqwil | overqwil.png |
| Enamorus | enamorus.png |
| Enamorus-Therian | enamorus-therian.png |
| Skeledirge-Alt | skeledirge-alt.png |
| Tatsugiri-Droopy-Mega | tatsugiri-mega.png |
| Tatsugiri-Stretchy-Mega | tatsugiri-mega.png |
| Baxcalibur-Mega | baxcalibur-mega.png |
| MissingNo. | missingno.png |
| Pokestar Smeargle | pokestarsmeargle.png |
| Pokestar Transport | pokestartransport.png |
| Pokestar Black Door | pokestarblackdoor.png |
| Pokestar White Door | pokestarwhitedoor.png |
| Pokestar Black Belt | pokestarblackbelt.png |
| Pokestar UFO-PropU2 | pokestarufo-propu2.png |
| Tentacruel-Reborn | 0.png |
| Cinderace-Mega | cinderace-mega.png |
| Ledian-Mega | ledian-mega.png |
| Ariados-Mega | ariados-mega.png |
| Roserade-Mega | roserade-mega.png |
| Clawitzer-Mega | clawitzer-mega.png |
| Soluneon | soluneon.png |
| Abysseon | abysseon.png |
| Divineon | divineon.png |
| Gligar-Alt | gligar-alt.png |
| Gliscor-Alt | gliscor-alt.png |

## Server and abilities

- **Mega Slowbro references an undefined ability:** data/pokedex.ts assigns Shell Trap; no Shell Trap ability exists in data/abilities.ts. Shell Trap is a move name. The intended ability cannot be inferred safely from this audit. MissingNo. also has its expected empty placeholder ability.
- **10 custom profiles still differ between server and client**, shown below. These are data mismatches for review, not automatic proof that every extra slot should be selectable: battle-only forms and special evolution rules may intentionally restrict choices. No ability balance changes were made.

| Pokémon | Server abilities | Client abilities |
| --- | --- | --- |
| Charizard-Mega-X-Alt | 0: Atrocity; 1: Intimidate; H: Solar Power | 0: Atrocity |
| Alakazam-Mega-Alt | 0: Perfect Foresight; 1: Grandmaster; H: Magic Guard | 0: Perfect Foresight |
| Muk-Pulse | 0: Pulse Waste; 1: Poison Touch; H: Regenerator | 0: Pulse Waste |
| Hypno-Pulse | 0: Nightmare Pulse; 1: Neutralizing Gas; H: Neutralization | 0: Nightmare Pulse |
| Auroreon | 0: Mind Freeze | 0: Mind Freeze; 1: Magic Bounce; H: Telepathy; S: Mind Freeze; E: Eclipse |
| Emboar-Mega-Reborn | 0: Burning Ego; 1: Violent Rush; H: Brute Force | 0: Burning Ego |
| Musharna-Rejuv | 0: Aevian Dream; 1: Telepathy; H: Aevian Dream | 0: Aevian Dream |
| Soluneon | 0: Eclipse | 0: Eclipse; 1: Magic Bounce; H: Telepathy; S: Mind Freeze; E: Eclipse |
| Abysseon | 0: Sinister Blaze | 0: Sinister Blaze; 1: Opportunist; H: Unstable Evo; S: Mind Freeze; E: Sinister Blaze; F: Eclipse; G: Ascendance |
| Divineon | 0: Ascendance | 0: Ascendance; 1: Opportunist; H: Unstable Evo; S: Mind Freeze; E: Sinister Blaze; F: Eclipse; G: Ascendance |


## Validation and limitations

- Native-art regression suite: **1,137 passing**. Covers every imported entry, normal/shiny selection in default and Gen 9 teams, PNG dimensions, fitting, custom-form fallback, and separation from battle/Gen 5 art.
- Focused simulator suite: **61 passing**, covering Storm Bell, Corrosive Touch, Frost Stalker, Sacred Power, Icy Field, water-field moves/messages, and field-format legality.
- Existing client battle tests: **40 passing, 1 pending, 3 failing**. Remaining failures were reproduced without the new routing: Lopunny dimension expectations (106 vs 108), the old Friend Guard description text, and Roserade-Mega expecting Blind Devotion instead of True Devotion.
- Full server suite cannot initialize: test/main.js accesses LoginServer before server globals are ready. Running ability/field tests directly yields 181 passing, 2 pending, 226 failures, many caused by stock tests referencing the absent gen9anythinggoes format and cascading cleanup errors. This run is not a clean mechanics verdict. Withering Shell tests also report component/Weak Armor expectation failures and deserve separate investigation.
- TypeScript checking is not clean: existing missing global Dex/SpriteData references and duplicate object properties occur outside the added artwork block.
- Client build completes and rebuilds battledata.js, but the optional news refresh warns that PHP is unavailable.
- This audit does not certify every ability/field interaction. No live browser or production-server validation was performed.

## Reproduce

From the client root, run node build-tools/sync-teambuilder-art.cjs to restore imported assets/update the embedded manifest, then node build. Run node node_modules/mocha/bin/mocha test/teambuilder-art.test.js --reporter dot. The saved before-audit JSON records which entries were selected and why; rerunning the importer does not discover newly released upstream art automatically.

## Gliscor follow-up

Resolved: Gliscor and Gliscor-Alt now list Venom Heal, Toxic Boost, and Wind Rider in both client and server. Toxic Boost replaces the stale Poison Heal client entry, as requested.

## Team-strip follow-up

The small menu icons were audited separately and 211 selections corrected. See [MENU_ICON_AUDIT.md](MENU_ICON_AUDIT.md) for coverage, remaining dedicated-art gaps, and validation.
