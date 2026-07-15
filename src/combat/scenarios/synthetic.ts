import type { ScenarioDefinition, StatLine } from "../types.ts";

function stats(hp: number, damage: number, defense: number, accuracy: number, agility: number, speed: number): StatLine {
  return { hp, damage, defense, accuracy, agility, speed };
}

export const SYNTHETIC_SCENARIOS: ScenarioDefinition[] = [
  {
    id: "equal-speed-duel",
    description: "Symmetric 1v1 duel to stress same-tick ties and seeded tie-breaks.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Aster",
      level: 1,
      warriors: [{ id: "a1", name: "Aster One", race: "Human", stats: stats(20, 6, 4, 5, 5, 5) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Brakka",
      level: 1,
      warriors: [{ id: "d1", name: "Brakka One", race: "Human", stats: stats(20, 6, 4, 5, 5, 5) }],
    },
  },
  {
    id: "speed-advantage-duel",
    description: "1v1 duel with a clear speed mismatch to compare overflow against reset-to-zero.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Swift",
      level: 1,
      warriors: [{ id: "a1", name: "Swiftblade", race: "Human", stats: stats(24, 6, 4, 5, 5, 9) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Slow",
      level: 1,
      warriors: [{ id: "d1", name: "Stonefoot", race: "Human", stats: stats(24, 6, 4, 5, 5, 4) }],
    },
  },
  {
    id: "high-defense-stall",
    description: "1v1 duel meant to generate many absorbed hits and possible draws.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Granite",
      level: 1,
      warriors: [{ id: "a1", name: "Granite Wall", race: "Dwarf", stats: stats(24, 4, 8, 5, 4, 4) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Bastion",
      level: 1,
      warriors: [{ id: "d1", name: "Bastion Guard", race: "Human", stats: stats(24, 4, 8, 5, 4, 4) }],
    },
  },
  {
    id: "hatred-matchup-duel",
    description: "1v1 Elf versus Dwarf duel to isolate racial-hatred damage behavior.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Sylva",
      level: 1,
      warriors: [{ id: "a1", name: "Sylva Blade", race: "Elf", stats: stats(22, 6, 4, 5, 5, 5) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Iron",
      level: 1,
      warriors: [{ id: "d1", name: "Iron Shield", race: "Dwarf", stats: stats(22, 6, 4, 5, 5, 5) }],
    },
  },
  {
    id: "low-accuracy-vs-high-agility",
    description: "1v1 duel to compare linear versus proportional hit chance behavior.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Blunt",
      level: 1,
      warriors: [{ id: "a1", name: "Blunt Edge", race: "Human", stats: stats(24, 7, 4, 2, 4, 5) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Shade",
      level: 1,
      warriors: [{ id: "d1", name: "Shade Step", race: "Human", stats: stats(20, 5, 4, 5, 9, 5) }],
    },
  },
  {
    id: "swingy-damage-check",
    description: "1v1 duel with matching stats to isolate damage-roll variance.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Ember",
      level: 1,
      warriors: [{ id: "a1", name: "Ember Fang", race: "Human", stats: stats(28, 10, 4, 6, 5, 5) }],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Ash",
      level: 1,
      warriors: [{ id: "d1", name: "Ash Guard", race: "Human", stats: stats(28, 10, 4, 6, 5, 5) }],
    },
  },
  {
    id: "focus-fire-2v2",
    description: "Symmetric 2v2 to observe targeting, natural focus, and tie handling.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Twin",
      level: 1,
      warriors: [
        { id: "a1", name: "Twin One", race: "Human", stats: stats(18, 6, 3, 5, 5, 5) },
        { id: "a2", name: "Twin Two", race: "Human", stats: stats(18, 6, 3, 5, 5, 5) },
      ],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Mirror",
      level: 1,
      warriors: [
        { id: "d1", name: "Mirror One", race: "Human", stats: stats(18, 6, 3, 5, 5, 5) },
        { id: "d2", name: "Mirror Two", race: "Human", stats: stats(18, 6, 3, 5, 5, 5) },
      ],
    },
  },
  {
    id: "same-tick-kill-2v2",
    description: "Fast 2v2 with fragile defenders to stress same-tick kills and prevented actions.",
    attacker: {
      lordId: "lord-a",
      lordName: "Lord Gore",
      level: 1,
      warriors: [
        { id: "a1", name: "Gore One", race: "Orc", stats: stats(16, 8, 2, 6, 5, 10) },
        { id: "a2", name: "Gore Two", race: "Orc", stats: stats(16, 8, 2, 6, 5, 10) },
      ],
    },
    defender: {
      lordId: "lord-b",
      lordName: "Lord Vale",
      level: 1,
      warriors: [
        { id: "d1", name: "Vale One", race: "Human", stats: stats(7, 6, 1, 5, 5, 9) },
        { id: "d2", name: "Vale Two", race: "Human", stats: stats(7, 6, 1, 5, 5, 9) },
      ],
    },
  },
];
