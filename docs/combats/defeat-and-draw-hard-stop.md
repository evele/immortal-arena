# Combat Model: Defeat And Draw With Hard Stop

This model defines defeat at `0` HP and ends unresolved battles immediately when a level-scaled action limit is reached.

## Status

Candidate Model 1 for MVP defeat and draw handling.

## Action Limit

```text
actionLimit = 100 + max(0, (attackerLordLevel + defenderLordLevel - 2) * 2)
```

Examples:

- Level `1` vs level `1` -> `100` actions.
- Level `5` vs level `5` -> `116` actions.
- Level `20` vs level `20` -> `176` actions.
- Level `45` vs level `45` -> `276` actions.

Combined lord level is used here as a temporary linear proxy for likely roster size until warrior-slot progression is finalized.

## Rules

1. A warrior is defeated when current HP reaches `0` or below.
2. Defeated warrior HP is clamped to `0`.
3. A defeated warrior cannot act, accumulate initiative, or be selected as a target.
4. If a warrior is defeated before its same-tick action resolves, it loses that action.
5. If one side has no living warriors after an action resolves, the battle ends immediately in victory or defeat.
6. Count every resolved attack attempt as one combat action, including misses and `0 damage` hits.
7. If the resolved action reaches the action limit and neither side has been eliminated, the battle ends immediately as a draw.
8. Under this model, the battle stops exactly at the action limit even if other warriors were already eligible to act in the same tick.
9. `Perished` is log language only. It means defeated in that battle, not permanently dead.

## Notes

- This model keeps the action cap exact and easy to test.
- It can cut a tick short when the draw limit is reached.
- Victory or defeat always overrides draw if the limiting action also eliminates the last living warrior on one side.
