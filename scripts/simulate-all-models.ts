import { formatScenarioAggregatesCsv, writeFile } from "../src/combat/export.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import { ALL_SCENARIOS, resolveScenario } from "../src/combat/scenarios/index.ts";

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

const args = parseArgs(process.argv.slice(2));
const scenarioId = typeof args.scenario === "string" ? args.scenario : undefined;
const seedCount = Number(args.seeds ?? 1000);
const seedStart = Number(args.start ?? 1);
const json = Boolean(args.json);
const write = Boolean(args.write);
const seeds = buildSeedList(seedCount, seedStart);
const generatedScenarioRequested =
  typeof args["attacker-class"] === "string" ||
  typeof args["defender-class"] === "string" ||
  typeof args["attacker-race"] === "string" ||
  typeof args["defender-race"] === "string";
const scenarioOptions = {
  ...(typeof scenarioId === "string" ? { scenarioId } : {}),
  ...(typeof args["attacker-class"] === "string" ? { attackerClassName: args["attacker-class"] } : {}),
  ...(typeof args["defender-class"] === "string" ? { defenderClassName: args["defender-class"] } : {}),
  ...(typeof args["attacker-race"] === "string" ? { attackerRace: args["attacker-race"] as never } : {}),
  ...(typeof args["defender-race"] === "string" ? { defenderRace: args["defender-race"] as never } : {}),
  ...(typeof args["lord-level"] === "string" ? { lordLevel: Number(args["lord-level"]) } : {}),
};
const scenarios = generatedScenarioRequested
  ? [resolveScenario(scenarioOptions)]
  : scenarioId
    ? [resolveScenario({ scenarioId })]
    : ALL_SCENARIOS;

const output = scenarios.map((scenario) => ({
  scenarioId: scenario.id,
  description: scenario.description,
  results: ALL_MODEL_CODES.map((modelCode) => aggregateScenarioRuns(scenario, modelCode, seeds)),
}));

if (write) {
  const baseName = `${scenarioId ?? "all-scenarios"}-${seedCount}runs-all-models`;
  await writeFile(`simulation-results/${baseName}.json`, JSON.stringify(output, null, 2));
  await writeFile(
    `simulation-results/${baseName}.csv`,
    formatScenarioAggregatesCsv(output.flatMap((entry) => entry.results)),
  );
}

if (json) {
  console.log(JSON.stringify(output, null, 2));
} else {
  for (const entry of output) {
    console.log(`\nScenario: ${entry.scenarioId}`);
    console.log(entry.description);
    console.table(
      entry.results.map((result) => ({
        model: result.modelCode,
        attackerWins: result.attackerWins,
        defenderWins: result.defenderWins,
        draws: result.draws,
        averageActions: Number(result.averageActions.toFixed(2)),
        missRate: Number(result.missRate.toFixed(3)),
        landedHitRate: Number(result.landedHitRate.toFixed(3)),
        zeroDamageRate: Number(result.zeroDamageRate.toFixed(3)),
        fullAbsorptionRate: Number(result.fullAbsorptionRate.toFixed(3)),
        hatredHitRate: Number(result.hatredHitRate.toFixed(3)),
        avgDamagePerHit: Number(result.averageDamagePerLandedHit.toFixed(2)),
        avgHighestHit: Number(result.averageHighestSingleHit.toFixed(2)),
        firstDefeatAction: Number(result.firstDefeatActionAverage.toFixed(2)),
        preventedActionsPerBattle: Number(result.preventedActionsPerBattle.toFixed(3)),
        repeatTurnRate: Number(result.repeatTurnRate.toFixed(3)),
        maxActorStreak: Number(result.maxActorStreakAverage.toFixed(2)),
        attackerFocus: Number(result.attackerTargetFocusAverage.toFixed(3)),
        defenderFocus: Number(result.defenderTargetFocusAverage.toFixed(3)),
      })),
    );
  }

  if (write) {
    console.log(`Saved files under simulation-results/${scenarioId ?? "all-scenarios"}-${seedCount}runs-all-models.*`);
  }
}
