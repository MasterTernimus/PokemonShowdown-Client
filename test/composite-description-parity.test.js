const assert = require('assert').strict;
require('./battle.test');
const expected = {
  "selfrepair": {
    "shortDesc": "Natural Cure + Self Sufficient.",
    "desc": "This Pokemon has Self Sufficient and Natural Cure's effects."
  },
  "slipstream": {
    "shortDesc": "Levitate + Keen Eye; first landed Flying attack each switch-in sets 3-turn Tailwind.",
    "desc": "Has Levitate's full effect. Once per switch-in, its first Flying-type attack to damage a foe sets Tailwind on its side for 3 turns. If Tailwind is already active, its duration is refreshed to 3 turns. Full local Keen Eye prevents opposing accuracy drops, ignores evasion boosts and reveals opposing Illusions on activation. Mirror Arena grants +1 accuracy and Laser Focus; shared accuracy entry rewards apply once."
  },
  "verdantedge": {
    "shortDesc": "Chlorophyll + Grass Pelt + Sharpness.",
    "desc": "Chlorophyll + Sharpness + Grass Pelt. Boosts Speed in sun, slicing damage, and Defense on grassy fields. Invigorate is removed."
  },
  "burningrage": {
    "shortDesc": "Proficient; Brute Force + Iron Fist + Turboblaze.",
    "desc": "This Pokemon has Brute Force, Iron Fist, and Turboblaze's effects."
  },
  "exalt": {
    "shortDesc": "Defiant + Sharpness; cannot flinch; slicing moves and Steel Wing have 1.5x power except on Cold Eclipse.",
    "desc": "This Pokemon has Defiant: opposing stat drops raise its Attack by 2 stages. It cannot flinch. Its slicing moves and Steel Wing have 1.5x power, except on Cold Eclipse, as with Sharpness. Intimidate still lowers its Attack and triggers Defiant. Flinch protection can be bypassed by Mold Breaker; ability suppression disables all effects."
  },
  "astralward": {
    "shortDesc": "Magic Bounce + Telepathy + Anticipation.",
    "desc": "Magic Bounce + Telepathy. Reflects eligible status moves and avoids allied damaging moves. Full local Anticipation reveals opposing Illusions and alerts to a super-effective or OHKO move. On Psychic Terrain, it gains +2 Special Attack only if no threat triggered the early alert."
  },
  "doublestrike": {
    "shortDesc": "Iron Fist + Technician + Skill Link; stacking boosts to weaker and punching moves.",
    "desc": "Skill Link maximizes eligible multi-hit moves. Moves with 60 or less effective base power (80 or less on Factory Field) gain 1.5x power, punching moves gain 1.4x power. These bonuses stack."
  },
  "terragift": {
    "shortDesc": "Hospitality + Unaware + Proficient; Reveals opposing Illusions on activation.",
    "desc": "This Pokemon has Hospitality, Unaware, and Proficient's effects. On activation, reveals all opposing active Illusions, including itemless foes; this is not a continuous effect."
  },
  "seafiend": {
    "shortDesc": "Toxic Debris + Water Bubble.",
    "desc": "This Pokemon has Toxic Debris and Water Bubble's effects."
  },
  "unovawing": {
    "shortDesc": "Super Luck; Critical-hit and Competitive effects; no Unburden.",
    "desc": "Critical-hit and Competitive effects; no Unburden. Stat drops can raise Special Attack, but item use or loss no longer doubles Speed."
  },
  "aeviantoxin": {
    "shortDesc": "Strong Jaw + Layered Coat + Merciless.",
    "desc": "Full Strong Jaw + Layered Coat + Merciless. Layered Coat includes Fur Coat and Overcoat: doubles Defense and preserves weather/powder protection and local field effects. Merciless guarantees critical hits against poisoned targets or on Corrosive, Corrosive Mist, Murkwater Surface and Wasteland fields, and retains its Chessboard critical-ratio effect. Critical-hit immunity still applies. Drapion transforms into Drapion-Rejuv on entry."
  },
  "aeviangrief": {
    "shortDesc": "Magic Guard + Cursed Body + Wonder Skin + Levitate.",
    "desc": "Wonder Skin + Levitate + Magic Guard + Cursed Body. Flare Boost is removed."
  },
  "aevianrocket": {
    "shortDesc": "Brute Force + Regenerator + Mold Breaker + Swift Swim; Transforms Veluza into Veluza-Rejuv.",
    "desc": "When Veluza enters battle with this Ability, it changes into Veluza-Rejuv. It has Brute Force's Reckless power boost and Rock Head recoil protection, restores 1/3 of its maximum HP on switching out through Regenerator, ignores opposing Abilities with Mold Breaker, and doubles its Speed under Swift Swim's conditions. If this Ability is suppressed, its Rejuv form reverts to the normal species until it switches out, even if suppression ends earlier."
  },
  "aevianglacier": {
    "shortDesc": "Snow Warning + Ice Body + Refrigerate; Transforms Turtonator into Turtonator-Rejuv.",
    "desc": "On entry, Turtonator permanently transforms into Turtonator-Rejuv. This Pokemon also has the effects of Snow Warning, Ice Body, and Refrigerate. If this Ability is suppressed, its Rejuv form reverts to the normal species until it switches out, even if suppression ends earlier."
  },
  "aevianbolt": {
    "shortDesc": "Storm Power + Static + Volt Absorb; Transforms Druddigon into Druddigon-Rejuv.",
    "desc": "On entry, Druddigon permanently transforms into Druddigon-Rejuv. This Pokemon also has the effects of Storm Power, Static, and Volt Absorb. If this Ability is suppressed, its Rejuv form reverts to the normal species until it switches out, even if suppression ends earlier."
  },
  "hisuianresolve": {
    "shortDesc": "Brute Force + Magma Armor.",
    "desc": "This Pokemon has Brute Force and Magma Armor's effects."
  },
  "greatmarsh": {
    "shortDesc": "Anticipation + Dry Skin + Adaptability + Toxic Chain.",
    "desc": "Full Anticipation + Dry Skin + Adaptability + Toxic Chain. Anticipation reveals dangerous moves and removes opposing Illusions. Dry Skin absorbs Water to heal 1/4 HP, increases incoming Fire power by 25%, retains rain/sun recovery/damage and all local field effects. Adaptability strengthens STAB. Toxic Chain has a 30% chance per damaging hit to badly poison (60% on Corrosive Mist or Wasteland); Shield Dust, Covert Cloak, Substitute and normal poison immunities still apply. Poison moves gain 1.3x power on Wasteland. No Corrosion."
  },
  "auramaster": {
    "shortDesc": "Dual Wield + Inner Focus + Technician; 0.5x from contact.",
    "desc": "This Pokemon takes half damage from contact moves and has Dual Wield, Inner Focus, and Technician's effects."
  },
  "sirius": {
    "shortDesc": "Apex Venom + Black Viper; first tail hit each entry badly poisons.",
    "desc": "Apex Venom + Black Viper. Retains Apex Venom, Dragon-type Poison Fang, +1 accuracy on entry and 1.5x tail power. Its first tail hit against a foe each entry also badly poisons it, subject to status immunities."
  },
  "battlebond": {
    "shortDesc": "Filter + Self Sufficient; A KO can trigger a Bond form; no lethal-hit survival.",
    "desc": "A KO can trigger a Bond form; no lethal-hit survival. Eligible Arcanine, Garchomp, and Greninja forms transform after a KO. It no longer leaves the holder at 1 HP from a lethal hit."
  },
  "shadowbond": {
    "shortDesc": "Battle Bond + Proficient + Infiltrator; Water Shuriken is 3 hits at 30 power, always critical.",
    "desc": "Battle Bond's shared effects plus Proficient and Infiltrator. Ash-Greninja's Water Shuriken hits three times at 30 base power per hit and always critically hits."
  },
  "apexbond": {
    "shortDesc": "Battle Bond + Supreme Overlord + Rough Skin; Dual Chop never misses and always critical.",
    "desc": "Battle Bond's shared effects plus Supreme Overlord and Rough Skin. Garchomp-Battle-Bond's Dual Chop never misses and always critically hits."
  },
  "sacredbond": {
    "shortDesc": "Battle Bond + Magma Armor + Intimidate + Flash Fire; Extreme Speed is 1.5x power and always critical.",
    "desc": "Battle Bond's shared effects plus Magma Armor, Intimidate, and Flash Fire. Arcanine-Battle-Bond's Extreme Speed has 1.5x power and always critically hits."
  },
  "astralengine": {
    "shortDesc": "Elevate + Power Spot + Analytic.",
    "desc": "Elevate + Analytic + Power Spot. Boosts allied move power. Filter is removed."
  },
  "fossilfrenzy": {
    "shortDesc": "Klutz; Hit: +1 Atk/Spe and confusion; confusion takes 1.25x; self-hit costs 1/8.",
    "desc": "When this Pokemon is hit by a damaging move, its Attack and Speed rise by 1 stage and it becomes confused. While confused, it takes 1.25x damage from attacks. This Pokemon has Klutz's effect. If it hits itself in confusion, it also loses 1/8 of its maximum HP."
  },
  "sunsovereign": {
    "shortDesc": "Drought + Unbound Blaze + Self Sufficient; 8-turn Sun.",
    "desc": "This Pokemon has Drought, Unbound Blaze, and Self Sufficient's effects. Its sun lasts 8 turns."
  },
  "primalego": {
    "shortDesc": "Unaware + Proficient + Ultra Ego + Mold Breaker.",
    "desc": "This Pokemon has Unaware, Proficient, and Ultra Ego's effects. Ultra Ego's combat effects are inactive on Bewitched Woods, Haunted, and Holy Field. Its enhanced-field one-time 1/4 HP pinch recovery is consumed only when it actually restores HP; blocked healing preserves it for a later eligible hit window."
  },
  "venomarmor": {
    "shortDesc": "Poison Heal + Dual Wield; Self-poisons on switch-in; poisoned physical damage 1.3x; Metal Claw 1.5x.",
    "desc": "On switch-in, this Pokemon becomes poisoned if it has no status, even if it is Steel-type. This Pokemon has Poison Heal and Dual Wield's effects. While poisoned, its physical damage is multiplied by 1.3. Metal Claw has 1.5x power."
  },
  "corrosiveburn": {
    "shortDesc": "Corrosion + Oblivious + Venom Ignition; Fire damage 1.2x against poisoned targets.",
    "desc": "Full local Corrosion + Oblivious + Venom Ignition. Corrosion allows poisoning Poison/Steel types and Poison attacks to hit Steel; newly poisoned foes lose 1 Defense and Sp. Def stage, with existing field effects retained. Oblivious blocks and cures attraction/Taunt, blocks Captivate and prevents Intimidate. Fire damaging attacks deal 1.2x damage if the target is poisoned or badly poisoned when damage is calculated, once per hit. No poison consumption or additional burn/residual effect; no Merciless or Regenerator."
  },
  "noseformation": {
    "shortDesc": "Filter; three adaptive 20 BP Mini-Noses chain after KOs and trigger Elevate.",
    "desc": "This Pokemon has Filter and Elevate. After it hits, three 20 BP special Mini-Noses each select the strongest of Steel, Electric, or Rock against their current target. They chain to another valid foe after a KO, and their KOs trigger Elevate."
  },
  "fallenstar": {
    "shortDesc": "Mold Breaker + Dual Wield + Self Sufficient + Proficient; Arrow moves gain 1.3x power against trapped foes.",
    "desc": "Arrow moves gain 1.3x power against trapped foes. No Skill Link effect. Retains its arrow follow-up and protective effects."
  },
  "ragingstorm": {
    "shortDesc": "Mold Breaker + Battle Armor; Cannot be suppressed; attacks ignore screens/defensive boosts; KO bonus.",
    "desc": "This Ability cannot be suppressed. This Pokemon has Mold Breaker and Battle Armor. Its attacks ignore Reflect, Light Screen, Aurora Veil, and defensive stat boosts. If this Pokemon gets a KO, it damages remaining foes for 60% of the last damage in multi battles, or raises Attack by 1 if there is no valid target or no damage is dealt. Magic Guard users do not take this damage."
  },
  "ragingoverlord": {
    "shortDesc": "Raging Storm + Supreme Overlord.",
    "desc": "This Ability cannot be suppressed. This Pokemon has Raging Storm and Supreme Overlord's effects."
  },
  "atrocity": {
    "shortDesc": "Unbound Blaze + Self Sufficient + Tough Claws; boosts critical hits.",
    "desc": "Unbound Blaze + Self Sufficient + Tough Claws + Proficient; boosts critical hits. Dragon Rush never misses. It does not drain HP or bypass abilities, screens, Veil, or Substitute."
  },
  "hellfireeclipse": {
    "shortDesc": "Solar Power; Flash Fire + Dark Aura; Sun: Atk/SpA 1.5x; Fire moves set 2-turn Sun.",
    "desc": "This Pokemon has Flash Fire and Dark Aura's effects. During harsh sunlight, its Attack and Special Attack are multiplied by 1.5. After it uses a Fire-type move, it sets Sunny Day for 2 turns."
  },
  "cursedkeepsake": {
    "shortDesc": "Frisk; Curses attackers; cursed foes deal 0.5x; heals 1/2 Curse damage.",
    "desc": "When this Pokemon is hit by an opposing damaging move, the attacker becomes cursed. Cursed Pokemon deal 0.5x damage to this Pokemon. This Pokemon restores HP equal to 1/2 of Curse damage it caused. When this Pokemon faints, opposing Pokemon become cursed and it creates Haunted Field for 5 turns, ignoring Neutralization. Full local Frisk breaks all opposing active Illusions on entry, reveals their held items, and independently has a 30% chance to Embargo each item holder for 5 turns."
  },
  "curseddoll": {
    "shortDesc": "Tough Claws + Shadow Shield + Frisk; damaging moves curse; faint sets Haunted.",
    "desc": "This Pokemon has Tough Claws and Shadow Shield's effects. Its damaging moves curse the foes they hurt. When it faints, it creates Haunted Field for 5 turns. Full local Frisk breaks all opposing active Illusions on entry, reveals their held items, and independently has a 30% chance to Embargo each item holder for 5 turns."
  },
  "cursedmarionette": {
    "shortDesc": "Prankster + Frisk; attacks/status curse; cursed foes deal 0.8x; heals 1/2 Curse damage.",
    "desc": "This Pokemon's status moves have +1 priority. Its attacks and status moves curse opposing targets, and being hit curses the attacker. Cursed foes deal 0.8x damage to this Pokemon. This Pokemon restores HP equal to 1/2 of Curse damage it caused. Its Curse deals 1/8 max HP. When it faints, opposing Pokemon become cursed and it creates Haunted Field for 5 turns, ignoring Neutralization. Full local Frisk breaks all opposing active Illusions on entry, reveals their held items, and independently has a 30% chance to Embargo each item holder for 5 turns."
  },
  "sandsovereign": {
    "shortDesc": "Sand Stream + Dauntless Shield + Solid Rock; 8-turn Sand; Rock chip scales by type in FFA.",
    "desc": "On entry, this Pokemon sets Sandstorm for 8 turns. It has Dauntless Shield and Solid Rock. Arenite Wall lasts 5 turns, or 8 turns when extended. Each turn, non-immune foes take Rock damage equal to 1/16 max HP. Only in Free-for-All does Rock type effectiveness scale this chip."
  },
  "frostsovereign": {
    "shortDesc": "Snow Warning + Ice Body + Filter; 8-turn Snow; Ice chip scales by type in FFA.",
    "desc": "On entry, this Pokemon sets Snow through Snow Warning for 8 turns. It has Ice Body and Filter. Manually used Aurora Veil lasts 8 turns. Each turn, non-immune foes take Ice damage equal to 1/16 max HP. Only in Free-for-All does Ice type effectiveness scale this chip."
  },
  "royalvoice": {
    "shortDesc": "Pixilate + Queenly Majesty + Dream Sickness.",
    "desc": "Pixilate + Queenly Majesty + Dream Sickness. Normal moves become Fairy and receive Pixilate power boosts. Blocks opposing priority moves targeting its side. Includes Telepathy and its field effects, 1/16 end-turn healing for itself and allies, and a once-per-switch-in rescue that leaves an ally at 1 HP and costs the holder 1/4 max HP."
  },
  "perfectforesight": {
    "shortDesc": "Trace; Insomnia + ability copy; Miracle Eye; stored attacks; once-per-battle Mega screens.",
    "desc": "Includes Insomnia and retains its opposing-ability copying. Automatically applies target-specific Miracle Eye before a direct damaging Psychic move. Direct single-target HP damage stores a 90 BP Psychic special attack; opposing special HP damage stores a 90 BP special attack of the incoming type. Shares one pending attack per opposing trainer (one in singles, up to three in Free-for-All), released one per turn beginning next turn. Snapshots its own level, Special Attack, stages and typing, without copied offensive abilities or items. Queues survive switching/fainting and coexist with ordinary Future Sight; normal live defenses apply. Once per battle when Alakazam Mega Evolves, sets real Reflect and Light Screen for 5 turns without shortening longer screens."
  },
  "doomwarning": {
    "shortDesc": "Magic Bounce + Magic Guard + Anticipation; faint casts Doom Desire.",
    "desc": "This Pokemon has Magic Bounce and Magic Guard. When it faints, Doom Desire is cast on every opposing Pokemon. Full local Anticipation reveals opposing Illusions and alerts to a super-effective or OHKO move. On Psychic Terrain, it gains +2 Special Attack only if no threat triggered the early alert."
  },
  "perfectego": {
    "shortDesc": "Ultra Ego; moves cannot miss.",
    "desc": "This Pokemon has Ultra Ego's effects, and its moves cannot miss. Its enhanced-field one-time 1/4 HP pinch recovery is consumed only when it actually restores HP; blocked healing preserves it for a later eligible hit window."
  },
  "mourningsnow": {
    "shortDesc": "Snow Warning + Ice Body; 8-turn Hail/Veil; damaging moves add 30% frostbite; faint healing/curse; hit Disable.",
    "desc": "On switch-in, this Pokemon summons Hail for 8 turns, and Aurora Veil used by this Pokemon lasts 8 turns. During Hail or Snow, it heals 1/16 max HP each turn. Its damaging moves of any type gain an additional 30% chance to inflict frostbite, preserving their existing effects; this does not require weather. It is immune to Hail damage. When another Pokemon faints, it restores 1/8 max HP, or 1/4 if the faint was caused by an Ice move, Hail, Snow, or Curse. When it faints, all opposing Pokemon become cursed. Damaging hits disable the attacker's move when possible."
  },
  "rimeknuckle": {
    "shortDesc": "Iron Fist + Filter + Ice Body; frostbite chance; KO healing.",
    "desc": "Filter + Iron Fist + Ice Body. Damaging moves have a 40% chance to cause frostbite (80% on Icy Field). KOs restore 1/8 max HP, or 1/4 against Mega, G-Max, Terastallized, Stellar or Z-Move item targets. Ice Body adds a 30% chance to frostbite contact attackers, hail immunity, and healing in hail/snow or on Icy, Snowy Mountain and Cold Eclipse fields. Healing is 1/16 max HP, or 1/8 in hail on Cold Eclipse."
  },
  "irondominion": {
    "shortDesc": "Pressure + Sworn Duty + Mirror Armor.",
    "desc": "On switch-in or G-Max activation, this Pokemon activates Pressure and Mirror Armor's effects and heals its ally like Sworn Duty."
  },
  "astralwatcher": {
    "shortDesc": "Prankster + Defragment + Frisk; Reveals opposing Illusions on activation.",
    "desc": "Defragment + Frisk + Prankster. Telepathy is removed; allied damaging moves can hit it. On activation, reveals all opposing active Illusions, including itemless foes; this is not a continuous effect."
  },
  "ragingfists": {
    "shortDesc": "Hydra Bond + Scrappy; Normal/Fighting hits Ghosts; damaging moves cannot miss.",
    "desc": "Hydra Bond, Normal/Fighting Ghost-immunity bypass, and damaging moves cannot miss. Retains Hydra Bond's Free-for-All targeting and Dragon's Den power bonus, without an extra multi-hit power multiplier. Does not grant Fighting Fiend's sleep immunity or Multiscale, or Scrappy's Intimidate immunity. Status moves retain their normal accuracy."
  },
  "fluffyevo": {
    "shortDesc": "Overcoat; Off-type moves gain STAB; hits type immunities.",
    "desc": "Moves that do not match this Pokemon's type gain STAB. Its damaging moves ignore type immunities while respecting resistances, and it has Overcoat's effects."
  },
  "tyrantdomain": {
    "shortDesc": "Relic Armor + Supreme Overlord + Self Sufficient + Sand Stream; Dragon's Den on faint.",
    "desc": "Sand Stream + Relic Armor + Supreme Overlord + Self Sufficient; Dragon's Den for 5 turns on faint. Shows \"The Tyrant will persist\" when it faints."
  },
  "auroradomain": {
    "shortDesc": "Relic Armor + Refrigerate + Self Sufficient + Snow Warning; Veil on faint.",
    "desc": "Snow Warning + Relic Armor + Refrigerate + Self Sufficient. Does not set Aurora Veil on entry; Aurora Veil can still be used manually. On faint, sets Fairy Tale and refreshes Aurora Veil for 5 turns. Shows \"The Aurora will persist\"."
  },
  "royalscales": {
    "shortDesc": "Prism Scale + Dragonize + Self Sufficient; heals 1/16 each turn; immune to Sandstorm and Hail.",
    "desc": "Prism Scale, Dragonize, and Self Sufficient. Status or Prism Scale's supported fields boost Defense by 1.5x. Blocks Attract, Captivate, Taunt, and Intimidate's Attack drop. Speed doubles in rain and Swift Swim's supported fields. Normal moves become Dragon and gain Dragonize's power boost. Restores 1/16 of this Pokemon's maximum HP at the end of each turn and prevents Sandstorm and Hail damage."
  },
  "truedevotion": {
    "shortDesc": "False Devotion + Technician.",
    "desc": "This Pokemon has False Devotion and Technician's effects."
  },
  "ancientbloom": {
    "shortDesc": "Self Sufficient + Proficient; Effect Spore + Pollen Bloom; Thick Fat applies once; field boosts.",
    "desc": "This Pokemon has Effect Spore and Pollen Bloom's effects. Thick Fat applies once through Pollen Bloom: Fire and Ice damage is halved, not quartered. It keeps its field-based Defense, Special Defense, and power boosts."
  },
  "blazingmane": {
    "shortDesc": "Proficient; Fire 1.5x; second hit 30%; half-HP Fire +1 priority; fire fields +1 Spe.",
    "desc": "Fire attacks have 1.5x power and damaging moves hit twice, with the second hit at 30% power. At half HP or less, Fire attacks gain +1 priority. Burning and Volcanic Fields raise its Speed by 1 on entry or when the field starts."
  },
  "fortressshell": {
    "shortDesc": "Proficient; Shell Armor + Water Barrage; field Electric absorption; ally support.",
    "desc": "This Pokemon has Shell Armor and Water Barrage's effects, plus Power Spot and Friend Guard. In Electric Terrain, Murkwater Surface, Water Surface, Underwater, Factory, and Short Circuit fields, incoming Electric moves are blocked and redirected to it, raising its Attack and Special Attack by 1. Fairy Tale, New World, Cold Eclipse, and Starlight Arena give it +1 Defense and +1 Special Defense once per active terrain. New World, Cold Eclipse, and Starlight Arena also boost its move power by 1.5x."
  },
  "waterbarrage": {
    "shortDesc": "Proficient; Dual Wield; cycling Water chip scales by type in FFA.",
    "desc": "This Pokemon has Dual Wield's effects. At the end of each turn, opposing Pokemon take cycling Water damage of 1/16, 2/16, then 3/16 max HP, blocked by Water immunities. Only in Free-for-All does Water type effectiveness scale this chip."
  },
  "templechime": {
    "shortDesc": "Elevate + Levitate; once/entry, a successful Heal Bell cure resets the user's negative SpD.",
    "desc": "Full Elevate (Levitate and highest-stat boosts after move KOs). Once per entry, Heal Bell actually curing at least one status also resets only the user's negative Special Defense stages. No additional healing."
  },
  "soothingpresence": {
    "shortDesc": "Friend Guard; Other allies take 25% less attack damage. Holder and allies have Aroma Veil protection.",
    "desc": "Combines Friend Guard and Aroma Veil. Other allies take 25% less attack damage; this does not reduce the holder's damage taken. The holder and its allies are protected from Attract, Disable, Encore, Heal Block, Taunt, and Torment."
  },
  "verdanthospitality": {
    "shortDesc": "Proficient; Friend Guard; heals ally on switch-in; heals self and ally each turn.",
    "desc": "This Pokemon has Friend Guard's effect. On switch-in, it restores 1/8 of its ally's max HP. At the end of each turn, this Pokemon restores 1/8 of its max HP and its ally restores 1/16 of its max HP."
  },
  "gooey": {
    "shortDesc": "Hydration + Sap Sipper; Damaging hit: attacker -2 Spe (-4 on Murkwater).",
    "desc": "When this Pokemon is hit by an opposing damaging move, once per attacking move, the attacker's Speed is lowered by 2 stages, or 4 stages on Murkwater Surface. This Pokemon also has Hydration and Sap Sipper's effects."
  },
  "phantombarrage": {
    "shortDesc": "Clear Body + Infiltrator + Levitate + Hydra Bond; signature moves gain 20% power.",
    "desc": "This Pokemon has Infiltrator, Levitate, and Hydra Bond's effects. Dragon Darts and G-Max Spirit Volley use its higher offensive stat and gain 20% power from Hydra Bond instead of extra hits. Dragon Darts keeps its two-hit pattern; Spirit Volley keeps its full-power hit and weaker follow-up against another foe. In Free-for-All battles, Dragon Darts hits all opposing Pokemon twice."
  },
  "illuminate": {
    "shortDesc": "Reveals opposing Illusions on activation; This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
    "desc": "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage. On activation, reveals all opposing active Illusions, including itemless foes; this is not a continuous effect."
  },
  "burningcrown": {
    "shortDesc": "Intimidate + White Smoke + Mold Breaker + Unbound Blaze + Self Sufficient; attacks deal 20% less; no KO boost.",
    "desc": "This Pokemon has Intimidate, White Smoke, Mold Breaker, Unbound Blaze, Self Sufficient, and Proficient. It takes 20% less damage from all damaging attacks. Self Sufficient restores 1/16 base maximum HP at turn end and prevents sandstorm and hail damage. Proficient boosts damaging attacks matching its type by 1.3x. It gains no boosts when a Pokemon faints. Its field bonuses remain active."
  },
  "unboundblaze": {
    "shortDesc": "Proficient; Dragonize + Magma Armor; Fire chip scales by type in FFA.",
    "desc": "This Pokemon has Dragonize and Magma Armor's effects. It is immune to Hail damage. At the end of each turn, opposing Pokemon take Fire-type damage equal to 1/16 max HP, doubled if burned or if this Pokemon used a Fire- or Dragon-type move this turn. This damage is blocked by Fire immunities. Only in Free-for-All does Fire type effectiveness scale this chip."
  },
  "keeneye": {
    "shortDesc": "Reveals opposing Illusions on activation; This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.",
    "desc": "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage. On activation, reveals all opposing active Illusions, including itemless foes; this is not a continuous effect."
  },
  "limber": {
    "shortDesc": "Cannot be paralyzed or have Speed reduced by other Pokemon or field effects.",
    "desc": "This Pokemon cannot be paralyzed, cures paralysis if it gains this Ability, and cannot have its Speed lowered by another Pokemon or field effects, including field Speed multipliers. Self-inflicted Speed costs and held-item slowdowns still apply. This does not change Trick Room ordering or prevent losing positive Speed boosts or Tailwind."
  },
  "longreach": {
    "shortDesc": "Super Luck + Keen Eye; Removes contact and raises critical-hit rate by one stage.",
    "desc": "Removes contact and raises critical-hit rate by one stage. Also raises Accuracy on entry and retains field bonuses. No triple critical-hit damage. Full local Keen Eye prevents opposing accuracy drops, ignores evasion boosts and reveals opposing Illusions on activation. Mirror Arena grants +1 accuracy and Laser Focus; shared accuracy entry rewards apply once."
  },
  "heavyartillery": {
    "shortDesc": "Unaware + Shell Armor; Reveals opposing Illusions on activation; Double pulse/bullet power; spread. FFA primary full, others half; -1 Def/SpD after firing.",
    "desc": "Unaware + Shell Armor. Damaging pulse and bullet moves have double power and hit all foes in Doubles and Free-for-All. In Free-for-All, the designated primary target takes full damage and other foes take half their otherwise-calculated damage; protection or immunity of the primary does not promote another target. If no valid primary is supplied, the first active foe in side order is selected. Defense and Special Defense fall by 1 after firing. On activation, reveals all opposing active Illusions, including itemless foes; this is not a continuous effect."
  },
  "seablessing": {
    "shortDesc": "Water Veil + Rain Dish; 1.5x Def/SpD; entry heals self/allies 1/4.",
    "desc": "This Pokemon's Defense and Special Defense are 1.5x. On entry, it and adjacent allies heal 1/4 max HP, and it gains Aqua Ring. It has Water Veil and Rain Dish."
  },
  "seviischooling": {
    "shortDesc": "Schooling; Changes Wishiwashi to Sevii form; School: Hydra Bond + Self Repair + Mold Breaker.",
    "desc": "Changes Wishiwashi into its Ghost-type Sevii form, or Ghost/Dragon Sevii Schooling form at level 20 or higher above 1/4 maximum HP. Underwater and Midnight Zone force School Form; Water Surface and Murkwater force it while grounded. The School Form has Hydra Bond, Self Repair, and Mold Breaker's effects."
  },
  "seasonalstride": {
    "shortDesc": "Chlorophyll; Normal -> primary type 1.2x; kicks 1.4x; weather forms.",
    "desc": "Normal moves become this Pokemon's primary type and have 1.2x power. Kicking moves have 1.4x power. It has Chlorophyll and changes forme with weather: Spring in rain, Summer in sun, Autumn in sand, Winter in snow."
  },
  "silkendecoy": {
    "shortDesc": "Insomnia + Self Sufficient + Swarm; Cocoon blocks a move, status and secondaries.",
    "desc": "Mega Ariados spins a persistent cocoon, renewed when another Pokemon faints. It blocks status moves and status conditions while intact, and absorbs one damaging move including all its hits and secondary effects. Also has Insomnia, Self Sufficient, and Swarm."
  },
  "cursedarmament": {
    "shortDesc": "Filter + Frisk; Curse becomes a 100 BP spread Ghost attack using the higher Attack or Sp. Atk; curses foes; heals 1/4 damage; half HP/faint sets Haunted Field.",
    "desc": "This Pokemon has Filter's effects. Curse used by this Pokemon becomes a 100 BP physical or special Ghost-type attack using its higher Attack or Special Attack, with 100% accuracy, that hits all adjacent foes and curses each target. Curse from this Pokemon deals 1/8 max HP each turn. This Pokemon restores 1/4 of the damage dealt by its attacks and by Curse damage it caused. When this Pokemon reaches half HP or faints, it creates Haunted Field for 5 turns. Full local Frisk breaks all opposing active Illusions on entry, reveals their held items, and independently has a 30% chance to Embargo each item holder for 5 turns."
  },
  "shieldsdown": {
    "shortDesc": "Shell Armor + Self Repair + Crumbling Shell; Form changes at 1/2 HP.",
    "desc": "If this Pokemon is a Minior, it changes to its Core forme if it has 1/2 or less of its maximum HP, and changes to Meteor Form if it has more than 1/2 its maximum HP. This check is done on switch-in and at the end of each turn. While in its Meteor Form, it cannot become affected by a non-volatile status condition or Yawn. This Pokemon also has Shell Armor, Self Repair, and Crumbling Shell's effects."
  },
  "highnoon": {
    "shortDesc": "Dual Wield + Mega Launcher + Proficient.",
    "desc": "Proficient + Dual Wield + Mega Launcher. Pulse and bullet moves gain Mega Launcher power; damaging moves never miss."
  },
  "forestsurge": {
    "shortDesc": "Proficient; Forest and Grassy Aura: 5 turns (8 with Amplifield Rock).",
    "desc": "On switch-in, this Pokemon sets Forest Terrain and Grassy Aura for 5 turns, or 8 turns with Amplifield Rock. It also has Proficient's effect."
  },
  "completeparasitism": {
    "shortDesc": "Parasitism + Filter + Self Repair; Mega can revive as Parasite.",
    "desc": "Parasitism, Filter, and Self Repair. A lethal hit triggers a full-HP revival as Parasect-Parasite at the end of the turn, even if Parasitism was used before Mega Evolution."
  },
  "resuscitation": {
    "shortDesc": "Self Repair + Magic Guard; Revival fully resets battle effects.",
    "desc": "When Parasect revives as Parasect-Parasite, its status, stat stages, and volatile effects are cleared and it returns to full HP. Afterward, this Ability has Self Repair and Magic Guard's effects."
  },
  "pulsewaste": {
    "shortDesc": "Protean + Poison Touch + Regenerator; 5-turn Murkwater Surface on entry.",
    "desc": "On entry, summons Murkwater Surface for 5 turns, subject to field-generation blockers. This Pokemon has Protean, Poison Touch, and Regenerator's effects. Field creation or refresh is attempted only once per battle per holder, even if blocked; switching, suppression, revival, or ability changes never reset this use."
  },
  "royalsun": {
    "shortDesc": "Drought + Supreme Overlord + Unnerve + Flame Body.",
    "desc": "Drought + Supreme Overlord + Unnerve + Flame Body. Summons sun for the usual Drought duration. Move power gains 10% per fainted ally; at 2 fallen allies, gains Infiltrator; at 4, flinch immunity; at 5, Magic Guard and a one-time +1 Attack and Special Attack. Opponents cannot eat Berries or use field seeds. Contact has a 30% burn chance, or 60% on Volcanic Field. On Cold Eclipse, lowers opposing Speed by 1 on entry (blocked by Substitute), raises its Defense and Special Defense by 1, and cannot burn through contact."
  },
  "verdantdrake": {
    "shortDesc": "Proficient + Dual Wield + Regenerator + Lightning Rod + Limber; 1.3x same-type moves.",
    "desc": "Same-type attacks gain 1.3x power. Dual Wield makes moves boosted by Sharpness or Mega Launcher, plus arrow moves, hit twice for reduced damage. Regenerator restores 1/3 maximum HP on switching out. Limber prevents paralysis, cures existing paralysis, and blocks Speed reductions from other Pokemon and field effects; self-inflicted costs and item slowdowns still apply. Lightning Rod draws in and absorbs Electric moves, raising Attack and Special Attack by 1 stage; Electric Terrain also grants these boosts on entry."
  },
  "wrathshield": {
    "shortDesc": "Bulletproof + Dauntless Shield + Self Repair + Proficient; boosted fields also give +1 SpD.",
    "desc": "This Pokemon has Bulletproof, Dauntless Shield, and Self Repair's effects. It gains 1 Defense stage on entry, plus 1 Special Defense stage in Cold Eclipse, New World, Starlight Arena, or Fairy Tale. It is immune to bullet and pulse moves and restores HP through Self Repair."
  },
  "astralwitchcraft": {
    "shortDesc": "Levitate + Magic Guard + Magic Bounce + Proficient.",
    "desc": "Proficient + Magic Guard + Magic Bounce + Levitate. Reflects eligible status moves. Sworn Duty is removed."
  },
  "blazingtempo": {
    "shortDesc": "Proficient + Speed Boost + Striker + Magma Armor + Keen Eye.",
    "desc": "Speed Boost + Proficient + Striker + Magma Armor + Keen Eye. Gains +1 Speed at the end of each eligible turn; same-type moves have 1.3x power and kicking moves have 1.4x power. Prevents freezing and Accuracy drops, and ignores the target's evasiveness. Magma Armor and Keen Eye also retain their field effects."
  },
  "siegelauncher": {
    "shortDesc": "Proficient; Water Barrage + Mega Launcher + Self Sufficient + Stalwart; boosted moves add 15% hit.",
    "desc": "This Pokemon has Water Barrage, Mega Launcher, Self Sufficient, and Stalwart's effects. Moves boosted by Mega Launcher are used twice through Dual Wield; the second hit deals 15% of the move's unboosted power."
  },
  "calderacore": {
    "shortDesc": "Magma Armor + Sheer Force + Drought.",
    "desc": "Sheer Force + Drought + Magma Armor. Solid Rock damage reduction is removed."
  },
  "strikersmomentum": {
    "shortDesc": "Proficient; Moves cannot miss; Striker + Defiant + Libero; first KO gives +1 Speed.",
    "desc": "This Pokemon has Striker, Defiant, and Libero's effects, and its moves cannot miss. Once per switch-in, a KO caused by this Pokemon raises its Speed by 1 stage."
  },
  "nighthunt": {
    "shortDesc": "Strong Jaw + Infiltrator + Intimidate + Frisk + Illuminate.",
    "desc": "Strong Jaw + Infiltrator + Intimidate. Biting moves have 1.5x power. Moves bypass substitutes and opposing screens. Lowers adjacent foes' Attack on entry. Full local Frisk reveals opposing Illusions (including itemless foes), reveals held items and independently has a 30% chance to Embargo each opposing item holder for 5 turns. Full local Illuminate prevents opposing accuracy drops and ignores evasion boosts. Mirror Arena lowers opposing accuracy by 1; Starlight Arena raises Special Attack by 2 and places Spotlight on the first adjacent ally in multi-active battles. Shared Illusion reveals occur once."
  },
  "fluffycraft": {
    "shortDesc": "Fluffy + Technician + Natural Cure.",
    "desc": "Full Fluffy + Technician + local Natural Cure. Contact attacks deal half damage; Fire attacks deal double damage (contact Fire attacks are neutral). Moves of 60 power or less gain 1.5x power, with the existing Factory Field threshold of 80. Switching out cures major status and, only when a status was cured, heals 1/3 maximum HP. Bewitched Woods also cures status at turn end without this switch-out heal. Normal ability suppression applies."
  },
  "mightyjaw": {
    "shortDesc": "Proficient; Strong Jaw + Intimidate; biting moves gain +2 priority on first action.",
    "desc": "This Pokemon has Strong Jaw and Intimidate's effects. On its first action after switching in, its biting moves have 2 higher priority."
  },
  "supersweetsyrup": {
    "shortDesc": "Sticky Hold; On switch-in, lowers adjacent foes' evasiveness 1 stage; attackers are Embargoed for 5 turns.",
    "desc": "On switch-in, this Pokemon lowers the evasiveness of adjacent opposing Pokemon by 1 stage every time it switches in. This Pokemon has Sticky Hold. When this Pokemon is hit by an attack, the attacker is Embargoed for 5 turns."
  },
  "rainsovereign": {
    "shortDesc": "Drizzle; 8-turn Rain; Electric/Water/Flying STAB; Water chip scales by type in FFA.",
    "desc": "On entry, this Pokemon sets Rain for 8 turns. Its Electric-, Water-, and Flying-type moves receive STAB. Each turn, non-immune foes take Water damage equal to 1/16 max HP. Only in Free-for-All does Water type effectiveness scale this chip."
  },
  "stormcircuit": {
    "shortDesc": "Electric Surge + Elevate + Current Coil; Coil also raises Sp. Atk, with Swift Swim.",
    "desc": "Electric Surge + Elevate + Current Coil. Summons the Electric aura, retains its existing KO highest-stat boost, and has Swift Swim plus Coil granting an additional +1 Sp. Atk."
  },
  "surgeconduit": {
    "shortDesc": "Shadow Shield; Electric Surge + Lightning Rod + Brute Force.",
    "desc": "This Pokemon has Electric Surge, Lightning Rod, and Brute Force's effects."
  },
  "ultraego": {
    "shortDesc": "Ignores Abilities; heals when attacking or hit; first hit boosts Atk and SpA.",
    "desc": "Damaging moves ignore opposing Abilities. Once per turn after dealing damage, this Pokemon heals 1/16 max HP. The first opposing damaging hit boosts its Attack and Sp. Atk by 1 and heals it by 1/16; later hits in the same move heal 1/20. Certain fields grant defensive boosts or stronger healing. Bewitched Woods, Haunted, and Holy Field suppress these effects. Its enhanced-field one-time 1/4 HP pinch recovery is consumed only when it actually restores HP; blocked healing preserves it for a later eligible hit window."
  },
  "territorial": {
    "shortDesc": "Unnerve + Stamina + Guard Dog.",
    "desc": "Full Unnerve, Stamina and Guard Dog. Each opposing physical or special hit that damages its HP heals 1/16 base maximum HP; the first such hit each turn immediately raises Defense by 1, including between multi-hit strikes. Opposing forced switching is blocked and Intimidate raises Attack instead. Opponents cannot eat Berries or use field seeds; Cold Eclipse entry lowers opposing Speed."
  },
  "burningego": {
    "shortDesc": "Proficient + Ultra Ego + Flame Body + Magma Armor.",
    "desc": "Proficient + Ultra Ego + Flame Body + Magma Armor. Same-type moves have 1.3x power; it heals and gains Attack and Sp. Atk when fighting, can burn contact attackers, and has full local Magma Armor. Water and Ice moves use half attacking stats; Dragon's Den blocks opposing Fire moves. Freeze is prevented outside Cold Eclipse and cured on update. Dragon's Den, Volcanic Field and Cold Eclipse grant +1 Defense and Special Defense on entry. Flame Body separately retains its Cold Eclipse +1 Defense and Special Defense. There is no Thick Fat Fire reduction or hail immunity. Its enhanced-field one-time 1/4 HP pinch recovery is consumed only when it actually restores HP; blocked healing preserves it for a later eligible hit window."
  },
  "waterbubble": {
    "shortDesc": "Water Veil; Water STAB/offense 2x; Fire offense 0.5x.",
    "desc": "This Pokemon gains Water STAB, and its offensive stat is doubled while using Water attacks. Fire attacks against it use half the attacker's offensive stat. It also has Water Veil's effects."
  },
  "stormsovereign": {
    "shortDesc": "Gale Wings + Keen Eye; Sets changeable Strong Winds; moves never miss.",
    "desc": "Sets changeable Strong Winds; Gale Wings + Keen Eye; moves never miss. Strong Winds lasts 8 turns and can be replaced by another weather. This ability does not summon Windy Aura."
  },
  "abysslure": {
    "shortDesc": "Volt Absorb + Water Absorb + Illuminate; Absorbs Electric/Water hits; heals 1/4; +1 Atk/SpA; no redirection.",
    "desc": "This Pokemon absorbs Electric- and Water-type moves that hit it, restoring 1/4 of its maximum HP and raising its Attack and Special Attack by 1 stage. It no longer redirects those moves from allies. It also has Illuminate's effect."
  },
  "amethystglow": {
    "shortDesc": "Ice Body + Refrigerate; Moves cannot miss; Ice in Ice fields.",
    "desc": "This Pokemon's moves cannot miss and it has Ice Body and Refrigerate's effects. It is treated as an Ice-type Pokemon in Hail and Ice fields."
  },
  "sushitrick": {
    "shortDesc": "On entry, heals adjacent allies by 1/4 max HP and cures confusion.",
    "desc": "On entry, restores 1/4 of each adjacent ally's maximum HP and cures its confusion."
  },
  "silksights": {
    "shortDesc": "Compound Eyes + Keen Eye; Electric moves ignore defense boosts on foes with lowered Speed.",
    "desc": "Compound Eyes. Electric attacks ignore positive defensive stat stages against foes whose Speed is lowered. Full local Keen Eye prevents opposing accuracy drops, ignores evasion boosts and reveals opposing Illusions on activation. Mirror Arena grants +1 accuracy and Laser Focus; shared accuracy entry rewards apply once."
  },
  "calculatedshot": {
    "shortDesc": "Frisk; Water attacks gain +1 critical-hit stage and the highest normal damage roll.",
    "desc": "Damaging Water moves gain +1 critical-hit stage and always use the highest normal damage roll. Does not increase fixed damage or bypass accuracy checks. Full local Frisk reveals opposing Illusions (including itemless foes), reveals held items and independently has a 30% chance to Embargo each opposing item holder for 5 turns."
  },
  "dawnherald": {
    "shortDesc": "Drought + Friend Guard; summons sun; allies take 25% less attack damage.",
    "desc": "Full Drought + Friend Guard. On entry, summons sun for 5 turns (8 with Heat Rock). While active, allies take 25% less attack damage; this does not protect the holder. Normal weather blocking, ability suppression and bypass rules apply."
  },
  "venomignition": {
    "shortDesc": "Fire attacks deal 1.2x damage against poisoned targets.",
    "desc": "Fire-type damaging attacks deal 1.2x damage against a poisoned or badly poisoned target. Status is checked when each hit is calculated. Does not consume poison, cause burns or add residual damage."
  },
  "transfixinggaze": {
    "shortDesc": "Frisk; opposing moves cannot pivot while this Pokemon remains active.",
    "desc": "Full local Frisk: removes opposing Illusions, reveals their held items, and each revealed item holder has a 30% chance of Embargo. While this Pokemon remains active with its ability functioning, opposing moves cannot switch their user out. Damage, stat changes and other move effects still occur. Manual switching, forced switching and item-triggered switches remain allowed. If this Pokemon faints, leaves or loses its ability before the move finishes, the pivot succeeds. No lingering mark."
  },
  "freshplumage": {
    "shortDesc": "Natural Cure; first successful Flying attack each entry deals 1.2x damage.",
    "desc": "Full local Natural Cure: cures status when switching out and heals 1/3 maximum HP only when curing a status; Bewitched Woods cures status at turn end without that heal. The first successful Flying damaging move each entry deals 1.2x damage across its entire hit sequence. Misses, Protect and immunity do not consume it; damaging a Substitute does. No additional recoil protection or Body Press bonus. Switching back in resets the Flying bonus."
  },
  "kickfiend": {
    "shortDesc": "Striker + Violent Rush + Limber.",
    "desc": "This Pokemon has Striker, Violent Rush, and Limber's effects."
  }
};
describe('Composite description client parity', () => {
 let savedAliases;
 beforeEach(() => {savedAliases = global.BattleAliases; global.BattleAliases = {...savedAliases, shadowguard: 'Voidcraft'};});
 afterEach(() => {global.BattleAliases = savedAliases;});
 it('matches scoped simulator summaries, installed data and manifest', () => {
  const raw = require('../play.pokemonshowdown.com/data/abilities.js').BattleAbilities;
  const snapshot = require('../server-data-sync-manifest.json').snapshot.abilities;
  for (const [id, text] of Object.entries(expected)) for (const key of ['shortDesc', 'desc']) {
   assert.equal(Dex.abilities.get(id)[key], text[key], id + ' hover/selector');
   assert.equal(raw[id][key], text[key], id + ' installed');
   assert.equal(snapshot[id][key], text[key], id + ' snapshot');
  }
 });
 it('resolves renamed aliases and nested identities without repeated effects', () => {
  assert.deepEqual([...Dex.getAbilityEffects('shadowguard')].sort(), [...Dex.getAbilityEffects('voidcraft')].sort());
  const effects = [...Dex.getAbilityEffects('toxicbloom')];
  for (const id of ['pollenbloom', 'thickfat', 'proficient', 'selfsufficient']) assert.equal(effects.filter(x => x === id).length, 1);
  assert(Dex.getAbilityEffects('verdantdrake').has('limber'));
  assert.deepEqual(Dex.species.get('skarmory').abilities, {"0":"Fresh Plumage","1":"Sturdy","H":"Weak Armor"});
  assert.deepEqual(Dex.species.get('espathra').abilities, {"0":"Opportunist","1":"Transfixing Gaze","H":"Speed Boost"});
  assert.deepEqual(Dex.species.get('ursaluna').abilities, {"0":"Raging Beast","1":"Bulletproof","H":"Territorial"});
  assert.deepEqual(Dex.species.get('emboar').abilities, {"0":"Gluttony","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('emboaralt').abilities, {"0":"Gluttony","1":"Thick Fat","H":"Brute Force"});
  assert.deepEqual(Dex.species.get('salazzle').abilities, {"0":"Corrosion","1":"Venom Ignition","H":"Aroma Veil"});
  assert.deepEqual(Dex.species.get('volcarona').abilities, {"0":"Cinder Scales","1":"Overcoat","H":"Dawn Herald"});
  assert.equal(Dex.species.get('araquanid').bst, 500);
  assert.deepEqual([...Dex.getAbilityEffects('corrosiveburn')].sort(), ['corrosion', 'corrosiveburn', 'oblivious', 'venomignition']);
  assert(Dex.getAbilityEffects('aeviantoxin').has('merciless'));
  assert(Dex.getAbilityEffects('verdantdrake').has('regenerator'));
  assert(Dex.getAbilityEffects('greatmarsh').has('toxicchain'));
  assert(Dex.getAbilityEffects('fluffycraft').has('naturalcure'));
  assert.deepEqual([...Dex.getAbilityEffects('dawnherald')].sort(), ['dawnherald', 'drought', 'friendguard']);
 });
});
