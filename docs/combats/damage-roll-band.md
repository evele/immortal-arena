# Combat Model: Damage Roll With Symmetric Band

This model defines rolled attack damage as a bounded percentage range around the attacker's Damage stat.

## Status

Candidate Model 1 for MVP damage roll.

## Formula

```text
minRolledDamage = max(1, floor(Damage * 0.85))
maxRolledDamage = max(minRolledDamage, ceil(Damage * 1.2))
rolledDamage = randomInt(minRolledDamage, maxRolledDamage)
```

## Rules

1. Resolve hit chance first.
2. If the attack hits, build a damage band from `85%` to `120%` of the attacker's Damage stat.
3. Round the lower bound down and the upper bound up.
4. Enforce a minimum pre-Defense rolled damage of `1`.
5. Roll seeded randomness once inside the inclusive range.
6. The rolled result is the raw attack damage before racial hatred and Defense.

## Starter Matchup Examples

Using the level 1 MVP catalog:

- Elf Slave Damage `4` -> `3..5` rolled damage.
- Human Wretch Damage `4` -> `3..5` rolled damage.
- Wretched Orc Damage `8` -> `6..10` rolled damage.
- Scrawny Goblin Damage `3` -> `2..4` rolled damage.

## Notes

- This model keeps visible variance without the wider swings of a `0.5..1.5` band.
- It is easy to reason about from the base Damage stat.
- It leaves most `0 damage` outcomes to the Defense step rather than the damage roll itself.
