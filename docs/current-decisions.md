# Current Decisions

This document records decisions made during early design discussion.

## Product Direction

- Immortal Arena should be strongly inspired by BloodArena.
- It should not be a pure clone; some experience redesign is expected to take advantage of blockchain.
- The first implementation target is a playable web prototype.
- The MVP should include all basic mechanics functioning.

## Player Identity

- The player is currently called a lord.
- The lord may overlap conceptually with the original BloodArena guild, but the current product language uses lord.
- A lord can be created automatically when a wallet connects for the first time.
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

- The account and its warriors are the main things the player should own.
- Warriors should be NFTs.
- Equipment may become NFTs, but this is undecided.
- A token should be avoided initially.
- In-game currency probably does not need to be on-chain initially.
- Combat can be off-chain, especially because it needs randomness and on-chain execution may be expensive.
- The preferred direction is still to keep as much warrior data on-chain as practical, if a sufficiently cheap or gasless chain/setup is available.
- Local blockchain development can use Anvil.
- Possible target chains include Sonic, Gnosis, Starknet, Immutable, or another low-cost/gasless chain.
- Solana is not preferred for now because it would add unfamiliar implementation risk.
- Whether warrior NFTs are transferable from day one is undecided.

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
- Defense reduces incoming damage as flat reduction for the MVP.
- There is no minimum damage floor for now; flat Defense can reduce an attack to zero damage.
- Combat should use a tick-based initiative model driven by Speed.
- Initiative uses direct accumulation with an action threshold of 100: each tick, each active warrior adds Speed to initiative; at 100 initiative, the warrior acts and 100 is subtracted from initiative.
- If multiple warriors are eligible to act after the same tick, action order is highest current initiative first, then highest Speed, then random if still tied.
- Ticks are internal math only; combat events and battle log entries are produced by actions.
- Battle logs should support misses, zero-damage hits, full armor absorption, remaining HP, wins, losses, and ties.
- Combat formulas should remain somewhat hidden/old-school.

## MVP

- The MVP should be playable.
- Wallet login should exist from day one.
- Blockchain can run locally with Anvil for initial development.
- The MVP can avoid some secondary systems initially if needed.
- The MVP should probably start with PvP asynchronous battles.
- Whether market, equipment, training, resets, and seasons are all required in the first MVP remains open.
- Free-to-play access is likely desirable, but not decided.
