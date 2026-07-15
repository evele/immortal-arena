# Combat Model Combinations

This document defines the complete combat models that are currently derivable from the alternative combat-model documents in `docs/combats/`.

It is not a recommendation list. It is a combinatorial expansion of the options already defined.

## Purpose

Several combat decisions are currently expressed as separate model documents.

To discuss, compare, test, and later script full battle simulations, it is useful to name the complete models that result from combining those per-axis decisions.

## Current Model Axes

### Turn Frequency

- `A`: `turn-frequency-overflow.md`
- `B`: `turn-frequency-no-overflow.md`

### Targeting

- `C`: `targeting-random-uniform.md`

### Hit Resolution

- `D`: `hit-resolution-linear.md`
- `E`: `hit-resolution-proportional.md`

### Damage Roll

- `F`: `damage-roll-band.md`
- `G`: `damage-roll-base-plus-bonus.md`

### Defense Resolution

- `H`: `defense-resolution-flat.md`

### Racial Hatred

- `I`: `racial-hatred-percent-bonus.md`
- `J`: `racial-hatred-base-additive.md`

### Defeat And Draw

- `K`: `defeat-and-draw-hard-stop.md`
- `L`: `defeat-and-draw-end-of-tick.md`

### Randomness

- `M`: `randomness-sequential-events.md`

### Log Vocabulary

- `N`: `log-vocabulary-minimal-fixed.md`

## Combination Rule

Each complete combat model is built by choosing exactly one option from each axis above.

With the current documents, that produces:

```text
2 turn-frequency options
x 1 targeting option
x 2 hit-resolution options
x 2 damage-roll options
x 1 defense option
x 2 racial-hatred options
x 2 defeat-and-draw options
x 1 randomness option
x 1 log-vocabulary option
= 32 complete combat models
```

## Naming Rule

Each full model is named by concatenating the chosen axis letters in order:

`Turn -> Targeting -> Hit -> Damage -> Defense -> Hatred -> Defeat -> Randomness -> Log`

Example:

- `ACDFHIKMN`

means:

- `A`: Turn Frequency With Overflow
- `C`: Random Uniform Targeting
- `D`: Linear Hit Resolution
- `F`: Symmetric-Band Damage Roll
- `H`: Flat Defense
- `I`: Percent-Bonus Racial Hatred
- `K`: Hard-Stop Defeat And Draw
- `M`: Sequential-Event Randomness
- `N`: Minimal Fixed Log Vocabulary

## Current Complete Model Set

| Code | Turn | Target | Hit | Damage | Defense | Hatred | Defeat/Draw | RNG | Log |
|---|---|---|---|---|---|---|---|---|---|
| `ACDFHIKMN` | A | C | D | F | H | I | K | M | N |
| `ACDFHILMN` | A | C | D | F | H | I | L | M | N |
| `ACDFHJKMN` | A | C | D | F | H | J | K | M | N |
| `ACDFHJLMN` | A | C | D | F | H | J | L | M | N |
| `ACDGHIKMN` | A | C | D | G | H | I | K | M | N |
| `ACDGHILMN` | A | C | D | G | H | I | L | M | N |
| `ACDGHJKMN` | A | C | D | G | H | J | K | M | N |
| `ACDGHJLMN` | A | C | D | G | H | J | L | M | N |
| `ACEFHIKMN` | A | C | E | F | H | I | K | M | N |
| `ACEFHILMN` | A | C | E | F | H | I | L | M | N |
| `ACEFHJKMN` | A | C | E | F | H | J | K | M | N |
| `ACEFHJLMN` | A | C | E | F | H | J | L | M | N |
| `ACEGHIKMN` | A | C | E | G | H | I | K | M | N |
| `ACEGHILMN` | A | C | E | G | H | I | L | M | N |
| `ACEGHJKMN` | A | C | E | G | H | J | K | M | N |
| `ACEGHJLMN` | A | C | E | G | H | J | L | M | N |
| `BCDFHIKMN` | B | C | D | F | H | I | K | M | N |
| `BCDFHILMN` | B | C | D | F | H | I | L | M | N |
| `BCDFHJKMN` | B | C | D | F | H | J | K | M | N |
| `BCDFHJLMN` | B | C | D | F | H | J | L | M | N |
| `BCDGHIKMN` | B | C | D | G | H | I | K | M | N |
| `BCDGHILMN` | B | C | D | G | H | I | L | M | N |
| `BCDGHJKMN` | B | C | D | G | H | J | K | M | N |
| `BCDGHJLMN` | B | C | D | G | H | J | L | M | N |
| `BCEFHIKMN` | B | C | E | F | H | I | K | M | N |
| `BCEFHILMN` | B | C | E | F | H | I | L | M | N |
| `BCEFHJKMN` | B | C | E | F | H | J | K | M | N |
| `BCEFHJLMN` | B | C | E | F | H | J | L | M | N |
| `BCEGHIKMN` | B | C | E | G | H | I | K | M | N |
| `BCEGHILMN` | B | C | E | G | H | I | L | M | N |
| `BCEGHJKMN` | B | C | E | G | H | J | K | M | N |
| `BCEGHJLMN` | B | C | E | G | H | J | L | M | N |

## Reading The Set

- All current complete models include `C`, `H`, `M`, and `N`, because those axes currently have only one defined option.
- The current variation comes from `A/B`, `D/E`, `F/G`, `I/J`, and `K/L`.
- If a new alternative is added on any axis, the total number of complete models increases by multiplying the current count by the number of options on that axis.

## Notes For Next Steps

- This file defines the current full-model space, but does not yet rank or eliminate candidates.
- A later comparison doc can narrow these `32` models into a smaller shortlist for scripted simulation.
- If the project starts referring to one preferred full model, that model should be named by its full code rather than by only one axis choice.
