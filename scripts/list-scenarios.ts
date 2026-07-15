import { listScenarioSummaries } from "../src/combat/scenarios/index.ts";

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
const json = Boolean(args.json);
const rows = listScenarioSummaries();

if (json) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.table(
    rows.map((row) => ({
      id: row.id,
      source: row.source,
      attackerLevel: row.attackerLordLevel ?? "-",
      defenderLevel: row.defenderLordLevel ?? "-",
      attackerWarriors: row.attackerWarriorCount,
      defenderWarriors: row.defenderWarriorCount,
      description: row.description,
    })),
  );

  console.log("\nGenerated scenario modes:");
  console.log('  Class duel: bun run simulate:one --attacker-class "Elf Lord" --defender-class "Orc Warlord" --model ACDFHIKMN --seed 1');
  console.log('  Race+level duel: bun run simulate:scenario --attacker-race Goblin --defender-race Dwarf --lord-level 30 --model ACDFHIKMN --seeds 50');
}
