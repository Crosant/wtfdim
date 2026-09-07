import { JobId, JobMeta, Role } from '../types/mitigation';

// Canonical registry of available jobs and their styling metadata
export const JOB_REGISTRY: Record<JobId, JobMeta> = {
  // Tanks
  PLD: { id: 'PLD', name: 'Paladin', role: 'tank', color: '#a8d2e6', iconBg: '#2a5270' },
  WAR: { id: 'WAR', name: 'Warrior', role: 'tank', color: '#cf2621', iconBg: '#641b18' },
  DRK: { id: 'DRK', name: 'Dark Knight', role: 'tank', color: '#d126bf', iconBg: '#591652' },
  GNB: { id: 'GNB', name: 'Gunbreaker', role: 'tank', color: '#796d30', iconBg: '#4a431d' },

  // Pure Healers
  WHM: { id: 'WHM', name: 'White Mage', role: 'pureHealer', color: '#fff0dc', iconBg: '#63533e' },
  AST: { id: 'AST', name: 'Astrologian', role: 'pureHealer', color: '#ffe74a', iconBg: '#5c5421' },

  // Shield Healers
  SCH: { id: 'SCH', name: 'Scholar', role: 'shieldHealer', color: '#8657ff', iconBg: '#3f2878' },
  SGE: { id: 'SGE', name: 'Sage', role: 'shieldHealer', color: '#00d2b4', iconBg: '#0b5247' },

  // Melee DPS
  MNK: { id: 'MNK', name: 'Monk', role: 'melee', color: '#d69f00', iconBg: '#594406' },
  DRG: { id: 'DRG', name: 'Dragoon', role: 'melee', color: '#4163c5', iconBg: '#1f305e' },
  NIN: { id: 'NIN', name: 'Ninja', role: 'melee', color: '#af1923', iconBg: '#541217' },
  SAM: { id: 'SAM', name: 'Samurai', role: 'melee', color: '#e46d32', iconBg: '#693217' },
  RPR: { id: 'RPR', name: 'Reaper', role: 'melee', color: '#964040', iconBg: '#472222' },
  VPR: { id: 'VPR', name: 'Viper', role: 'melee', color: '#10b981', iconBg: '#094d37' },

  // Physical Ranged DPS
  BRD: { id: 'BRD', name: 'Bard', role: 'physRanged', color: '#91ba5e', iconBg: '#41522b' },
  MCH: { id: 'MCH', name: 'Machinist', role: 'physRanged', color: '#6ee1d4', iconBg: '#2e5752' },
  DNC: { id: 'DNC', name: 'Dancer', role: 'physRanged', color: '#e2b0af', iconBg: '#5e4343' },

  // Caster DPS
  BLM: { id: 'BLM', name: 'Black Mage', role: 'caster', color: '#a579d6', iconBg: '#452d5e' },
  SMN: { id: 'SMN', name: 'Summoner', role: 'caster', color: '#2d9b78', iconBg: '#184738' },
  RDM: { id: 'RDM', name: 'Red Mage', role: 'caster', color: '#e87b7b', iconBg: '#632d2d' },
  PCT: { id: 'PCT', name: 'Pictomancer', role: 'caster', color: '#ec4899', iconBg: '#611b3e' },
};

export const ROLE_LABELS: Record<Role, string> = {
  tank: 'Tank',
  pureHealer: 'Pure Healer',
  shieldHealer: 'Shield Healer',
  melee: 'Melee DPS',
  physRanged: 'Phys Ranged',
  caster: 'Caster DPS',
};

export const ROLE_COLORS: Record<Role, string> = {
  tank: '#3b82f6',
  pureHealer: '#10b981',
  shieldHealer: '#06b6d4',
  melee: '#ef4444',
  physRanged: '#f59e0b',
  caster: '#a855f7',
};

export const DEFAULT_COMPOSITION = {
  mt: 'WAR' as JobId,
  ot: 'PLD' as JobId,
  h1: 'WHM' as JobId,
  h2: 'SCH' as JobId,
  d1: 'SAM' as JobId,
  d2: 'NIN' as JobId,
  d3: 'DNC' as JobId,
  d4: 'PCT' as JobId,
};
