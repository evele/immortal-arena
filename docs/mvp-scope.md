# MVP Scope

The MVP goal is a playable off-chain web prototype with the core BloodArena-inspired mechanics working.

`docs/mvp-0-vertical-slice.md` defines the first implementation slice.

## Must Have

- Lord identity.
- Starting gold for each new lord.
- Basic in-game gold.
- Initial warrior purchase chosen by the player.
- Basic warrior market/recruitment.
- Stable global IDs for lords, warriors, battles, and seasons.
- Off-chain warrior ownership separated from mutable warrior stats, so NFT or equivalent ownership can be added later.
- MVP races: Human, Orc, Elf, Dwarf, and Goblin.
- Original racial hatred cycle.
- Basic warrior stats.
- Automated asynchronous guild-vs-guild PvP combat.
- Text-based battle results/logs.
- Basic experience gain.
- Basic lord progression.
- Basic warrior progression.
- Daily limited attacks.
- Attack stacking over a limited number of days.
- No permanent warrior death.
- Wounded warrior state.

## Likely But Not Confirmed

- Wallet login.
- Training sessions.
- Salary.
- More warrior slots.
- Basic equipment.
- Healing or recovery through time and/or payment.
- Simple leaderboard.

## Probably Later

- Local blockchain support through Anvil or another chain-specific devnet.
- Warrior ownership represented on-chain as NFT or equivalent smart contract model.
- Full marketplace.
- Equipment NFTs.
- Weekly tournaments.
- Full seasonal reset system.
- Fame or legacy scoring.
- Multi-chain deployment.
- Real on-chain randomness.
- Tokenized in-game currency.

## MVP Design Question

The main MVP question is whether to include equipment and training immediately, or start with only warriors, stats, attacks, wounds/recovery, and progression.
