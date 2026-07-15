import { writeFile } from "../src/combat/export.ts";
import { createWarriorFromTemplate, getWarriorTemplateForRaceAtTierIndex } from "../src/combat/catalog.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import { buildCatalogClassDuelScenario, getScenarioById } from "../src/combat/scenarios/index.ts";
import type { Race, ScenarioAggregate, ScenarioDefinition } from "../src/combat/types.ts";

const HATRED_EDGES: Array<{ favored: Race; hated: Race }> = [
  { favored: "Elf", hated: "Dwarf" },
  { favored: "Dwarf", hated: "Orc" },
  { favored: "Orc", hated: "Human" },
  { favored: "Human", hated: "Goblin" },
  { favored: "Goblin", hated: "Elf" },
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

function parseNumberArg(value: string | boolean | undefined, fallback: number): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

interface ScenarioEntry {
  key: string;
  description: string;
  scenario: ScenarioDefinition;
}

interface RedFlagThresholds {
  mirrorBiasThreshold: number;
  stallDrawRateThreshold: number;
  stallFullAbsorptionThreshold: number;
  speedRunawayRepeatRateThreshold: number;
  speedRunawayMaxStreakThreshold: number;
  focusCollapseThreshold: number;
  archetypeDominanceWinThreshold: number;
  archetypeSuppressionWinThreshold: number;
  archetypeAbsorptionThreshold: number;
  highestHitSpikeThreshold: number;
  firstDefeatRatioThreshold: number;
  lateGameDrawRateThreshold: number;
  lateGameMaxStreakThreshold: number;
  hatredCycleMatchupThreshold: number;
  hatredCycleAverageThreshold: number;
  hatredCycleMaxFailures: number;
}

const DEFAULT_THRESHOLDS: RedFlagThresholds = {
  mirrorBiasThreshold: 0.55,
  stallDrawRateThreshold: 0.95,
  stallFullAbsorptionThreshold: 0.7,
  speedRunawayRepeatRateThreshold: 0.45,
  speedRunawayMaxStreakThreshold: 4,
  focusCollapseThreshold: 0.75,
  archetypeDominanceWinThreshold: 0.75,
  archetypeSuppressionWinThreshold: 0.2,
  archetypeAbsorptionThreshold: 0.55,
  highestHitSpikeThreshold: 120,
  firstDefeatRatioThreshold: 0.6,
  lateGameDrawRateThreshold: 0.35,
  lateGameMaxStreakThreshold: 3.5,
  hatredCycleMatchupThreshold: 0.5,
  hatredCycleAverageThreshold: 0.6,
  hatredCycleMaxFailures: 3,
};

function buildThresholds(args: Record<string, string | boolean>): RedFlagThresholds {
  return {
    mirrorBiasThreshold: parseNumberArg(args["mirror-bias-threshold"], DEFAULT_THRESHOLDS.mirrorBiasThreshold),
    stallDrawRateThreshold: parseNumberArg(args["stall-draw-threshold"], DEFAULT_THRESHOLDS.stallDrawRateThreshold),
    stallFullAbsorptionThreshold: parseNumberArg(
      args["stall-absorption-threshold"],
      DEFAULT_THRESHOLDS.stallFullAbsorptionThreshold,
    ),
    speedRunawayRepeatRateThreshold: parseNumberArg(
      args["speed-repeat-threshold"],
      DEFAULT_THRESHOLDS.speedRunawayRepeatRateThreshold,
    ),
    speedRunawayMaxStreakThreshold: parseNumberArg(
      args["speed-streak-threshold"],
      DEFAULT_THRESHOLDS.speedRunawayMaxStreakThreshold,
    ),
    focusCollapseThreshold: parseNumberArg(args["focus-threshold"], DEFAULT_THRESHOLDS.focusCollapseThreshold),
    archetypeDominanceWinThreshold: parseNumberArg(
      args["dominance-win-threshold"],
      DEFAULT_THRESHOLDS.archetypeDominanceWinThreshold,
    ),
    archetypeSuppressionWinThreshold: parseNumberArg(
      args["suppression-win-threshold"],
      DEFAULT_THRESHOLDS.archetypeSuppressionWinThreshold,
    ),
    archetypeAbsorptionThreshold: parseNumberArg(
      args["archetype-absorption-threshold"],
      DEFAULT_THRESHOLDS.archetypeAbsorptionThreshold,
    ),
    highestHitSpikeThreshold: parseNumberArg(args["highest-hit-threshold"], DEFAULT_THRESHOLDS.highestHitSpikeThreshold),
    firstDefeatRatioThreshold: parseNumberArg(
      args["first-defeat-ratio-threshold"],
      DEFAULT_THRESHOLDS.firstDefeatRatioThreshold,
    ),
    lateGameDrawRateThreshold: parseNumberArg(
      args["late-game-draw-threshold"],
      DEFAULT_THRESHOLDS.lateGameDrawRateThreshold,
    ),
    lateGameMaxStreakThreshold: parseNumberArg(
      args["late-game-streak-threshold"],
      DEFAULT_THRESHOLDS.lateGameMaxStreakThreshold,
    ),
    hatredCycleMatchupThreshold: parseNumberArg(
      args["hatred-matchup-threshold"],
      DEFAULT_THRESHOLDS.hatredCycleMatchupThreshold,
    ),
    hatredCycleAverageThreshold: parseNumberArg(
      args["hatred-average-threshold"],
      DEFAULT_THRESHOLDS.hatredCycleAverageThreshold,
    ),
    hatredCycleMaxFailures: parseNumberArg(
      args["hatred-max-failures"],
      DEFAULT_THRESHOLDS.hatredCycleMaxFailures,
    ),
  };
}

function buildComparableHatredTiers(): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8];
}

function buildHatredScenario(attackerRace: Race, defenderRace: Race, tier: number): ScenarioDefinition {
  const attackerTemplate = getWarriorTemplateForRaceAtTierIndex(attackerRace, tier);
  const defenderTemplate = getWarriorTemplateForRaceAtTierIndex(defenderRace, tier);
  const lordLevel = Math.max(attackerTemplate.unlockLordLevel, defenderTemplate.unlockLordLevel);

  return {
    id: `flags-hatred-t${tier}-${attackerRace.toLowerCase()}-vs-${defenderRace.toLowerCase()}`,
    description: `Hatred-cycle validation duel at tier ${tier}: ${attackerTemplate.className} versus ${defenderTemplate.className}.`,
    attacker: {
      lordId: `flags-${attackerRace.toLowerCase()}-t${tier}`,
      lordName: `Lord ${attackerRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(attackerTemplate, "a1", attackerTemplate.className)],
    },
    defender: {
      lordId: `flags-${defenderRace.toLowerCase()}-t${tier}`,
      lordName: `Lord ${defenderRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(defenderTemplate, "d1", defenderTemplate.className)],
    },
  };
}

function summarizeHatredCycle(
  modelCode: string,
  seeds: number[],
  thresholds: RedFlagThresholds,
): HatredCycleSummary {
  const comparableTiers = buildComparableHatredTiers();
  const rates: number[] = [];
  let failedMatchups = 0;

  for (const tier of comparableTiers) {
    for (const edge of HATRED_EDGES) {
      const forward = aggregateScenarioRuns(buildHatredScenario(edge.favored, edge.hated, tier), modelCode as (typeof ALL_MODEL_CODES)[number], seeds);
      const reverse = aggregateScenarioRuns(buildHatredScenario(edge.hated, edge.favored, tier), modelCode as (typeof ALL_MODEL_CODES)[number], seeds);
      const favoredPoints = forward.attackerWins + reverse.defenderWins + 0.5 * (forward.draws + reverse.draws);
      const favoredPointRate = favoredPoints / (forward.runs + reverse.runs);
      rates.push(favoredPointRate);
      if (favoredPointRate <= thresholds.hatredCycleMatchupThreshold) {
        failedMatchups += 1;
      }
    }
  }

  return {
    averageFavoredPointRate: average(rates),
    failedMatchups,
  };
}

function requireAggregate(perScenario: Record<string, ScenarioAggregate>, key: string): ScenarioAggregate {
  const aggregate = perScenario[key];
  if (!aggregate) {
    throw new Error(`Missing scenario aggregate for key: ${key}`);
  }

  return aggregate;
}

interface ModelFlagRow {
  modelCode: string;
  flagCount: number;
  flags: string[];
  mirrorBias: number;
  stallDrawRate: number;
  stallFullAbsorptionRate: number;
  speedRunawayRepeatRate: number;
  speedRunawayMaxStreak: number;
  focusFireTargetFocus: number;
  speedVsTankAttackerWinRate: number;
  speedVsDamageAttackerWinRate: number;
  assassinVsTankAttackerWinRate: number;
  assassinVsSpeedAttackerWinRate: number;
  damageVsTankAttackerWinRate: number;
  damageVsSpeedAttackerWinRate: number;
  lateGameDrawRate: number;
  lateGameMaxActorStreak: number;
  hatredCycleAverageFavoredRate: number;
  hatredCycleFailedMatchups: number;
}

interface HatredCycleSummary {
  averageFavoredPointRate: number;
  failedMatchups: number;
}

function buildScenarioSuite(): ScenarioEntry[] {
  return [
    {
      key: "equalSpeedMirror",
      description: "Synthetic equal-speed mirror baseline.",
      scenario: getScenarioById("equal-speed-duel"),
    },
    {
      key: "highDefenseStall",
      description: "Synthetic defense stall baseline.",
      scenario: getScenarioById("high-defense-stall"),
    },
    {
      key: "speedAdvantage",
      description: "Synthetic speed advantage baseline.",
      scenario: getScenarioById("speed-advantage-duel"),
    },
    {
      key: "focusFire",
      description: "Synthetic 2v2 focus-fire baseline.",
      scenario: getScenarioById("focus-fire-2v2"),
    },
    {
      key: "speedVsTank",
      description: "Max-speed versus tank duel.",
      scenario: buildCatalogClassDuelScenario("Goblin Lord", "Dwarf Lord"),
    },
    {
      key: "speedVsDamage",
      description: "Max-speed versus raw-damage duel.",
      scenario: buildCatalogClassDuelScenario("Goblin Lord", "Orc Warlord"),
    },
    {
      key: "assassinVsTank",
      description: "High-accuracy/offense versus tank duel.",
      scenario: buildCatalogClassDuelScenario("Human Assassin", "Dwarf Lord"),
    },
    {
      key: "assassinVsSpeed",
      description: "High-accuracy/offense versus max-speed duel.",
      scenario: buildCatalogClassDuelScenario("Human Assassin", "Goblin Lord"),
    },
    {
      key: "damageVsTank",
      description: "Raw-damage versus tank duel.",
      scenario: buildCatalogClassDuelScenario("Orc Warlord", "Dwarf Lord"),
    },
    {
      key: "damageVsSpeed",
      description: "Raw-damage versus max-speed duel.",
      scenario: buildCatalogClassDuelScenario("Orc Warlord", "Goblin Lord"),
    },
    {
      key: "elfLordMirror",
      description: "Late-game fast mirror duel.",
      scenario: buildCatalogClassDuelScenario("Elf Lord", "Elf Lord"),
    },
    {
      key: "goblinLordMirror",
      description: "Late-game extreme-speed mirror duel.",
      scenario: buildCatalogClassDuelScenario("Goblin Lord", "Goblin Lord"),
    },
    {
      key: "lateGameSkirmish",
      description: "Late-game source-derived multi-warrior fight.",
      scenario: getScenarioById("tier45-lord-warband"),
    },
  ];
}

function winRateForAttacker(aggregate: ScenarioAggregate): number {
  return aggregate.runs === 0 ? 0 : aggregate.attackerWins / aggregate.runs;
}

function drawRate(aggregate: ScenarioAggregate): number {
  return aggregate.runs === 0 ? 0 : aggregate.draws / aggregate.runs;
}

function biasRate(aggregate: ScenarioAggregate): number {
  return aggregate.runs === 0 ? 0 : Math.abs(aggregate.attackerWins - aggregate.defenderWins) / aggregate.runs;
}

function detectFlags(
  perScenario: Record<string, ScenarioAggregate>,
  thresholds: RedFlagThresholds,
  hatredCycle: HatredCycleSummary,
): string[] {
  const flags: string[] = [];

  const equalSpeedMirror = requireAggregate(perScenario, "equalSpeedMirror");
  const highDefenseStall = requireAggregate(perScenario, "highDefenseStall");
  const speedAdvantage = requireAggregate(perScenario, "speedAdvantage");
  const focusFire = requireAggregate(perScenario, "focusFire");
  const speedVsTank = requireAggregate(perScenario, "speedVsTank");
  const speedVsDamage = requireAggregate(perScenario, "speedVsDamage");
  const assassinVsTank = requireAggregate(perScenario, "assassinVsTank");
  const assassinVsSpeed = requireAggregate(perScenario, "assassinVsSpeed");
  const damageVsTank = requireAggregate(perScenario, "damageVsTank");
  const damageVsSpeed = requireAggregate(perScenario, "damageVsSpeed");
  const elfLordMirror = requireAggregate(perScenario, "elfLordMirror");
  const goblinLordMirror = requireAggregate(perScenario, "goblinLordMirror");
  const lateGameSkirmish = requireAggregate(perScenario, "lateGameSkirmish");

  const mirrorBias = average([equalSpeedMirror, elfLordMirror, goblinLordMirror].map((aggregate) => biasRate(aggregate)));
  const focusTarget = average([
    focusFire.attackerTargetFocusAverage,
    focusFire.defenderTargetFocusAverage,
    lateGameSkirmish.attackerTargetFocusAverage,
    lateGameSkirmish.defenderTargetFocusAverage,
  ]);

  const speedRunawayRepeat = average([speedAdvantage.repeatTurnRate, speedVsTank.repeatTurnRate, speedVsDamage.repeatTurnRate]);
  const speedRunawayStreak = average([
    speedAdvantage.maxActorStreakAverage,
    speedVsTank.maxActorStreakAverage,
    speedVsDamage.maxActorStreakAverage,
  ]);

  const speedDominance =
    winRateForAttacker(speedVsTank) > thresholds.archetypeDominanceWinThreshold &&
    winRateForAttacker(speedVsDamage) > thresholds.archetypeDominanceWinThreshold &&
    speedRunawayRepeat > thresholds.speedRunawayRepeatRateThreshold;

  const defenseDominance =
    winRateForAttacker(speedVsTank) < thresholds.archetypeSuppressionWinThreshold &&
    winRateForAttacker(damageVsTank) < thresholds.archetypeSuppressionWinThreshold &&
    winRateForAttacker(assassinVsTank) < thresholds.archetypeSuppressionWinThreshold &&
    average([speedVsTank.fullAbsorptionRate, damageVsTank.fullAbsorptionRate, assassinVsTank.fullAbsorptionRate]) >
      thresholds.archetypeAbsorptionThreshold;

  const accuracyDominance =
    winRateForAttacker(assassinVsTank) > thresholds.archetypeDominanceWinThreshold &&
    winRateForAttacker(assassinVsSpeed) > thresholds.archetypeDominanceWinThreshold &&
    assassinVsTank.averageHighestSingleHit > thresholds.highestHitSpikeThreshold &&
    assassinVsTank.firstDefeatActionAverage > 0 &&
    assassinVsTank.firstDefeatActionAverage < assassinVsTank.averageActions * thresholds.firstDefeatRatioThreshold;

  const damageDominance =
    winRateForAttacker(damageVsTank) > thresholds.archetypeDominanceWinThreshold &&
    winRateForAttacker(damageVsSpeed) > thresholds.archetypeDominanceWinThreshold &&
    average([damageVsTank.averageHighestSingleHit, damageVsSpeed.averageHighestSingleHit]) > thresholds.highestHitSpikeThreshold;

  const lateGameDrawSaturation =
    average([
      drawRate(speedVsTank),
      drawRate(speedVsDamage),
      drawRate(assassinVsTank),
      drawRate(assassinVsSpeed),
      drawRate(damageVsTank),
      drawRate(damageVsSpeed),
      drawRate(lateGameSkirmish),
    ]) > thresholds.lateGameDrawRateThreshold;

  if (mirrorBias > thresholds.mirrorBiasThreshold) {
    flags.push("mirror-bias-too-high");
  }

  if (
    drawRate(highDefenseStall) > thresholds.stallDrawRateThreshold &&
    highDefenseStall.fullAbsorptionRate > thresholds.stallFullAbsorptionThreshold
  ) {
    flags.push("defense-stall-draw-lock");
  }

  if (
    speedAdvantage.repeatTurnRate > thresholds.speedRunawayRepeatRateThreshold ||
    speedAdvantage.maxActorStreakAverage > thresholds.speedRunawayMaxStreakThreshold
  ) {
    flags.push("speed-runaway-turn-loop");
  }

  if (focusTarget > thresholds.focusCollapseThreshold) {
    flags.push("random-targeting-focus-collapse");
  }

  if (speedDominance) {
    flags.push("speed-maxing-clear-advantage");
  }

  if (defenseDominance) {
    flags.push("defense-maxing-clear-advantage");
  }

  if (accuracyDominance) {
    flags.push("accuracy-maxing-clear-advantage");
  }

  if (damageDominance) {
    flags.push("damage-maxing-clear-advantage");
  }

  if (lateGameDrawSaturation && lateGameSkirmish.maxActorStreakAverage > thresholds.lateGameMaxStreakThreshold) {
    flags.push("late-game-draw-saturation");
  }

  if (
    hatredCycle.averageFavoredPointRate < thresholds.hatredCycleAverageThreshold ||
    hatredCycle.failedMatchups > thresholds.hatredCycleMaxFailures
  ) {
    flags.push("hatred-cycle-broken");
  }

  return flags;
}

function formatRowsCsv(rows: ModelFlagRow[]): string {
  const header = csvRow([
    "modelCode",
    "flagCount",
    "flags",
    "mirrorBias",
    "stallDrawRate",
    "stallFullAbsorptionRate",
    "speedRunawayRepeatRate",
    "speedRunawayMaxStreak",
    "focusFireTargetFocus",
    "speedVsTankAttackerWinRate",
    "speedVsDamageAttackerWinRate",
    "assassinVsTankAttackerWinRate",
    "assassinVsSpeedAttackerWinRate",
    "damageVsTankAttackerWinRate",
    "damageVsSpeedAttackerWinRate",
    "lateGameDrawRate",
    "lateGameMaxActorStreak",
    "hatredCycleAverageFavoredRate",
    "hatredCycleFailedMatchups",
  ]);

  const body = rows.map((row) =>
    csvRow([
      row.modelCode,
      row.flagCount,
      row.flags.join(";"),
      row.mirrorBias,
      row.stallDrawRate,
      row.stallFullAbsorptionRate,
      row.speedRunawayRepeatRate,
      row.speedRunawayMaxStreak,
      row.focusFireTargetFocus,
      row.speedVsTankAttackerWinRate,
      row.speedVsDamageAttackerWinRate,
      row.assassinVsTankAttackerWinRate,
      row.assassinVsSpeedAttackerWinRate,
      row.damageVsTankAttackerWinRate,
      row.damageVsSpeedAttackerWinRate,
      row.lateGameDrawRate,
      row.lateGameMaxActorStreak,
      row.hatredCycleAverageFavoredRate,
      row.hatredCycleFailedMatchups,
    ]),
  );

  return [header, ...body].join("\n");
}

const args = parseArgs(process.argv.slice(2));
const seedCount = Number(args.seeds ?? 1000);
const seedStart = Number(args.start ?? 1);
const json = Boolean(args.json);
const write = Boolean(args.write);
const seeds = buildSeedList(seedCount, seedStart);
const suite = buildScenarioSuite();
const thresholds = buildThresholds(args);

const rows = ALL_MODEL_CODES.map((modelCode) => {
  const perScenario = Object.fromEntries(
    suite.map((entry) => [entry.key, aggregateScenarioRuns(entry.scenario, modelCode, seeds)]),
  ) as Record<string, ScenarioAggregate>;

  const hatredCycle = summarizeHatredCycle(modelCode, seeds, thresholds);
  const flags = detectFlags(perScenario, thresholds, hatredCycle);

  const equalSpeedMirror = requireAggregate(perScenario, "equalSpeedMirror");
  const highDefenseStall = requireAggregate(perScenario, "highDefenseStall");
  const speedAdvantage = requireAggregate(perScenario, "speedAdvantage");
  const focusFire = requireAggregate(perScenario, "focusFire");
  const speedVsTank = requireAggregate(perScenario, "speedVsTank");
  const speedVsDamage = requireAggregate(perScenario, "speedVsDamage");
  const assassinVsTank = requireAggregate(perScenario, "assassinVsTank");
  const assassinVsSpeed = requireAggregate(perScenario, "assassinVsSpeed");
  const damageVsTank = requireAggregate(perScenario, "damageVsTank");
  const damageVsSpeed = requireAggregate(perScenario, "damageVsSpeed");
  const elfLordMirror = requireAggregate(perScenario, "elfLordMirror");
  const goblinLordMirror = requireAggregate(perScenario, "goblinLordMirror");
  const lateGameSkirmish = requireAggregate(perScenario, "lateGameSkirmish");

  return {
    modelCode,
    flagCount: flags.length,
    flags,
    mirrorBias: average([equalSpeedMirror, elfLordMirror, goblinLordMirror].map((aggregate) => biasRate(aggregate))),
    stallDrawRate: drawRate(highDefenseStall),
    stallFullAbsorptionRate: highDefenseStall.fullAbsorptionRate,
    speedRunawayRepeatRate: average([speedAdvantage.repeatTurnRate, speedVsTank.repeatTurnRate, speedVsDamage.repeatTurnRate]),
    speedRunawayMaxStreak: average([
      speedAdvantage.maxActorStreakAverage,
      speedVsTank.maxActorStreakAverage,
      speedVsDamage.maxActorStreakAverage,
    ]),
    focusFireTargetFocus: average([
      focusFire.attackerTargetFocusAverage,
      focusFire.defenderTargetFocusAverage,
      lateGameSkirmish.attackerTargetFocusAverage,
      lateGameSkirmish.defenderTargetFocusAverage,
    ]),
    speedVsTankAttackerWinRate: winRateForAttacker(speedVsTank),
    speedVsDamageAttackerWinRate: winRateForAttacker(speedVsDamage),
    assassinVsTankAttackerWinRate: winRateForAttacker(assassinVsTank),
    assassinVsSpeedAttackerWinRate: winRateForAttacker(assassinVsSpeed),
    damageVsTankAttackerWinRate: winRateForAttacker(damageVsTank),
    damageVsSpeedAttackerWinRate: winRateForAttacker(damageVsSpeed),
    lateGameDrawRate: average([
      drawRate(speedVsTank),
      drawRate(speedVsDamage),
      drawRate(assassinVsTank),
      drawRate(assassinVsSpeed),
      drawRate(damageVsTank),
      drawRate(damageVsSpeed),
      drawRate(lateGameSkirmish),
    ]),
    lateGameMaxActorStreak: lateGameSkirmish.maxActorStreakAverage,
    hatredCycleAverageFavoredRate: hatredCycle.averageFavoredPointRate,
    hatredCycleFailedMatchups: hatredCycle.failedMatchups,
    perScenario,
  };
}).sort((left, right) => {
  if (right.flagCount !== left.flagCount) {
    return right.flagCount - left.flagCount;
  }
  return right.mirrorBias - left.mirrorBias;
});

const printableRows: ModelFlagRow[] = rows.map(({ perScenario: _perScenario, ...row }) => row);

if (write) {
  const baseName = `balance-red-flags-${seedCount}runs`;
  await writeFile(
    `simulation-results/${baseName}.json`,
    JSON.stringify(
      {
        config: { seedCount, seedStart, thresholds },
        scenarioSuite: suite.map((entry) => ({ key: entry.key, description: entry.description, scenarioId: entry.scenario.id })),
        rows,
      },
      null,
      2,
    ),
  );
  await writeFile(`simulation-results/${baseName}.csv`, formatRowsCsv(printableRows));
}

if (json) {
  console.log(
    JSON.stringify(
      {
        config: { seedCount, seedStart, thresholds },
        scenarioSuite: suite.map((entry) => ({ key: entry.key, description: entry.description, scenarioId: entry.scenario.id })),
        rows: printableRows,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Balance red-flag analysis`);
  console.log(`seeds=${seedCount} start=${seedStart}`);
  console.log(`thresholds=${JSON.stringify(thresholds)}`);
  console.log("\nScenario suite:");
  for (const entry of suite) {
    console.log(`- ${entry.key}: ${entry.scenario.id} - ${entry.description}`);
  }

  console.log("\nFlagged models first:");
  console.table(
    printableRows.map((row) => ({
      model: row.modelCode,
      flagCount: row.flagCount,
      flags: row.flags.join(", "),
      mirrorBias: Number(row.mirrorBias.toFixed(3)),
      stallDrawRate: Number(row.stallDrawRate.toFixed(3)),
      stallFullAbsorptionRate: Number(row.stallFullAbsorptionRate.toFixed(3)),
      speedRunawayRepeatRate: Number(row.speedRunawayRepeatRate.toFixed(3)),
      speedRunawayMaxStreak: Number(row.speedRunawayMaxStreak.toFixed(2)),
      focusFireTargetFocus: Number(row.focusFireTargetFocus.toFixed(3)),
      speedVsTankAttackerWinRate: Number(row.speedVsTankAttackerWinRate.toFixed(3)),
      speedVsDamageAttackerWinRate: Number(row.speedVsDamageAttackerWinRate.toFixed(3)),
      assassinVsTankAttackerWinRate: Number(row.assassinVsTankAttackerWinRate.toFixed(3)),
      assassinVsSpeedAttackerWinRate: Number(row.assassinVsSpeedAttackerWinRate.toFixed(3)),
      damageVsTankAttackerWinRate: Number(row.damageVsTankAttackerWinRate.toFixed(3)),
      damageVsSpeedAttackerWinRate: Number(row.damageVsSpeedAttackerWinRate.toFixed(3)),
      lateGameDrawRate: Number(row.lateGameDrawRate.toFixed(3)),
      lateGameMaxActorStreak: Number(row.lateGameMaxActorStreak.toFixed(2)),
      hatredCycleAverageFavoredRate: Number(row.hatredCycleAverageFavoredRate.toFixed(3)),
      hatredCycleFailedMatchups: row.hatredCycleFailedMatchups,
    })),
  );

  if (write) {
    console.log(`Saved files under simulation-results/balance-red-flags-${seedCount}runs.*`);
  }
}
