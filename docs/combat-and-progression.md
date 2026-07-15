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

Combat should use a tick-based initiative model driven by Speed. The first timing model is documented in `combats/turn-frequency-overflow.md`.

Initiative uses direct accumulation:

- Each tick, each active warrior adds Speed to initiative.
- The Model 1 action threshold is `300` initiative.
- When a warrior reaches the action threshold, that warrior acts.
- After acting, the action threshold is subtracted from that warrior's initiative.
- Any extra initiative above the threshold is preserved.
- In Model 1, each warrior can attack at most once per tick even if overflow remains above the threshold.
- If multiple warriors are eligible to act after the same tick, resolve them by highest current initiative first.
- If current initiative is tied, resolve by highest Speed first.
- If current initiative and Speed are both tied, resolve randomly.

Ticks are internal math only. Combat events and battle log entries are produced by actions, not by every tick.

All living warriors in the battle actively participate. They build initiative and can act while they are not defeated.

For the MVP, each combat action targets a random living enemy from the opposing side. The first targeting option is documented in `combats/targeting-random-uniform.md`.

Racial hatred should grant a damage bonus against the hated race for the MVP. The exact bonus value is not finalized yet.

## Battle End Conditions

A battle ends when all warriors on one side are defeated.

A battle also ends in a draw after 100 combat actions for the MVP.

The 100-action draw limit is provisional and may need adjustment for battles with many warriors.

Original examples show ties after many unresolved combat actions, so the MVP should use a maximum action limit rather than requiring every battle to end in defeat.

Current defeat-and-draw candidates are documented in `combats/defeat-and-draw-hard-stop.md` and `combats/defeat-and-draw-end-of-tick.md`.

Those candidates also explore replacing the fixed `100`-action cap with a linear cap based on the combined lord levels, using lord level as a temporary proxy for likely battle size until warrior-slot progression is finalized.

## Battle Logs

Battle logs should be text-based.

The log should show individual actions in a style similar to classic webgames.

Logs should support misses, zero-damage hits, armor absorption messages, current HP after damage, victory, defeat, and tie outcomes.

Source-style dramatic language such as `perished` is acceptable in battle logs. It describes being defeated in that battle, not permanent warrior death. A defeated warrior can later recover or revive according to the recovery rules.

Example:

```text
Gorath strikes Elion for 14 damage.
Elion dodges Brakka's attack.
Thorin blocks part of the blow and takes 6 damage.
```

## Warrior Availability And Defeat

Wounded warriors can still defend.

Fatigue is not currently part of the game design and should not be treated as an existing mechanic.

Warriors do not die permanently. During a battle they can be defeated, reduced to `0` HP, or described as having `perished`; after the battle they remain owned by the lord and can recover or revive through the recovery system.

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
- Defense reduces or absorbs incoming damage for the MVP.
- There is no minimum damage floor for now; Defense can reduce an attack to zero damage.
- Accuracy increases chance to hit.
- Agility reduces the chance of being hit.
- Speed drives tick-based initiative and determines how often a warrior acts.

Exact formulas are intentionally not finalized yet.

Current hit-resolution candidates are documented in `combats/hit-resolution-linear.md` and `combats/hit-resolution-proportional.md`.

A third alternative, where Accuracy also creates a second-stage skilled-hit or damage-quality roll after a successful hit, is noted as possible source-inspired future work but is not part of the current base model set because it mixes hit resolution with damage resolution.

## Damage And Defense

For the MVP, Defense should reduce or absorb incoming Damage.

There is no minimum damage floor for now. If Defense fully absorbs the incoming Damage, the attack can deal zero damage.

Original examples include both explicit `for 0 damage` results and full absorption messages such as `his armour absorbs the full blow`.

Current damage-roll candidates are documented in `combats/damage-roll-band.md` and `combats/damage-roll-base-plus-bonus.md`.

The current base model set for damage roll includes only those two alternatives.

Current Defense resolution is documented in `combats/defense-resolution-flat.md`.

The current base model set for Defense resolution includes only that flat-reduction option.

## Original Example Notes

The example battle and training logs suggest these useful baseline behaviors:

- A combatant can act multiple times before the opponent, which supports the tick-based Speed direction.
- Attacks can miss completely.
- Attacks can deal variable damage rather than a single fixed value.
- Attacks can deal zero damage after Defense or armor absorption.
- Misses are distinct from hits that deal `0` damage.
- A `viciously attacks` log line appears to indicate a racial hatred attack.
- Combat can end by victory, defeat, or tie after too many unresolved actions.
- Source logs may use death language such as `perished`, but Immortal Arena treats this as battle defeat rather than permanent warrior death.
- Training logs can award a multiplier, experience, and gold.
- Battle and training logs show remaining HP after damage.

## Source Example Inferences

The current source examples are in `docs/examples/`.

The strongest combat example is `docs/examples/battle-loss-example.md`, where Gruint fights Lina, the enemy Elf Slave. Lina's class exists in `docs/warrior-catalog.md` with level 1 Elf Slave stats. The log is consistent with Lina receiving racial hatred against a Dwarf opponent because Elf hates Dwarf and her attacks are logged as `viciously attacks`.

From these examples, Immortal Arena should preserve the following source-feel constraints when defining the exact MVP formula:

- Speed must be able to create non-alternating action order and repeated actions by the faster combatant.
- Accuracy and Agility should drive hit/miss behavior.
- Damage should have some variability or roll component.
- Defense should be able to reduce damage to zero and produce armor absorption text.
- Racial hatred should affect damage and log text.
- Defeat can be described with source-style death language, while recovery/revive prevents permanent loss.

The examples do not reveal the exact BloodArena formulas. MVP formulas should be chosen to fit these constraints and the source-derived catalog scale, then validated against example-like scenarios.

## Combat Definition Steps

Before implementing the combat engine, define the following in `docs/stats-and-formulas.md`:

1. Turn frequency: confirm the tick-based Speed model and action threshold.
2. Targeting: confirm MVP random target selection among living enemies.
3. Hit resolution: define the Accuracy vs Agility formula and clamps.
4. Damage roll: define how base Damage becomes variable attack damage.
5. Defense resolution: define how Defense reduces or absorbs rolled damage, including `0 damage` and full absorption.
6. Racial hatred: define exact damage effect and `viciously attacks` log condition.
7. Defeat and draw: define HP `0`, `perished` log language, recovery expectations, and action limit.
8. Randomness: define seeded deterministic random calls and their order.
9. Log vocabulary: define required text events for miss, normal hit, zero damage, armor absorption, hatred hit, defeat, win, loss, and tie.
10. Example validation: create a small set of expected combat scenarios based on `docs/examples/` before coding tests.

Current randomness model is documented in `combats/randomness-sequential-events.md`.

Current log-vocabulary model is documented in `combats/log-vocabulary-minimal-fixed.md`.

Current derived full-model combinations are documented in `combats/complete-model-combinations.md`.

A future alternative, where the battle seed is split into separate RNG channels for targeting, hit resolution, damage rolls, and tie-breaks, is worth keeping in mind if replay isolation becomes more important later, but it is not part of the current MVP base model.

## Racial Hatred

The original racial hatred cycle should be preserved.

For the MVP, racial hatred affects damage. When a warrior attacks a race it hates, the attack receives a damage bonus. Racial hatred does not affect hit chance in the current MVP direction.

The exact damage bonus is not finalized yet.

Current racial-hatred candidates are documented in `combats/racial-hatred-percent-bonus.md` and `combats/racial-hatred-base-additive.md`.

Racial hatred is not random. If an attacker hates the defender's race, that matchup bonus applies consistently throughout the battle whenever that attacker lands a successful hit on that hated race.

Source-style `viciously attacks` wording should be tied to successful hatred hits. A hatred matchup that misses should still use normal miss text.

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
