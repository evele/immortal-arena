import {
  createWarriorFromTemplate,
  getWarriorTemplateForRaceAtExactLordLevel,
  getWarriorTemplateForRaceAtTierIndex,
} from "../src/combat/catalog.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import type { ModelCode, Race, ScenarioDefinition } from "../src/combat/types.ts";

const RACES: Race[] = ["Elf", "Dwarf", "Orc", "Human", "Goblin"];
const LORD_LEVELS = [1, 2, 4];
const TIER_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8];
const LEVEL_GROUPS: Array<{ id: string; levels: Record<Race, number> }> = [
  { id: "1/1/1/1/1", levels: { Elf: 1, Dwarf: 1, Orc: 1, Human: 1, Goblin: 1 } },
  { id: "2/2/2/2/2", levels: { Elf: 2, Dwarf: 2, Orc: 2, Human: 2, Goblin: 2 } },
  { id: "4/4/4/4/4", levels: { Elf: 4, Dwarf: 4, Orc: 4, Human: 4, Goblin: 4 } },
  { id: "7/8/7/7/7", levels: { Elf: 7, Dwarf: 8, Orc: 7, Human: 7, Goblin: 7 } },
  { id: "12/14/12/12/12", levels: { Elf: 12, Dwarf: 14, Orc: 12, Human: 12, Goblin: 12 } },
  { id: "20/25/20/20/20", levels: { Elf: 20, Dwarf: 25, Orc: 20, Human: 20, Goblin: 20 } },
  { id: "30/35/30/30/30", levels: { Elf: 30, Dwarf: 35, Orc: 30, Human: 30, Goblin: 30 } },
  { id: "45/55/45/50/45", levels: { Elf: 45, Dwarf: 55, Orc: 45, Human: 50, Goblin: 45 } },
];

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]!;
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildExactLevelDuelScenario(attackerRace: Race, defenderRace: Race, lordLevel: number): ScenarioDefinition {
  return buildDuelScenario(
    attackerRace,
    defenderRace,
    `l${lordLevel}`,
    getWarriorTemplateForRaceAtExactLordLevel(attackerRace, lordLevel),
    getWarriorTemplateForRaceAtExactLordLevel(defenderRace, lordLevel),
  );
}

function buildTierDuelScenario(attackerRace: Race, defenderRace: Race, tierIndex: number): ScenarioDefinition {
  return buildDuelScenario(
    attackerRace,
    defenderRace,
    `t${tierIndex}`,
    getWarriorTemplateForRaceAtTierIndex(attackerRace, tierIndex),
    getWarriorTemplateForRaceAtTierIndex(defenderRace, tierIndex),
  );
}

function buildGroupedDuelScenario(attackerRace: Race, defenderRace: Race, group: (typeof LEVEL_GROUPS)[number]): ScenarioDefinition {
  return buildDuelScenario(
    attackerRace,
    defenderRace,
    `g${group.id}`,
    getWarriorTemplateForRaceAtExactLordLevel(attackerRace, group.levels[attackerRace]),
    getWarriorTemplateForRaceAtExactLordLevel(defenderRace, group.levels[defenderRace]),
  );
}

function buildDuelScenario(
  attackerRace: Race,
  defenderRace: Race,
  bucketId: string,
  attackerTemplate: ReturnType<typeof getWarriorTemplateForRaceAtExactLordLevel>,
  defenderTemplate: ReturnType<typeof getWarriorTemplateForRaceAtExactLordLevel>,
): ScenarioDefinition {
  const lordLevel = Math.max(attackerTemplate.unlockLordLevel, defenderTemplate.unlockLordLevel);

  return {
    id: `race-matchup-${bucketId}-${attackerRace.toLowerCase()}-vs-${defenderRace.toLowerCase()}`,
    description: `Race matchup ${bucketId}: ${attackerTemplate.className} versus ${defenderTemplate.className}.`,
    attacker: {
      lordId: `race-${attackerRace.toLowerCase()}-l${lordLevel}`,
      lordName: `Lord ${attackerRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(attackerTemplate, "a1", attackerTemplate.className)],
    },
    defender: {
      lordId: `race-${defenderRace.toLowerCase()}-l${lordLevel}`,
      lordName: `Lord ${defenderRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(defenderTemplate, "d1", defenderTemplate.className)],
    },
  };
}

const args = parseArgs(process.argv.slice(2));
const seedCount = Number(args.seeds ?? 100);
const seedStart = Number(args.start ?? 1);
const modelFilter = typeof args.model === "string" ? args.model : undefined;
const mode = args.mode === "tier" ? "tier" : args.mode === "group" ? "group" : "level";
const summaryOnly = Boolean(args["summary-only"]);
const limit = Number(args.limit ?? (modelFilter ? 1 : 8));
const seeds = buildSeedList(seedCount, seedStart);
const modelCodes = modelFilter ? [modelFilter as ModelCode] : ALL_MODEL_CODES;
const buckets = mode === "tier" ? TIER_INDEXES : mode === "group" ? LEVEL_GROUPS : LORD_LEVELS;
const bucketLabel = mode === "tier" ? "tier" : mode === "group" ? "group" : "level";

const summaries = modelCodes.map((modelCode) => {
  const racePointRates = new Map<Race, number[]>();
  const matchupRows: Array<{ bucket: string | number; race: Race; opponent: Race; pointRate: number }> = [];

  for (const race of RACES) {
    racePointRates.set(race, []);
  }

  for (const bucket of buckets) {
    const bucketId = typeof bucket === "number" ? bucket : bucket.id;
    for (let leftIndex = 0; leftIndex < RACES.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < RACES.length; rightIndex += 1) {
        const leftRace = RACES[leftIndex]!;
        const rightRace = RACES[rightIndex]!;
        const leftForward = aggregateScenarioRuns(
          mode === "tier"
            ? buildTierDuelScenario(leftRace, rightRace, bucket as number)
            : mode === "group"
              ? buildGroupedDuelScenario(leftRace, rightRace, bucket as (typeof LEVEL_GROUPS)[number])
              : buildExactLevelDuelScenario(leftRace, rightRace, bucket as number),
          modelCode,
          seeds,
        );
        const rightForward = aggregateScenarioRuns(
          mode === "tier"
            ? buildTierDuelScenario(rightRace, leftRace, bucket as number)
            : mode === "group"
              ? buildGroupedDuelScenario(rightRace, leftRace, bucket as (typeof LEVEL_GROUPS)[number])
              : buildExactLevelDuelScenario(rightRace, leftRace, bucket as number),
          modelCode,
          seeds,
        );
        const leftPoints = leftForward.attackerWins + rightForward.defenderWins + 0.5 * (leftForward.draws + rightForward.draws);
        const leftPointRate = leftPoints / (leftForward.runs + rightForward.runs);
        const rightPointRate = 1 - leftPointRate;

        racePointRates.get(leftRace)!.push(leftPointRate);
        racePointRates.get(rightRace)!.push(rightPointRate);
        matchupRows.push({ bucket: bucketId, race: leftRace, opponent: rightRace, pointRate: leftPointRate });
        matchupRows.push({ bucket: bucketId, race: rightRace, opponent: leftRace, pointRate: rightPointRate });
      }
    }
  }

  const raceSummaries = RACES.map((race) => {
    const rates = racePointRates.get(race)!;
    return {
      race,
      averagePointRate: average(rates),
      minPointRate: Math.min(...rates),
      maxPointRate: Math.max(...rates),
    };
  }).sort((left, right) => right.averagePointRate - left.averagePointRate);

  return {
    modelCode,
    raceSummaries,
    matchupRows,
    dominanceSpread: raceSummaries[0]!.averagePointRate - raceSummaries[raceSummaries.length - 1]!.averagePointRate,
  };
}).sort((left, right) => left.dominanceSpread - right.dominanceSpread);

console.log(`Race all-vs-all analysis`);
console.log(`${bucketLabel}s=${buckets.map((bucket) => (typeof bucket === "number" ? bucket : bucket.id)).join(", ")} seeds=${seedCount} start=${seedStart}`);

for (const summary of summaries.slice(0, limit)) {
  console.log(`\nModel: ${summary.modelCode} dominanceSpread=${summary.dominanceSpread.toFixed(3)}`);
  console.table(
    summary.raceSummaries.map((entry) => ({
      race: entry.race,
      avgPointRate: Number(entry.averagePointRate.toFixed(3)),
      minPointRate: Number(entry.minPointRate.toFixed(3)),
      maxPointRate: Number(entry.maxPointRate.toFixed(3)),
    })),
  );
  if (!summaryOnly) {
    console.table(
      summary.matchupRows
        .filter((entry) => entry.pointRate < 0.25 || entry.pointRate > 0.75)
        .sort((left, right) => String(left.bucket).localeCompare(String(right.bucket)) || left.race.localeCompare(right.race))
        .map((entry) => ({
          [bucketLabel]: entry.bucket,
          matchup: `${entry.race} vs ${entry.opponent}`,
          pointRate: Number(entry.pointRate.toFixed(3)),
        })),
    );
  }
}
