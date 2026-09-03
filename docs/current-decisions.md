# Current Decisions

This document records decisions made during early design discussion.

## Product Direction

- Immortal Arena should be strongly inspired by BloodArena.
- It should not be a pure clone; some experience redesign is expected to take advantage of blockchain.
- The first implementation target is a playable off-chain web prototype.
- The MVP should include all basic mechanics functioning.
- The game should be designed web2-first but web3-ready, so a later chain integration improves ownership/settlement without driving the initial gameplay architecture.

## Player Identity

- The player is currently called a lord.
- The lord may overlap conceptually with the original BloodArena guild, but the current product language uses lord.
- A lord can be created automatically when the player starts; if wallet login is added, first wallet connection can trigger lord creation.
- Lord names should be globally unique.
- Lord name changes may be allowed, but this is undecided.
- The lord should have level and experience.
- The lord owns and manages warriors.
- The lord does not start with a free warrior by default.
- The lord starts with an initial amount of gold and buys the first warrior.
- The first warrior should be chosen by the player, not randomly generated.
- More warrior slots can be purchased or unlocked later.
- Confirmed lord attributes include salary, daily attacks, daily training sessions, and warrior slots.
- Additional lord/account concepts such as fame, legacy, season score, or honor are desirable but not yet designed.

## Blockchain

- The initial playable prototype should be off-chain and chain-agnostic.
- The account and its warriors are the main things the player should eventually own through web3 integration.
- Warriors can start as off-chain game entities with stable global IDs, with NFT or equivalent ownership added later.
- Equipment may become NFTs, but this is undecided.
- A token should be avoided initially.
- In-game currency should stay off-chain initially.
- Combat should remain off-chain initially, especially because it needs randomness and on-chain execution may be expensive.
- Keep ownership, identity, and settlement boundaries separate enough that a future backend can target EVM, Solana, Starknet/Cairo, or another chain.
- Local blockchain development can use Anvil if an EVM integration is chosen later.
- Possible future target chains include Sonic, Gnosis, Starknet, Immutable, Solana, or another low-cost/gasless chain; do not choose the chain before the gameplay prototype proves useful.
- Whether warrior NFTs are transferable from day one is undecided.

## Implementation Strategy

- Build the first vertical slice as a functional web2 game: lord identity, gold, warrior purchase, market, combat, battle logs, wounds, and progression can all live in normal application storage.
- Use `docs/mvp-0-vertical-slice.md` as the implementation target for the first playable slice.
- Use `docs/next-definitions.md` to drive the next design pass before heavy implementation.
- Do not build a multi-chain abstraction framework up front.
- Do keep global IDs for lords, warriors, battles, and seasons so later on-chain ownership or commitments can reference existing game objects.
- Keep ownership separate from mutable gameplay stats so warrior ownership can move on-chain later without rewriting combat.
- Keep core game logic independent from storage and chain APIs.

## Technical Direction

- Frontend preference is Vue, not React.
- Runtime/backend preference is Bun where practical.
- SQLite is acceptable for the first off-chain prototype.
- Vitest is likely acceptable for tests, especially pure game logic tests.
- ORM/query layer is undecided; do not add one by default without explaining why SQL-first is insufficient.
- Start implementation with the pure combat engine after the next warrior/stat definitions are written.
- MVP 0 should use the source-derived warrior catalog scale from `docs/warrior-catalog.md` as the balance baseline, not a simplified or rescaled mock scale.

## Gameplay

- Combat is automatic.
- Combat is asynchronous guild-vs-guild PvP.
- There are no decisions during combat in the initial design.
- The first UI can present combat as text/log output in classic webgame style.
- Warriors should not die permanently.
- Warriors can be wounded.
- Fatigue is not currently part of the design.
- Daily action limits should exist.
- A baseline of two attacks per day, with stacking over multiple days, is acceptable.
- Salary should exist, similar to the original.
- Seasons are likely a good fit, but the exact reset/persistence model is undecided.
- The MVP races are Human, Orc, Elf, Dwarf, and Goblin.
- Undead is not planned for now.
- The original racial hatred cycle should be preserved.
- Racial hatred should grant a damage bonus against the hated race for the MVP.
- Warriors should not have random base stats.
- Warriors should not use rarity as the primary hierarchy.
- Warrior hierarchy should come from classes/tiers available in the market as the lord level advances.
- Example: higher lord levels unlock stronger Orc classes with better base stats.
- The source catalog's asymmetric class unlocks are intentional and should be preserved unless a later explicit design decision changes them.
- Combat uses all available warriors from each side, not 1v1.
- All living warriors in the battle actively participate; they build initiative and can act while not defeated.
- Wounded warriors can defend.
- Each combat action targets a random living enemy for the MVP.
- Battles end when all warriors on one side are defeated, or in a draw after 100 combat actions for the MVP.
- The 100-action draw limit may need adjustment for battles with many warriors.
- Combat should use the original stats: HP, Damage, Defense, Accuracy, Agility, and Speed.
- No extra stats such as Luck, Morale, or Stamina should be added for now.
- Accuracy affects hit chance.
- Agility helps avoid hits.
- Defense reduces or absorbs incoming damage for the MVP.
- Defense can fully absorb attacks when effective Defense is more than twice the incoming damage; otherwise near-threshold attacks deal at least `10%` of their incoming damage.
- Every third landed hit against the same defender deals `1` armor-chip damage. Misses do not count.
- Combat should use a tick-based initiative model driven by Speed.
- Initiative uses direct accumulation. In Model 1, each tick, each active warrior adds Speed to initiative; at `300` initiative, the warrior acts and `300` is subtracted from initiative.
- Model 1 allows at most one attack action per warrior per tick, even if overflow remains above the threshold.
- If multiple warriors are eligible to act after the same tick, action order is highest current initiative first, then highest Speed, then random if still tied.
- Ticks are internal math only; combat events and battle log entries are produced by actions.
- Battle logs should support misses, zero-damage hits, full armor absorption, remaining HP, wins, losses, and ties.
- Combat formulas should remain somewhat hidden/old-school.
- Current combat tuning uses `+25` hatred hit chance, `x1.25` hatred damage for percent hatred, defender Speed as `25%` evasion contribution, and `95%` effective Defense. Defense fully absorbs attacks above the two-to-one threshold and otherwise permits conditional `10%` armor pressure.

## MVP

- The MVP should be playable.
- Wallet login is useful but no longer required for the first off-chain prototype.
- Blockchain and Anvil are not required for the first off-chain prototype.
- The MVP can avoid some secondary systems initially if needed.
- The MVP should probably start with PvP asynchronous battles.
- Whether market, equipment, training, resets, and seasons are all required in the first MVP remains open.
- Free-to-play access is likely desirable, but not decided.
