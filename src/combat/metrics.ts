import { buildCombatModel } from "./models.ts";
import { simulateBattle } from "./engine.ts";
import type { BattleResult, ModelCode, ScenarioAggregate, ScenarioDefinition } from "./types.ts";

export function buildSeedList(count: number, start = 1): number[] {
  return Array.from({ length: count }, (_, index) => start + index);
}

export function aggregateScenarioRuns(
  scenario: ScenarioDefinition,
  modelCode: ModelCode,
  seeds: number[],
): ScenarioAggregate {
  const model = buildCombatModel(modelCode);
  const results = seeds.map((seed) =>
    simulateBattle(
      {
        modelCode,
        seed,
        attacker: scenario.attacker,
        defender: scenario.defender,
      },
      model,
    ),
  );

  return summarizeScenarioResults(scenario.id, modelCode, seeds, results);
}

export function summarizeScenarioResults(
  scenarioId: string,
  modelCode: ModelCode,
  seeds: number[],
  results: BattleResult[],
): ScenarioAggregate {
  const runs = results.length;

  let attackerWins = 0;
  let defenderWins = 0;
  let draws = 0;
  let actions = 0;
  let misses = 0;
  let landedHits = 0;
  let zeroDamageHits = 0;
  let fullAbsorptions = 0;
  let hatredHits = 0;
  let attackerDamageDealt = 0;
  let defenderDamageDealt = 0;
  let highestSingleHit = 0;
  let attackerKills = 0;
  let defenderKills = 0;
  let firstDefeatActionSum = 0;
  let firstDefeatSamples = 0;
  let preventedActions = 0;
  let repeatedTurns = 0;
  let repeatTurnDenominator = 0;
  let maxActorStreak = 0;
  let attackerTargetFocus = 0;
  let defenderTargetFocus = 0;
  let attackerRemainingHp = 0;
  let defenderRemainingHp = 0;

  for (const result of results) {
    if (result.outcome === "attacker_win") {
      attackerWins += 1;
    } else if (result.outcome === "defender_win") {
      defenderWins += 1;
    } else {
      draws += 1;
    }

    actions += result.metrics.actions;
    misses += result.metrics.misses;
    landedHits += result.metrics.landedHits;
    zeroDamageHits += result.metrics.zeroDamageHits;
    fullAbsorptions += result.metrics.fullAbsorptions;
    hatredHits += result.metrics.hatredHits;
    attackerDamageDealt += result.metrics.attackerDamageDealt;
    defenderDamageDealt += result.metrics.defenderDamageDealt;
    highestSingleHit += result.metrics.highestSingleHit;
    attackerKills += result.metrics.attackerKills;
    defenderKills += result.metrics.defenderKills;
    if (result.metrics.firstDefeatAction !== undefined) {
      firstDefeatActionSum += result.metrics.firstDefeatAction;
      firstDefeatSamples += 1;
    }
    preventedActions += result.metrics.preventedActions;
    repeatedTurns += result.metrics.repeatedTurns;
    repeatTurnDenominator += Math.max(0, result.metrics.actions - 1);
    maxActorStreak += result.metrics.maxActorStreak;
    attackerTargetFocus += result.metrics.attackerTargetFocus;
    defenderTargetFocus += result.metrics.defenderTargetFocus;
    attackerRemainingHp += result.metrics.attackerRemainingHp;
    defenderRemainingHp += result.metrics.defenderRemainingHp;
  }

  return {
    scenarioId,
    modelCode,
    seeds,
    runs,
    attackerWins,
    defenderWins,
    draws,
    averageActions: runs === 0 ? 0 : actions / runs,
    missRate: actions === 0 ? 0 : misses / actions,
    landedHitRate: actions === 0 ? 0 : landedHits / actions,
    zeroDamageRate: actions === 0 ? 0 : zeroDamageHits / actions,
    fullAbsorptionRate: actions === 0 ? 0 : fullAbsorptions / actions,
    hatredHitRate: actions === 0 ? 0 : hatredHits / actions,
    averageDamagePerAction: actions === 0 ? 0 : (attackerDamageDealt + defenderDamageDealt) / actions,
    averageDamagePerLandedHit: landedHits === 0 ? 0 : (attackerDamageDealt + defenderDamageDealt) / landedHits,
    averageAttackerDamageDealt: runs === 0 ? 0 : attackerDamageDealt / runs,
    averageDefenderDamageDealt: runs === 0 ? 0 : defenderDamageDealt / runs,
    averageHighestSingleHit: runs === 0 ? 0 : highestSingleHit / runs,
    averageAttackerKills: runs === 0 ? 0 : attackerKills / runs,
    averageDefenderKills: runs === 0 ? 0 : defenderKills / runs,
    firstDefeatActionAverage: firstDefeatSamples === 0 ? 0 : firstDefeatActionSum / firstDefeatSamples,
    preventedActionsPerBattle: runs === 0 ? 0 : preventedActions / runs,
    repeatTurnRate: repeatTurnDenominator === 0 ? 0 : repeatedTurns / repeatTurnDenominator,
    maxActorStreakAverage: runs === 0 ? 0 : maxActorStreak / runs,
    attackerTargetFocusAverage: runs === 0 ? 0 : attackerTargetFocus / runs,
    defenderTargetFocusAverage: runs === 0 ? 0 : defenderTargetFocus / runs,
    attackerRemainingHpAverage: runs === 0 ? 0 : attackerRemainingHp / runs,
    defenderRemainingHpAverage: runs === 0 ? 0 : defenderRemainingHp / runs,
  };
}
