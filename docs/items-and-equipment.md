# Items And Equipment

This document preserves source-derived item data and tracks later equipment design decisions.

Items are not part of MVP 0 unless the MVP scope is explicitly changed. For now, this catalog is source material for later implementation.

## Scope Notes

- MVP 0 currently has no equipment.
- Item data may include Undead eligibility because it comes from source material.
- Undead eligibility does not change the current MVP race list.
- Eligible MVP warrior classes are Dwarf, Elf, Goblin, Human, and Orc.
- Undead item eligibility should be preserved for later if Undead are added.

## Open Equipment Questions

- Which item classes and subclasses exist?
- Can items be bought, sold, equipped, and unequipped freely?
- Do items bind to warriors or remain transferable?
- Do items have durability or breakage?
- Are items ever NFTs, or always off-chain equipment?
- How should item weaknesses such as attack-type vulnerabilities work?

## Equipment Rules

- A warrior can equip no more than one Armour item.
- A warrior can equip no more than one Weapon item.
- A warrior can equip no more than one Enchanted Item.
- The warrior must satisfy the item's minimum level requirement.
- The warrior must be included in the item's eligible warrior classes.
- Equipment subclass restrictions are enforced through the item's eligible warrior classes for now.

## Source-Observed Market Rules

- Normal market items can be sold back to the system for gold.
- Observed resale price appears to be `floor(item cost * 0.65)`.
- This is probable source behavior, not yet final Immortal Arena economy design.

Observed examples:

| Item | Cost | Observed Sell Price | Calculation |
|---|---:|---:|---|
| Hatchet | 189 | 122 | `floor(189 * 0.65) = 122` |
| Cloth Vest | 210 | 136 | `floor(210 * 0.65) = 136` |
| Hammer | 168 | 109 | `floor(168 * 0.65) = 109` |

## Source Item Catalog

| Name | Min Level | Class | Subclass | Cost | Damage | Defense | Accuracy | Agility | Speed | Special | Eligible Warrior Classes |
|---|---:|---|---|---:|---:|---:|---:|---:|---:|---|---|
| Cloth Vest | 1 | Armour | Armour | 210 | 0 | 7 | 1 | 1 | 1 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Leather Cap | 2 | Armour | Armour | 352 | 0 | 12 | 1 | 1 | 2 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Padded Jerkin | 3 | Armour | Armour | 552 | 0 | 16 | 3 | 2 | 3 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Shield | 4 | Armour | Armour | 792 | 0 | 22 | 4 | 4 | 3 | This armour is weak against SLASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Leather Jerkin | 5 | Armour | Armour | 975 | 0 | 28 | 3 | 4 | 4 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Tower Shield | 7 | Armour | Armour | 1539 | 0 | 41 | 6 | 5 | 5 | This armour is weak against SLASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Ringmail Shirt | 9 | Armour | Armour | 2088 | 0 | 50 | 8 | 8 | 6 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Chainmail Shirt | 11 | Armour | Armour | 2697 | 0 | 63 | 8 | 7 | 9 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Scalemail Armour | 14 | Armour | Armour | 3876 | 0 | 78 | 11 | 11 | 14 | This armour is weak against SLASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Full Plate Armour | 17 | Armour | Armour | 5106 | 0 | 97 | 13 | 14 | 14 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Adamantium Ringmail | 20 | Armour | Armour | 6440 | 0 | 109 | 16 | 18 | 18 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Adamantium Chainmail | 24 | Armour | Armour | 8404 | 0 | 135 | 18 | 19 | 19 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Adamantium Scalemail | 28 | Armour | Armour | 10752 | 0 | 160 | 21 | 22 | 21 | This armour is weak against SLASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Adamantium Plate | 32 | Armour | Armour | 13364 | 0 | 177 | 28 | 25 | 27 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Mithril Ringmail | 36 | Armour | Armour | 16072 | 0 | 199 | 28 | 28 | 32 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Mithril Chainmail | 40 | Armour | Armour | 19140 | 0 | 221 | 32 | 34 | 32 | This armour is weak against PIERCING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Mithril Scalemail | 45 | Armour | Armour | 23530 | 0 | 253 | 40 | 34 | 35 | This armour is weak against SLASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Mithril Plate | 55 | Armour | Armour | 32925 | 0 | 307 | 44 | 46 | 42 | This armour is weak against BASHING attacks | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Hatchet | 1 | Weapon | Axe | 189 | 5 | 1 | 1 | 1 | 1 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Axe | 3 | Weapon | Axe | 552 | 12 | 2 | 5 | 2 | 3 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| War Axe | 5 | Weapon | Axe | 1025 | 21 | 5 | 7 | 4 | 4 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Broad Axe | 7 | Weapon | Axe | 1512 | 29 | 5 | 10 | 5 | 7 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Two Handed Axe | 10 | Weapon | Axe | 2370 | 41 | 7 | 15 | 8 | 8 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Two-Handed Broad Axe | 15 | Weapon | Axe | 4235 | 60 | 11 | 22 | 14 | 14 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Great Axe | 20 | Weapon | Axe | 6360 | 77 | 16 | 32 | 16 | 18 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Slicer | 25 | Weapon | Axe | 9000 | 100 | 19 | 41 | 21 | 19 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Devil Cutter | 35 | Weapon | Axe | 15400 | 141 | 28 | 57 | 27 | 27 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Fire Axe | 50 | Weapon | Axe | 28000 | 201 | 39 | 80 | 38 | 42 | This weapon delivers SLASHING damage | Dwarf, Goblin, Orc |
| Hammer | 1 | Weapon | Hammer | 168 | 4 | 0 | 1 | 1 | 2 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Heavy hammer | 2 | Weapon | Hammer | 352 | 5 | 1 | 3 | 3 | 4 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Long-hafted hammer | 4 | Weapon | Hammer | 768 | 11 | 2 | 5 | 5 | 9 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Two handed hammer | 8 | Weapon | Hammer | 1820 | 22 | 3 | 9 | 10 | 21 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Warhammer | 15 | Weapon | Hammer | 4200 | 44 | 5 | 16 | 20 | 35 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Heavy warhammer | 18 | Weapon | Hammer | 5434 | 50 | 7 | 21 | 23 | 42 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Two handed warhammer | 24 | Weapon | Hammer | 8492 | 67 | 9 | 31 | 29 | 57 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Admantium hammer | 29 | Weapon | Hammer | 11368 | 82 | 12 | 34 | 32 | 72 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Thunder hammer | 34 | Weapon | Hammer | 14742 | 95 | 13 | 42 | 39 | 84 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Storm hammer | 41 | Weapon | Hammer | 20008 | 119 | 16 | 48 | 50 | 95 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Death hammer | 50 | Weapon | Hammer | 28070 | 140 | 20 | 57 | 60 | 124 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Mjollir | 60 | Weapon | Hammer | 38560 | 163 | 24 | 73 | 79 | 143 | This weapon delivers BASHING damage | Dwarf, Elf, Goblin, Human, Orc, Undead |
| Bec de Corbin | 1 | Weapon | Polearm | 189 | 2 | 3 | 1 | 2 | 1 | This weapon delivers PIERCING damage | Undead |
| Bill Hook | 2 | Weapon | Polearm | 352 | 5 | 6 | 2 | 1 | 2 | This weapon delivers PIERCING damage | Undead |
| Glaive | 4 | Weapon | Polearm | 744 | 11 | 7 | 4 | 3 | 6 | This weapon delivers PIERCING damage | Undead |
| Pike | 8 | Weapon | Polearm | 1792 | 18 | 21 | 9 | 5 | 11 | This weapon delivers PIERCING damage | Undead |
| Fauchard | 10 | Weapon | Polearm | 2400 | 21 | 23 | 10 | 9 | 17 | This weapon delivers PIERCING damage | Undead |
| Corseque | 15 | Weapon | Polearm | 4200 | 36 | 32 | 14 | 13 | 25 | This weapon delivers PIERCING damage | Undead |
| Bardiche | 22 | Weapon | Polearm | 7392 | 57 | 47 | 15 | 20 | 37 | This weapon delivers PIERCING damage | Undead |
| Halberd | 30 | Weapon | Polearm | 12000 | 75 | 74 | 25 | 20 | 46 | This weapon delivers PIERCING damage | Undead |
| Trident | 50 | Weapon | Polearm | 28000 | 121 | 127 | 36 | 36 | 80 | This weapon delivers PIERCING damage | Undead |
| Short Bow | 1 | Weapon | Ranged | 168 | 1 | 1 | 2 | 1 | 3 | This weapon delivers PIERCING damage | Elf |
| Bow | 2 | Weapon | Ranged | 330 | 4 | 1 | 5 | 1 | 4 | This weapon delivers PIERCING damage | Elf |
| Long Bow | 3 | Weapon | Ranged | 529 | 5 | 3 | 6 | 2 | 7 | This weapon delivers PIERCING damage | Elf |
| Composite Short Bow | 5 | Weapon | Ranged | 1025 | 9 | 4 | 12 | 4 | 12 | This weapon delivers PIERCING damage | Elf |
| Composite Bow | 7 | Weapon | Ranged | 1512 | 11 | 7 | 16 | 5 | 17 | This weapon delivers PIERCING damage | Elf |
| Composite Long Bow | 9 | Weapon | Ranged | 2059 | 16 | 6 | 21 | 6 | 22 | This weapon delivers PIERCING damage | Elf |
| Reflex Bow | 12 | Weapon | Ranged | 3104 | 18 | 9 | 29 | 9 | 32 | This weapon delivers PIERCING damage | Elf |
| HeartSeeker | 15 | Weapon | Ranged | 4200 | 25 | 14 | 32 | 13 | 36 | This weapon delivers PIERCING damage | Elf |
| War Bow | 20 | Weapon | Ranged | 6360 | 35 | 14 | 47 | 15 | 48 | This weapon delivers PIERCING damage | Elf |
| Fire Bow | 30 | Weapon | Ranged | 12050 | 46 | 23 | 76 | 24 | 72 | This weapon delivers PIERCING damage | Elf |
| Bow of Destruction | 37 | Weapon | Ranged | 16986 | 65 | 23 | 75 | 60 | 75 | This weapon delivers PIERCING damage | Elf |
| Hellfire | 40 | Weapon | Ranged | 18600 | 70 | 26 | 75 | 62 | 77 | This weapon delivers PIERCING damage | Elf |
| Common Staff | 1 | Weapon | Staff | 168 | 1 | 3 | 2 | 1 | 1 | This weapon delivers BASHING damage | Elf, Human |
| Strengthened Staff | 2 | Weapon | Staff | 352 | 2 | 6 | 1 | 3 | 4 | This weapon delivers BASHING damage | Elf, Human |
| Composite Staff | 3 | Weapon | Staff | 552 | 4 | 9 | 2 | 4 | 5 | This weapon delivers BASHING damage | Elf, Human |
| Iron Staff | 5 | Weapon | Staff | 1000 | 7 | 14 | 4 | 7 | 8 | This weapon delivers BASHING damage | Elf, Human |
| Wizards Staff | 7 | Weapon | Staff | 1539 | 10 | 18 | 6 | 12 | 11 | This weapon delivers BASHING damage | Elf, Human |
| Adamantium Staff | 9 | Weapon | Staff | 2117 | 11 | 26 | 6 | 16 | 14 | This weapon delivers BASHING damage | Elf, Human |
| Staff of Light | 12 | Weapon | Staff | 3072 | 14 | 35 | 11 | 18 | 18 | This weapon delivers BASHING damage | Elf, Human |
| Staff of Power | 15 | Weapon | Staff | 4235 | 18 | 42 | 12 | 25 | 24 | This weapon delivers BASHING damage | Elf, Human |
| Rune Staff | 20 | Weapon | Staff | 6400 | 25 | 56 | 15 | 32 | 32 | This weapon delivers BASHING damage | Elf, Human |
| Sorcerers Staff | 30 | Weapon | Staff | 12000 | 35 | 82 | 27 | 49 | 47 | This weapon delivers BASHING damage | Elf, Human |
| Rusty Sword | 1 | Weapon | Sword | 189 | 1 | 2 | 2 | 2 | 2 | This weapon delivers SLASHING damage | Human |
| Common Sword | 2 | Weapon | Sword | 352 | 1 | 4 | 3 | 5 | 3 | This weapon delivers SLASHING damage | Human |
| Cutlass | 4 | Weapon | Sword | 768 | 4 | 5 | 8 | 10 | 5 | This weapon delivers SLASHING damage | Human |
| Silver Rapier | 8 | Weapon | Sword | 1820 | 7 | 12 | 14 | 19 | 13 | This weapon delivers SLASHING damage | Human |
| Bastard Sword | 10 | Weapon | Sword | 2430 | 9 | 17 | 19 | 19 | 17 | This weapon delivers SLASHING damage | Human |
| Falchion | 14 | Weapon | Sword | 3842 | 12 | 21 | 30 | 30 | 20 | This weapon delivers SLASHING damage | Human |
| Two-Handed Sword | 21 | Weapon | Sword | 6970 | 19 | 34 | 42 | 40 | 35 | This weapon delivers SLASHING damage | Human |
| Razor Sword | 28 | Weapon | Sword | 10800 | 23 | 46 | 54 | 62 | 40 | This weapon delivers SLASHING damage | Human |
| Devil Blade | 35 | Weapon | Sword | 15510 | 25 | 57 | 70 | 72 | 58 | This weapon delivers SLASHING damage | Human |
| Sword of Damocles | 50 | Weapon | Sword | 28000 | 38 | 77 | 102 | 99 | 84 | This weapon delivers SLASHING damage | Human |
| Warped Ring | 16 | Enchanted Item | Dark Magic Item | 7560 | 2 | 2 | 14 | 2 | 1 | None | Goblin |
| Darkstone Ring | 42 | Enchanted Item | Dark Magic Item | 33480 | 5 | 5 | 36 | 6 | 2 | None | Goblin |
| Warpstone Ring | 62 | Enchanted Item | Dark Magic Item | 66420 | 8 | 8 | 53 | 8 | 4 | None | Goblin |
| Bone Ring | 20 | Enchanted Item | Death Magic Item | 64400 | 15 | 34 | 81 | 16 | 15 | None | Undead |
| Skull Ring | 40 | Enchanted Item | Death Magic Item | 192600 | 31 | 63 | 162 | 32 | 33 | None | Undead |
| Flayed Skin Ring | 70 | Enchanted Item | Death Magic Item | 504900 | 55 | 108 | 283 | 57 | 58 | None | Undead |
| Rune Stone | 16 | Enchanted Item | Deep Magic Item | 7200 | 1 | 2 | 2 | 2 | 13 | None | Dwarf |
| Glowing Rune Stone | 42 | Enchanted Item | Deep Magic Item | 33480 | 2 | 5 | 5 | 5 | 37 | None | Dwarf |
| Rune of Power | 60 | Enchanted Item | Deep Magic Item | 63200 | 4 | 8 | 8 | 7 | 52 | None | Dwarf |
| Shining Pendant | 16 | Enchanted Item | Light Magic Item | 7560 | 14 | 2 | 2 | 1 | 2 | None | Elf |
| Pendant of Light | 42 | Enchanted Item | Light Magic Item | 33480 | 36 | 5 | 6 | 2 | 5 | None | Elf |
| Sun Pendant | 60 | Enchanted Item | Light Magic Item | 62400 | 52 | 7 | 7 | 4 | 8 | None | Elf |
| Rock Necklace | 16 | Enchanted Item | Primal Magic | 7560 | 1 | 2 | 2 | 14 | 2 | None | Orc |
| Ancient Necklance | 42 | Enchanted Item | Primal Magic | 34100 | 2 | 6 | 5 | 36 | 6 | None | Orc |
| Mystic Necklace | 60 | Enchanted Item | Primal Magic | 61600 | 4 | 7 | 8 | 51 | 7 | None | Orc |
| Glittering Ring | 16 | Enchanted Item | Spirit Magic Item | 7200 | 2 | 13 | 1 | 2 | 2 | None | Human |
| Spirit Ring | 42 | Enchanted Item | Spirit Magic Item | 32860 | 5 | 35 | 3 | 5 | 5 | None | Human |
| Ring of Shadows | 60 | Enchanted Item | Spirit Magic Item | 61600 | 7 | 51 | 4 | 7 | 8 | None | Human |

## Special Non-Market Item Source

These items are source material for special items that are not bought from the normal market. The acquisition mechanic is extra design work and remains undefined.

Source note: posted 02 Nov 2012 17:27.

| Name | Min Level | Class | Subclass | Cost | Damage | Defense | Accuracy | Agility | Speed | Special | Eligible Warrior Classes |
|---|---:|---|---|---:|---:|---:|---:|---:|---:|---|---|
| Soul Slicer | 30 | Weapon | Sword | 1 | 50 | 100 | 30 | 70 | 75 | This weapon delivers SLASHING damage | TBD |
| Neptunes Trident | 60 | Weapon | Polearm | 1 | 139 | 148 | 49 | 48 | 96 | This weapon delivers PIERCING damage | TBD |
| Soul Piercer | 30 | Weapon | Ranged | 1 | 50 | 30 | 100 | 70 | 75 | This weapon delivers PIERCING damage | TBD |
| Spirit Glaive aka Michal Jackson's Wand | 32 | Weapon | Polearm | 1 | 75 | 150 | 30 | 30 | 56 | This weapon delivers PIERCING damage | TBD |
| Ethereal Carver | 60 | Weapon | Axe | 1 | 250 | 60 | 50 | 50 | 55 | This weapon delivers SLASHING damage | TBD |
| Soul Carver | 30 | Weapon | Axe | 1 | 150 | 30 | 50 | 50 | 55 | TBD | TBD |
| Ethereal Slicer | 60 | Weapon | Sword | TBD | 50 | 200 | 60 | 70 | 75 | TBD | TBD |
| Ethereal Piercer | 60 | Weapon | Ranged | 1 | 50 | 60 | 200 | 70 | 75 | This weapon delivers PIERCING damage | TBD |
| Ethereal Crusher | 60 | Weapon | Staff | TBD | 50 | 200 | 60 | 70 | 75 | This weapon delivers BASHING damage | TBD |
