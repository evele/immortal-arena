# Agent Notes

## Repo State
- This repository currently has no app source, manifests, lockfiles, CI, or test/build scripts; do not invent `npm`, `forge`, or other commands until those files exist.
- `docs/immortal-arena.code-workspace` only opens the repo root and adds no project settings.

## Design Source Priority
- Treat `docs/current-decisions.md`, `docs/next-definitions.md`, `docs/mvp-0-vertical-slice.md`, `docs/mvp-scope.md`, `docs/lord-and-warriors.md`, and `docs/combat-and-progression.md` as the current product direction.
- Treat `docs/guide.md`, `docs/iceman-newbie-guide.md`, and `docs/original-game-analysis.md` as BloodArena source material; if they conflict with current-direction docs, follow the current-direction docs.
- `docs/open-questions.md` and `docs/questions-for-tomorrow.md` are unresolved backlog, not implementation commitments.

## Current MVP Constraints
- First target is a playable off-chain web prototype; wallet login, Anvil, and contracts are not required for the first vertical slice.
- Current technical preference is Vue + Bun + SQLite + Vitest; ORM/query layer is undecided and should not be added by default.
- Player identity is a `lord`, not a guild in product language; a lord starts with gold and buys the first warrior rather than receiving a free/random warrior.
- Warriors can start as off-chain game entities with stable global IDs; NFT or equivalent ownership is a later integration goal.
- Keep ownership separate from mutable gameplay stats so later chain integration does not rewrite combat.
- Avoid adding a game token initially; in-game gold probably stays off-chain at the start.
- MVP races are Human, Orc, Elf, Dwarf, and Goblin; Undead is not planned for now.
- Preserve the hatred cycle: Orc -> Human -> Goblin -> Elf -> Dwarf -> Orc. For MVP it is a damage bonus, not a hit-chance bonus.
- Warriors use HP, Damage, Defense, Accuracy, Agility, and Speed only; do not add Luck, Morale, Stamina, random base stats, or rarity-first hierarchy.

## Combat Rules To Preserve
- Combat is automatic asynchronous lord-vs-lord PvP using all available warriors, not 1v1 and not player-controlled during battle.
- Initiative is tick-based: each active warrior adds Speed each tick, acts at 100 initiative, subtracts 100 after acting, and keeps overflow.
- Same-tick action order is highest current initiative, then highest Speed, then random.
- MVP target selection is random among living enemies; wounded warriors can defend; warriors do not die permanently; fatigue is not currently a mechanic.
- Defense is flat reduction for MVP and may reduce damage to zero; there is no minimum damage floor.
- Battles end when one side is defeated or after 100 combat actions as a provisional draw limit.
- Battle logs should be text-first and support misses, zero-damage hits, full armor absorption, remaining HP, wins, losses, and ties.

## Blockchain And Randomness
- Combat can remain off-chain initially because randomness is unresolved and on-chain execution may be expensive.
- If a random mechanic affects future on-chain state, mark whether it is MVP-only off-chain randomness or needs later verification.
- Do not build a multi-chain abstraction framework up front; keep IDs, ownership boundaries, and pure game logic clean enough to integrate EVM, Solana, Starknet/Cairo, or another chain later.
