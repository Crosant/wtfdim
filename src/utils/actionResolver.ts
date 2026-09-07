import { JobId, PartyComposition, PlanAction } from '../types/mitigation';

// Resolves physical ranged role defensive based on chosen job
export function getPhysRSkillName(job: JobId): string {
  switch (job) {
    case 'BRD': return 'Troubadour';
    case 'MCH': return 'Tactician';
    case 'DNC': return 'Shield Samba';
    default: return 'Troub / Tact / Samba';
  }
}

// Resolves tank 90s party defensive based on chosen tank job
export function getTankPartyMitName(job: JobId): string {
  switch (job) {
    case 'WAR': return 'Shake It Off';
    case 'PLD': return 'Divine Veil';
    case 'DRK': return 'Dark Missionary';
    case 'GNB': return 'Heart of Light';
    default: return 'Tank Party Mit';
  }
}

// Resolves tank invulnerability skill based on chosen job
export function getTankInvulnName(job: JobId): string {
  switch (job) {
    case 'WAR': return 'Holmgang';
    case 'PLD': return 'Hallowed Ground';
    case 'DRK': return 'Living Dead';
    case 'GNB': return 'Superbolide';
    default: return 'Tank Invuln';
  }
}

// Resolves major defensive stack for heavy tankbusters based on job
export function getTankBusterKitchenSink(job: JobId): string {
  switch (job) {
    case 'WAR': return 'Damnation + Bloodwhetting';
    case 'PLD': return 'Sentinel + Holy Sheltron';
    case 'DRK': return 'Shadowed Vigil + TBN';
    case 'GNB': return 'Great Nebula + Corundum';
    default: return 'Full Defensives';
  }
}

// Resolves targeted single-target defensive from one tank onto another
export function getTankSupportName(job: JobId): string {
  switch (job) {
    case 'WAR': return 'Nascent Flash';
    case 'PLD': return 'Intervention';
    case 'DRK': return 'TBN + Oblation';
    case 'GNB': return 'Heart of Corundum';
    default: return 'Tank Single-Target Mit';
  }
}

// Resolves dual tankbuster defensives for MT and OT slots
export function getTankEmbraceMit(job: JobId, slot: 'mt' | 'ot'): string {
  if (slot === 'mt') {
    switch (job) {
      case 'WAR': return 'Damnation + Rampart';
      case 'PLD': return 'Sentinel + Rampart';
      case 'DRK': return 'Shadowed Vigil + Rampart';
      case 'GNB': return 'Great Nebula + Rampart';
      default: return 'Rampart + 30%';
    }
  } else {
    switch (job) {
      case 'WAR': return 'Bloodwhetting + Thrill';
      case 'PLD': return 'Holy Sheltron + Bulwark';
      case 'DRK': return 'TBN + Dark Mind';
      case 'GNB': return 'Heart of Corundum + Camouflage';
      default: return 'Short CD + Defense';
    }
  }
}

export interface ResolvedAction {
  job: JobId;
  skill: string;
  carryOver?: boolean;
  target?: string;
  timingNote?: string;
  isOptional?: boolean;
  slotTag?: string;
}

const CASTER_JOBS: JobId[] = ['BLM', 'SMN', 'RDM', 'PCT'];
const MELEE_JOBS: JobId[] = ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'];
const PHYS_R_JOBS: JobId[] = ['BRD', 'MCH', 'DNC'];
const TANK_JOBS: JobId[] = ['WAR', 'PLD', 'DRK', 'GNB'];

// Resolves generic role slots into active party member skills.
// Returns null if a conditional slot (e.g. caster2, melee2) does not match the party composition.
export function resolveActionForParty(action: PlanAction, partyComp: PartyComposition): ResolvedAction | null {
  if (action.roleSlot) {
    switch (action.roleSlot) {
      case 'physRanged': {
        const job = partyComp.d3 || 'DNC';
        return {
          job,
          skill: getPhysRSkillName(job),
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D3'
        };
      }
      case 'physRanged2': {
        if (!PHYS_R_JOBS.includes(partyComp.d2)) {
          return null;
        }
        return {
          job: partyComp.d2,
          skill: getPhysRSkillName(partyComp.d2),
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D2'
        };
      }
      case 'caster': {
        const job = partyComp.d4 || 'PCT';
        return {
          job,
          skill: 'Addle',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D4'
        };
      }
      case 'caster2': {
        if (!CASTER_JOBS.includes(partyComp.d2)) {
          return null;
        }
        return {
          job: partyComp.d2,
          skill: 'Addle',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D2'
        };
      }
      case 'melee1': {
        const job = partyComp.d1 || 'SAM';
        return {
          job,
          skill: 'Feint',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D1'
        };
      }
      case 'melee2': {
        if (!MELEE_JOBS.includes(partyComp.d2)) {
          return null;
        }
        return {
          job: partyComp.d2,
          skill: 'Feint',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'D2'
        };
      }
      case 'mtPartyMit': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: getTankPartyMitName(job),
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'otPartyMit': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: getTankPartyMitName(job),
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'mtReprisal': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: 'Reprisal',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'otReprisal': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: 'Reprisal',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'mtBusterMit': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: getTankBusterKitchenSink(job),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'otBusterMit': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: getTankBusterKitchenSink(job),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'otSupport': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: getTankSupportName(job),
          carryOver: action.carryOver,
          target: action.target || 'MT',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'mtSupport': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: getTankSupportName(job),
          carryOver: action.carryOver,
          target: action.target || 'OT',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'mtInvuln': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: getTankInvulnName(job),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'otInvuln': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: getTankInvulnName(job),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'mtEmbraceMit': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: getTankEmbraceMit(job, 'mt'),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'MT'
        };
      }
      case 'otEmbraceMit': {
        const job = partyComp.ot || 'PLD';
        return {
          job,
          skill: getTankEmbraceMit(job, 'ot'),
          carryOver: action.carryOver,
          target: action.target || 'Self',
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'OT'
        };
      }
      case 'tankLb3': {
        const job = partyComp.mt || 'WAR';
        return {
          job,
          skill: 'Tank LB3',
          carryOver: action.carryOver,
          target: action.target,
          timingNote: action.timingNote,
          isOptional: action.isOptional,
          slotTag: 'Tank'
        };
      }
    }
  }

  // Action is bound directly to a specific job
  const job = action.job || 'WAR';
  let slotTag: string | undefined = undefined;
  if (partyComp.mt === job) slotTag = 'MT';
  else if (partyComp.ot === job) slotTag = 'OT';

  return {
    job,
    skill: action.skill,
    carryOver: action.carryOver,
    target: action.target,
    timingNote: action.timingNote,
    isOptional: action.isOptional,
    slotTag
  };
}

// Determines if a plan action is applicable when viewing a specific job in Quick-Cheat
export function actionAppliesToJob(action: PlanAction, job: JobId, partyComp: PartyComposition): boolean {
  if (action.job) {
    return action.job === job;
  }

  if (!action.roleSlot) return false;

  switch (action.roleSlot) {
    case 'physRanged':
      return PHYS_R_JOBS.includes(job) && (partyComp.d3 === job || !PHYS_R_JOBS.includes(partyComp.d2));
    case 'physRanged2':
      return PHYS_R_JOBS.includes(job) && partyComp.d2 === job;
    case 'caster':
      return CASTER_JOBS.includes(job) && (partyComp.d4 === job || !CASTER_JOBS.includes(partyComp.d2));
    case 'caster2':
      return CASTER_JOBS.includes(job) && partyComp.d2 === job;
    case 'melee1':
      return MELEE_JOBS.includes(job) && (partyComp.d1 === job || !MELEE_JOBS.includes(partyComp.d2));
    case 'melee2':
      return MELEE_JOBS.includes(job) && partyComp.d2 === job;

    // MT specific actions
    case 'mtPartyMit':
    case 'mtReprisal':
    case 'mtBusterMit':
    case 'mtInvuln':
    case 'mtEmbraceMit':
    case 'mtSupport':
      return partyComp.mt === job || (TANK_JOBS.includes(job) && partyComp.ot !== job);

    // OT specific actions
    case 'otPartyMit':
    case 'otReprisal':
    case 'otBusterMit':
    case 'otInvuln':
    case 'otEmbraceMit':
    case 'otSupport':
      return partyComp.ot === job;

    case 'tankLb3':
      return TANK_JOBS.includes(job) && (partyComp.mt === job || partyComp.ot === job);

    default:
      return false;
  }
}

// Gets the display skill name for a specific job viewing this action
export function getSkillNameForJob(action: PlanAction, job: JobId): string {
  if (action.roleSlot) {
    if (action.roleSlot === 'physRanged' || action.roleSlot === 'physRanged2') {
      return getPhysRSkillName(job);
    }
    if (action.roleSlot === 'mtPartyMit' || action.roleSlot === 'otPartyMit') {
      return getTankPartyMitName(job);
    }
    if (action.roleSlot === 'caster' || action.roleSlot === 'caster2') {
      return 'Addle';
    }
    if (action.roleSlot === 'melee1' || action.roleSlot === 'melee2') {
      return 'Feint';
    }
    if (action.roleSlot === 'mtReprisal' || action.roleSlot === 'otReprisal') {
      return 'Reprisal';
    }
    if (action.roleSlot === 'mtInvuln' || action.roleSlot === 'otInvuln') {
      return getTankInvulnName(job);
    }
    if (action.roleSlot === 'mtBusterMit' || action.roleSlot === 'otBusterMit') {
      return getTankBusterKitchenSink(job);
    }
    if (action.roleSlot === 'otSupport' || action.roleSlot === 'mtSupport') {
      return getTankSupportName(job);
    }
    if (action.roleSlot === 'mtEmbraceMit') {
      return getTankEmbraceMit(job, 'mt');
    }
    if (action.roleSlot === 'otEmbraceMit') {
      return getTankEmbraceMit(job, 'ot');
    }
    if (action.roleSlot === 'tankLb3') {
      return 'Tank LB3';
    }
  }
  return action.skill;
}

