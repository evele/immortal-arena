# Combat Model: Hit Resolution Proportional

This model defines hit chance as a proportional contest between Accuracy and Agility.

## Status

Candidate Model 2 for MVP hit resolution.

It keeps Accuracy focused on hit chance only.

## Formula

```text
hitChance = clamp(attackerAccuracy / (attackerAccuracy + defenderAgility) * 100, 10, 90)
```

If `attackerAccuracy + defenderAgility` is `0`, use `50` as the fallback hit chance before clamps.

## Rules

1. Build hit chance from the ratio between attacker Accuracy and total contested stats.
2. Clamp the result to the inclusive `10` to `90` range.
3. Roll seeded randomness once for hit resolution.
4. If the roll is within hit chance, the attack hits.
5. If the roll is outside hit chance, the attack misses.
6. Accuracy does not add extra damage in this model.
7. Agility only affects hit avoidance in this model.

## Starter Matchup Examples

Using the level 1 MVP catalog:

- Human Wretch Accuracy `5` vs Scrawny Goblin Agility `4` -> about `56%` hit chance.
- Elf Slave Accuracy `4` vs Dwarf Slave Agility `3` -> about `57%` hit chance.
- Wretched Orc Accuracy `2` vs Elf Slave Agility `4` -> about `33%` hit chance.
- Dwarf Slave Accuracy `3` vs Goblin Agility `4` -> about `43%` hit chance.

## Notes

- This model scales naturally across low and high stat ranges.
- It makes poor-Accuracy attackers noticeably less reliable against agile targets.
- It is less direct to tune than the linear model because there is no separate base chance.
