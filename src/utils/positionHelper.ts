import { JobId, PartyComposition, PositionSlot } from '../types/mitigation';
import { DEFAULT_COMPOSITION } from '../data/jobs';

const TANK_JOBS: JobId[] = ['WAR', 'PLD', 'DRK', 'GNB'];
const PURE_HEALER_JOBS: JobId[] = ['WHM', 'AST'];
const SHIELD_HEALER_JOBS: JobId[] = ['SCH', 'SGE'];
const MELEE_JOBS: JobId[] = ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'];
const PHYS_R_JOBS: JobId[] = ['BRD', 'MCH', 'DNC'];
const CASTER_JOBS: JobId[] = ['BLM', 'SMN', 'RDM', 'PCT'];

/**
 * Returns available combat positions for the given job.
 */
export function getAvailablePositionsForJob(job: JobId): PositionSlot[] {
  if (TANK_JOBS.includes(job)) {
    return ['MT', 'OT'];
  }
  if (PURE_HEALER_JOBS.includes(job)) {
    return ['H1', 'H2'];
  }
  if (SHIELD_HEALER_JOBS.includes(job)) {
    return ['H2', 'H1'];
  }
  if (MELEE_JOBS.includes(job)) {
    return ['D1', 'D2'];
  }
  if (PHYS_R_JOBS.includes(job)) {
    return ['D3', 'D2'];
  }
  if (CASTER_JOBS.includes(job)) {
    return ['D4', 'D2'];
  }
  return ['MT', 'OT'];
}

/**
 * Returns the default primary position for the given job.
 */
export function getDefaultPositionForJob(job: JobId): PositionSlot {
  if (TANK_JOBS.includes(job)) return 'MT';
  if (PURE_HEALER_JOBS.includes(job)) return 'H1';
  if (SHIELD_HEALER_JOBS.includes(job)) return 'H2';
  if (MELEE_JOBS.includes(job)) return 'D1';
  if (PHYS_R_JOBS.includes(job)) return 'D3';
  if (CASTER_JOBS.includes(job)) return 'D4';
  return 'MT';
}

/**
 * Returns a human-friendly role label for a position slot.
 */
export function getPositionLabel(pos: PositionSlot): string {
  switch (pos) {
    case 'MT': return 'Main Tank';
    case 'OT': return 'Off Tank';
    case 'H1': return 'Pure Healer';
    case 'H2': return 'Barrier Healer';
    case 'D1': return 'Melee 1';
    case 'D2': return 'Flex / D2';
    case 'D3': return 'Phys Ranged';
    case 'D4': return 'Caster';
    default: return pos;
  }
}

/**
 * Dynamically configures a valid PartyComposition where the target job occupies the chosen position slot.
 * Ensures complementary party slots are sensibly populated so all cross-mitigations resolve cleanly.
 */
export function createPartyCompForJobAndPosition(
  job: JobId,
  pos: PositionSlot,
  existingComp?: PartyComposition
): PartyComposition {
  const comp: PartyComposition = { ...(existingComp || DEFAULT_COMPOSITION) };

  if (pos === 'MT') {
    comp.mt = job;
    if (comp.ot === job) {
      comp.ot = (job === 'PLD' ? 'WAR' : 'PLD');
    }
  } else if (pos === 'OT') {
    comp.ot = job;
    if (comp.mt === job) {
      comp.mt = (job === 'WAR' ? 'PLD' : 'WAR');
    }
  } else if (pos === 'H1') {
    comp.h1 = job;
    if (comp.h2 === job) {
      comp.h2 = 'SGE';
    }
  } else if (pos === 'H2') {
    comp.h2 = job;
    if (comp.h1 === job) {
      comp.h1 = 'WHM';
    }
  } else if (pos === 'D1') {
    comp.d1 = job;
    if (comp.d2 === job) {
      comp.d2 = 'VPR';
    }
  } else if (pos === 'D2') {
    comp.d2 = job;
    if (MELEE_JOBS.includes(job) && comp.d1 === job) {
      comp.d1 = 'VPR';
    } else if (CASTER_JOBS.includes(job) && comp.d4 === job) {
      comp.d4 = 'BLM';
    } else if (PHYS_R_JOBS.includes(job) && comp.d3 === job) {
      comp.d3 = 'BRD';
    }
  } else if (pos === 'D3') {
    comp.d3 = job;
    if (comp.d2 === job) {
      comp.d2 = 'VPR';
    }
  } else if (pos === 'D4') {
    comp.d4 = job;
    if (comp.d2 === job) {
      comp.d2 = 'VPR';
    }
  }

  return comp;
}
