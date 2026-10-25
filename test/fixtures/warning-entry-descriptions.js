// Reviewed repeat-sensing description snapshot.
module.exports = {
  "greatmarsh": {
    "desc": "On entry, reveals opposing Illusions and alerts to an opposing super-effective or OHKO move. If no threat is found, Psychic Terrain grants +2 Sp. Atk. Absorbs Water moves for 1/4 max HP; incoming Fire moves have 1.25x power. Effective rain heals 1/8 HP per turn; sun costs 1/8. Field healing per turn: 1/16 on Underwater, Swamp, Misty or grounded Water Surface; 1/8 when grounded and Poison-type on Murkwater. Corrosive Mist heals Poison types by 1/8 but damages non-Steel others by 1/8. Desert costs 1/8 HP per turn. Same-type attack bonus becomes 2x instead of 1.5x, or 2.25x instead of a 2x bonus. Its attacks have a 30% chance of badly poisoning. This effect comes before a move's inherent secondary effect chance. Its Anticipation component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Reveals threats; rain/field healing; stronger STAB; hits may badly poison."
  },
  "anticipation": {
    "desc": "Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. For each check, removes that opponent's Illusion and reveals one super-effective damaging move or OHKO threat. If that opponent has no threat, Psychic Terrain grants +2 Sp. Atk. Until switching out, takes 25% less damage from opposing uses of the most recently revealed damaging non-OHKO move. This replaces weaker Forewarn protection rather than stacking with it.",
    "shortDesc": "Checks each foe on entry and every foe switch-in; warns of danger and protects against its latest warned move."
  },
  "doomwarning": {
    "desc": "Reflects eligible status moves and hazards once. On Mirror Arena, reflecting a directly targeted move gives its original user +1 evasion. Prevents indirect damage; HP costs, Pain Split, confusion and Struggle recoil still apply. On entry, reveals opposing Illusions and alerts to an opposing super-effective or OHKO move. If no threat is found, Psychic Terrain grants +2 Sp. Atk. On fainting, schedules a special, 140-power Steel Doom Desire against each foe. An existing delayed attack is delayed by another 2 turns instead. Its Anticipation component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Reflects status moves; no indirect damage; reveals threats; Doom Desire against foes on fainting."
  },
  "forewarn": {
    "desc": "Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. For each check, removes that opponent's Illusion and reveals one of its strongest damaging moves, choosing randomly among ties. Each successful reveal on Psychic Terrain grants +2 Sp. Atk. Takes 20% less move damage, or 25% less from opposing uses of the most recently revealed damaging non-OHKO move until switching out. These reductions do not stack; OHKO moves receive no learned-move protection.",
    "shortDesc": "Checks each foe on entry and every foe switch-in; latest warned move deals 25% less damage, otherwise 20%."
  },
  "shadowcurrent": {
    "desc": "Before an eligible damaging move, changes to its type. Technician boosts eligible weak moves. Anticipation reveals a dangerous opposing move and grants 25% damage reduction against that move until switching out; OHKO moves are not reduced. Removes opposing Illusions; if no threat is found, Psychic Terrain grants +2 Sp. Atk. Its Anticipation component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Protean, Technician and Anticipation."
  },
  "coldlogic": {
    "desc": "Forewarn reveals a strongest opposing move and removes foe Illusions on entry. Takes 20% less move damage, or 25% less from the revealed move until switching out; these reductions do not stack, and OHKO moves are excluded from learned-move protection. A successful reveal on Psychic Terrain grants +2 Sp. Atk. Opponents cannot lower its accuracy stages. An opposing move that knocks it out triggers Aftermath even without contact: the attacker loses 1/4 max HP, or 1/2 on Corrosive Mist. Damp prevents this, and indirect-damage protection applies. Tough Claws is supplied separately by Mega Metagross's passive. Its Forewarn component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Forewarn + Aftermath; opposing accuracy-drop immunity; noncontact KO retaliation."
  },
  "silentreprisal": {
    "desc": "Soundproof + full local Anticipation. Immune to other Pokemon's sound moves. On entry, exposes opposing Illusion and checks for super-effective attacks or OHKO moves; if none trigger its warning, gains two Sp. Atk stages on Psychic Terrain, matching local Anticipation. Its Anticipation component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Soundproof + Anticipation."
  },
  "stillmind": {
    "desc": "Anticipation reveals opposing Illusions and warns of super-effective or OHKO moves, with its Psychic Terrain Sp. Atk boost. Oblivious prevents infatuation, Taunt, Captivate and Intimidate Attack drops and cures infatuation or Taunt. Pure Power is a separate species passive. Its Anticipation component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Anticipation + Oblivious. Pure Power is a separate passive."
  },
  "astralconcord": {
    "desc": "Retains all local Forewarn warning, Illusion reveal, damage protection and Psychic Terrain effects. Competitive raises Special Attack by two stages when an opponent lowers a stat. Its Forewarn component: Checks each active opponent separately when the holder enters, and rechecks each incoming opponent on every switch-in, including repeat entries. Allies are not checked, and initial checks do not trigger twice. Each check retains its usual Psychic Terrain bonus condition and latest-warned-move protection.",
    "shortDesc": "Forewarn + Competitive."
  }
};
