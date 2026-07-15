import { formatBattleResultText, writeFile } from "../src/combat/export.ts";
import { simulateBattle } from "../src/combat/engine.ts";
import { buildCombatModel, ALL_MODEL_CODES } from "../src/combat/models.ts";
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
const modelCode = String(args.model ?? ALL_MODEL_CODES[0]);
const seed = Number(args.seed ?? 1);
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
const model = buildCombatModel(modelCode);
const result = simulateBattle(
  {
    modelCode: model.code,
    seed,
    attacker: scenario.attacker,
    defender: scenario.defender,
  },
  model,
);

const textOutput = formatBattleResultText(result);

if (write) {
  const baseName = `${scenario.id}-${result.modelCode}-seed${result.seed}`;
  await writeFile(`simulation-results/${baseName}.json`, JSON.stringify({ scenario, result }, null, 2));
  await writeFile(`simulation-results/${baseName}.log`, textOutput);
}

if (json) {
  console.log(JSON.stringify({ scenario, result }, null, 2));
} else {
  console.log(`scenario: ${scenario.id}`);
  console.log(textOutput);
  if (write) {
    console.log(`\nSaved files under simulation-results/${scenario.id}-${result.modelCode}-seed${result.seed}.*`);
  }
}
