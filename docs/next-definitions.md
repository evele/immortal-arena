# Next Definitions

This file tracks what must be defined next before or during early implementation. Keep it focused on decisions that unblock building the game.

## Technical Direction To Confirm

- Frontend preference: Vue, not React.
- Runtime/backend preference: Bun instead of Node where practical.
- Database: SQLite is acceptable for the first off-chain prototype.
- Tests: Vitest is likely acceptable, especially for pure combat/game logic.
- ORM/query layer is undecided; SQL-first is acceptable unless migrations/types become painful enough to justify Drizzle, Kysely, or another lightweight layer.
- First implementation module should be the pure combat engine.

## Design Definitions Needed Next

### 1. Warriors And Market

- Source-derived MVP race catalog now exists in `docs/warrior-catalog.md`.
- Undead source material is preserved separately in `docs/undead-warrior-source.md` and is not part of MVP 0.
- Decision: MVP 0 uses the source-derived catalog scale directly as the balance baseline.

- Starter warrior classes per race.
- Additional classes/tiers per race after lord level 1.
- Base stats for every warrior class.
- Unlock lord level for each class/tier.
- Gold cost for each class/tier.
- Race stat tendencies and asymmetric unlocks from the source catalog.
- Warrior naming rules and whether names are editable.

Target doc: `docs/warrior-catalog.md`.

### 2. Stats And Formulas

- Final-ish MVP meaning of HP, Damage, Defense, Accuracy, Agility, and Speed.
- Hit chance formula.
- Damage formula.
- Racial hatred bonus value.
- Whether damage has variance.
- How Defense produces reduced damage, `0 damage`, and full armor absorption log text.
- Whether Accuracy only affects hit chance or can also create stronger/skilled hits.
- How to improve Goblin performance and reduce Dwarf dominance without directly changing warrior catalog stats or adding Stamina.
- Decision: Stamina should not be added for the current balance pass. It works against the desired Goblin buff because it would likely punish frequent actions from high-Speed warriors.
- Balance validation tables for exact unlock levels and grouped unlock bands such as `7/8/7/7/7`, `12/14/12/12/12`, `20/25/20/20/20`, `30/35/30/30/30`, and `45/55/45/50/45`.
- Whether crits exist; default should be no unless explicitly added.
- Required battle log vocabulary, including source-style `perished` as non-permanent defeat language.
- Level-up stat growth and stat point assignment.
- XP curves for lords and warriors.

Target doc: `docs/stats-and-formulas.md`.

### 3. Items And Equipment

- Whether equipment enters MVP 1 or later.
- Item classes and slots.
- Item subclasses or restrictions by warrior class/race.
- Stat bonuses per item type.
- Minimum warrior level requirements.
- Purchase/equip/unequip rules.
- Whether items persist, bind, break, or can be sold later.

Target doc: `docs/items-and-equipment.md`.

### 4. Economy And Rewards

- Starting gold final MVP value.
- Battle gold reward formula.
- XP reward formula.
- Salary rules.
- Healing/recovery costs.
- Market price curve.
- Anti-farming constraints for attacking weak/demo/inactive lords.

Target doc: `docs/economy-and-rewards.md`.

### 5. Wounds, Recovery, And Daily Loop

- Whether battle HP persists exactly after combat.
- Whether defeated warriors can attack or only defend after recovery.
- Free recovery vs paid healing vs timed healing.
- Daily attack reset timing.
- Attack stacking cap.
- Whether training sessions share the same reset model.

Target doc: `docs/daily-loop-and-recovery.md`.

## Useful BloodArena Source Material To Mine

- Warrior/race tendencies.
- Original item classes and subclasses.
- Example battle/training logs.
- Original market unlock rhythm.
- Salary, reset, and attack stacking behavior.
- Tournament, fame, seasons, and special attributes are later inspiration, not MVP 0 requirements.

## Next Session Suggested Order

1. Define `docs/stats-and-formulas.md` against the source-derived catalog scale.
2. Define MVP economy and progression values that fit the source-derived catalog.
3. Revisit `docs/mvp-0-vertical-slice.md` after formulas and economy are defined.
4. Only then create the app skeleton and combat engine tests.
