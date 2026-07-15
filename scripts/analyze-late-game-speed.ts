import { writeFile } from "../src/combat/export.ts";
import {
  getHighestDefenseUnlockedTemplateAtLordLevel,
  WARRIOR_CATALOG,
} from "../src/combat/catalog.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import { buildCatalogClassDuelScenario } from "../src/combat/scenarios/index.ts";
import type { ScenarioDefinition } from "../src/combat/types.ts";

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

function buildSpeedStressScenarios(minLevel: number, topCount: number): { mirrors: ScenarioDefinition[]; pressure: ScenarioDefinition[] } {
  const fastTemplates = [...WARRIOR_CATALOG]
    .filter((templateEntry) => templateEntry.unlockLordLevel >= minLevel)
    .sort((left, right) => {
      if (right.stats.speed !== left.stats.speed) {
        return right.stats.speed - left.stats.speed;
      }
      return right.unlockLordLevel - left.unlockLordLevel;
    })
    .slice(0, topCount);

  const mirrors = fastTemplates.map((templateEntry) =>
    buildCatalogClassDuelScenario(templateEntry.className, templateEntry.className),
  );

  const pressure = fastTemplates.map((templateEntry) => {
    const tankTemplate = [...WARRIOR_CATALOG]
      .filter((candidate) => candidate.unlockLordLevel <= templateEntry.unlockLordLevel && candidate.className !== templateEntry.className)
      .sort((left, right) => {
        if (right.stats.defense !== left.stats.defense) {
          return right.stats.defense - left.stats.defense;
        }
        if (right.stats.hp !== left.stats.hp) {
          return right.stats.hp - left.stats.hp;
        }
        return right.unlockLordLevel - left.unlockLordLevel;
      })[0] ?? getHighestDefenseUnlockedTemplateAtLordLevel(templateEntry.unlockLordLevel);

    return buildCatalogClassDuelScenario(templateEntry.className, tankTemplate.className);
  });

  return { mirrors, pressure };
}

interface SpeedAnalysisRow {
  modelCode: string;
  scenarioCount: number;
  mirrorCount: number;
  pressureCount: number;
  averageActions: number;
  averageDrawRate: number;
  averageRepeatTurnRate: number;
  averageFullAbsorptionRate: number;
  averageDamagePerLandedHit: number;
  averageHighestSingleHit: number;
  averageFirstDefeatAction: number;
  averageMaxActorStreak: number;
  averageTargetFocus: number;
  mirrorAttackerBias: number;
  pressureAttackerWinRate: number;
  speedPressureScore: number;
}

const args = parseArgs(process.argv.slice(2));
const minLevel = Number(args["min-level"] ?? 20);
const topCount = Number(args.top ?? 6);
const seedCount = Number(args.seeds ?? 1000);
const seedStart = Number(args.start ?? 1);
const json = Boolean(args.json);
const write = Boolean(args.write);
const seeds = buildSeedList(seedCount, seedStart);

const { mirrors, pressure } = buildSpeedStressScenarios(minLevel, topCount);
const scenarioEntries = [
  ...mirrors.map((scenario) => ({ scenario, kind: "mirror" as const })),
  ...pressure.map((scenario) => ({ scenario, kind: "pressure" as const })),
];

const perModelScenarioResults = ALL_MODEL_CODES.map((modelCode) => {
  const aggregates = scenarioEntries.map((entry) => ({
    kind: entry.kind,
    aggregate: aggregateScenarioRuns(entry.scenario, modelCode, seeds),
  }));

  const mirrorAggregates = aggregates.filter((entry) => entry.kind === "mirror").map((entry) => entry.aggregate);
  const pressureAggregates = aggregates.filter((entry) => entry.kind === "pressure").map((entry) => entry.aggregate);
  const allAggregates = aggregates.map((entry) => entry.aggregate);

  const mirrorAttackerBias = average(
    mirrorAggregates.map((aggregate) => Math.abs(aggregate.attackerWins - aggregate.defenderWins) / aggregate.runs),
  );

  const pressureAttackerWinRate = average(
    pressureAggregates.map((aggregate) => aggregate.attackerWins / aggregate.runs),
  );

  const row: SpeedAnalysisRow = {
    modelCode,
    scenarioCount: allAggregates.length,
    mirrorCount: mirrorAggregates.length,
    pressureCount: pressureAggregates.length,
    averageActions: average(allAggregates.map((aggregate) => aggregate.averageActions)),
    averageDrawRate: average(allAggregates.map((aggregate) => aggregate.draws / aggregate.runs)),
    averageRepeatTurnRate: average(allAggregates.map((aggregate) => aggregate.repeatTurnRate)),
    averageFullAbsorptionRate: average(allAggregates.map((aggregate) => aggregate.fullAbsorptionRate)),
    averageDamagePerLandedHit: average(allAggregates.map((aggregate) => aggregate.averageDamagePerLandedHit)),
    averageHighestSingleHit: average(allAggregates.map((aggregate) => aggregate.averageHighestSingleHit)),
    averageFirstDefeatAction: average(allAggregates.map((aggregate) => aggregate.firstDefeatActionAverage)),
    averageMaxActorStreak: average(allAggregates.map((aggregate) => aggregate.maxActorStreakAverage)),
    averageTargetFocus: average(
      allAggregates.map((aggregate) => (aggregate.attackerTargetFocusAverage + aggregate.defenderTargetFocusAverage) / 2),
    ),
    mirrorAttackerBias,
    pressureAttackerWinRate,
    speedPressureScore: average(allAggregates.map((aggregate) => aggregate.repeatTurnRate * aggregate.averageActions)),
  };

  return {
    row,
    scenarioResults: aggregates,
  };
}).sort((left, right) => {
  if (right.row.speedPressureScore !== left.row.speedPressureScore) {
    return right.row.speedPressureScore - left.row.speedPressureScore;
  }
  return right.row.averageRepeatTurnRate - left.row.averageRepeatTurnRate;
});

const rows = perModelScenarioResults.map((entry) => entry.row);

function formatAnalysisCsv(entries: SpeedAnalysisRow[]): string {
  const header = csvRow([
    "modelCode",
    "scenarioCount",
    "mirrorCount",
    "pressureCount",
    "averageActions",
    "averageDrawRate",
    "averageRepeatTurnRate",
    "averageFullAbsorptionRate",
    "averageDamagePerLandedHit",
    "averageHighestSingleHit",
    "averageFirstDefeatAction",
    "averageMaxActorStreak",
    "averageTargetFocus",
    "mirrorAttackerBias",
    "pressureAttackerWinRate",
    "speedPressureScore",
  ]);

  const body = entries.map((entry) =>
    csvRow([
      entry.modelCode,
      entry.scenarioCount,
      entry.mirrorCount,
      entry.pressureCount,
      entry.averageActions,
      entry.averageDrawRate,
      entry.averageRepeatTurnRate,
      entry.averageFullAbsorptionRate,
      entry.averageDamagePerLandedHit,
      entry.averageHighestSingleHit,
      entry.averageFirstDefeatAction,
      entry.averageMaxActorStreak,
      entry.averageTargetFocus,
      entry.mirrorAttackerBias,
      entry.pressureAttackerWinRate,
      entry.speedPressureScore,
    ]),
  );

  return [header, ...body].join("\n");
}

if (write) {
  const baseName = `late-game-speed-l${minLevel}-top${topCount}-${seedCount}runs`;
  await writeFile(
    `simulation-results/${baseName}.json`,
    JSON.stringify(
      {
        config: { minLevel, topCount, seedCount, seedStart },
        mirrorScenarios: mirrors,
        pressureScenarios: pressure,
        rows,
        scenarioResults: perModelScenarioResults,
      },
      null,
      2,
    ),
  );
  await writeFile(`simulation-results/${baseName}.csv`, formatAnalysisCsv(rows));
}

if (json) {
  console.log(
    JSON.stringify(
      {
        config: { minLevel, topCount, seedCount, seedStart },
        mirrorScenarios: mirrors.map((scenario) => scenario.id),
        pressureScenarios: pressure.map((scenario) => scenario.id),
        rows,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Late-game speed stress analysis`);
  console.log(`minLevel=${minLevel} topCount=${topCount} seeds=${seedCount} start=${seedStart}`);
  console.log("\nMirror scenarios:");
  for (const scenario of mirrors) {
    console.log(`- ${scenario.id}: ${scenario.description}`);
  }
  console.log("\nPressure scenarios:");
  for (const scenario of pressure) {
    console.log(`- ${scenario.id}: ${scenario.description}`);
  }
  console.log("\nRanked models:");
  console.table(
    rows.map((entry) => ({
      model: entry.modelCode,
      avgActions: Number(entry.averageActions.toFixed(2)),
      avgDrawRate: Number(entry.averageDrawRate.toFixed(3)),
      avgRepeatTurnRate: Number(entry.averageRepeatTurnRate.toFixed(3)),
      avgFullAbsorptionRate: Number(entry.averageFullAbsorptionRate.toFixed(3)),
      avgDamagePerHit: Number(entry.averageDamagePerLandedHit.toFixed(2)),
      avgHighestHit: Number(entry.averageHighestSingleHit.toFixed(2)),
      avgFirstDefeatAction: Number(entry.averageFirstDefeatAction.toFixed(2)),
      avgMaxActorStreak: Number(entry.averageMaxActorStreak.toFixed(2)),
      avgTargetFocus: Number(entry.averageTargetFocus.toFixed(3)),
      mirrorAttackerBias: Number(entry.mirrorAttackerBias.toFixed(3)),
      pressureAttackerWinRate: Number(entry.pressureAttackerWinRate.toFixed(3)),
      speedPressureScore: Number(entry.speedPressureScore.toFixed(3)),
    })),
  );

  if (write) {
    console.log(`Saved files under simulation-results/late-game-speed-l${minLevel}-top${topCount}-${seedCount}runs.*`);
  }
}
