# MVP 0 Vertical Slice

MVP 0 is a playable off-chain web prototype. Its job is to prove the core loop before wallet, contracts, NFTs, or chain choice.

## Goal

- Create a lord.
- Receive starting gold.
- Buy one chosen warrior from the market.
- Attack another lord.
- Resolve automatic combat.
- Show a text battle log.
- Persist rewards, wounds, and progression.

## Non-Goals

- No wallet login requirement.
- No Anvil, contracts, NFTs, or chain adapter.
- No multi-chain abstraction framework.
- No equipment.
- No training.
- No seasons.
- No marketplace between players.
- No tokenized currency.
- No on-chain randomness.

## First-Run Flow

- Player enters a globally unique lord name.
- The app creates an off-chain lord record.
- New lord starts with `100` gold.
- New lord has no free warrior.
- Player buys exactly one first warrior from the market.
- The market offers one starter class per MVP race.
- After buying a warrior, the player can attack seeded demo lords or other created lords.

## MVP 0 Screens

- Lord profile: name, level, XP, gold, attacks remaining, warrior slots, battle record.
- Market: starter warriors by race, cost, and visible stats.
- Warriors: owned warriors, current HP, level, XP, wounds, stats.
- Arena: list of attackable lords and their visible roster summary.
- Battle result: outcome, rewards, HP changes, and full text log.

## Minimal Data Model

- `Lord`: stable global ID, name, gold, level, XP, daily attacks, max daily attacks, warrior slots, win/loss/tie counts.
- `Warrior`: stable global ID, owner lord ID, name, race, class, level, XP, max HP, current HP, Damage, Defense, Accuracy, Agility, Speed.
- `MarketWarriorTemplate`: stable ID, race, class, cost, base stats, unlock lord level.
- `Battle`: stable global ID, attacker lord ID, defender lord ID, seed, combatant snapshots, outcome, rewards, log entries, created time.

Keep warrior ownership separate from mutable stats even while both live in normal application storage.

## Provisional Starter Market

All starter warriors cost `100` gold and require lord level `1`.

| Race | Class | HP | Damage | Defense | Accuracy | Agility | Speed |
|---|---|---:|---:|---:|---:|---:|---:|
| Human | Militia | 100 | 12 | 5 | 65 | 45 | 20 |
| Orc | Brute | 110 | 16 | 3 | 55 | 35 | 15 |
| Elf | Archer | 85 | 10 | 3 | 75 | 60 | 25 |
| Dwarf | Guard | 130 | 11 | 8 | 55 | 30 | 12 |
| Goblin | Skirmisher | 80 | 8 | 2 | 60 | 65 | 35 |

These numbers are MVP 0 tuning constants, not final balance.

## Combat Rules

- Use all available warriors on both sides.
- A warrior is available if current HP is above `0`.
- Wounded warriors with current HP above `0` can attack and defend.
- Combat uses tick-based initiative from `docs/combat-and-progression.md`.
- Each action targets a random living enemy.
- Battle ends when one side has no living warriors or after `100` combat actions.
- Same-tick action order: highest current initiative, then highest Speed, then seeded random.
- Race hatred cycle: Orc -> Human -> Goblin -> Elf -> Dwarf -> Orc.
- MVP 0 hatred bonus is `+25%` Damage before Defense, rounded up.
- MVP 0 hit chance is `50 + attacker Accuracy - defender Agility`, clamped between `10` and `90` percent.
- MVP 0 damage is `max(0, modified Damage - defender Defense)`.
- There is no minimum damage floor.
- Randomness must use the battle seed so a battle can be replayed deterministically.

## Battle Logs

Each battle should log text events for:

- Initiative actions, not every tick.
- Misses.
- Normal hits.
- Zero-damage hits.
- Full armor absorption.
- Remaining HP after damage.
- Victory, defeat, and tie.
- Rewards applied.

## Rewards And Progression

- Winner receives `10` lord XP and `10` gold.
- Each surviving warrior on the winning side receives `10` warrior XP.
- Draw gives `3` lord XP to both lords and no gold.
- Defeat gives no MVP 0 reward.
- Lord and warrior level curves are provisional: every `100` XP grants `1` level.
- Stat point assignment is out of MVP 0; level increases can be recorded without spending points.

## Wounds And Recovery

- Battle damage persists to warrior current HP after combat.
- Defeated warriors remain at `0` HP after battle.
- MVP 0 includes a simple off-chain `Recover` action that restores a lord's warriors to max HP for free.
- Paid healing, timed healing, Apothecary, and salary interaction are later design work.

## Daily Attacks

- New lords start with `2` daily attacks and max daily attacks `2`.
- Each attack consumes `1` daily attack.
- MVP 0 can include a manual demo reset that restores daily attacks to max.
- Real scheduled resets, attack stacking, salary payout, and training session resets are later design work.

## Seeded Demo Data

- Include at least three seeded demo lords with one starter warrior each.
- Seeded lords are normal lord records flagged as demo content.
- Demo lords exist only to make the arena playable before multiple real players exist.

## Implementation Guardrails

- Keep combat as pure game logic independent of UI, storage, and chain APIs.
- Persist battle snapshots so old logs remain explainable after warrior stats change.
- Do not expose exact formulas in player-facing UI unless a later design decision changes formula transparency.
- Do not add extra stats, rarity tiers, permanent death, fatigue, or player combat decisions.
