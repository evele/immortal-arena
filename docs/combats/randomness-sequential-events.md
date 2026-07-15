# Combat Model: Randomness With Sequential Event Stream

This model defines combat randomness as a single seeded stream consumed in the order that random events actually occur during battle resolution.

## Status

Current base model for MVP combat randomness.

## Core Rule

Initialize one deterministic pseudo-random number generator from the battle seed.

That generator is not pre-filled with a fixed amount of values. It produces the next value only when combat reaches a step that actually needs randomness.

## Consumption Order

Consume values from the battle RNG in this order whenever those steps occur:

1. Same-tick tie-break randomization, if multiple warriors are still tied after initiative and Speed.
2. Target selection among living enemies.
3. Hit-resolution roll.
4. Damage-roll value, only if the hit succeeds.

If a step does not occur, it does not consume a random value.

Examples:

- If there is no same-tick tie, skip tie-break consumption.
- If the attacker misses, skip damage-roll consumption.
- If the battle ends before another action starts, stop consuming values.

## Tie-Break Rule

When multiple warriors are eligible to act in the same tick and are still tied after comparing current initiative and Speed:

1. Build the tied subgroup only.
2. Consume one RNG value for each warrior in that subgroup.
3. Order the subgroup by those random values.
4. If two warriors somehow receive the same random value, fall back to stable warrior ID ordering.

This avoids relying on unspecified sort behavior and keeps tie resolution replayable.

## Targeting Rule

When an acting warrior must pick a target:

1. Build the list of living enemy warriors.
2. Consume one RNG value.
3. Map that value to a uniform integer index in the enemy list.
4. Select the enemy at that index.

## Hit Rule

When an attack attempts to hit:

1. Consume one RNG value.
2. Compare it to the previously calculated hit chance.
3. If the roll is outside the hit chance, the attack misses and the action ends.

## Damage Rule

When a hit succeeds:

1. Consume one RNG value.
2. Map it to the selected inclusive damage range.
3. Use that rolled damage before hatred and Defense are applied.

## Notes

- This model does not require knowing the number of random values in advance.
- The implementation should request the next random value on demand rather than pre-generating a fixed array for the whole battle.
- The battle seed defines a deterministic stream, and combat consumes from that stream lazily as needed.
- Different battle paths naturally consume different counts of values.
- Replay stays deterministic as long as battle state, rules, and random-consumption order stay the same.
- A future alternative could split randomness into separate per-purpose streams such as targeting, hit, damage, and tie-break channels, but that is not part of the current MVP base model.
