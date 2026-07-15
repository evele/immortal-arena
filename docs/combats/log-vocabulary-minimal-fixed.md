# Combat Model: Log Vocabulary Minimal And Fixed

This model defines the MVP battle log as a small fixed set of text event types with stable wording expectations.

## Status

Current base model for MVP battle log vocabulary.

## Goal

The battle log should be readable in classic webgame style while remaining consistent enough for deterministic replay checks and combat-engine tests.

## Required Event Types

The MVP log must support these event categories:

1. Miss.
2. Normal hit.
3. Zero-damage hit.
4. Full armor absorption.
5. Successful racial-hatred hit.
6. Defeat of a warrior.
7. Battle victory.
8. Battle loss.
9. Battle tie.
10. Rewards applied.

## Event Rules

### 1. Miss

Use when an attack fails hit resolution.

Required information:

- Attacker name.
- Defender name.
- Clear miss outcome.

Example style:

```text
Gorath misses Elion.
```

### 2. Normal Hit

Use when an attack hits and deals damage above `0` without racial-hatred wording.

Required information:

- Attacker name.
- Defender name.
- Final damage dealt.
- Defender remaining HP.

Example style:

```text
Gorath strikes Elion for 6 damage. Elion has 8 HP left.
```

### 3. Zero-Damage Hit

Use when an attack hits but final damage is `0`, and the log does not use the full-absorption phrasing.

This wording is appropriate when the hit connects and the final result is exactly `0 damage`, without emphasizing that the defender's armor clearly overmatched the blow.

Required information:

- Attacker name.
- Defender name.
- Explicit `0 damage` outcome.

Example style:

```text
Gorath strikes Thorin for 0 damage.
```

### 4. Full Armor Absorption

Use when an attack hits, final damage is `0`, and the log chooses armor-absorption wording instead of the plain `0 damage` line.

This wording is appropriate when the hit connects, the final result is still `0 damage`, and the log wants to emphasize that the defender's armor completely swallowed the blow rather than only reporting the numeric result.

Required information:

- Attacker name.
- Defender name.
- Clear armor absorption outcome.

Example style:

```text
Gorath strikes Thorin, but Thorin's armour absorbs the full blow.
```

Both event types represent a landed hit that deals `0` final damage. The distinction is in presentation, not in the final numeric outcome.

### 5. Successful Racial-Hatred Hit

Use when the attack hits, the attacker hates the defender's race, and the hit resolves successfully.

Required information:

- Attacker name.
- Defender name.
- Final damage dealt.
- Defender remaining HP if damage is above `0`.
- Source-style hatred wording such as `viciously attacks`.

Example style:

```text
Lina viciously attacks Gruint for 7 damage. Gruint has 5 HP left.
```

If a hatred-qualified attack misses, use the normal miss event instead.

### 6. Defeat Of A Warrior

Use when a warrior reaches `0` HP.

Required information:

- Defender name.
- Source-style defeat wording such as `perished`.

Example style:

```text
Elion has perished.
```

This is battle language only and does not imply permanent death.

### 7. Battle Victory

Use when the acting lord wins the battle.

Required information:

- Winning lord name.
- Losing lord name.
- Clear victory outcome.

Example style:

```text
Lord Aster defeats Lord Brakka.
```

### 8. Battle Loss

Use when presenting the same finished battle from the losing lord perspective, if the UI needs explicit result wording separate from the victory line.

Required information:

- Losing lord name.
- Winning lord name.
- Clear loss outcome.

Example style:

```text
Lord Brakka loses to Lord Aster.
```

If the product only stores one canonical shared battle log, this outcome can be covered by the victory line alone.

### 9. Battle Tie

Use when the draw condition is reached and both sides still have living warriors.

Required information:

- Both lord names.
- Clear tie outcome.

Example style:

```text
Lord Aster and Lord Brakka fight to a draw.
```

### 10. Rewards Applied

Use after the final battle result when the MVP reward rules grant gold or XP.

Required information:

- Reward recipient.
- Gold amount, if any.
- Lord XP amount, if any.
- Warrior XP amount, if any.

Example style:

```text
Lord Aster gains 120 gold and 8 lord XP. Surviving warriors gain 4 XP each.
```

## Ordering Rules

1. Log action events in combat resolution order.
2. If an attack reduces a warrior to `0` HP, log the attack result first and the defeat line immediately after.
3. Log the final battle outcome after the last combat action.
4. Log rewards after the final outcome.

## Notes

- The MVP should prefer a fixed vocabulary over large pools of interchangeable flavor text.
- Exact punctuation and minor article wording can vary slightly, but event meaning must stay stable.
- The engine should treat these as distinct event meanings even if the UI later chooses to render them with different phrasing.
