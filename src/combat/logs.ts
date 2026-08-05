import type { LogEvent, RenderContext } from "./types.ts";

export function renderLogEvent(event: LogEvent, _context: RenderContext): string {
  switch (event.type) {
    case "miss":
      return `${event.attackerName} misses ${event.defenderName}.`;
    case "normal_hit":
      return `${event.attackerName} strikes ${event.defenderName} for ${event.damage} damage${formatDamageDetails(event)}. ${event.defenderName} has ${event.defenderHpLeft} HP left.`;
    case "zero_damage":
      return `${event.attackerName} strikes ${event.defenderName} for 0 damage.`;
    case "full_absorption":
      return `${event.attackerName} strikes ${event.defenderName}, but ${event.defenderName}'s armour absorbs the full blow.`;
    case "armor_chip":
      return `${event.attackerName} strikes ${event.defenderName}, but ${event.defenderName}'s armour absorbs most of the blow. ${event.defenderName} takes ${event.damage} wear damage${formatDamageDetails(event)} and has ${event.defenderHpLeft} HP left.`;
    case "hatred_hit":
      return `${event.attackerName} viciously attacks ${event.defenderName} for ${event.damage} damage${formatDamageDetails(event)}. ${event.defenderName} has ${event.defenderHpLeft} HP left.`;
    case "warrior_defeat":
      return `${event.warriorName} has perished.`;
    case "battle_victory":
      return `${event.winnerLordName} defeats ${event.loserLordName}.`;
    case "battle_loss":
      return `${event.loserLordName} loses to ${event.winnerLordName}.`;
    case "battle_tie":
      return `${event.attackerLordName} and ${event.defenderLordName} fight to a draw.`;
    case "rewards_applied": {
      const parts: string[] = [];
      if (event.gold !== undefined) {
        parts.push(`${event.gold} gold`);
      }
      if (event.lordXp !== undefined) {
        parts.push(`${event.lordXp} lord XP`);
      }
      if (event.warriorXp !== undefined) {
        parts.push(`${event.warriorXp} warrior XP`);
      }
      return `${event.recipientName} gains ${parts.join(" and ")}.`;
    }
  }
}

function formatDamageDetails(event: LogEvent): string {
  const details: string[] = [];
  if ("armorChipDamage" in event && event.armorChipDamage) {
    details.push(`${event.armorChipDamage} armor chip`);
  }

  return details.length === 0 ? "" : `, including ${details.join(" and ")}`;
}

export function renderLogEvents(events: LogEvent[], context: RenderContext): string[] {
  return events.map((event) => renderLogEvent(event, context));
}
