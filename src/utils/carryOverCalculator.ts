import { PlanRow, PlanAction } from '../types/mitigation';
import { DMU_TIMELINE } from '../data/dmuTimeline';

/**
 * Converts mm:ss timestamp format into total seconds from phase start.
 */
export function timestampToSeconds(timestamp: string): number {
  const [minutes, seconds] = timestamp.split(':').map(Number);
  return minutes * 60 + seconds;
}

const mechPhaseMap = new Map(DMU_TIMELINE.map(m => [m.id, m.phase]));

/**
 * Standard raid mitigation durations in FFXIV Dawntrail (in seconds).
 * Standardized across role-action mits:
 * - Melee Feint: 15s (10% physical / 5% magic)
 * - Caster Addle: 15s (10% magic / 5% physical)
 * - Physical Ranged Mit (Troubadour / Tactician / Shield Samba): 15s (10% damage reduction)
 */
const DPS_MIT_DURATIONS: Record<string, number> = {
  melee1: 15,
  melee2: 15,
  physRanged: 15,
  physRanged2: 15,
  caster: 15,
  caster2: 15,
};

const DPS_ROLE_SLOTS = new Set(Object.keys(DPS_MIT_DURATIONS));

/**
 * Computes and enriches mitigation carryovers based on ability duration and timeline timestamps.
 * If a 15-second defensive is activated at mechanic T0, any subsequent mechanic in the same
 * phase occurring at T <= T0 + 15s will display that defensive with carryOver: true.
 *
 * Handles:
 * 1. Automatic insertion of missing carryover chips on subsequent hits within the 15s window.
 * 2. Correction of misflagged actions that occur within 15s of an initial cast to carryOver: true.
 * 3. Clearing buffs/debuffs on phase boundaries to respect raid cutscenes and downtime.
 * 4. Non-stacking role supersession (e.g. fresh Melee 2 Feint overwrites an active Melee 1 Feint).
 */
export function calculateCarryOvers(rows: PlanRow[]): PlanRow[] {
  // Track active mitigation per roleSlot: slot -> { castAt: number, skill: string, phase: number }
  const activeMits = new Map<string, { castAt: number; skill: string; phase: number }>();
  let currentPhase = 1;

  return rows.map(row => {
    const phase = mechPhaseMap.get(row.mechanicId) || 1;
    const t = timestampToSeconds(row.timestamp);

    // Reset active cooldowns on phase transition (cutscenes/downtime clear active buffs/debuffs)
    if (phase !== currentPhase) {
      activeMits.clear();
      currentPhase = phase;
    }

    // Check which slots have fresh casts in this row
    const freshSlotsInRow = new Set<string>();
    for (const a of row.actions) {
      if (a.roleSlot && DPS_ROLE_SLOTS.has(a.roleSlot)) {
        if (!a.carryOver) {
          freshSlotsInRow.add(a.roleSlot);
          activeMits.set(a.roleSlot, { castAt: t, skill: a.skill, phase });
        }
      }
    }

    // Overwrite non-stacking role slots when an alternate slot freshly casts
    if (freshSlotsInRow.has('melee1')) activeMits.delete('melee2');
    if (freshSlotsInRow.has('melee2')) activeMits.delete('melee1');
    if (freshSlotsInRow.has('caster')) activeMits.delete('caster2');
    if (freshSlotsInRow.has('caster2')) activeMits.delete('caster');
    if (freshSlotsInRow.has('physRanged')) activeMits.delete('physRanged2');
    if (freshSlotsInRow.has('physRanged2')) activeMits.delete('physRanged');

    // Build the row's actions, updating existing actions and appending missing carryovers
    const updatedActions: PlanAction[] = [];
    const handledSlots = new Set<string>();

    for (const a of row.actions) {
      if (a.roleSlot && DPS_ROLE_SLOTS.has(a.roleSlot)) {
        handledSlots.add(a.roleSlot);
        const active = activeMits.get(a.roleSlot);
        const duration = DPS_MIT_DURATIONS[a.roleSlot] || 15;
        // If an entry was marked fresh but was actually cast within the last 15s in the same phase:
        if (!a.carryOver && active && t > active.castAt && (t - active.castAt) <= duration) {
          updatedActions.push({ ...a, carryOver: true });
        } else {
          updatedActions.push(a);
        }
      } else {
        updatedActions.push(a);
      }
    }

    // Inject any active carryover that wasn't already in this row's actions
    for (const [slot, info] of activeMits.entries()) {
      if (handledSlots.has(slot) || freshSlotsInRow.has(slot)) continue;

      const duration = DPS_MIT_DURATIONS[slot] || 15;
      const elapsed = t - info.castAt;
      if (elapsed > 0 && elapsed <= duration) {
        updatedActions.push({
          roleSlot: slot as any,
          skill: info.skill,
          carryOver: true
        });
      } else if (elapsed > duration) {
        activeMits.delete(slot);
      }
    }

    return {
      ...row,
      actions: updatedActions
    };
  });
}
