# Combat Model: Racial Hatred Base Additive Bonus

This model defines racial hatred as an additive bonus derived from the attacker's base Damage stat.

## Status

Candidate Model 2 for MVP racial hatred.

## Formula

```text
hatedDamage = rolledDamage + ceil(attackerDamage * 0.25)
```

If the matchup does not qualify for hatred, use `rolledDamage` unchanged.

## Rules

1. Resolve hit chance first.
2. Resolve rolled damage second.
3. Check the hatred cycle against the defender's race.
4. If the attacker hates the defender's race, add `ceil(attackerDamage * 0.25)` to rolled damage.
5. Apply Defense after the hatred bonus.
6. Hatred is not random. If the race matchup qualifies, the bonus is available on every successful hit in that matchup during the battle.
7. A successful hatred hit should be marked for log vocabulary as a hatred attack.
8. A hatred matchup that misses still uses normal miss text.

## Starter Matchup Examples

Using the MVP hatred cycle:

- Elf Slave Damage `4`, rolled `4` into Dwarf Slave becomes `5` before Defense.
- Elf Slave Damage `4`, rolled `5` into Dwarf Slave becomes `6` before Defense.
- Wretched Orc Damage `8`, rolled `8` into Human Wretch becomes `10` before Defense.
- Human Wretch Damage `4`, rolled `3` into Goblin becomes `4` before Defense.

## Notes

- This model makes hatred feel more stable because part of the bonus comes from base Damage rather than only the current roll.
- It can make hatred more noticeable on weak rolls.
- It supports source-style `viciously attacks` wording without making hatred a random event.
