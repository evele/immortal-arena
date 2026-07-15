import {
  createWarriorFromTemplate,
  getStrongestUnlockedTemplateForRace,
  getWarriorTemplateByClassName,
} from "../catalog.ts";
import type { Race, ScenarioDefinition } from "../types.ts";
import { CATALOG_SCENARIOS } from "./catalog.ts";
import { SYNTHETIC_SCENARIOS } from "./synthetic.ts";

export type ScenarioSource = "synthetic" | "catalog" | "generated";

export interface ScenarioLookupOptions {
  scenarioId?: string;
  attackerClassName?: string;
  defenderClassName?: string;
  attackerRace?: Race;
  defenderRace?: Race;
  lordLevel?: number;
}

export interface ScenarioSummary {
  id: string;
  source: ScenarioSource;
  description: string;
  attackerWarriorCount: number;
  defenderWarriorCount: number;
  attackerLordLevel?: number;
  defenderLordLevel?: number;
}

const BUILTIN_SCENARIOS: Array<{ source: ScenarioSource; scenarios: ScenarioDefinition[] }> = [
  { source: "synthetic", scenarios: SYNTHETIC_SCENARIOS },
  { source: "catalog", scenarios: CATALOG_SCENARIOS },
];

export const ALL_SCENARIOS: ScenarioDefinition[] = BUILTIN_SCENARIOS.flatMap((entry) => entry.scenarios);

function slugify(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");
}

export function getScenarioById(id: string): ScenarioDefinition {
  const scenario = ALL_SCENARIOS.find((entry) => entry.id === id);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${id}`);
  }

  return scenario;
}

export function getScenarioSource(id: string): ScenarioSource {
  for (const entry of BUILTIN_SCENARIOS) {
    if (entry.scenarios.some((scenario) => scenario.id === id)) {
      return entry.source;
    }
  }

  return "generated";
}

export function listScenarioSummaries(): ScenarioSummary[] {
  return ALL_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    source: getScenarioSource(scenario.id),
    description: scenario.description,
    attackerWarriorCount: scenario.attacker.warriors.length,
    defenderWarriorCount: scenario.defender.warriors.length,
    ...(scenario.attacker.level !== undefined ? { attackerLordLevel: scenario.attacker.level } : {}),
    ...(scenario.defender.level !== undefined ? { defenderLordLevel: scenario.defender.level } : {}),
  }));
}

export function buildCatalogClassDuelScenario(attackerClassName: string, defenderClassName: string): ScenarioDefinition {
  const attackerTemplate = getWarriorTemplateByClassName(attackerClassName);
  const defenderTemplate = getWarriorTemplateByClassName(defenderClassName);
  const lordLevel = Math.max(attackerTemplate.unlockLordLevel, defenderTemplate.unlockLordLevel);

  return {
    id: `generated-${slugify(attackerClassName)}-vs-${slugify(defenderClassName)}`,
    description: `Generated catalog duel: ${attackerClassName} versus ${defenderClassName}.`,
    attacker: {
      lordId: `generated-${slugify(attackerClassName)}-lord`,
      lordName: `Lord ${attackerClassName}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(attackerTemplate, "a1", attackerTemplate.className)],
    },
    defender: {
      lordId: `generated-${slugify(defenderClassName)}-lord`,
      lordName: `Lord ${defenderClassName}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(defenderTemplate, "d1", defenderTemplate.className)],
    },
  };
}

export function buildCatalogRaceLevelScenario(attackerRace: Race, defenderRace: Race, lordLevel: number): ScenarioDefinition {
  const attackerTemplate = getStrongestUnlockedTemplateForRace(attackerRace, lordLevel);
  const defenderTemplate = getStrongestUnlockedTemplateForRace(defenderRace, lordLevel);

  return {
    id: `generated-l${lordLevel}-${slugify(attackerRace)}-vs-${slugify(defenderRace)}`,
    description: `Generated strongest-unlocked duel at lord level ${lordLevel}: ${attackerTemplate.className} versus ${defenderTemplate.className}.`,
    attacker: {
      lordId: `generated-${slugify(attackerRace)}-l${lordLevel}`,
      lordName: `Lord ${attackerRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(attackerTemplate, "a1", attackerTemplate.className)],
    },
    defender: {
      lordId: `generated-${slugify(defenderRace)}-l${lordLevel}`,
      lordName: `Lord ${defenderRace}`,
      level: lordLevel,
      warriors: [createWarriorFromTemplate(defenderTemplate, "d1", defenderTemplate.className)],
    },
  };
}

export function resolveScenario(options: ScenarioLookupOptions): ScenarioDefinition {
  if (options.scenarioId) {
    return getScenarioById(options.scenarioId);
  }

  if (options.attackerClassName && options.defenderClassName) {
    return buildCatalogClassDuelScenario(options.attackerClassName, options.defenderClassName);
  }

  if (options.attackerRace && options.defenderRace && options.lordLevel !== undefined) {
    return buildCatalogRaceLevelScenario(options.attackerRace, options.defenderRace, options.lordLevel);
  }

  return ALL_SCENARIOS[0]!;
}
