import { createWarriorFromTemplate, getWarriorTemplateForRaceAtExactLordLevel } from "../src/combat/catalog.ts";
import { writeFile } from "../src/combat/export.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import type { Race, ScenarioAggregate, ScenarioDefinition } from "../src/combat/types.ts";

const RACES: Race[] = ["Human", "Orc", "Elf", "Dwarf", "Goblin"];
const HATRED_EDGES: Array<{ favored: Race; hated: Race }> = [
  { favored: "Elf", hated: "Dwarf" },
  { favored: "Dwarf", hated: "Orc" },
  { favored: "Orc", hated: "Human" },
  { favored: "Human", hated: "Goblin" },
  { favored: "Goblin", hated: "Elf" },
];

interface HatredThresholds {
  favoredPointRateThreshold: number;
  averageFavoredPointRateThreshold: number;
  maxAllowedFailures: number;
}

interface HatredMatchupRow {
  lordLevel: number;
  favoredRace: Race;
  hatedRace: Race;
  favoredUnlockLevel: number;
  hatedUnlockLevel: number;
  favoredClass: string;
  hatedClass: string;
  favoredPointRate: number;
  forwardAttackerWinRate: number;
  reverseDefenderWinRate: number;
  drawRate: number;
  failed: boolean;
}

interface HatredModelSummary {
  modelCode: string;
  comparableLordLevels: number[];
  matchupCount: number;
  averageFavoredPointRate: number;
  minFavoredPointRate: number;
  failedMatchups: number;
  flags: string[];
  details: HatredMatchupRow[];
}

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

function parseNumberArg(value: string | boolean | undefined, fallback: number): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }

  return stringValue;
}

function csvRow(values: Array<string | number>): string {
  return values.map((value) => escapeCsvValue(value)).join(",");
}

function buildComparableLordLevels(): number[] {
  return [1, 2, 4];
}

function buildDuelScenario(attackerRace: Race, defenderRace: Race, lordLevel: number): ScenarioDefinition {
  const attackerTemplate = getWarriorTemplateForRaceAtExactLordLevel(attackerRace, lordLevel);
  const defenderTemplate = getWarriorTemplateForRaceAtExactLordLevel(defenderRace, lordLevel);

  return {
    id: `hatred-l${lordLevel}-${attackerRace.toLowerCase()}-vs-${defenderRace.toLowerCase()}`,
    description: `Hatred-cycle duel at lord level ${lordLevel}: ${attackerTemplate.className} versus ${defenderTemplate.className}.`,
    attacker: {
      lordId: `lord-${attackerRace.toLowerCase()}-l${lordLevel}`,
      lordName: `Lord ${attackerRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(attackerTemplate, "a1", attackerTemplate.className)],
    },
    defender: {
      lordId: `lord-${defenderRace.toLowerCase()}-l${lordLevel}`,
      lordName: `Lord ${defenderRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(defenderTemplate, "d1", defenderTemplate.className)],
    },
  };
}

function buildThresholds(args: Record<string, string | boolean>): HatredThresholds {
  return {
    favoredPointRateThreshold: parseNumberArg(args["matchup-threshold"], 0.5),
    averageFavoredPointRateThreshold: parseNumberArg(args["average-threshold"], 0.53),
    maxAllowedFailures: parseNumberArg(args["max-failures"], 2),
  };
}

function formatSummaryCsv(rows: HatredModelSummary[]): string {
  const header = csvRow([
    "modelCode",
    "matchupCount",
    "averageFavoredPointRate",
    "minFavoredPointRate",
    "failedMatchups",
    "flags",
  ]);

  const body = rows.map((row) =>
    csvRow([
      row.modelCode,
      row.matchupCount,
      row.averageFavoredPointRate,
      row.minFavoredPointRate,
      row.failedMatchups,
      row.flags.join(";"),
    ]),
  );

  return [header, ...body].join("\n");
}

const args = parseArgs(process.argv.slice(2));
const seedCount = Number(args.seeds ?? 1000);
const seedStart = Number(args.start ?? 1);
const json = Boolean(args.json);
const write = Boolean(args.write);
const thresholds = buildThresholds(args);
const seeds = buildSeedList(seedCount, seedStart);
const comparableLordLevels = buildComparableLordLevels();

const summaries: HatredModelSummary[] = ALL_MODEL_CODES.map((modelCode) => {
  const details: HatredMatchupRow[] = [];

  for (const lordLevel of comparableLordLevels) {
    for (const edge of HATRED_EDGES) {
      const forwardScenario = buildDuelScenario(edge.favored, edge.hated, lordLevel);
      const reverseScenario = buildDuelScenario(edge.hated, edge.favored, lordLevel);
      const forward = aggregateScenarioRuns(forwardScenario, modelCode, seeds);
      const reverse = aggregateScenarioRuns(reverseScenario, modelCode, seeds);

      const favoredTemplate = getWarriorTemplateForRaceAtExactLordLevel(edge.favored, lordLevel);
      const hatedTemplate = getWarriorTemplateForRaceAtExactLordLevel(edge.hated, lordLevel);
      const favoredPoints = forward.attackerWins + reverse.defenderWins + 0.5 * (forward.draws + reverse.draws);
      const favoredPointRate = favoredPoints / (forward.runs + reverse.runs);
      const drawRate = (forward.draws + reverse.draws) / (forward.runs + reverse.runs);

      details.push({
        lordLevel,
        favoredRace: edge.favored,
        hatedRace: edge.hated,
        favoredUnlockLevel: favoredTemplate.unlockLordLevel,
        hatedUnlockLevel: hatedTemplate.unlockLordLevel,
        favoredClass: favoredTemplate.className,
        hatedClass: hatedTemplate.className,
        favoredPointRate,
        forwardAttackerWinRate: forward.attackerWins / forward.runs,
        reverseDefenderWinRate: reverse.defenderWins / reverse.runs,
        drawRate,
        failed: favoredPointRate <= thresholds.favoredPointRateThreshold,
      });
    }
  }

  const averageFavoredPointRate = average(details.map((detail) => detail.favoredPointRate));
  const minFavoredPointRate = Math.min(...details.map((detail) => detail.favoredPointRate));
  const failedMatchups = details.filter((detail) => detail.failed).length;
  const flags: string[] = [];
  if (averageFavoredPointRate < thresholds.averageFavoredPointRateThreshold) {
    flags.push("hatred-cycle-weak-average");
  }
  if (failedMatchups > thresholds.maxAllowedFailures) {
    flags.push("hatred-cycle-broken-matchups");
  }

  return {
    modelCode,
    comparableLordLevels,
    matchupCount: details.length,
    averageFavoredPointRate,
    minFavoredPointRate,
    failedMatchups,
    flags,
    details,
  };
}).sort((left, right) => {
  if (right.failedMatchups !== left.failedMatchups) {
    return right.failedMatchups - left.failedMatchups;
  }
  return left.averageFavoredPointRate - right.averageFavoredPointRate;
});

if (write) {
  const baseName = `hatred-cycle-${seedCount}runs`;
  await writeFile(
    `simulation-results/${baseName}.json`,
    JSON.stringify(
      {
        config: { seedCount, seedStart, thresholds, comparableLordLevels },
        summaries,
      },
      null,
      2,
    ),
  );
  await writeFile(`simulation-results/${baseName}.csv`, formatSummaryCsv(summaries));
}

if (json) {
  console.log(JSON.stringify({ config: { seedCount, seedStart, thresholds, comparableLordLevels }, summaries }, null, 2));
} else {
  console.log(`Hatred cycle analysis`);
  console.log(`seeds=${seedCount} start=${seedStart}`);
  console.log(`comparableLordLevels=${comparableLordLevels.join(", ")}`);
  console.log(`thresholds=${JSON.stringify(thresholds)}`);
  console.log("\nModel summary:");
  console.table(
    summaries.map((summary) => ({
      model: summary.modelCode,
      failedMatchups: summary.failedMatchups,
      averageFavoredPointRate: Number(summary.averageFavoredPointRate.toFixed(3)),
      minFavoredPointRate: Number(summary.minFavoredPointRate.toFixed(3)),
      flags: summary.flags.join(", "),
    })),
  );

  const worst = summaries[0];
  if (worst) {
    console.log(`\nWorst model matchup details: ${worst.modelCode}`);
    console.table(
      worst.details
        .slice()
        .sort((left, right) => left.favoredPointRate - right.favoredPointRate)
        .map((detail) => ({
          lordLevel: detail.lordLevel,
          matchup: `${detail.favoredRace} > ${detail.hatedRace}`,
          favoredUnlockLevel: detail.favoredUnlockLevel,
          hatedUnlockLevel: detail.hatedUnlockLevel,
          favoredClass: detail.favoredClass,
          hatedClass: detail.hatedClass,
          favoredPointRate: Number(detail.favoredPointRate.toFixed(3)),
          forwardAttackerWinRate: Number(detail.forwardAttackerWinRate.toFixed(3)),
          reverseDefenderWinRate: Number(detail.reverseDefenderWinRate.toFixed(3)),
          drawRate: Number(detail.drawRate.toFixed(3)),
          failed: detail.failed,
        })),
    );
  }

  if (write) {
    console.log(`Saved files under simulation-results/hatred-cycle-${seedCount}runs.*`);
  }
}
