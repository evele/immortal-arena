import { createWarriorFromTemplate, getStarterTemplate, getWarriorTemplateByClassName } from "../catalog.ts";
import type { ScenarioDefinition } from "../types.ts";

function warrior(id: string, className: string, name = className) {
  return createWarriorFromTemplate(getWarriorTemplateByClassName(className), id, name);
}

export const CATALOG_SCENARIOS: ScenarioDefinition[] = [
  {
    id: "starter-human-vs-orc",
    description: "Source-derived level 1 starter duel: Human Wretch versus Wretched Orc.",
    attacker: {
      lordId: "lord-human",
      lordName: "Lord Warden",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Human"), "a1", "Human Wretch")],
    },
    defender: {
      lordId: "lord-orc",
      lordName: "Lord Gorehand",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Orc"), "d1", "Wretched Orc")],
    },
  },
  {
    id: "starter-elf-vs-dwarf",
    description: "Source-derived level 1 starter duel: Elf Slave versus Dwarf Slave, including hatred matchup.",
    attacker: {
      lordId: "lord-elf",
      lordName: "Lord Sylvan",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Elf"), "a1", "Elf Slave")],
    },
    defender: {
      lordId: "lord-dwarf",
      lordName: "Lord Granite",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Dwarf"), "d1", "Dwarf Slave")],
    },
  },
  {
    id: "starter-goblin-vs-human",
    description: "Source-derived level 1 starter duel: Scrawny Goblin versus Human Wretch, including Human hatred if the sides flip later.",
    attacker: {
      lordId: "lord-goblin",
      lordName: "Lord Slink",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Goblin"), "a1", "Scrawny Goblin")],
    },
    defender: {
      lordId: "lord-human",
      lordName: "Lord Warden",
      level: 1,
      warriors: [createWarriorFromTemplate(getStarterTemplate("Human"), "d1", "Human Wretch")],
    },
  },
  {
    id: "starter-five-race-skirmish",
    description: "Source-derived multi-warrior starter battle using one level 1 warrior from each MVP race.",
    attacker: {
      lordId: "lord-alliance",
      lordName: "Lord Alliance",
      level: 1,
      warriors: [
        createWarriorFromTemplate(getStarterTemplate("Human"), "a1", "Human Wretch"),
        createWarriorFromTemplate(getStarterTemplate("Elf"), "a2", "Elf Slave"),
        createWarriorFromTemplate(getStarterTemplate("Dwarf"), "a3", "Dwarf Slave"),
      ],
    },
    defender: {
      lordId: "lord-horde",
      lordName: "Lord Horde",
      level: 1,
      warriors: [
        createWarriorFromTemplate(getStarterTemplate("Orc"), "d1", "Wretched Orc"),
        createWarriorFromTemplate(getStarterTemplate("Goblin"), "d2", "Scrawny Goblin"),
      ],
    },
  },
  {
    id: "tier2-human-vs-orc",
    description: "Source-derived level 2 duel: Human Peasant versus Swamp Orc.",
    attacker: {
      lordId: "lord-human-tier2",
      lordName: "Lord Farmhold",
      level: 2,
      warriors: [warrior("a1", "Human Peasant")],
    },
    defender: {
      lordId: "lord-orc-tier2",
      lordName: "Lord Marshfang",
      level: 2,
      warriors: [warrior("d1", "Swamp Orc")],
    },
  },
  {
    id: "tier7-elf-vs-goblin",
    description: "Source-derived speed-focused duel: Elf Scout versus Cave Goblin.",
    attacker: {
      lordId: "lord-elf-tier7",
      lordName: "Lord Willowstep",
      level: 7,
      warriors: [warrior("a1", "Elf Scout")],
    },
    defender: {
      lordId: "lord-goblin-tier7",
      lordName: "Lord Warrensneak",
      level: 7,
      warriors: [warrior("d1", "Cave Goblin")],
    },
  },
  {
    id: "tier12-human-vs-orc",
    description: "Source-derived midgame duel: Man At Arms versus Orc Fighter.",
    attacker: {
      lordId: "lord-human-tier12",
      lordName: "Lord Bastion",
      level: 12,
      warriors: [warrior("a1", "Man At Arms")],
    },
    defender: {
      lordId: "lord-orc-tier12",
      lordName: "Lord Skullbrand",
      level: 12,
      warriors: [warrior("d1", "Orc Fighter")],
    },
  },
  {
    id: "tier25-rune-elf-vs-rune-dwarf",
    description: "Source-derived hatred duel at higher stats: Rune Elf versus Rune Dwarf.",
    attacker: {
      lordId: "lord-elf-tier25",
      lordName: "Lord Starbough",
      level: 25,
      warriors: [warrior("a1", "Rune Elf")],
    },
    defender: {
      lordId: "lord-dwarf-tier25",
      lordName: "Lord Stonecrown",
      level: 25,
      warriors: [warrior("d1", "Rune Dwarf")],
    },
  },
  {
    id: "tier30-duo-clash",
    description: "Source-derived late-game 2v2 clash: Elf Ranger and Human Noble versus Black Orc and Black Goblin.",
    attacker: {
      lordId: "lord-court-tier30",
      lordName: "Lord Highcourt",
      level: 30,
      warriors: [warrior("a1", "Elf Ranger"), warrior("a2", "Human Noble")],
    },
    defender: {
      lordId: "lord-warband-tier30",
      lordName: "Lord Warband",
      level: 30,
      warriors: [warrior("d1", "Black Orc"), warrior("d2", "Black Goblin")],
    },
  },
  {
    id: "tier45-lord-warband",
    description: "Source-derived lord-tier warband fight: Elf Lord, Human Assassin, and Dwarf Lord versus Orc Warlord and Goblin Lord.",
    attacker: {
      lordId: "lord-citadel-tier45",
      lordName: "Lord Citadel",
      level: 50,
      warriors: [warrior("a1", "Elf Lord"), warrior("a2", "Human Assassin"), warrior("a3", "Dwarf Lord")],
    },
    defender: {
      lordId: "lord-dominion-tier45",
      lordName: "Lord Dominion",
      level: 50,
      warriors: [warrior("d1", "Orc Warlord"), warrior("d2", "Goblin Lord")],
    },
  },
  {
    id: "tier55-dwarf-berserker-gauntlet",
    description: "Source-derived extreme durability test: Dwarf Berserker versus Orc Warlord and Black Goblin.",
    attacker: {
      lordId: "lord-dwarf-tier55",
      lordName: "Lord Anvil",
      level: 55,
      warriors: [warrior("a1", "Dwarf Berserker")],
    },
    defender: {
      lordId: "lord-raiders-tier55",
      lordName: "Lord Raiders",
      level: 55,
      warriors: [warrior("d1", "Orc Warlord"), warrior("d2", "Black Goblin")],
    },
  },
];
