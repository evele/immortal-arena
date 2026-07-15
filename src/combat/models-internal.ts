import {
  DAMAGE_ROLL_CODES,
  DEFEAT_DRAW_CODES,
  DEFENSE_RESOLUTION_CODES,
  HATRED_CODES,
  HIT_RESOLUTION_CODES,
  LOG_VOCABULARY_CODES,
  RANDOMNESS_CODES,
  TARGETING_CODES,
  TURN_FREQUENCY_CODES,
  type ModelCode,
  type Race,
} from "./types.ts";

export const MODEL_CODE_LENGTH = 9;

export const VALID_CODE_SETS: ReadonlyArray<Set<string>> = [
  new Set(TURN_FREQUENCY_CODES),
  new Set(TARGETING_CODES),
  new Set(HIT_RESOLUTION_CODES),
  new Set(DAMAGE_ROLL_CODES),
  new Set(DEFENSE_RESOLUTION_CODES),
  new Set(HATRED_CODES),
  new Set(DEFEAT_DRAW_CODES),
  new Set(RANDOMNESS_CODES),
  new Set(LOG_VOCABULARY_CODES),
];

export const HATRED_TARGETS: Record<Race, Race> = {
  Orc: "Human",
  Human: "Goblin",
  Goblin: "Elf",
  Elf: "Dwarf",
  Dwarf: "Orc",
};

const codes: ModelCode[] = [];

for (const turn of TURN_FREQUENCY_CODES) {
  for (const targeting of TARGETING_CODES) {
    for (const hit of HIT_RESOLUTION_CODES) {
      for (const damage of DAMAGE_ROLL_CODES) {
        for (const defense of DEFENSE_RESOLUTION_CODES) {
          for (const hatred of HATRED_CODES) {
            for (const defeatDraw of DEFEAT_DRAW_CODES) {
              for (const randomness of RANDOMNESS_CODES) {
                for (const log of LOG_VOCABULARY_CODES) {
                  codes.push(`${turn}${targeting}${hit}${damage}${defense}${hatred}${defeatDraw}${randomness}${log}` as ModelCode);
                }
              }
            }
          }
        }
      }
    }
  }
}

export const ALL_MODEL_CODES_INTERNAL = codes;
