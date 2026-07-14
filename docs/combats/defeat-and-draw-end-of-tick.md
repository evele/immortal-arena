# Combat Model: Defeat And Draw At End Of Tick

This model defines defeat at `0` HP and ends unresolved battles after the current tick finishes once a level-scaled action limit has been reached.

## Status

Candidate Model 2 for MVP defeat and draw handling.

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
7. If the action limit is reached during a tick and both sides still have living warriors, mark the battle to end in a draw after the current tick finishes resolving.
8. Under this model, other warriors that were already eligible to act in the same tick may still act before the draw is declared.
9. `Perished` is log language only. It means defeated in that battle, not permanently dead.

## Notes

- This model preserves the feel that a started tick gets to finish.
- It is slightly less strict than the hard-stop model because total actions can exceed the nominal limit.
- Victory or defeat always overrides draw if the remaining same-tick actions eliminate one side before the tick ends.
