import type { BattleResult, ScenarioAggregate } from "./types.ts";

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

export function formatScenarioAggregatesCsv(rows: ScenarioAggregate[]): string {
  const header = csvRow([
    "scenarioId",
    "modelCode",
    "runs",
    "attackerWins",
    "defenderWins",
    "draws",
    "averageActions",
    "missRate",
    "landedHitRate",
    "zeroDamageRate",
    "fullAbsorptionRate",
    "hatredHitRate",
    "averageDamagePerAction",
    "averageDamagePerLandedHit",
    "averageAttackerDamageDealt",
    "averageDefenderDamageDealt",
    "averageHighestSingleHit",
    "averageAttackerKills",
    "averageDefenderKills",
    "firstDefeatActionAverage",
    "preventedActionsPerBattle",
    "repeatTurnRate",
    "maxActorStreakAverage",
    "attackerTargetFocusAverage",
    "defenderTargetFocusAverage",
    "attackerRemainingHpAverage",
    "defenderRemainingHpAverage",
    "seedStart",
    "seedEnd",
  ]);

  const body = rows.map((row) =>
    csvRow([
      row.scenarioId,
      row.modelCode,
      row.runs,
      row.attackerWins,
      row.defenderWins,
      row.draws,
      row.averageActions,
      row.missRate,
      row.landedHitRate,
      row.zeroDamageRate,
      row.fullAbsorptionRate,
      row.hatredHitRate,
      row.averageDamagePerAction,
      row.averageDamagePerLandedHit,
      row.averageAttackerDamageDealt,
      row.averageDefenderDamageDealt,
      row.averageHighestSingleHit,
      row.averageAttackerKills,
      row.averageDefenderKills,
      row.firstDefeatActionAverage,
      row.preventedActionsPerBattle,
      row.repeatTurnRate,
      row.maxActorStreakAverage,
      row.attackerTargetFocusAverage,
      row.defenderTargetFocusAverage,
      row.attackerRemainingHpAverage,
      row.defenderRemainingHpAverage,
      row.seeds[0] ?? "",
      row.seeds[row.seeds.length - 1] ?? "",
    ]),
  );

  return [header, ...body].join("\n");
}

export function formatBattleResultText(result: BattleResult): string {
  const lines = [
    `model: ${result.modelCode}`,
    `seed: ${result.seed}`,
    `outcome: ${result.outcome}`,
    `winner: ${result.winnerLordName ?? "draw"}`,
    `actions: ${result.actionCount} / ${result.actionLimit}`,
    `metrics: ${JSON.stringify(result.metrics)}`,
    "",
    ...result.logLines,
  ];

  return lines.join("\n");
}

export async function writeFile(path: string, contents: string): Promise<void> {
  await Bun.write(path, contents);
}
