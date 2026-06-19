# Combat And Progression

This document records the current direction for battle mechanics and progression.

## Combat Scope

Combat is guild vs guild, using all available warriors on each side.

The MVP should not be limited to 1v1 combat.

When a lord attacks another lord, the attacking side uses its available warriors and the defender uses its available defending warriors automatically.

## Combat Control

Combat is automatic.

Players do not make decisions during battle.

The result should be determined by warrior stats, race matchups, equipment if available, level, and the combat formula.

Combat should use a tick-based initiative model driven by Speed.

Initiative uses direct accumulation:

- Each tick, each active warrior adds Speed to initiative.
- The action threshold is 100 initiative.
- When a warrior reaches 100 initiative, that warrior acts.
- After acting, 100 initiative is subtracted from that warrior's initiative.
- Any extra initiative above the threshold is preserved.
- If multiple warriors are eligible to act after the same tick, resolve them by highest current initiative first.
- If current initiative is tied, resolve by highest Speed first.
- If current initiative and Speed are both tied, resolve randomly.

Ticks are internal math only. Combat events and battle log entries are produced by actions, not by every tick.

All living warriors in the battle actively participate. They build initiative and can act while they are not defeated.

For the MVP, each combat action targets a random living enemy from the opposing side.

Racial hatred should grant a damage bonus against the hated race for the MVP. The exact bonus value is not finalized yet.

## Battle End Conditions

A battle ends when all warriors on one side are defeated.

A battle also ends in a draw after 100 combat actions for the MVP.

The 100-action draw limit is provisional and may need adjustment for battles with many warriors.

Original examples show ties after many unresolved combat actions, so the MVP should use a maximum action limit rather than requiring every battle to end in defeat.

## Battle Logs

Battle logs should be text-based.

The log should show individual actions in a style similar to classic webgames.

Logs should support misses, zero-damage hits, armor absorption messages, current HP after damage, victory, defeat, and tie outcomes.

Example:

```text
Gorath strikes Elion for 14 damage.
Elion dodges Brakka's attack.
Thorin blocks part of the blow and takes 6 damage.
```

## Warrior Availability

Wounded warriors can still defend.

Fatigue is not currently part of the game design and should not be treated as an existing mechanic.

Warriors do not die permanently.

## Stats

The game should use the original six warrior stats:

- HP.
- Damage.
- Defense.
- Accuracy.
- Agility.
- Speed.

No extra stats such as Luck, Morale, or Stamina should be added for now.

## Stat Roles

Current direction:

- HP determines how much damage a warrior can take before being defeated.
- Damage contributes to how hard a warrior hits.
- Defense reduces incoming damage as flat reduction for the MVP.
- There is no minimum damage floor for now; flat Defense can reduce an attack to zero damage.
- Accuracy increases chance to hit.
- Agility reduces the chance of being hit.
- Speed drives tick-based initiative and determines how often a warrior acts.

Exact formulas are intentionally not finalized yet.

## Damage And Defense

For the MVP, Defense is a flat reduction against incoming Damage.

There is no minimum damage floor for now. If Defense fully absorbs the incoming Damage, the attack can deal zero damage.

Original examples include both explicit `for 0 damage` results and full absorption messages such as `his armour absorbs the full blow`.

## Original Example Notes

The example battle and training logs suggest these useful baseline behaviors:

- A combatant can act multiple times before the opponent, which supports the tick-based Speed direction.
- Attacks can miss completely.
- Attacks can deal zero damage after Defense or armor absorption.
- Combat can end by victory, defeat, or tie after too many unresolved actions.
- Old logs may use death language such as `perished`, but Immortal Arena's current direction remains no permanent warrior death.

## Racial Hatred

The original racial hatred cycle should be preserved.

For the MVP, racial hatred affects damage. When a warrior attacks a race it hates, the attack receives a damage bonus. Racial hatred does not affect hit chance in the current MVP direction.

The exact damage bonus is not finalized yet.

## Formula Transparency

Combat formulas should be somewhat hidden, old-school style.

Players should be able to infer behavior through logs, results, guides, and experimentation, but the exact formula does not need to be fully exposed.

## Warrior Progression

Warriors have level and experience.

Warrior HP can increase both from level/class and from assigned points.

Warriors receive points when they level up.

Warrior points are assigned to warrior stats.

## Lord Progression

The lord/guild has level and experience.

Lord points are separate from warrior points.

Lord points improve lord/guild-level attributes such as:

- Salary.
- Daily attacks.
- Daily training sessions.
- Warrior slots.

Lord points should not be spent on warrior combat stats directly.
