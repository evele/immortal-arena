# Combat Model: Damage Roll With Base Plus Bonus

This model defines rolled attack damage as the full Damage stat plus a smaller random bonus.

## Status

Candidate Model 2 for MVP damage roll.

## Formula

```text
bonusDamage = randomInt(0, ceil(Damage / 2))
rolledDamage = Damage + bonusDamage
```

## Rules

1. Resolve hit chance first.
2. If the attack hits, start from the full Damage stat as guaranteed raw damage before Defense.
3. Build a bonus range from `0` to `ceil(Damage / 2)`.
4. Roll seeded randomness once inside the inclusive bonus range.
5. Add the rolled bonus to the base Damage stat.
6. The rolled result is the raw attack damage before racial hatred and Defense.

## Starter Matchup Examples

Using the level 1 MVP catalog:

- Elf Slave Damage `4` -> `4..6` rolled damage.
- Human Wretch Damage `4` -> `4..6` rolled damage.
- Wretched Orc Damage `8` -> `8..12` rolled damage.
- Scrawny Goblin Damage `3` -> `3..5` rolled damage.

## Notes

- This model is more stable than the percentage band model.
- It makes the attacker's Damage stat feel like a reliable floor before Defense.
- It tends to push more variance into matchup effects and Defense rather than the raw damage roll.
