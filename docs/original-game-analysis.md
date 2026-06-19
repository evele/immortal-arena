# Original BloodArena Analysis

This document summarizes the source material from `docs/guide.md` and `iceman-newbie-guide.md`.

## Core Fantasy

The player represents a guild competing against other players to become rich, powerful, and highly ranked.

The central loop is not about controlling one hero directly. It is about managing a group of warriors: buying them, equipping them, training them, and sending them into battle.

## Player Entity

The original game uses the concept of a guild. The player has a guild profile with statistics such as battles won, battles lost, salary, level, and other account-wide progression.

For Immortal Arena, this maps better to a lord identity for now.

## Warriors

Warriors are the main units used for attack and defense.

They have:

- Race.
- Level.
- Experience.
- HP.
- Damage.
- Defense.
- Accuracy.
- Agility.
- Speed.
- Equipment restrictions.
- Available item subclasses.

## Races

The original common races are:

- Orc.
- Human.
- Elf.
- Dwarf.
- Goblin.

There is also an Undead race for donators in the original game.

Race matters in two ways:

- Each race has stat tendencies.
- Each race hates another race, creating matchup bonuses.

Original hatred cycle:

- Orcs hate Humans.
- Humans hate Goblins.
- Goblins hate Elves.
- Elves hate Dwarfs.
- Dwarfs hate Orcs.
- Elves have a strong hatred against Undead.
- Undead have a small bonus against most races except Elves.

## Race Tendencies From User Guide

- Elves are known for accuracy.
- Goblins are known for speed.
- Dwarves have strong defense and durability, but poor speed.
- Orcs have strong damage, but poor defense.
- Dwarves and Orcs tend to have bad speed and agility.
- Goblins and Elves may lack damage and defense.

## Items

Items improve warrior attributes.

Items are divided into classes and subclasses.

Rules from the original:

- A warrior can only equip one item per item class.
- Item subclasses restrict which warriors can use which items.
- Items can have minimum warrior level requirements.
- Items are purchased from the Armoury.
- Items are equipped from the Storeroom.

## Training

Warriors can train to improve without fighting real PvP battles.

Training is limited by daily training sessions.

## Battles

Battles are the main activity.

The player selects or searches for another guild to attack.

Winning grants:

- Guild experience.
- Warrior experience for surviving warriors.
- Gold prize equal to half the experience earned.

Rewards depend on opponent strength. Defeating stronger opponents gives better rewards than defeating weaker opponents.

## Guild/Lord Progression

The guild gains experience and levels up.

Leveling grants guild points.

Guild points can improve account-wide attributes, such as:

- Daily salary.
- Number of attacks per day.
- Number of training sessions per day.
- Number of warriors.

After reaching 25 daily attacks, additional attack increases cost 2 guild points each in the original.

## Warrior Progression

Warriors gain experience and level up.

Leveling grants warrior points that can be assigned to stats.

The user guide recommends raising HP early so the first warrior can survive long enough to win fights.

## Daily Resets

The original has resets twice per day at noon and midnight UK time.

At reset, players receive:

- Salary.
- Daily battles.
- Daily training sessions.

Unused battles and training sessions accumulate up to four times the daily limit.

## Rounds

Every few months, the original game resets and players start from scratch.

Rounds include a random special attribute that receives a percentage bonus for the entire round.

## Fame

Fame is awarded to guilds finishing top 10 in certain categories.

Unlike most progression, Fame is not reset at the end of each round.

Fame represents long-term ranking and legacy.

## Tournament

There is a weekly tournament with an entry fee based on guild level.

Prizes can be gold or unique items.

## Healing And Reviving

Warriors take damage in battle.

They can be healed to full HP at the Apothecary by paying gold.

If not healed manually, they automatically revive over time.

Original automatic revive interval: every 15 minutes.
