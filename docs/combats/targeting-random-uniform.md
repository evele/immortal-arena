# Combat Targeting: Random Uniform

## Status

Base targeting option for the current combat model set.

## Decisions

1. Target is selected when the action resolves.
2. The target pool includes all living enemies.
3. Selection is random uniform.
4. Natural focus is allowed.
5. There is no formation system for now.
6. Players have zero targeting control during combat.
7. Retargeting is not needed.

## Rules

1. When a warrior's action resolves, build a target pool from opposing warriors with current HP above `0`.
2. Select exactly one target from that pool using seeded randomness.
3. Every living enemy in the pool has equal selection weight.
4. Defeated warriors with current HP `0` cannot be selected.
5. Wounded warriors with current HP above `0` remain selectable.
6. Multiple attackers can select the same target naturally through random selection.
7. If the opposing side has no living targets, the battle ends before target selection.

## Notes For Later Alternatives

- Racial hatred could later affect target weighting, making warriors more likely to attack hated races.
- Counterattack mechanics could later affect target selection or create reactive targeting.
- Formation or front-line rules could later restrict the target pool, but they are not part of the current base option.

## Open Test Cases

- Single living enemy: the only living enemy is always selected.
- Multiple living enemies: each living enemy has equal selection weight.
- Defeated enemy: a warrior at `0` HP is never selected.
- Wounded enemy: a warrior above `0` HP remains selectable.
- Same-tick defeat: target pool reflects deaths from earlier actions in the same tick.
- Natural focus: multiple attackers can hit the same target in the same tick.
