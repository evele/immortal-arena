# Combat Model: Hit Resolution Linear

This model defines hit chance as a simple linear contest between Accuracy and Agility.

## Status

Candidate Model 1 for MVP hit resolution.

It keeps Accuracy focused on hit chance only.

## Formula

```text
hitChance = clamp(60 + (attackerAccuracy - defenderAgility) * 4, 10, 90)
```

Where:

- `60` is the base hit chance before stat differences.
- `4` is the per-point step between Accuracy and Agility.
- `10` is the minimum hit chance.
- `90` is the maximum hit chance.

## Rules

1. Build hit chance from attacker Accuracy and defender Agility.
2. Clamp the result to the inclusive `10` to `90` range.
3. Roll seeded randomness once for hit resolution.
4. If the roll is within hit chance, the attack hits.
5. If the roll is outside hit chance, the attack misses.
6. Accuracy does not add extra damage in this model.
7. Agility only affects hit avoidance in this model.

## Starter Matchup Examples

Using the level 1 MVP catalog:

- Human Wretch Accuracy `5` vs Scrawny Goblin Agility `4` -> `64%` hit chance.
- Elf Slave Accuracy `4` vs Dwarf Slave Agility `3` -> `64%` hit chance.
- Wretched Orc Accuracy `2` vs Elf Slave Agility `4` -> `52%` hit chance.
- Dwarf Slave Accuracy `3` vs Goblin Agility `4` -> `56%` hit chance.

## Notes

- This model is easy to tune by changing the base value or the per-point step.
- It produces frequent misses without making low-level battles completely unreliable.
- It separates hit resolution cleanly from damage resolution.
