# Combat Model: Racial Hatred Percent Bonus

This model defines racial hatred as a percentage damage bonus on the rolled attack damage.

## Status

Candidate Model 1 for MVP racial hatred.

## Formula

```text
hatedDamage = ceil(rolledDamage * 1.25)
```

If the matchup does not qualify for hatred, use `rolledDamage` unchanged.

## Rules

1. Resolve hit chance first.
2. Resolve rolled damage second.
3. Check the hatred cycle against the defender's race.
4. If the attacker hates the defender's race, multiply rolled damage by `1.25` and round up.
5. Apply Defense after the hatred bonus.
6. Hatred is not random. If the race matchup qualifies, the bonus is available on every successful hit in that matchup during the battle.
7. A successful hatred hit should be marked for log vocabulary as a hatred attack.
8. A hatred matchup that misses still uses normal miss text.

## Starter Matchup Examples

Using the MVP hatred cycle:

- Elf Slave hitting Dwarf Slave: rolled `4` becomes `5` before Defense.
- Elf Slave hitting Dwarf Slave: rolled `5` becomes `7` before Defense.
- Wretched Orc hitting Human Wretch: rolled `8` becomes `10` before Defense.
- Human Wretch hitting Goblin: rolled `3` becomes `4` before Defense.

## Notes

- This model scales naturally from low-level to high-level warriors.
- It keeps hatred tied closely to the existing damage roll.
- It supports source-style `viciously attacks` wording without making hatred a random event.
