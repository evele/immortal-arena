# Combat Model: Defense Resolution Flat

This model defines Defense as direct flat damage reduction.

## Status

Current base model for MVP Defense resolution.

## Formula

```text
effectiveDefense = defenderDefense * 0.95

finalDamage = 0, if effectiveDefense > adjustedDamage * 2
finalDamage = max(adjustedDamage - effectiveDefense, adjustedDamage * 0.10), otherwise
```

Where:

- `adjustedDamage` is the damage after hit resolution, damage roll, and racial hatred.
- `defenderDefense` is the defending warrior's current Defense stat.
- `0.95` is the current effective Defense rate.

## Rules

1. Resolve hit chance first.
2. Resolve rolled attack damage.
3. Apply racial hatred damage adjustment if the matchup qualifies.
4. Calculate effective Defense as `95%` of the defender's Defense stat.
5. If effective Defense is more than twice the adjusted damage, fully absorb the hit.
6. Otherwise, deal the greater of normal flat-reduction damage or `10%` of adjusted damage.
7. If final damage is `0`, the log uses full armor absorption wording.
8. The `10%` pressure result is conditional on the two-to-one Defense threshold, not a universal per-hit damage floor.
9. Every third landed hit against the same defender deals `1` armor-chip damage. Misses do not count.

## Starter Matchup Examples

Using the level 1 MVP catalog before hatred:

- Elf Slave rolled `5` damage into Dwarf Slave Defense `5` -> `0.5` final damage.
- Human Wretch rolled `4` damage into Scrawny Goblin Defense `2` -> `2.1` final damage.
- Wretched Orc rolled `9` damage into Human Wretch Defense `4` -> `5.2` final damage.
- Scrawny Goblin rolled `3` damage into Dwarf Slave Defense `5` -> `0.3` final damage.

## Notes

- This model keeps flat Defense as the primary reduction mechanism.
- It preserves full absorption when Defense exceeds twice the incoming damage.
- The conditional pressure result prevents near-threshold armor from turning every hit into zero damage, which matters especially for high-Speed Goblins against Dwarves.
- Armor chip still rewards sustained pressure after a fully absorbed hit.
