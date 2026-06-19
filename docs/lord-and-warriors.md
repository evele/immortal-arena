# Lord And Warriors

This document defines the current model for the player account and warrior units.

## Lord

The player is represented as a lord.

The lord is conceptually close to the original BloodArena guild: it is the account-level entity that owns resources, progresses over time, and manages warriors.

## Lord Creation

Current direction:

- A lord can be created automatically when a wallet connects for the first time.
- The lord name should be globally unique.
- Lord name changes may be allowed, but this is undecided.
- The lord starts with gold, not with a free warrior.
- The player uses starting gold to buy the first warrior.

## Lord Progression

The lord should have:

- Level.
- Experience.
- Lord points or equivalent account-level upgrade points.

Confirmed lord upgrade attributes:

- Salary.
- Daily attacks.
- Daily training sessions.
- Warrior slots.

Possible future lord/account concepts:

- Fame.
- Legacy.
- Season score.
- Honor.

These need more design work before implementation.

## Warriors

Warriors are the main combat units.

The player buys warriors, trains them, equips them, and sends them into asynchronous automatic guild-vs-guild battles.

Warriors should be represented as NFTs, but the exact on-chain/off-chain data split is undecided.

## First Warrior

The first warrior should be chosen by the player from available market options.

It should not be randomly generated.

The player starts with enough gold to buy an initial warrior, preserving the original strategic choice of spending limited early resources.

## MVP Races

The MVP races are:

- Human.
- Orc.
- Elf.
- Dwarf.
- Goblin.

Undead is not planned for now.

## Racial Hatred

The original racial hatred cycle should be preserved:

- Orcs hate Humans.
- Humans hate Goblins.
- Goblins hate Elves.
- Elves hate Dwarfs.
- Dwarfs hate Orcs.

This should create matchup bonuses during combat.

## Warrior Stats

The expected stat set comes from the original game:

- HP.
- Damage.
- Defense.
- Accuracy.
- Agility.
- Speed.

The exact formulas and point scaling are not designed yet.

Current stat role direction:

- HP determines survivability.
- Damage contributes to outgoing damage.
- Defense probably reduces incoming damage as flat reduction.
- Accuracy increases hit chance.
- Agility helps avoid hits.
- Speed affects attack frequency.

## No Random Base Stats

Warriors should not be generated with random base stats.

The player should know what they are buying.

Strategic variety should come from race, class/tier, stat growth, equipment, and lord progression rather than hidden/random starting rolls.

## Warrior Classes And Market Hierarchy

The game should not use rarity as the primary warrior hierarchy.

Instead, warriors should have classes or tiers available in the market.

As the lord levels up, stronger warrior options become available.

Example:

- Low-level lords can buy basic Orc warriors.
- Higher-level lords can buy stronger Orc classes with better base stats.

This mirrors the original market progression where stronger warrior options unlock at higher levels.

## Transferability

Whether warrior NFTs should be transferable from day one is undecided.

If transferability exists, the game needs rules for edge cases:

- A player selling their only warrior.
- A player buying a high-tier warrior from another player.
- Seasonal balance.
- Pay-to-win pressure.

If a player has no warriors, they should still be able to continue by buying a new warrior before attacking.

## On-Chain Data Direction

Preferred direction:

- Keep warrior data on-chain if a cheap enough or gasless chain/setup allows it.
- Avoid expensive on-chain actions for frequent gameplay if costs become a problem.

Candidate ecosystems include Sonic, Gnosis, Starknet, Immutable, or another low-cost/gasless chain.

Local development can use Anvil.

## Seasons And Immortality

The original game reset everything every round.

Immortal Arena may preserve some form of long-term continuity through warrior NFTs.

One possible direction is that a warrior who reaches level 100 becomes Immortal, unlocking some persistent status or cross-season survival.

This is not decided yet.

Open questions:

- Does a warrior's level reset each season?
- Does the NFT persist while seasonal stats reset?
- What does Immortal mean mechanically?
- Can an Immortal warrior enter future seasons directly?
- Does Immortality affect only prestige, or gameplay power too?
- Can Immortality create unfair advantages for new seasons?
