# Warrior Catalog

This document defines the source-derived warrior market catalog for MVP races.

The numbers below come from BloodArena source material and are the MVP 0 balance baseline. Do not replace them with simplified or rescaled mock values unless a later explicit design decision changes the catalog.

## Scope

MVP races included here:

- Human.
- Orc.
- Elf.
- Dwarf.
- Goblin.

Undead are intentionally excluded from the MVP catalog. Their source material is kept separately in `docs/undead-warrior-source.md` for later design.

## Race Tendencies

- Human: balanced, strong Accuracy, medium durability and speed.
- Orc: very high Damage and HP, weaker Accuracy, Agility, and Speed.
- Elf: high Agility and Speed, good Accuracy, lower HP and Defense.
- Dwarf: very high HP and Defense, slower than most races.
- Goblin: highest Speed and strong Agility, lower HP and Damage.

## Naming Rules

- Each warrior template has a fixed race and class name.
- Recruited warriors should receive an individual name.
- Whether warrior names are editable remains undecided.
- Class names should remain stable for combat logs, market display, and future chain references.

## MVP Race Catalog

| Lord Level | Race | Class | Price | HP | Damage | Defense | Accuracy | Agility | Speed |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | Elf | Elf Slave | 630 | 12 | 4 | 2 | 4 | 4 | 4 |
| 1 | Goblin | Scrawny Goblin | 660 | 12 | 3 | 2 | 3 | 4 | 7 |
| 1 | Human | Human Wretch | 720 | 20 | 4 | 4 | 5 | 3 | 3 |
| 1 | Orc | Wretched Orc | 630 | 20 | 8 | 2 | 2 | 2 | 2 |
| 1 | Dwarf | Dwarf Slave | 630 | 16 | 4 | 5 | 3 | 3 | 2 |
| 2 | Elf | Minor Elf | 930 | 16 | 6 | 3 | 4 | 8 | 6 |
| 2 | Goblin | Swamp Goblin | 930 | 16 | 4 | 4 | 4 | 5 | 10 |
| 2 | Human | Human Peasant | 900 | 24 | 5 | 4 | 7 | 4 | 4 |
| 2 | Orc | Swamp Orc | 930 | 24 | 12 | 3 | 3 | 4 | 3 |
| 2 | Dwarf | Dwarf Drunkard | 900 | 32 | 6 | 6 | 4 | 3 | 3 |
| 4 | Elf | Wood Elf | 1590 | 32 | 9 | 6 | 6 | 14 | 10 |
| 4 | Goblin | Tunnel Goblin | 1530 | 16 | 6 | 4 | 7 | 10 | 20 |
| 4 | Human | Human Thug | 1560 | 44 | 8 | 8 | 9 | 8 | 8 |
| 4 | Orc | Orc Bruiser | 1530 | 44 | 18 | 6 | 6 | 6 | 4 |
| 4 | Dwarf | Dwarf Miner | 1530 | 44 | 11 | 9 | 8 | 6 | 6 |
| 7 | Elf | Elf Scout | 2400 | 44 | 15 | 9 | 10 | 20 | 15 |
| 7 | Goblin | Cave Goblin | 2400 | 32 | 10 | 7 | 12 | 16 | 27 |
| 7 | Human | Human Fighter | 2430 | 60 | 12 | 12 | 18 | 11 | 13 |
| 7 | Orc | Orc Thug | 2370 | 64 | 34 | 8 | 7 | 7 | 7 |
| 8 | Dwarf | Dwarf Fighter | 2670 | 84 | 17 | 17 | 15 | 10 | 9 |
| 12 | Elf | Elf Warrior | 4110 | 76 | 20 | 14 | 19 | 41 | 24 |
| 12 | Goblin | Dark Goblin | 3990 | 56 | 15 | 13 | 21 | 25 | 45 |
| 12 | Human | Man At Arms | 3990 | 104 | 20 | 19 | 26 | 22 | 20 |
| 12 | Orc | Orc Fighter | 3930 | 108 | 52 | 12 | 12 | 15 | 13 |
| 14 | Dwarf | Dwarf Defender | 4470 | 156 | 32 | 28 | 22 | 14 | 14 |
| 20 | Elf | Rune Elf | 6360 | 132 | 31 | 21 | 23 | 53 | 49 |
| 20 | Goblin | Rune Goblin | 6360 | 88 | 23 | 20 | 30 | 44 | 73 |
| 20 | Human | Human Knight | 6330 | 168 | 33 | 30 | 41 | 33 | 32 |
| 20 | Orc | Orc Warrior | 6330 | 168 | 82 | 23 | 20 | 20 | 24 |
| 25 | Dwarf | Rune Dwarf | 7770 | 264 | 51 | 52 | 38 | 25 | 27 |
| 30 | Elf | Elf Ranger | 9330 | 180 | 61 | 33 | 33 | 76 | 63 |
| 30 | Goblin | Black Goblin | 9450 | 124 | 34 | 30 | 49 | 65 | 106 |
| 30 | Human | Human Noble | 9390 | 236 | 48 | 49 | 63 | 47 | 47 |
| 30 | Orc | Black Orc | 9330 | 252 | 124 | 30 | 30 | 32 | 32 |
| 35 | Dwarf | Dwarf Lord | 10800 | 380 | 73 | 73 | 51 | 35 | 33 |
| 45 | Elf | Elf Lord | 13770 | 288 | 75 | 44 | 44 | 98 | 126 |
| 45 | Goblin | Goblin Lord | 13890 | 188 | 50 | 44 | 67 | 93 | 162 |
| 45 | Orc | Orc Warlord | 13770 | 364 | 187 | 43 | 44 | 47 | 47 |
| 50 | Human | Human Assassin | 15450 | 396 | 80 | 75 | 105 | 80 | 76 |
| 55 | Dwarf | Dwarf Berserker | 16800 | 564 | 110 | 114 | 85 | 53 | 57 |

## MVP 0 Implementation Notes

- MVP 0 only needs one starter option per MVP race.
- Use the level 1 rows in this catalog as the MVP 0 starter market.
- Preserve the catalog's source-derived prices, stats, level unlocks, and asymmetric class availability.
- Earlier simplified MVP numbers were mock placeholders and should not be implemented.

## Open Tuning Questions

- Should class names be kept close to the original, renamed for Immortal Arena, or mixed?
- Should high-level Speed values be used directly with the tick-based initiative model, or compressed to avoid excessive multi-actions?
