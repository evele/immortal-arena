# Combat Model 1: Turn Frequency With Overflow

This model defines how Speed creates action frequency and action order.

## Status

Model 1 is the first combat timing model to test with scripts.

It keeps overflow after acting and allows at most one attack action per warrior per tick.

## Source Scale Check

The source-derived catalog includes high late-game Speed values:

| Source | Speed |
|---|---:|
| Goblin Lord | 162 |
| Mjollir | 143 |
| Mithril Plate | 42 |
| Warpstone Ring | 4 |
| Total observed Goblin max with normal gear | 351 |

Other high source combinations:

| Warrior | Warrior Speed | Fastest Normal Weapon | Fastest Armour | Race Enchanted Item | Total |
|---|---:|---:|---:|---:|---:|
| Goblin Lord | 162 | 143 | 42 | 4 | 351 |
| Elf Lord | 126 | 143 | 42 | 8 | 319 |
| Dwarf Berserker | 57 | 143 | 42 | 52 | 294 |
| Human Assassin | 76 | 143 | 42 | 8 | 269 |
| Orc Warlord | 47 | 143 | 42 | 7 | 239 |

Because source equipment can push final Speed above `300`, Model 1 uses a fixed threshold of `300` and a hard rule of at most one attack action per warrior per tick. Speed above the threshold still matters through overflow and tie-breaking priority, but it does not grant multiple attacks inside the same tick.

## Rules

1. Initiative threshold is `300`.
2. Every living warrior starts battle with `0` initiative.
3. Each tick, every living warrior adds its current Speed to initiative.
4. Only warriors with current HP above `0` accumulate initiative.
5. A warrior is eligible to act when initiative is greater than or equal to `300`.
6. Each eligible warrior can perform at most one attack action during that tick.
7. Multiple warriors can attack during the same tick.
8. Warriors can attack each other in the same tick if both are alive when their action resolves.
9. Same-tick action order is highest current initiative first, then highest Speed, then seeded random.
10. After a warrior acts, subtract `300` initiative and keep overflow.
11. If a warrior still has initiative greater than or equal to `300` after acting, it does not attack again in the same tick under Model 1.
12. Every attack attempt counts as a combat action, including misses and attacks that deal `0` damage.
13. The tick ends after every warrior that was eligible and still able to act has had at most one attack opportunity.
14. The model remains tick-based for now. A mathematically equivalent optimized scheduler can be considered later.

## Defeat During A Tick

If a warrior reaches `0` HP before its action in a tick, it cannot act later in that same tick.

If two warriors are both eligible, the earlier ordered action can prevent the later warrior from acting by defeating it first.

## Open Test Cases

- Equal Speed duel: both warriors should become eligible on the same ticks, with seeded random deciding true ties.
- Faster warrior duel: the faster warrior should act more often over a long battle.
- Speed above threshold: a warrior with Speed above `300` should still attack at most once per tick.
- Same-tick defeat: a warrior defeated before its same-tick action should not act.
- Overflow priority: preserved overflow should affect later same-tick ordering.
