# Source Guild Snapshot

This document preserves a manually observed BloodArena guild/account snapshot as source material.

It is not automatically an Immortal Arena design decision. Use it to infer economy, progression, and daily-loop rules.

## Snapshot

### Guild Info

| Field | Value |
|---|---:|
| Level | 1 |
| Experience | 30 |
| Exp for next level | 300 |
| Exp needed | 270 |
| Gold | 71 |
| Daily Salary | 50 |

### Battle Info

| Field | Value |
|---|---:|
| Max Num of Warriors | 1 |
| Attacks Accumulated | 2 |
| Daily Attacks | 5 |
| Training Matches | 0 |
| Daily Training Matches | 5 |
| Tournament Points | 0 |

## Observations

- The account is level 1 with `30` XP already earned.
- The next guild/lord level appears to require `300` total XP.
- `Exp needed` is derived as `Exp for next level - Experience`, so `300 - 30 = 270`.
- The observed daily salary at level 1 is `50` gold.
- The observed maximum warrior slots at level 1 is `1`.
- `Attacks Accumulated` and `Daily Attacks` are separate fields.
- The account has `2` accumulated attacks and `5` daily attacks.
- Training has the same visible daily base as attacks in this snapshot: `5` daily training matches.
- Tournament points exist in the source game but are not MVP 0 scope yet.

## Questions Raised

- Is `Exp for next level = 300` the level 1 source requirement for guild/lord level 2?
- Is `Exp needed` always a derived display field, or is it stored separately anywhere?
- Does Daily Salary start at `50` for all new guilds/lords?
- How often is salary paid: daily reset, login, manual collection, or another timing?
- Does salary accumulate if the player does not log in?
- Is `Max Num of Warriors = 1` the level 1 default before buying extra slots or leveling up?
- How does `Max Num of Warriors` increase: lord level, purchased upgrade, guild points, or direct gold cost?
- What is the exact difference between `Attacks Accumulated` and `Daily Attacks`?
- Does `Daily Attacks = 5` mean max attacks generated per day, while `Attacks Accumulated = 2` means currently available attacks?
- What is the cap for accumulated attacks?
- Do attacks accumulate across missed days?
- Does training use the same accumulation model as attacks?
- Why are `Training Matches = 0` while `Daily Training Matches = 5`: were all used, not accumulated yet, or displayed differently?
- Are Tournament Points earned only from tournaments, or also from normal battles?
- Should Tournament Points be ignored for MVP 0 or preserved as later source material only?
