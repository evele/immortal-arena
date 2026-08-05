# Combat Model: Defense Resolution Flat

This model defines Defense as direct flat damage reduction.

## Status

Current base model for MVP Defense resolution.

## Formula

```text
finalDamage = max(0, adjustedDamage - defenderDefense * 0.95)
```

Where:

- `adjustedDamage` is the damage after hit resolution, damage roll, and racial hatred.
- `defenderDefense` is the defending warrior's current Defense stat.
- `0.95` is the current effective Defense rate.

## Rules

1. Resolve hit chance first.
2. Resolve rolled attack damage.
3. Apply racial hatred damage adjustment if the matchup qualifies.
4. Subtract `95%` of the defender's Defense stat from the adjusted damage.
5. If the result is below `0`, use `0` instead.
6. If final damage is `0`, the log can use either a `for 0 damage` result or a full armor absorption message.
7. There is no per-hit minimum damage floor.
8. Every third landed hit against the same defender deals `1` armor-chip damage. Misses do not count.

## Starter Matchup Examples

Using the level 1 MVP catalog before hatred:

- Elf Slave rolled `5` damage into Dwarf Slave Defense `5` -> `0` final damage.
- Human Wretch rolled `4` damage into Scrawny Goblin Defense `2` -> `2` final damage.
- Wretched Orc rolled `9` damage into Human Wretch Defense `4` -> `5` final damage.
- Scrawny Goblin rolled `3` damage into Dwarf Slave Defense `5` -> `0` final damage.

## Notes

- This model matches the current MVP direction that Defense is flat reduction.
- It naturally produces both low-damage hits and full absorption outcomes.
- Armor chip rewards sustained pressure and prevents high-Defense warriors from ignoring frequent low-Damage hits forever, which is especially important for high-Speed Goblins against Dwarves.
- It keeps most combat readability in the visible stats rather than adding more randomness to armor.
