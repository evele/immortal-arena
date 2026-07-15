import { formatScenarioAggregatesCsv, writeFile } from "../src/combat/export.ts";
import { aggregateScenarioRuns, buildSeedList } from "../src/combat/metrics.ts";
import { ALL_MODEL_CODES } from "../src/combat/models.ts";
import { resolveScenario } from "../src/combat/scenarios/index.ts";

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
const modelCode = String(args.model ?? ALL_MODEL_CODES[0]);
const seedCount = Number(args.seeds ?? 1000);
const seedStart = Number(args.start ?? 1);
const json = Boolean(args.json);
const write = Boolean(args.write);

const scenarioOptions = {
  ...(typeof args.scenario === "string" ? { scenarioId: args.scenario } : {}),
  ...(typeof args["attacker-class"] === "string" ? { attackerClassName: args["attacker-class"] } : {}),
  ...(typeof args["defender-class"] === "string" ? { defenderClassName: args["defender-class"] } : {}),
  ...(typeof args["attacker-race"] === "string" ? { attackerRace: args["attacker-race"] as never } : {}),
  ...(typeof args["defender-race"] === "string" ? { defenderRace: args["defender-race"] as never } : {}),
  ...(typeof args["lord-level"] === "string" ? { lordLevel: Number(args["lord-level"]) } : {}),
};

const scenario = resolveScenario(scenarioOptions);
const aggregate = aggregateScenarioRuns(scenario, modelCode as (typeof ALL_MODEL_CODES)[number], buildSeedList(seedCount, seedStart));

if (write) {
  const baseName = `${scenario.id}-${aggregate.modelCode}-${aggregate.runs}runs`;
  await writeFile(`simulation-results/${baseName}.json`, JSON.stringify(aggregate, null, 2));
  await writeFile(`simulation-results/${baseName}.csv`, formatScenarioAggregatesCsv([aggregate]));
}

if (json) {
  console.log(JSON.stringify(aggregate, null, 2));
} else {
  console.table([
    {
      ...aggregate,
      missRate: Number(aggregate.missRate.toFixed(3)),
      landedHitRate: Number(aggregate.landedHitRate.toFixed(3)),
      zeroDamageRate: Number(aggregate.zeroDamageRate.toFixed(3)),
      fullAbsorptionRate: Number(aggregate.fullAbsorptionRate.toFixed(3)),
      hatredHitRate: Number(aggregate.hatredHitRate.toFixed(3)),
      averageDamagePerAction: Number(aggregate.averageDamagePerAction.toFixed(2)),
      averageDamagePerLandedHit: Number(aggregate.averageDamagePerLandedHit.toFixed(2)),
      averageHighestSingleHit: Number(aggregate.averageHighestSingleHit.toFixed(2)),
      firstDefeatActionAverage: Number(aggregate.firstDefeatActionAverage.toFixed(2)),
      repeatTurnRate: Number(aggregate.repeatTurnRate.toFixed(3)),
      maxActorStreakAverage: Number(aggregate.maxActorStreakAverage.toFixed(2)),
      attackerTargetFocusAverage: Number(aggregate.attackerTargetFocusAverage.toFixed(3)),
      defenderTargetFocusAverage: Number(aggregate.defenderTargetFocusAverage.toFixed(3)),
    },
  ]);
  if (write) {
    console.log(`Saved files under simulation-results/${scenario.id}-${aggregate.modelCode}-${aggregate.runs}runs.*`);
  }
}
