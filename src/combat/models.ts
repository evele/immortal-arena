import {
  ALL_MODEL_CODES_INTERNAL,
  HATRED_TARGETS,
  MODEL_CODE_LENGTH,
  VALID_CODE_SETS,
} from "./models-internal.ts";
import type { CombatModel, ModelCode } from "./types.ts";

export const ALL_MODEL_CODES = ALL_MODEL_CODES_INTERNAL;

export function isValidModelCode(code: string): code is ModelCode {
  if (code.length !== MODEL_CODE_LENGTH) {
    return false;
  }

  return code.split("").every((letter, index) => VALID_CODE_SETS[index]?.has(letter) ?? false);
}

export function buildCombatModel(code: string): CombatModel {
  if (!isValidModelCode(code)) {
    throw new Error(`Invalid model code: ${code}`);
  }

  const letters = code.split("");

  return {
    code: code as ModelCode,
    turnFrequency: letters[0] as CombatModel["turnFrequency"],
    targeting: letters[1] as CombatModel["targeting"],
    hitResolution: letters[2] as CombatModel["hitResolution"],
    damageRoll: letters[3] as CombatModel["damageRoll"],
    defenseResolution: letters[4] as CombatModel["defenseResolution"],
    hatred: letters[5] as CombatModel["hatred"],
    defeatDraw: letters[6] as CombatModel["defeatDraw"],
    randomness: letters[7] as CombatModel["randomness"],
    logVocabulary: letters[8] as CombatModel["logVocabulary"],
  };
}

export function hatesRace(attackerRace: keyof typeof HATRED_TARGETS, defenderRace: keyof typeof HATRED_TARGETS): boolean {
  return HATRED_TARGETS[attackerRace] === defenderRace;
}
