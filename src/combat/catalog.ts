import type { Race, StatLine, WarriorSnapshot, WarriorTemplate } from "./types.ts";

function stats(hp: number, damage: number, defense: number, accuracy: number, agility: number, speed: number): StatLine {
  return { hp, damage, defense, accuracy, agility, speed };
}

function template(
  id: string,
  race: Race,
  className: string,
  unlockLordLevel: number,
  cost: number,
  warriorStats: StatLine,
): WarriorTemplate {
  return {
    id,
    race,
    className,
    unlockLordLevel,
    cost,
    stats: warriorStats,
  };
}

export const WARRIOR_CATALOG: WarriorTemplate[] = [
  template("elf-slave", "Elf", "Elf Slave", 1, 630, stats(12, 4, 2, 4, 4, 4)),
  template("scrawny-goblin", "Goblin", "Scrawny Goblin", 1, 660, stats(12, 3, 2, 3, 4, 7)),
  template("human-wretch", "Human", "Human Wretch", 1, 720, stats(20, 4, 4, 5, 3, 3)),
  template("wretched-orc", "Orc", "Wretched Orc", 1, 630, stats(20, 8, 2, 2, 2, 2)),
  template("dwarf-slave", "Dwarf", "Dwarf Slave", 1, 630, stats(16, 4, 5, 3, 3, 2)),
  template("minor-elf", "Elf", "Minor Elf", 2, 930, stats(16, 6, 3, 4, 8, 6)),
  template("swamp-goblin", "Goblin", "Swamp Goblin", 2, 930, stats(16, 4, 4, 4, 5, 10)),
  template("human-peasant", "Human", "Human Peasant", 2, 900, stats(24, 5, 4, 7, 4, 4)),
  template("swamp-orc", "Orc", "Swamp Orc", 2, 930, stats(24, 12, 3, 3, 4, 3)),
  template("dwarf-drunkard", "Dwarf", "Dwarf Drunkard", 2, 900, stats(32, 6, 6, 4, 3, 3)),
  template("wood-elf", "Elf", "Wood Elf", 4, 1590, stats(32, 9, 6, 6, 14, 10)),
  template("tunnel-goblin", "Goblin", "Tunnel Goblin", 4, 1530, stats(16, 6, 4, 7, 10, 20)),
  template("human-thug", "Human", "Human Thug", 4, 1560, stats(44, 8, 8, 9, 8, 8)),
  template("orc-bruiser", "Orc", "Orc Bruiser", 4, 1530, stats(44, 18, 6, 6, 6, 4)),
  template("dwarf-miner", "Dwarf", "Dwarf Miner", 4, 1530, stats(44, 11, 9, 8, 6, 6)),
  template("elf-scout", "Elf", "Elf Scout", 7, 2400, stats(44, 15, 9, 10, 20, 15)),
  template("cave-goblin", "Goblin", "Cave Goblin", 7, 2400, stats(32, 10, 7, 12, 16, 27)),
  template("human-fighter", "Human", "Human Fighter", 7, 2430, stats(60, 12, 12, 18, 11, 13)),
  template("orc-thug", "Orc", "Orc Thug", 7, 2370, stats(64, 34, 8, 7, 7, 7)),
  template("dwarf-fighter", "Dwarf", "Dwarf Fighter", 8, 2670, stats(84, 17, 17, 15, 10, 9)),
  template("elf-warrior", "Elf", "Elf Warrior", 12, 4110, stats(76, 20, 14, 19, 41, 24)),
  template("dark-goblin", "Goblin", "Dark Goblin", 12, 3990, stats(56, 15, 13, 21, 25, 45)),
  template("man-at-arms", "Human", "Man At Arms", 12, 3990, stats(104, 20, 19, 26, 22, 20)),
  template("orc-fighter", "Orc", "Orc Fighter", 12, 3930, stats(108, 52, 12, 12, 15, 13)),
  template("dwarf-defender", "Dwarf", "Dwarf Defender", 14, 4470, stats(156, 32, 28, 22, 14, 14)),
  template("rune-elf", "Elf", "Rune Elf", 20, 6360, stats(132, 31, 21, 23, 53, 49)),
  template("rune-goblin", "Goblin", "Rune Goblin", 20, 6360, stats(88, 23, 20, 30, 44, 73)),
  template("human-knight", "Human", "Human Knight", 20, 6330, stats(168, 33, 30, 41, 33, 32)),
  template("orc-warrior", "Orc", "Orc Warrior", 20, 6330, stats(168, 82, 23, 20, 20, 24)),
  template("rune-dwarf", "Dwarf", "Rune Dwarf", 25, 7770, stats(264, 51, 52, 38, 25, 27)),
  template("elf-ranger", "Elf", "Elf Ranger", 30, 9330, stats(180, 61, 33, 33, 76, 63)),
  template("black-goblin", "Goblin", "Black Goblin", 30, 9450, stats(124, 34, 30, 49, 65, 106)),
  template("human-noble", "Human", "Human Noble", 30, 9390, stats(236, 48, 49, 63, 47, 47)),
  template("black-orc", "Orc", "Black Orc", 30, 9330, stats(252, 124, 30, 30, 32, 32)),
  template("dwarf-lord", "Dwarf", "Dwarf Lord", 35, 10800, stats(380, 73, 73, 51, 35, 33)),
  template("elf-lord", "Elf", "Elf Lord", 45, 13770, stats(288, 75, 44, 44, 98, 126)),
  template("goblin-lord", "Goblin", "Goblin Lord", 45, 13890, stats(188, 50, 44, 67, 93, 162)),
  template("orc-warlord", "Orc", "Orc Warlord", 45, 13770, stats(364, 187, 43, 44, 47, 47)),
  template("human-assassin", "Human", "Human Assassin", 50, 15450, stats(396, 80, 75, 105, 80, 76)),
  template("dwarf-berserker", "Dwarf", "Dwarf Berserker", 55, 16800, stats(564, 110, 114, 85, 53, 57)),
];

export const STARTER_WARRIOR_LIST = WARRIOR_CATALOG.filter((templateEntry) => templateEntry.unlockLordLevel === 1);

export const STARTER_WARRIOR_TEMPLATES: Record<Race, WarriorTemplate> = {
  Elf: getWarriorTemplateByClassName("Elf Slave"),
  Goblin: getWarriorTemplateByClassName("Scrawny Goblin"),
  Human: getWarriorTemplateByClassName("Human Wretch"),
  Orc: getWarriorTemplateByClassName("Wretched Orc"),
  Dwarf: getWarriorTemplateByClassName("Dwarf Slave"),
};

export function getStarterTemplate(race: Race): WarriorTemplate {
  return STARTER_WARRIOR_TEMPLATES[race];
}

export function getWarriorTemplateById(id: string): WarriorTemplate {
  const templateEntry = WARRIOR_CATALOG.find((candidate) => candidate.id === id);
  if (!templateEntry) {
    throw new Error(`Unknown warrior template id: ${id}`);
  }

  return templateEntry;
}

export function getWarriorTemplateByClassName(className: string): WarriorTemplate {
  const templateEntry = WARRIOR_CATALOG.find((candidate) => candidate.className === className);
  if (!templateEntry) {
    throw new Error(`Unknown warrior template class name: ${className}`);
  }

  return templateEntry;
}

export function getWarriorTemplatesForRace(race: Race): WarriorTemplate[] {
  return WARRIOR_CATALOG.filter((templateEntry) => templateEntry.race === race).sort((left, right) => {
    if (left.unlockLordLevel !== right.unlockLordLevel) {
      return left.unlockLordLevel - right.unlockLordLevel;
    }
    return left.cost - right.cost;
  });
}

export function getWarriorTemplateForRaceAtTierIndex(race: Race, tierIndex: number): WarriorTemplate {
  if (!Number.isInteger(tierIndex) || tierIndex < 1) {
    throw new Error(`Invalid tier index: ${tierIndex}`);
  }

  const templates = getWarriorTemplatesForRace(race);
  const templateEntry = templates[tierIndex - 1];
  if (!templateEntry) {
    throw new Error(`No warrior template for race ${race} at tier index ${tierIndex}`);
  }

  return templateEntry;
}

export function getWarriorTemplateForRaceAtExactLordLevel(race: Race, lordLevel: number): WarriorTemplate {
  const templateEntry = WARRIOR_CATALOG.find(
    (candidate) => candidate.race === race && candidate.unlockLordLevel === lordLevel,
  );
  if (!templateEntry) {
    throw new Error(`No warrior template for race ${race} at exact lord level ${lordLevel}`);
  }

  return templateEntry;
}

export function getWarriorTemplatesUnlockedAtLordLevel(lordLevel: number): WarriorTemplate[] {
  return WARRIOR_CATALOG.filter((templateEntry) => templateEntry.unlockLordLevel <= lordLevel);
}

export function getWarriorTemplatesUnlockedForRace(race: Race, lordLevel: number): WarriorTemplate[] {
  return WARRIOR_CATALOG.filter((templateEntry) => templateEntry.race === race && templateEntry.unlockLordLevel <= lordLevel).sort(
    (left, right) => {
      if (left.unlockLordLevel !== right.unlockLordLevel) {
        return left.unlockLordLevel - right.unlockLordLevel;
      }
      return left.cost - right.cost;
    },
  );
}

export function getStrongestUnlockedTemplateForRace(race: Race, lordLevel: number): WarriorTemplate {
  const unlocked = getWarriorTemplatesUnlockedForRace(race, lordLevel);
  const strongest = unlocked[unlocked.length - 1];
  if (!strongest) {
    throw new Error(`No unlocked warrior template for race ${race} at lord level ${lordLevel}`);
  }

  return strongest;
}

export function getHighestDefenseUnlockedTemplateAtLordLevel(lordLevel: number): WarriorTemplate {
  const unlocked = getWarriorTemplatesUnlockedAtLordLevel(lordLevel);
  const sorted = [...unlocked].sort((left, right) => {
    if (right.stats.defense !== left.stats.defense) {
      return right.stats.defense - left.stats.defense;
    }
    if (right.stats.hp !== left.stats.hp) {
      return right.stats.hp - left.stats.hp;
    }
    return right.unlockLordLevel - left.unlockLordLevel;
  });
  const templateEntry = sorted[0];
  if (!templateEntry) {
    throw new Error(`No unlocked warrior templates at lord level ${lordLevel}`);
  }

  return templateEntry;
}

export function createWarriorFromTemplate(templateEntry: WarriorTemplate, id: string, name: string): WarriorSnapshot {
  return {
    id,
    name,
    race: templateEntry.race,
    stats: { ...templateEntry.stats },
  };
}
