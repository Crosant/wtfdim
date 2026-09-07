export type Role = 'tank' | 'pureHealer' | 'shieldHealer' | 'melee' | 'physRanged' | 'caster';

export type JobId =
  | 'PLD' | 'WAR' | 'DRK' | 'GNB'
  | 'WHM' | 'AST'
  | 'SCH' | 'SGE'
  | 'MNK' | 'DRG' | 'NIN' | 'SAM' | 'RPR' | 'VPR'
  | 'BRD' | 'MCH' | 'DNC'
  | 'BLM' | 'SMN' | 'RDM' | 'PCT';

export interface JobMeta {
  id: JobId;
  name: string;
  role: Role;
  color: string;
  iconBg: string;
}

export type DamageType = 'magic' | 'physical' | 'darkness' | 'unique';

export type MechanicSeverity = 'raidwide' | 'tankbuster' | 'heavy_mechanic' | 'towers' | 'auto' | 'enrage';

export interface Mechanic {
  id: string;
  phase: number;
  phaseName: string;
  timestamp: string;      // mm:ss format
  seconds: number;        // integer seconds from phase start
  name: string;
  damageType: DamageType;
  rawDamage?: string;     // Estimated unmitigated damage
  severity: MechanicSeverity;
  description?: string;
}

// Universal role slots that dynamically resolve depending on chosen team roster
export type RoleSlot =
  | 'physRanged'      // D3: Troubadour (BRD) / Tactician (MCH) / Shield Samba (DNC)
  | 'physRanged2'     // For second Phys Ranged in double-physR setups
  | 'caster'          // D4: Addle
  | 'caster2'         // For second Caster in double-caster setups
  | 'melee1'          // D1: Feint
  | 'melee2'          // D2: Feint
  | 'mtPartyMit'      // MT 90s party defensive
  | 'otPartyMit'      // OT 90s party defensive
  | 'mtReprisal'      // MT Reprisal
  | 'otReprisal'      // OT Reprisal
  | 'mtInvuln'        // MT invulnerability skill
  | 'otInvuln'        // OT invulnerability skill
  | 'mtBusterMit'     // MT heavy tankbuster defensive (30% + short cooldown)
  | 'otBusterMit'     // OT heavy tankbuster defensive
  | 'otSupport'       // OT targeted single-target mitigation on MT
  | 'mtSupport'       // MT targeted single-target mitigation on OT
  | 'mtEmbraceMit'    // MT defensives for dual-tankbuster
  | 'otEmbraceMit'    // OT defensives for dual-tankbuster
  | 'mtProvoke'       // MT Provoke (tank swap)
  | 'otProvoke'       // OT Provoke (tank swap)
  | 'tankLb3';        // Tank Limit Break 3

export interface PlanAction {
  job?: JobId;            // Specific job if action is job-unique (e.g. WHM, SCH, SGE, AST)
  roleSlot?: RoleSlot;    // Role assignment that resolves to whichever job is in that slot
  skill: string;          // Canonical fallback skill name
  carryOver?: boolean;    // Indicates carryover from a prior cast
  target?: string;        // e.g. "MT", "OT", "Party", "Chaos", "Exdeath"
  timingNote?: string;    // Action cue, e.g. "at 80% castbar" or "after knockback"
  isOptional?: boolean;
}

export interface PlanRow {
  mechanicId: string;
  timestamp: string;
  mechanicName: string;
  damageType: DamageType;
  rawDamage?: string;
  actions: PlanAction[];
  notes?: string;
}

export interface PartyComposition {
  mt: JobId;
  ot: JobId;
  h1: JobId;
  h2: JobId;
  d1: JobId;
  d2: JobId;
  d3: JobId;
  d4: JobId;
}

export interface MitPlanVariant {
  id: string;
  name: string;
  shortName: string;
  description: string;
  authors: string;
  sourceUrl?: string;
  rows: PlanRow[];
}

export type PositionSlot = 'MT' | 'OT' | 'H1' | 'H2' | 'D1' | 'D2' | 'D3' | 'D4';
export type ViewMode = 'matrix' | 'cheat';
