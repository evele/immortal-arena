import { renderLogEvents } from "./logs.ts";
import { hatesRace } from "./models.ts";
import { SeededRng } from "./random.ts";
import type {
  BattleInput,
  BattleMetrics,
  BattleResult,
  BattleSide,
  BattleStateWarrior,
  BattleOutcome,
  CombatModel,
  LogEvent,
  SideId,
} from "./types.ts";

const INITIATIVE_THRESHOLD = 300;
const HATRED_HIT_CHANCE_BONUS = 25;
const HATRED_DAMAGE_MULTIPLIER = 1.25;
const HATRED_ADDITIVE_DAMAGE_RATE = 0.25;
const DEFENDER_SPEED_EVASION_RATE = 0.25;
const DEFENSE_EFFECTIVE_RATE = 0.95;
const ARMOR_CHIP_LANDED_HITS = 3;
const ARMOR_CHIP_DAMAGE = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function buildBattleSide(side: BattleSide, sideId: SideId): BattleStateWarrior[] {
  return side.warriors.map((warrior) => ({
    id: warrior.id,
    name: warrior.name,
    race: warrior.race,
    side: sideId,
    currentHp: clamp(warrior.currentHp ?? warrior.stats.hp, 0, warrior.stats.hp),
    maxHp: warrior.stats.hp,
    stats: { ...warrior.stats },
    initiative: 0,
  }));
}

function buildActionLimit(input: BattleInput): number {
  const attackerLevel = input.attacker.level ?? 1;
  const defenderLevel = input.defender.level ?? 1;
  return 100 + Math.max(0, (attackerLevel + defenderLevel - 2) * 2);
}

function livingWarriors(warriors: BattleStateWarrior[]): BattleStateWarrior[] {
  return warriors.filter((warrior) => warrior.currentHp > 0);
}

function totalRemainingHp(warriors: BattleStateWarrior[]): number {
  return warriors.reduce((sum, warrior) => sum + warrior.currentHp, 0);
}

function orderEligibleWarriors(eligible: BattleStateWarrior[], rng: SeededRng): BattleStateWarrior[] {
  const byStats = [...eligible].sort((left, right) => {
    if (right.initiative !== left.initiative) {
      return right.initiative - left.initiative;
    }
    if (right.stats.speed !== left.stats.speed) {
      return right.stats.speed - left.stats.speed;
    }
    return left.id.localeCompare(right.id);
  });

  const ordered: BattleStateWarrior[] = [];

  for (let index = 0; index < byStats.length; ) {
    const start = index;
    const current = byStats[index]!;

    while (
      index < byStats.length &&
      byStats[index]!.initiative === current.initiative &&
      byStats[index]!.stats.speed === current.stats.speed
    ) {
      index += 1;
    }

    const group = byStats.slice(start, index);
    if (group.length === 1) {
      ordered.push(group[0]!);
      continue;
    }

    const randomized = group
      .map((warrior) => ({ warrior, tieValue: rng.nextFloat() }))
      .sort((left, right) => {
        if (right.tieValue !== left.tieValue) {
          return right.tieValue - left.tieValue;
        }
        return left.warrior.id.localeCompare(right.warrior.id);
      });

    for (const entry of randomized) {
      ordered.push(entry.warrior);
    }
  }

  return ordered;
}

function selectTarget(attacker: BattleStateWarrior, warriors: BattleStateWarrior[], rng: SeededRng): BattleStateWarrior {
  const candidates = warriors.filter((warrior) => warrior.side !== attacker.side && warrior.currentHp > 0);

  if (candidates.length === 0) {
    throw new Error(`No living targets available for ${attacker.name}`);
  }

  return candidates[rng.nextInt(0, candidates.length - 1)]!;
}

function resolveHitChance(attacker: BattleStateWarrior, defender: BattleStateWarrior, model: CombatModel): number {
  const hatredHitBonus = hatesRace(attacker.race, defender.race) ? HATRED_HIT_CHANCE_BONUS : 0;
  const defenderEvasion = defender.stats.agility + defender.stats.speed * DEFENDER_SPEED_EVASION_RATE;

  if (model.hitResolution === "D") {
    return clamp(60 + (attacker.stats.accuracy - defenderEvasion) * 4 + hatredHitBonus, 10, 90);
  }

  const total = attacker.stats.accuracy + defenderEvasion;
  const rawChance = total === 0 ? 50 : (attacker.stats.accuracy / total) * 100;
  return clamp(rawChance + hatredHitBonus, 10, 90);
}

function rollDamage(attacker: BattleStateWarrior, model: CombatModel, rng: SeededRng): number {
  if (model.damageRoll === "F") {
    const minRolledDamage = Math.max(1, Math.floor(attacker.stats.damage * 0.8));
    const maxRolledDamage = Math.max(minRolledDamage, Math.ceil(attacker.stats.damage * 1.2));
    return rng.nextInt(minRolledDamage, maxRolledDamage);
  }

  const bonusDamage = rng.nextInt(0, Math.ceil(attacker.stats.damage / 2));
  return attacker.stats.damage + bonusDamage;
}

function applyHatred(rolledDamage: number, attacker: BattleStateWarrior, defender: BattleStateWarrior, model: CombatModel): { adjustedDamage: number; hatredApplied: boolean } {
  if (!hatesRace(attacker.race, defender.race)) {
    return { adjustedDamage: rolledDamage, hatredApplied: false };
  }

  if (model.hatred === "I") {
    return { adjustedDamage: Math.ceil(rolledDamage * HATRED_DAMAGE_MULTIPLIER), hatredApplied: true };
  }

  return {
    adjustedDamage: rolledDamage + Math.ceil(attacker.stats.damage * HATRED_ADDITIVE_DAMAGE_RATE),
    hatredApplied: true,
  };
}

function applyDefense(adjustedDamage: number, defender: BattleStateWarrior): number {
  return Math.max(0, adjustedDamage - defender.stats.defense * DEFENSE_EFFECTIVE_RATE);
}

function buildOutcome(
  outcome: BattleOutcome,
  input: BattleInput,
  metrics: BattleMetrics,
  actionLimit: number,
  actionCount: number,
  events: LogEvent[],
): BattleResult {
  const winnerLordName =
    outcome === "attacker_win"
      ? input.attacker.lordName
      : outcome === "defender_win"
        ? input.defender.lordName
        : undefined;

  if (outcome === "attacker_win") {
    events.push({ type: "battle_victory", winnerLordName: input.attacker.lordName, loserLordName: input.defender.lordName });
  } else if (outcome === "defender_win") {
    events.push({ type: "battle_victory", winnerLordName: input.defender.lordName, loserLordName: input.attacker.lordName });
  } else {
    events.push({ type: "battle_tie", attackerLordName: input.attacker.lordName, defenderLordName: input.defender.lordName });
  }

  return {
    modelCode: input.modelCode,
    seed: input.seed,
    outcome,
    actionLimit,
    actionCount,
    metrics,
    logEvents: events,
    logLines: renderLogEvents(events, {
      attackerLordName: input.attacker.lordName,
      defenderLordName: input.defender.lordName,
    }),
    ...(winnerLordName ? { winnerLordName } : {}),
  };
}

export function simulateBattle(input: BattleInput, model: CombatModel): BattleResult {
  const rng = new SeededRng(input.seed);
  const warriors = [
    ...buildBattleSide(input.attacker, "attacker"),
    ...buildBattleSide(input.defender, "defender"),
  ];
  const actionLimit = buildActionLimit(input);
  const events: LogEvent[] = [];
  const actionActors: string[] = [];
  const landedHitCounts = new Map<string, number>();
  let actionCount = 0;
  let preventedActions = 0;
  let drawPendingAtEndOfTick = false;
  let attackerDamageDealt = 0;
  let defenderDamageDealt = 0;
  let highestSingleHit = 0;
  let attackerKills = 0;
  let defenderKills = 0;
  const attackerTargetSelections = new Map<string, number>();
  const defenderTargetSelections = new Map<string, number>();
  let firstDefeatAction: number | undefined;

  while (true) {
    const attackersAlive = livingWarriors(warriors.filter((warrior) => warrior.side === "attacker"));
    const defendersAlive = livingWarriors(warriors.filter((warrior) => warrior.side === "defender"));

    if (attackersAlive.length === 0) {
      const metrics = buildMetrics(
        warriors,
        actionCount,
        events,
        preventedActions,
        actionActors,
        attackerDamageDealt,
        defenderDamageDealt,
        highestSingleHit,
        attackerKills,
        defenderKills,
        attackerTargetSelections,
        defenderTargetSelections,
        firstDefeatAction,
      );
      return buildOutcome("defender_win", input, metrics, actionLimit, actionCount, events);
    }

    if (defendersAlive.length === 0) {
      const metrics = buildMetrics(
        warriors,
        actionCount,
        events,
        preventedActions,
        actionActors,
        attackerDamageDealt,
        defenderDamageDealt,
        highestSingleHit,
        attackerKills,
        defenderKills,
        attackerTargetSelections,
        defenderTargetSelections,
        firstDefeatAction,
      );
      return buildOutcome("attacker_win", input, metrics, actionLimit, actionCount, events);
    }

    for (const warrior of warriors) {
      if (warrior.currentHp > 0) {
        warrior.initiative += warrior.stats.speed;
      }
    }

    const eligible = orderEligibleWarriors(
      warriors.filter((warrior) => warrior.currentHp > 0 && warrior.initiative >= INITIATIVE_THRESHOLD),
      rng,
    );

    if (eligible.length === 0) {
      continue;
    }

    drawPendingAtEndOfTick = false;

    for (const actor of eligible) {
      if (actor.currentHp <= 0) {
        preventedActions += 1;
        continue;
      }

      const livingEnemies = warriors.filter((warrior) => warrior.side !== actor.side && warrior.currentHp > 0);
      if (livingEnemies.length === 0) {
        break;
      }

      actionActors.push(actor.id);
      actionCount += 1;

      const target = selectTarget(actor, warriors, rng);
      if (actor.side === "attacker") {
        incrementSelectionCount(attackerTargetSelections, target.id);
      } else {
        incrementSelectionCount(defenderTargetSelections, target.id);
      }
      const hitChance = resolveHitChance(actor, target, model);
      const hitRoll = rng.nextFloat() * 100;

      if (hitRoll > hitChance) {
        events.push({ type: "miss", attackerName: actor.name, defenderName: target.name });
      } else {
        const rolledDamage = rollDamage(actor, model, rng);
        const { adjustedDamage, hatredApplied } = applyHatred(rolledDamage, actor, target, model);
        const defendedDamage = applyDefense(adjustedDamage, target);
        let finalDamage = defendedDamage;
        const fullyAbsorbed = defendedDamage === 0 && adjustedDamage < target.stats.defense;
        const armorChipApplied = incrementLandedHitCount(landedHitCounts, target.id) >= ARMOR_CHIP_LANDED_HITS;

        if (armorChipApplied) {
          landedHitCounts.set(target.id, 0);
          finalDamage += ARMOR_CHIP_DAMAGE;
        }

        if (finalDamage > highestSingleHit) {
          highestSingleHit = finalDamage;
        }
        if (actor.side === "attacker") {
          attackerDamageDealt += finalDamage;
        } else {
          defenderDamageDealt += finalDamage;
        }

        target.currentHp = Math.max(0, target.currentHp - finalDamage);

        if (defendedDamage === 0 && armorChipApplied) {
          events.push({
            type: "armor_chip",
            attackerName: actor.name,
            defenderName: target.name,
            damage: finalDamage,
            defenderHpLeft: target.currentHp,
            wasFullAbsorption: fullyAbsorbed,
          });
        } else if (finalDamage === 0) {
          if (fullyAbsorbed) {
            events.push({ type: "full_absorption", attackerName: actor.name, defenderName: target.name });
          } else {
            events.push({ type: "zero_damage", attackerName: actor.name, defenderName: target.name });
          }
        } else if (hatredApplied) {
          events.push({
            type: "hatred_hit",
            attackerName: actor.name,
            defenderName: target.name,
            damage: finalDamage,
            defenderHpLeft: target.currentHp,
            ...(armorChipApplied ? { armorChipDamage: ARMOR_CHIP_DAMAGE } : {}),
          });
        } else {
          events.push({
            type: "normal_hit",
            attackerName: actor.name,
            defenderName: target.name,
            damage: finalDamage,
            defenderHpLeft: target.currentHp,
            ...(armorChipApplied ? { armorChipDamage: ARMOR_CHIP_DAMAGE } : {}),
          });
        }

        if (target.currentHp === 0) {
          if (firstDefeatAction === undefined) {
            firstDefeatAction = actionCount;
          }
          if (actor.side === "attacker") {
            attackerKills += 1;
          } else {
            defenderKills += 1;
          }
          events.push({ type: "warrior_defeat", warriorName: target.name });
        }
      }

      if (model.turnFrequency === "A") {
        actor.initiative -= INITIATIVE_THRESHOLD;
      } else {
        actor.initiative = 0;
      }

      const attackersStillAlive = livingWarriors(warriors.filter((warrior) => warrior.side === "attacker"));
      const defendersStillAlive = livingWarriors(warriors.filter((warrior) => warrior.side === "defender"));

      if (attackersStillAlive.length === 0) {
        const metrics = buildMetrics(
          warriors,
          actionCount,
          events,
          preventedActions,
          actionActors,
          attackerDamageDealt,
          defenderDamageDealt,
          highestSingleHit,
          attackerKills,
          defenderKills,
          attackerTargetSelections,
          defenderTargetSelections,
          firstDefeatAction,
        );
        return buildOutcome("defender_win", input, metrics, actionLimit, actionCount, events);
      }

      if (defendersStillAlive.length === 0) {
        const metrics = buildMetrics(
          warriors,
          actionCount,
          events,
          preventedActions,
          actionActors,
          attackerDamageDealt,
          defenderDamageDealt,
          highestSingleHit,
          attackerKills,
          defenderKills,
          attackerTargetSelections,
          defenderTargetSelections,
          firstDefeatAction,
        );
        return buildOutcome("attacker_win", input, metrics, actionLimit, actionCount, events);
      }

      if (actionCount >= actionLimit) {
        if (model.defeatDraw === "K") {
          const metrics = buildMetrics(
            warriors,
            actionCount,
            events,
            preventedActions,
            actionActors,
            attackerDamageDealt,
            defenderDamageDealt,
            highestSingleHit,
            attackerKills,
            defenderKills,
            attackerTargetSelections,
            defenderTargetSelections,
            firstDefeatAction,
          );
          return buildOutcome("draw", input, metrics, actionLimit, actionCount, events);
        }

        drawPendingAtEndOfTick = true;
      }
    }

    if (drawPendingAtEndOfTick) {
      const metrics = buildMetrics(
        warriors,
        actionCount,
        events,
        preventedActions,
        actionActors,
        attackerDamageDealt,
        defenderDamageDealt,
        highestSingleHit,
        attackerKills,
        defenderKills,
        attackerTargetSelections,
        defenderTargetSelections,
        firstDefeatAction,
      );
      return buildOutcome("draw", input, metrics, actionLimit, actionCount, events);
    }
  }
}

function buildMetrics(
  warriors: BattleStateWarrior[],
  actionCount: number,
  events: LogEvent[],
  preventedActions: number,
  actionActors: string[],
  attackerDamageDealt: number,
  defenderDamageDealt: number,
  highestSingleHit: number,
  attackerKills: number,
  defenderKills: number,
  attackerTargetSelections: Map<string, number>,
  defenderTargetSelections: Map<string, number>,
  firstDefeatAction: number | undefined,
): BattleMetrics {
  let misses = 0;
  let landedHits = 0;
  let zeroDamageHits = 0;
  let fullAbsorptions = 0;
  let armorChipHits = 0;
  let armorChipDamage = 0;
  let hatredHits = 0;
  let repeatedTurns = 0;
  let maxActorStreak = 0;
  let currentActorStreak = 0;
  let previousActorId: string | undefined;

  for (const event of events) {
    switch (event.type) {
      case "miss":
        misses += 1;
        break;
      case "normal_hit":
        landedHits += 1;
        if (event.armorChipDamage !== undefined) {
          armorChipHits += 1;
          armorChipDamage += event.armorChipDamage;
        }
        break;
      case "zero_damage":
        landedHits += 1;
        zeroDamageHits += 1;
        break;
      case "full_absorption":
        landedHits += 1;
        fullAbsorptions += 1;
        break;
      case "armor_chip":
        landedHits += 1;
        if (event.wasFullAbsorption) {
          fullAbsorptions += 1;
        } else {
          zeroDamageHits += 1;
        }
        armorChipHits += 1;
        armorChipDamage += event.damage;
        break;
      case "hatred_hit":
        landedHits += 1;
        hatredHits += 1;
        if (event.armorChipDamage !== undefined) {
          armorChipHits += 1;
          armorChipDamage += event.armorChipDamage;
        }
        break;
      default:
        break;
    }
  }

  for (let index = 1; index < actionActors.length; index += 1) {
    if (actionActors[index] === actionActors[index - 1]) {
      repeatedTurns += 1;
    }
  }

  for (const actorId of actionActors) {
    if (actorId === previousActorId) {
      currentActorStreak += 1;
    } else {
      previousActorId = actorId;
      currentActorStreak = 1;
    }
    if (currentActorStreak > maxActorStreak) {
      maxActorStreak = currentActorStreak;
    }
  }

  const attackerTargetFocus = computeTargetFocus(attackerTargetSelections);
  const defenderTargetFocus = computeTargetFocus(defenderTargetSelections);

  return {
    actions: actionCount,
    misses,
    landedHits,
    zeroDamageHits,
    fullAbsorptions,
    armorChipHits,
    armorChipDamage,
    hatredHits,
    preventedActions,
    repeatedTurns,
    maxActorStreak,
    ...(firstDefeatAction !== undefined ? { firstDefeatAction } : {}),
    attackerDamageDealt,
    defenderDamageDealt,
    highestSingleHit,
    attackerKills,
    defenderKills,
    attackerTargetFocus,
    defenderTargetFocus,
    attackerRemainingHp: totalRemainingHp(warriors.filter((warrior) => warrior.side === "attacker")),
    defenderRemainingHp: totalRemainingHp(warriors.filter((warrior) => warrior.side === "defender")),
  };
}

function incrementSelectionCount(counts: Map<string, number>, targetId: string): void {
  counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
}

function incrementLandedHitCount(counts: Map<string, number>, targetId: string): number {
  const nextCount = (counts.get(targetId) ?? 0) + 1;
  counts.set(targetId, nextCount);
  return nextCount;
}

function computeTargetFocus(counts: Map<string, number>): number {
  let totalSelections = 0;
  let maxSelections = 0;

  for (const count of counts.values()) {
    totalSelections += count;
    if (count > maxSelections) {
      maxSelections = count;
    }
  }

  if (totalSelections === 0) {
    return 0;
  }

  return maxSelections / totalSelections;
}
