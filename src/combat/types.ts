export const TURN_FREQUENCY_CODES = ["A", "B"] as const;
export const TARGETING_CODES = ["C"] as const;
export const HIT_RESOLUTION_CODES = ["D", "E"] as const;
export const DAMAGE_ROLL_CODES = ["F", "G"] as const;
export const DEFENSE_RESOLUTION_CODES = ["H"] as const;
export const HATRED_CODES = ["I", "J"] as const;
export const DEFEAT_DRAW_CODES = ["K", "L"] as const;
export const RANDOMNESS_CODES = ["M"] as const;
export const LOG_VOCABULARY_CODES = ["N"] as const;

export type TurnFrequencyCode = (typeof TURN_FREQUENCY_CODES)[number];
export type TargetingCode = (typeof TARGETING_CODES)[number];
export type HitResolutionCode = (typeof HIT_RESOLUTION_CODES)[number];
export type DamageRollCode = (typeof DAMAGE_ROLL_CODES)[number];
export type DefenseResolutionCode = (typeof DEFENSE_RESOLUTION_CODES)[number];
export type HatredCode = (typeof HATRED_CODES)[number];
export type DefeatDrawCode = (typeof DEFEAT_DRAW_CODES)[number];
export type RandomnessCode = (typeof RANDOMNESS_CODES)[number];
export type LogVocabularyCode = (typeof LOG_VOCABULARY_CODES)[number];

export type ModelCode = `${TurnFrequencyCode}${TargetingCode}${HitResolutionCode}${DamageRollCode}${DefenseResolutionCode}${HatredCode}${DefeatDrawCode}${RandomnessCode}${LogVocabularyCode}`;

export type Race = "Human" | "Orc" | "Elf" | "Dwarf" | "Goblin";
export type SideId = "attacker" | "defender";

export interface StatLine {
  hp: number;
  damage: number;
  defense: number;
  accuracy: number;
  agility: number;
  speed: number;
}

export interface WarriorSnapshot {
  id: string;
  name: string;
  race: Race;
  stats: StatLine;
  currentHp?: number;
}

export interface WarriorTemplate {
  id: string;
  race: Race;
  className: string;
  unlockLordLevel: number;
  cost: number;
  stats: StatLine;
}

export interface BattleSide {
  lordId: string;
  lordName: string;
  level?: number;
  warriors: WarriorSnapshot[];
}

export interface BattleInput {
  modelCode: ModelCode;
  seed: number;
  attacker: BattleSide;
  defender: BattleSide;
}

export interface ScenarioDefinition {
  id: string;
  description: string;
  attacker: BattleSide;
  defender: BattleSide;
}

export interface RenderContext {
  attackerLordName: string;
  defenderLordName: string;
}

export type LogEvent =
  | { type: "miss"; attackerName: string; defenderName: string }
  | { type: "normal_hit"; attackerName: string; defenderName: string; damage: number; defenderHpLeft: number }
  | { type: "zero_damage"; attackerName: string; defenderName: string }
  | { type: "full_absorption"; attackerName: string; defenderName: string }
  | { type: "hatred_hit"; attackerName: string; defenderName: string; damage: number; defenderHpLeft: number }
  | { type: "warrior_defeat"; warriorName: string }
  | { type: "battle_victory"; winnerLordName: string; loserLordName: string }
  | { type: "battle_loss"; loserLordName: string; winnerLordName: string }
  | { type: "battle_tie"; attackerLordName: string; defenderLordName: string }
  | { type: "rewards_applied"; recipientName: string; gold?: number; lordXp?: number; warriorXp?: number };

export interface BattleMetrics {
  actions: number;
  misses: number;
  landedHits: number;
  zeroDamageHits: number;
  fullAbsorptions: number;
  hatredHits: number;
  preventedActions: number;
  repeatedTurns: number;
  maxActorStreak: number;
  firstDefeatAction?: number;
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  highestSingleHit: number;
  attackerKills: number;
  defenderKills: number;
  attackerTargetFocus: number;
  defenderTargetFocus: number;
  attackerRemainingHp: number;
  defenderRemainingHp: number;
}

export type BattleOutcome = "attacker_win" | "defender_win" | "draw";

export interface BattleResult {
  modelCode: ModelCode;
  seed: number;
  outcome: BattleOutcome;
  winnerLordName?: string;
  actionLimit: number;
  actionCount: number;
  metrics: BattleMetrics;
  logEvents: LogEvent[];
  logLines: string[];
}

export interface ScenarioAggregate {
  scenarioId: string;
  modelCode: ModelCode;
  seeds: number[];
  runs: number;
  attackerWins: number;
  defenderWins: number;
  draws: number;
  averageActions: number;
  missRate: number;
  landedHitRate: number;
  zeroDamageRate: number;
  fullAbsorptionRate: number;
  hatredHitRate: number;
  averageDamagePerAction: number;
  averageDamagePerLandedHit: number;
  averageAttackerDamageDealt: number;
  averageDefenderDamageDealt: number;
  averageHighestSingleHit: number;
  averageAttackerKills: number;
  averageDefenderKills: number;
  firstDefeatActionAverage: number;
  preventedActionsPerBattle: number;
  repeatTurnRate: number;
  maxActorStreakAverage: number;
  attackerTargetFocusAverage: number;
  defenderTargetFocusAverage: number;
  attackerRemainingHpAverage: number;
  defenderRemainingHpAverage: number;
}

export interface BattleStateWarrior {
  id: string;
  name: string;
  race: Race;
  side: SideId;
  currentHp: number;
  maxHp: number;
  stats: StatLine;
  initiative: number;
}

export interface CombatModel {
  code: ModelCode;
  turnFrequency: TurnFrequencyCode;
  targeting: TargetingCode;
  hitResolution: HitResolutionCode;
  damageRoll: DamageRollCode;
  defenseResolution: DefenseResolutionCode;
  hatred: HatredCode;
  defeatDraw: DefeatDrawCode;
  randomness: RandomnessCode;
  logVocabulary: LogVocabularyCode;
}
