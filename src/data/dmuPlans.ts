import { MitPlanVariant, PlanRow } from '../types/mitigation';
import { calculateCarryOvers } from '../utils/carryOverCalculator';

// ==========================================
// 1. LPDU STANDARD MITIGATION COMPILE
// ==========================================
const LPDU_ROWS: PlanRow[] = [
  // ==========================================
  // PHASE 1: KEFKA
  // ==========================================
  {
    mechanicId: 'dmu-p1-01',
    timestamp: '00:16',
    mechanicName: 'Revolting Ruin III',
    damageType: 'magic',
    rawDamage: '1,300,000',
    actions: [
      { roleSlot: 'mtBusterMit', skill: 'MT Tankbuster CDs', target: 'Self', timingNote: 'Kitchen Sink (40% + Rampart + Short CD)' },
      { roleSlot: 'otSupport', skill: 'OT Single-Target Mit', target: 'MT', timingNote: 'Buddy Mit' },
      { roleSlot: 'otProvoke', skill: 'Provoke', target: 'Boss', timingNote: 'Provoke during castbar' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'MT', timingNote: 'Tetra OT' },
      { job: 'AST', skill: 'Exaltation + CI', target: 'MT', timingNote: 'All ST mits MT -> Ewer OT' },
      { job: 'SCH', skill: 'Protraction + Excog', target: 'MT', timingNote: 'Spreadlo off MT after 2nd hit, Excog OT' },
      { job: 'SGE', skill: 'Haima + Taurochole', target: 'MT', timingNote: 'E.Prog between hits then prep Zoe' },
    ],
    notes: 'Two hits: targets MT 1st in enmity then retargets 2nd in enmity. MT Kitchen Sinks (40% + Rampart + Short CD), OT Buddy Mits and Provokes during castbar to take enmity.'
  },
  {
    mechanicId: 'dmu-p1-03',
    timestamp: '00:38',
    mechanicName: 'Mystery Magic',
    damageType: 'magic',
    rawDamage: '220,000',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'As Kefka re-centers' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'During statue cast' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Temperance', timingNote: 'As spread/stacks appear' },
      { job: 'AST', skill: 'Neutral Sect + Sun Sign', timingNote: 'On tether spawn' },
      { job: 'SCH', skill: 'Spreadlo + Expedient', timingNote: '1 GCD after tethers' },
      { job: 'SGE', skill: 'Panhaima + Zoe E.Prog', timingNote: 'At end of castbar' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Early on cast' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'During castbar' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'During castbar' },
    ],
    notes: 'Mitigation snapshots here and carries over through Wave Cannon and the first Double-Trouble trap.'
  },
  {
    mechanicId: 'dmu-p1-04',
    timestamp: '00:43',
    mechanicName: 'Wave Cannon',
    damageType: 'magic',
    rawDamage: '325,000',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Pop after stack/spread' },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos + Kerachole', timingNote: 'Between hits' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Targeted line beams. Covered primarily by carried over defensives.'
  },
  {
    mechanicId: 'dmu-p1-05',
    timestamp: '00:50',
    mechanicName: 'Double-Trouble Trap',
    damageType: 'magic',
    rawDamage: '165,000',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Neutral Sect + Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Covers trap & confetti' },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Statue shockwave detonation.'
  },
  {
    mechanicId: 'dmu-p1-06',
    timestamp: '01:03',
    mechanicName: 'Light of Judgment',
    damageType: 'magic',
    rawDamage: '260,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', timingNote: 'Late in castbar' },
      { job: 'WHM', skill: 'Asylum + Plenary', timingNote: 'Late castbar' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'Flash bubble' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true, timingNote: 'Late soil covers TB' },
      { job: 'SGE', skill: 'Kerachole + E.Prog', timingNote: 'At 1 confetti' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Late castbar' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'Mitigate late into the castbar so 15s buffs persist into the upcoming Hyperdrive busters.'
  },
  {
    mechanicId: 'dmu-p1-07',
    timestamp: '01:05',
    mechanicName: 'Hyperdrive',
    damageType: 'magic',
    rawDamage: '700,000 x3',
    actions: [
      { roleSlot: 'otBusterMit', skill: 'OT Tankbuster CDs', target: 'Self', timingNote: 'Kitchen Sink (40% + Rampart + Short CD)' },
      { roleSlot: 'mtSupport', skill: 'MT Single-Target Mit', target: 'OT', timingNote: 'Buddy Mit' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Benison', target: 'OT' },
      { job: 'AST', skill: 'Celestial Intersection', target: 'OT', timingNote: 'Card mits + CI OT' },
      { job: 'SCH', skill: 'Aetherpact (Tether)', target: 'OT', timingNote: 'Fairy tether OT' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Taurochole', target: 'OT' },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'No castbar, occurs immediately after Light of Judgment on current tank (OT). OT Kitchen Sinks, MT Buddy Mits.'
  },
  {
    mechanicId: 'dmu-p1-08',
    timestamp: '01:28',
    mechanicName: 'Gravitas II (Part I)',
    damageType: 'magic',
    rawDamage: 'Gravity Soaks',
    actions: [
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'As cast begins' },
      { job: 'SCH', skill: 'Sacred Soil + Seraphism', timingNote: 'Soil late on 1st puddle' },
      { job: 'SGE', skill: 'Kerachole + Philosophia', timingNote: '1st puddle stack' },
    ],
    notes: 'First wave of puddle drops and movement healing.'
  },
  {
    mechanicId: 'dmu-p1-08b',
    timestamp: '01:38',
    mechanicName: 'Revolting Ruin III (TB3)',
    damageType: 'magic',
    rawDamage: '1,300,000',
    actions: [
      { roleSlot: 'mtProvoke', skill: 'Provoke', target: 'Boss', timingNote: 'Provoke during castbar' },
      { roleSlot: 'otInvuln', skill: 'OT Invulnerability', target: 'Self' },
      { job: 'WHM', skill: 'Benediction', target: 'OT', timingNote: 'If DRK Living Dead' },
    ],
    notes: 'Magic tankbuster on OT. OT Invulnerabilities take both hits; MT Provokes during castbar to swap boss back to MT.'
  },
  {
    mechanicId: 'dmu-p1-09',
    timestamp: '01:46',
    mechanicName: 'Gravitas II (Part II)',
    damageType: 'magic',
    rawDamage: 'Confetti Soaks',
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'Before 1st puddles' },
      { job: 'AST', skill: 'Horoscope + Celestial Opposition', timingNote: 'Walking back middle' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illum + Soil', timingNote: 'At least 3s on confetti' },
      { job: 'SGE', skill: 'Holos + Kerachole + Physis II', timingNote: 'At 14s confetti timer' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'For puddle soaks' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'For puddle soaks' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'For puddle soaks' },
    ],
    notes: 'Renew Soil and barriers with at least 3s left on confetti debuff so it persists into Light of Judgment 2.'
  },
  {
    mechanicId: 'dmu-p1-10',
    timestamp: '01:58',
    mechanicName: 'Double-Trouble Trap 2',
    damageType: 'magic',
    rawDamage: '165,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Panhaima + Zoe E.Prog' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Trap detonation during second statue sequence.'
  },
  {
    mechanicId: 'dmu-p1-11',
    timestamp: '02:12',
    mechanicName: 'Light of Judgment 2',
    damageType: 'magic',
    rawDamage: '260,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Asylum', timingNote: 'Off cooldown' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'For confetti / raidwide' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Zoe E.Prog' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'Heavy raidwide preceding directional arrows.'
  },
  {
    mechanicId: 'dmu-p1-11b',
    timestamp: '02:16',
    mechanicName: 'Hyperdrive (TB4)',
    damageType: 'magic',
    rawDamage: '700,000 x3',
    actions: [
      { roleSlot: 'mtInvuln', skill: 'MT Invulnerability', target: 'Self', timingNote: 'Kitchen sink if WAR' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'AST', skill: 'Neutral Sect', timingNote: 'Off cooldown' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'No castbar, occurs immediately after Light of Judgment 2 on MT. MT uses Invulnerability (WAR can alternatively kitchen sink this and save Holmgang for P2 Ultimate Embrace).'
  },
  {
    mechanicId: 'dmu-p1-12',
    timestamp: '02:29',
    mechanicName: 'Tele-trouncing',
    damageType: 'physical',
    rawDamage: 'Knockback + Arrows',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', timingNote: 'For arrows' },
      { job: 'WHM', skill: 'Temperance', timingNote: 'Off cd to align with P2' },
      { job: 'AST', skill: 'Sun Sign + Celestial Opposition', timingNote: 'Off cd' },
      { job: 'SCH', skill: 'Whispering Dawn + Expedient', timingNote: 'For movement' },
      { job: 'SGE', skill: 'Panhaima + Physis II', timingNote: 'After arrows placed' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'On boss before knockback' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'Before arrows' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'Before arrows' },
    ],
    notes: 'Pressing 2-minute cooldowns here guarantees they reset in time for P2 Forsaken.'
  },
  {
    mechanicId: 'dmu-p1-13',
    timestamp: '02:45',
    mechanicName: 'Double-Trouble Trap 3',
    damageType: 'magic',
    rawDamage: '165,000',
    actions: [
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Neutral Sect', timingNote: 'Pre-pop for P2' },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Third statue trap resolution.'
  },
  {
    mechanicId: 'dmu-p1-14',
    timestamp: '02:53',
    mechanicName: 'Indulgent Will',
    damageType: 'magic',
    rawDamage: '200,000',
    actions: [
      { job: 'WHM', skill: 'Divine Caress', carryOver: true },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Raidwide blast before final phase 1 check.'
  },
  {
    mechanicId: 'dmu-p1-15',
    timestamp: '03:07',
    mechanicName: 'Mystery Magic 2',
    damageType: 'magic',
    rawDamage: '220,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Zoe E.Prog' },
    ],
    notes: 'Final elemental resolution of Phase 1 before transition.'
  },

  // ==========================================
  // PHASE 2: FORSAKEN KEFKA
  // ==========================================
  {
    mechanicId: 'dmu-p2-01',
    timestamp: '00:24',
    mechanicName: 'Ultimate Embrace',
    damageType: 'magic',
    rawDamage: '1,200,000',
    actions: [
      { roleSlot: 'mtEmbraceMit', skill: 'MT Embrace Defensives', target: 'Self' },
      { roleSlot: 'otEmbraceMit', skill: 'OT Embrace Defensives', target: 'Self' },
      { job: 'WHM', skill: 'Aquaveil OT + Benison Both', target: 'Tanks' },
      { job: 'AST', skill: 'Exaltation OT + CI Both', target: 'Tanks' },
      { job: 'SCH', skill: 'Excogitation + Spreadlo', target: 'MT' },
      { job: 'SGE', skill: 'Holos + Taurochole + Haima', target: 'Tanks', timingNote: 'Holos early covers raidwide' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'On boss for buster' },
    ],
    notes: 'Heavy opening tankbuster. Pre-shield both tanks during transition.'
  },
  {
    mechanicId: 'dmu-p2-02',
    timestamp: '00:39',
    mechanicName: 'Forsaken (Cast)',
    damageType: 'magic',
    rawDamage: '280,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', timingNote: 'At 80% castbar' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'At 80% castbar' },
      { job: 'WHM', skill: 'Plenary + Asylum', timingNote: 'Mid-cast' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope', timingNote: 'On cast' },
      { job: 'SCH', skill: 'Sacred Soil + Spreadlo', timingNote: 'At 60% castbar' },
      { job: 'SGE', skill: 'Holos + Kerachole + Zoe E.Prog', timingNote: 'At 80% castbar' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'On castbar' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'On castbar' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'On castbar' },
    ],
    notes: 'Raidwide bleed initiator. Heavy shields mandatory.'
  },
  {
    mechanicId: 'dmu-p2-03',
    timestamp: '00:53',
    mechanicName: 'Towers I',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Assize + Plenary' },
      { job: 'AST', skill: 'Star detonation + Horoscope resolve' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Panhaima + Physis II', timingNote: 'T1' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'First tower soak wave.'
  },
  {
    mechanicId: 'dmu-p2-04',
    timestamp: '01:03',
    mechanicName: 'Towers II (Past/Future\'s End)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { job: 'AST', skill: 'Lady of Crowns' },
      { job: 'SCH', skill: 'Seraph Consolation 1', carryOver: true },
      { job: 'SGE', skill: 'Panhaima stack 2 + Kerachole' },
    ],
    notes: 'Second tower wave.'
  },
  {
    mechanicId: 'dmu-p2-05',
    timestamp: '01:14',
    mechanicName: 'Towers III (All Things Ending)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'AST', skill: 'Macrocosmos + Neutral Sect', timingNote: 'Moving to spot' },
      { job: 'SCH', skill: 'Sacred Soil 2', timingNote: 'Press off cd' },
      { job: 'SGE', skill: 'Kerachole + Philosophia' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'Set 3 (if double PhysR)' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'Set 3 (if double Caster)' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Set 3 (if double Melee)' },
    ],
    notes: 'Third tower wave requiring middle mitigation rotation.'
  },
  {
    mechanicId: 'dmu-p2-06',
    timestamp: '01:24',
    mechanicName: 'Towers IV (Past/Future\'s End)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'AST', skill: 'Macrocosmos manual resolve' },
      { job: 'SCH', skill: 'Sacred Soil 2', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Fourth tower wave.'
  },
  {
    mechanicId: 'dmu-p2-07',
    timestamp: '01:35',
    mechanicName: 'Towers V (All Things Ending)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell + Temperance', timingNote: 'Set 4/5' },
      { job: 'SCH', skill: 'Expedient + Sacred Soil', timingNote: 'Movement on set 5' },
      { job: 'SGE', skill: 'Panhaima', timingNote: 'Set 5' },
    ],
    notes: 'Expedient greatly eases movement during the fifth and sixth tower sets.'
  },
  {
    mechanicId: 'dmu-p2-08',
    timestamp: '01:45',
    mechanicName: 'Towers VI (Past/Future\'s End)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary + Temperance' },
      { job: 'AST', skill: 'Collective Unconscious + Neutral Sect' },
      { job: 'SCH', skill: 'Seraphism', carryOver: true },
      { job: 'SGE', skill: 'Philosophia + Panhaima' },
    ],
    notes: 'Sixth tower wave.'
  },
  {
    mechanicId: 'dmu-p2-09',
    timestamp: '01:55',
    mechanicName: 'Towers VII (All Things Ending)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Set 5/7' },
      { job: 'AST', skill: 'Sun Sign + Star off cd' },
      { job: 'SCH', skill: 'Sacred Soil 3' },
      { job: 'SGE', skill: 'Panhaima + Kerachole' },
    ],
    notes: 'Seventh tower wave.'
  },
  {
    mechanicId: 'dmu-p2-10',
    timestamp: '02:06',
    mechanicName: 'Towers VIII (Past/Future\'s End)',
    damageType: 'magic',
    rawDamage: '180,000 / set',
    actions: [
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil 3', carryOver: true },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Final tower wave concluding Forsaken sets.'
  },
  {
    mechanicId: 'dmu-p2-11',
    timestamp: '02:26',
    mechanicName: 'Light of Judgment',
    damageType: 'magic',
    rawDamage: '260,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil' },
      { job: 'SGE', skill: 'Zoe E.Prog + Holos + Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Heavy raidwide immediately following the Forsaken resolution.'
  },
  {
    mechanicId: 'dmu-p2-12',
    timestamp: '02:54',
    mechanicName: 'Wings of Destruction',
    damageType: 'magic',
    rawDamage: '850,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', timingNote: 'Early in cast' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'Early in cast' },
      { job: 'WHM', skill: 'Plenary + Solace MT' },
      { job: 'AST', skill: 'Collective Unconscious + Bole MT' },
      { job: 'SCH', skill: 'Excog + Fairy tether MT + Soil + Seraph' },
      { job: 'SGE', skill: 'Kerachole + Panhaima + Physis II' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'If double Melee' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'Dual cleave tankbuster requiring active spot healing.'
  },
  {
    mechanicId: 'dmu-p2-13',
    timestamp: '03:01',
    mechanicName: 'Ultimate Embrace 2',
    damageType: 'magic',
    rawDamage: '1,200,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Benisons both + Aquaveil OT' },
      { job: 'AST', skill: 'CI both + Exalt OT + Star manual' },
      { job: 'SCH', skill: 'Sacred Soil + Adlo on tank' },
      { job: 'SGE', skill: 'Kerachole + Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
    ],
    notes: 'Final tankbuster sequence of Phase 2.'
  },

  // ==========================================
  // PHASE 3: CHAOS & EXDEATH
  // ==========================================
  {
    mechanicId: 'dmu-p3-01',
    timestamp: '01:08',
    mechanicName: 'Bowels of Agony (Chaos)',
    damageType: 'magic',
    rawDamage: '270,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary + Asylum center + Regen tanks' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope + Asp. Benefic' },
      { job: 'SCH', skill: 'Whispering Dawn + Spreadlo off tank + Soil' },
      { job: 'SGE', skill: 'Kerachole + Philosophia + E.Prog' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos', timingNote: 'On Chaos' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'On Exdeath autos' },
    ],
    notes: 'Opening raidwide of Phase 3. Maintain continuous regeneration on both tanks for incoming autos.'
  },
  {
    mechanicId: 'dmu-p3-02',
    timestamp: '01:28',
    mechanicName: 'Stray Flames / Tsunami (1st Set)',
    damageType: 'magic',
    rawDamage: '210,000',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Plenary + Aquaveil non-invuln + Benison' },
      { job: 'AST', skill: 'Exaltation non-invuln + CI both' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fairy tether Chaos tank' },
      { job: 'SGE', skill: 'Zoe E.Prog + Kerachole' },
    ],
    notes: 'Single-target shields and spot healing on the non-invulning tank are essential.'
  },
  {
    mechanicId: 'dmu-p3-03',
    timestamp: '01:36',
    mechanicName: 'Thunder III (1st Set)',
    damageType: 'magic',
    rawDamage: '950,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'mtInvuln', skill: 'MT Invuln', target: 'Self' },
      { job: 'WHM', skill: '2 Lilies + Tetra + Benison on invuln tank' },
      { job: 'SCH', skill: 'Expedient', timingNote: 'At 80% castbar' },
      { job: 'SGE', skill: 'Holos', timingNote: 'Halfway through cast' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'On Exdeath' },
    ],
    notes: 'High damage shared or invulned tankbuster.'
  },
  {
    mechanicId: 'dmu-p3-04',
    timestamp: '01:55',
    mechanicName: 'Stray Flames / Tsunami (2nd Set)',
    damageType: 'magic',
    rawDamage: '210,000',
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Summon Seraph', carryOver: true },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Second wave of debuff resolutions.'
  },
  {
    mechanicId: 'dmu-p3-05',
    timestamp: '02:05',
    mechanicName: 'Ultima Blaster',
    damageType: 'magic',
    rawDamage: '220,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign + Neutral Sect', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illum + Seraphism' },
      { job: 'SGE', skill: 'Kerachole + Panhaima' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
    ],
    notes: 'Pre-knockback party damage.'
  },
  {
    mechanicId: 'dmu-p3-06',
    timestamp: '02:12',
    mechanicName: 'Vacuum Wave (LB3)',
    damageType: 'magic',
    rawDamage: 'Knockback + 230,000',
    actions: [
      { roleSlot: 'tankLb3', skill: 'Tank LB3', timingNote: 'At the "W" of Vacuum Wave' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary + Temperance', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious + Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Panhaima', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Center knockback mitigated by Tank LB3. Either tank presses it.'
  },
  {
    mechanicId: 'dmu-p3-07',
    timestamp: '02:16',
    mechanicName: 'Cyclone',
    damageType: 'magic',
    rawDamage: '200,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Caress + Plenary', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious + Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Panhaima', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Post-knockback cyclone ticks.'
  },
  {
    mechanicId: 'dmu-p3-08',
    timestamp: '02:43',
    mechanicName: 'The Decisive Battle',
    damageType: 'magic',
    rawDamage: 'Debuff Setup',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', target: 'Exdeath' },
      { job: 'SCH', skill: 'Spreadlo off tank' },
      { job: 'SGE', skill: 'Zoe E.Prog' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'On cast' },
    ],
    notes: 'Decisive Battle cast leading into Accretions.'
  },
  {
    mechanicId: 'dmu-p3-09',
    timestamp: '02:57',
    mechanicName: 'Earthquake (Accretions)',
    damageType: 'unique',
    rawDamage: 'Party to 1 HP',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Plenary + Medica III + Benediction Accretion healer' },
      { job: 'AST', skill: 'Macrocosmos + Horoscope resolve + ED Accretion' },
      { job: 'SCH', skill: 'Spreadlo + Lustrate healer Accretion + Indom' },
      { job: 'SGE', skill: 'Physis II + Krasis 1st healer + Druochole' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
    ],
    notes: 'Party reduced to 1 HP. Rapidly top Accretion targets to full HP. Non-healers must NOT use self-heals (Second Wind, Waltz) to avoid premature activation.'
  },
  {
    mechanicId: 'dmu-p3-10',
    timestamp: '03:16',
    mechanicName: 'Shocking Impact / Shockwave (Slap 1)',
    damageType: 'magic',
    rawDamage: '190,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Regen both tanks' },
      { job: 'AST', skill: 'Collective Unconscious + Asp. Benefic' },
      { job: 'SCH', skill: 'Sacred Soil + Whispering Dawn' },
      { job: 'SGE', skill: 'Kerachole + E.Prog' },
    ],
    notes: 'First beam blast during tether assignments.'
  },
  {
    mechanicId: 'dmu-p3-11',
    timestamp: '03:47',
    mechanicName: 'Shocking Impact / Shockwave (Slap 2)',
    damageType: 'magic',
    rawDamage: '190,000',
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Liturgy of the Bell' },
      { job: 'AST', skill: 'Neutral Conj. Helios + Sun Sign' },
      { job: 'SCH', skill: 'Expedient + Summon Seraph + Sacred Soil' },
      { job: 'SGE', skill: 'Holos + Kerachole' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
    ],
    notes: 'Second beam blast during black hole movement.'
  },
  {
    mechanicId: 'dmu-p3-12',
    timestamp: '03:54',
    mechanicName: 'Black Holes II (3rd Tether Set)',
    damageType: 'magic',
    rawDamage: 'Tether Damage',
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph + Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos + Kerachole', carryOver: true },
    ],
    notes: 'Tether resolution wave.'
  },
  {
    mechanicId: 'dmu-p3-13',
    timestamp: '03:59',
    mechanicName: 'Black Holes II (4th Tether Set)',
    damageType: 'magic',
    rawDamage: 'Tether Damage',
    actions: [
      { job: 'SCH', skill: 'Expedient + Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Tether resolution wave.'
  },
  {
    mechanicId: 'dmu-p3-14',
    timestamp: '04:04',
    mechanicName: 'Black Holes II (5th Tether Set)',
    damageType: 'magic',
    rawDamage: 'Tether Damage',
    actions: [
      { job: 'SCH', skill: 'Fey Illumination + Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Tether resolution wave.'
  },
  {
    mechanicId: 'dmu-p3-15',
    timestamp: '04:15',
    mechanicName: 'Thunder III (5th Set)',
    damageType: 'magic',
    rawDamage: '950,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Temperance', timingNote: 'Set 5/6' },
      { job: 'AST', skill: 'Neutral Sect', timingNote: 'Set 5/6' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illum' },
      { job: 'SGE', skill: 'Zoe E.Prog + Panhaima + Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath' },
    ],
    notes: 'Heavy tankbuster sequence.'
  },
  {
    mechanicId: 'dmu-p3-16',
    timestamp: '04:28',
    mechanicName: 'Black Holes III (6th Tether Set)',
    damageType: 'magic',
    rawDamage: 'Tether Damage',
    actions: [
      { job: 'WHM', skill: 'Divine Caress' },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Sets 6-8' },
    ],
    notes: 'Sixth tether set.'
  },
  {
    mechanicId: 'dmu-p3-17',
    timestamp: '04:55',
    mechanicName: 'Shocking Impact / Shockwave (White Hole)',
    damageType: 'unique',
    rawDamage: 'Full HP Check',
    actions: [
      { job: 'WHM', skill: 'Plenary + Cure III / Medica III' },
      { job: 'AST', skill: 'Collective Unconscious + Star pop + Lady' },
      { job: 'SCH', skill: 'Sacred Soil + Indom' },
      { job: 'SGE', skill: 'Kerachole + Zoe Pneuma + Ixochole' },
    ],
    notes: 'Lethal check: everyone must be topped to 100% max HP before White Hole resolves.'
  },
  {
    mechanicId: 'dmu-p3-18',
    timestamp: '05:23',
    mechanicName: 'Stomp-a-Mole + Knock Down',
    damageType: 'physical',
    rawDamage: '250,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Plenary + Medica III + Lily' },
      { job: 'AST', skill: 'Collective Unconscious + Conj. Helios' },
      { job: 'SCH', skill: 'Seraphism + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole + E.Prog + Physis II' },
      { roleSlot: 'melee2', skill: 'Feint', target: 'Chaos' },
    ],
    notes: 'Final physical tower stomps before transition. Instant-cast heals prepped between 1st & 2nd stomps.'
  },

  // ==========================================
  // PHASE 4: KEFKA SAYS
  // ==========================================
  {
    mechanicId: 'dmu-p4-01',
    timestamp: '00:29',
    mechanicName: 'Grand Cross 1',
    damageType: 'magic',
    rawDamage: '240,000',
    actions: [
      { job: 'WHM', skill: 'Plenary + Asylum' },
      { job: 'AST', skill: 'Collective Unconscious + Neutral Sect' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', timingNote: 'Late Soil 60-80%' },
      { job: 'SGE', skill: 'Kerachole + Philosophia + Holos' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Used for autos' },
    ],
    notes: 'First color check.'
  },
  {
    mechanicId: 'dmu-p4-02',
    timestamp: '00:35',
    mechanicName: 'Inferno / Tsunami 1',
    damageType: 'magic',
    rawDamage: '260,000',
    actions: [
      { job: 'WHM', skill: 'Plenary', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Holos', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
    ],
    notes: 'Elemental raidwide blast.'
  },
  {
    mechanicId: 'dmu-p4-03',
    timestamp: '00:44',
    mechanicName: 'Grand Cross 2',
    damageType: 'magic',
    rawDamage: '240,000',
    actions: [
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Expedient + Fey Illumination + Sacred Soil' },
      { job: 'SGE', skill: 'Panhaima + Holos', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Second color command sequence.'
  },
  {
    mechanicId: 'dmu-p4-04',
    timestamp: '00:49',
    mechanicName: 'Inferno / Tsunami 2',
    damageType: 'magic',
    rawDamage: '260,000',
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign + Neutral Sect', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph + Expedient + Fey Illum' },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
    ],
    notes: 'Elemental raidwide pulse.'
  },
  {
    mechanicId: 'dmu-p4-05',
    timestamp: '00:59',
    mechanicName: 'Grand Cross 3',
    damageType: 'magic',
    rawDamage: '240,000',
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Caress + Temperance' },
      { job: 'AST', skill: 'Neutral Sect + Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph + Expedient + Fey Illum' },
      { job: 'SGE', skill: 'Zoe E.Prog' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'After 2nd GC' },
    ],
    notes: 'Third command check.'
  },
  {
    mechanicId: 'dmu-p4-06',
    timestamp: '01:11',
    mechanicName: 'Flood of Naught',
    damageType: 'darkness',
    rawDamage: 'Color Resolution',
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell' },
      { job: 'AST', skill: 'Macrocosmos' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Color resolution mechanic.'
  },
  {
    mechanicId: 'dmu-p4-07',
    timestamp: '01:21',
    mechanicName: 'Death Bolt / Wave 1',
    damageType: 'magic',
    rawDamage: '230,000',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Antilight beams.'
  },
  {
    mechanicId: 'dmu-p4-08',
    timestamp: '01:39',
    mechanicName: 'Ultima Upsurge 1',
    damageType: 'magic',
    rawDamage: '290,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary + Asylum' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil + Recitation Indom' },
      { job: 'SGE', skill: 'Kerachole + Philosophia' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Heavy penultimate raidwide.'
  },
  {
    mechanicId: 'dmu-p4-09',
    timestamp: '01:46',
    mechanicName: 'Death Bolt / Wave 2',
    damageType: 'magic',
    rawDamage: '230,000',
    actions: [
      { job: 'WHM', skill: 'Plenary', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Second beams sequence.'
  },
  {
    mechanicId: 'dmu-p4-10',
    timestamp: '02:18',
    mechanicName: 'Ultima Upsurge 2',
    damageType: 'magic',
    rawDamage: '290,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'SCH', skill: 'Sacred Soil + Succor' },
      { job: 'SGE', skill: 'Kerachole + Zoe E.Prog' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'If double Melee' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'Final heavy raidwide before Phase 5.'
  },

  // ==========================================
  // PHASE 5: KEFKA REIMAGINED
  // ==========================================
  {
    mechanicId: 'dmu-p5-01',
    timestamp: '00:49',
    mechanicName: 'Ultima Repeater 1',
    damageType: 'magic',
    rawDamage: '310,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'When staff comes down' },
      { job: 'WHM', skill: 'Plenary + Asylum + Temperance' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope + NS' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illum' },
      { job: 'SGE', skill: 'Zoe E.Prog + Holos + Kerachole + Physis II' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Pre-pop after "smile"' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'First massive raidwide of Phase 5. Apply early party defensives.'
  },
  {
    mechanicId: 'dmu-p5-02',
    timestamp: '00:54',
    mechanicName: 'Fell Forces 1 (3x Tank Autos)',
    damageType: 'physical',
    rawDamage: '150,000 x3',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary + Aquaveil OT + Benison MT', target: 'Tanks' },
      { job: 'AST', skill: 'Collective Unconscious + Bole MT + Exalt OT', target: 'Tanks' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Holos between 1st & 2nd auto + Haima' },
    ],
    notes: 'Autos hit tanks for extreme physical damage. Healers must prioritize spot defensives.'
  },
  {
    mechanicId: 'dmu-p5-03',
    timestamp: '01:06',
    mechanicName: 'Chaotic Flood',
    damageType: 'magic',
    rawDamage: '240,000',
    actions: [
      { job: 'WHM', skill: 'Temperance', timingNote: 'For movement' },
      { job: 'AST', skill: 'Neutral Sect + Sun Sign + CO' },
      { job: 'SCH', skill: 'Expedient + Succor' },
      { job: 'SGE', skill: 'Panhaima + Holos', carryOver: true },
    ],
    notes: 'Exaflare pattern movement.'
  },
  {
    mechanicId: 'dmu-p5-04',
    timestamp: '01:18',
    mechanicName: 'Maddening Orchestra 1',
    damageType: 'magic',
    rawDamage: '280,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Divine Caress + Benison MT' },
      { job: 'AST', skill: 'Sun Sign + Asp. Benefic MT' },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination + Expedient' },
      { job: 'SGE', skill: 'Kerachole + Panhaima' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
    ],
    notes: 'Raidwide + tankbuster sequence.'
  },
  {
    mechanicId: 'dmu-p5-05',
    timestamp: '01:31',
    mechanicName: 'Fell Forces 2 (2x Tank Autos)',
    damageType: 'physical',
    rawDamage: '150,000 x2',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { job: 'AST', skill: 'Sun Sign + Star off cd + ED OT' },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
    ],
    notes: 'Second set of heavy tank autos.'
  },
  {
    mechanicId: 'dmu-p5-06',
    timestamp: '01:49',
    mechanicName: 'Celestriad',
    damageType: 'magic',
    rawDamage: '190,000 / hit',
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Plenary + Lilies' },
      { job: 'AST', skill: 'Horoscope + Collective Unconscious + Star pop' },
      { job: 'SCH', skill: 'Summon Seraph + Whispering Dawn + Recitation Succor' },
      { job: 'SGE', skill: 'E.Prog + Physis II' },
    ],
    notes: 'Three elemental tower sets.'
  },
  {
    mechanicId: 'dmu-p5-07',
    timestamp: '02:11',
    mechanicName: 'Ultima Repeater 2',
    damageType: 'magic',
    rawDamage: '310,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Plenary + Medica III + Lily' },
      { job: 'AST', skill: 'Collective Unconscious + Conj. Helios + Lady' },
      { job: 'SCH', skill: 'Sacred Soil + Succor + Indom' },
      { job: 'SGE', skill: 'Kerachole + E.Prog' },
      { roleSlot: 'melee2', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Off cd' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Right after T3' },
    ],
    notes: 'Second wave of Ultima Repeater bursts.'
  },
  {
    mechanicId: 'dmu-p5-08',
    timestamp: '02:16',
    mechanicName: 'Fell Forces 3 (2x Tank Autos)',
    damageType: 'physical',
    rawDamage: '150,000 x2',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Benison MT + Aquaveil OT' },
      { job: 'AST', skill: 'Bole MT + Exalt OT + CI' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Third set of heavy tank auto attacks.'
  },
  {
    mechanicId: 'dmu-p5-09',
    timestamp: '02:42',
    mechanicName: 'Stray Entropy / Apocalypse',
    damageType: 'magic',
    rawDamage: 'Exaflare Spread',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', timingNote: '2 GCDs after cast' },
      { job: 'SGE', skill: 'E.Prog for spread' },
    ],
    notes: 'Exaflare dodge sequence.'
  },
  {
    mechanicId: 'dmu-p5-10',
    timestamp: '02:51',
    mechanicName: 'Maddening Orchestra 2',
    damageType: 'magic',
    rawDamage: '280,000',
    actions: [
      { job: 'WHM', skill: 'Benison MT + top up' },
      { job: 'AST', skill: 'Asp. Benefic MT' },
      { job: 'SCH', skill: 'Sacred Soil + Whispering Dawn' },
      { job: 'SGE', skill: 'Early Kerachole + E.Prog + Haima non-invuln' },
    ],
    notes: 'Penultimate raidwide sequence.'
  },
  {
    mechanicId: 'dmu-p5-11',
    timestamp: '03:03',
    mechanicName: 'Fell Forces 4 (3x Tank Autos)',
    damageType: 'physical',
    rawDamage: '150,000 x3',
    actions: [
      { job: 'WHM', skill: 'Aquaveil OT + leftover Benisons' },
      { job: 'AST', skill: 'Leftover card mits MT + Exalt OT + CI' },
      { job: 'SCH', skill: 'Fey Blessing for autos' },
    ],
    notes: 'Final autos before enrage channel.'
  },
  {
    mechanicId: 'dmu-p5-12',
    timestamp: '03:20',
    mechanicName: 'Forsaken (1st Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Temperance + Asylum' },
      { job: 'AST', skill: 'Neutral Sect + Collective Unconscious + Horoscope' },
      { job: 'SCH', skill: 'Spreadlo + Fey Illum + Sacred Soil + Expedient' },
      { job: 'SGE', skill: 'Zoe E.Prog + Holos + Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'If double PhysR' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'If double Caster' },
    ],
    notes: 'Enrage pulse 1. Apply timed mitigation as late as possible.'
  },
  {
    mechanicId: 'dmu-p5-13',
    timestamp: '03:25',
    mechanicName: 'Forsaken Bonds (2nd Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Liturgy of the Bell + Temperance' },
      { job: 'AST', skill: 'Neutral Sect + Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Seraphism + Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Philosophia + Holos + Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
    ],
    notes: 'Enrage stack 1.'
  },
  {
    mechanicId: 'dmu-p5-14',
    timestamp: '03:28',
    mechanicName: 'Forsaken (3rd Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Macrocosmos + Neutral Sect + CU', carryOver: true },
      { job: 'SCH', skill: 'Expedient + Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Panhaima + Holos + Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
    ],
    notes: 'Enrage pulse 2.'
  },
  {
    mechanicId: 'dmu-p5-15',
    timestamp: '03:34',
    mechanicName: 'Forsaken Bonds (4th Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Neutral Sect', carryOver: true },
      { job: 'SCH', skill: 'Expedient + Fey Illum', carryOver: true },
      { job: 'SGE', skill: 'Holos + Panhaima', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
    ],
    notes: 'Enrage stack 2.'
  },
  {
    mechanicId: 'dmu-p5-16',
    timestamp: '03:37',
    mechanicName: 'Forsaken (5th Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Divine Caress + Temperance' },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos + Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Off cd' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Off cd' },
    ],
    notes: 'Enrage pulse 3. Important: first round of mitigations expires, second round must apply here.'
  },
  {
    mechanicId: 'dmu-p5-17',
    timestamp: '03:42',
    mechanicName: 'Forsaken Bonds (6th Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Enrage stack 3.'
  },
  {
    mechanicId: 'dmu-p5-18',
    timestamp: '03:45',
    mechanicName: 'Forsaken (7th Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph' },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Enrage pulse 4.'
  },
  {
    mechanicId: 'dmu-p5-19',
    timestamp: '03:50',
    mechanicName: 'Forsaken Bonds (8th Hit)',
    damageType: 'magic',
    rawDamage: '320,000',
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Enrage stack 4.'
  },
  {
    mechanicId: 'dmu-p5-20',
    timestamp: '04:24',
    mechanicName: 'Forsaken Null (Hard Enrage)',
    damageType: 'unique',
    rawDamage: 'Enrage Wipe',
    actions: [],
    notes: 'Boss enrage channel.'
  }
];

// Helper utility to merge baseline rows with variant-specific action and note overrides.
// Notes are strictly isolated to each plan variant: if a variant does not provide a note,
// it will NOT inherit notes from baseline or other plans to prevent cross-plan confusion.
function createPlanVariant(
  baseRows: PlanRow[],
  overrides: Record<string, { actions?: PlanRow['actions']; notes?: string }>
): PlanRow[] {
  return baseRows.map(row => {
    const override = overrides[row.mechanicId];
    if (!override) {
      return {
        ...row,
        notes: undefined
      };
    }
    return {
      ...row,
      actions: override.actions !== undefined ? override.actions : row.actions,
      notes: override.notes !== undefined ? override.notes : undefined
    };
  });
}

// ==========================================
// 2. IKUYA MITTY COMPILE (AUTHENTIC SHEET DATA)
// ==========================================
const IKUYA_OVERRIDES: Record<string, { actions?: PlanRow['actions']; notes?: string }> = {
  'dmu-p1-01': {
    notes: 'Ikuya: Revolting Ruin III targets 1st in enmity and retargets to 2nd in enmity when the castbar ends. MT Kitchen Sink, OT Buddy Mit + Provoke during castbar.'
  },
  'dmu-p1-03': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'GNB/DRK as boss centers' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'WAR/PLD after Ruin III' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect + Sun Sign' },
      { job: 'SCH', skill: 'Spreadlo + Expedient' },
      { job: 'SGE', skill: 'Kerachole + Zoe Shields', timingNote: 'Hold Panhaima for Trap 2' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Early on cast' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Pre-pop on center' },
    ],
    notes: 'Ikuya: Pre-pop 90s party mitigations on center for Graven Image 1. All mechanics require shields.'
  },
  'dmu-p1-04': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Carryover Temperance' },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos', timingNote: 'Carryover Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
    ],
    notes: 'Line beams. Targeted mitigations do not work on Wave Cannon, but apply to the upcoming Trap.'
  },
  'dmu-p1-05': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Carryover Expedient' },
      { job: 'SGE', skill: 'Holos', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Applies to trap explosion' },
    ],
    notes: 'Statue shockwave detonation.'
  },
  'dmu-p1-06': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', timingNote: 'Late into castbar' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Late castbar' },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Ikuya: Press mitigation late into castbar so 15s buffs persist into upcoming Hyperdrive busters.'
  },
  'dmu-p1-07': {
    notes: 'Ikuya: Hyperdrive does not have a castbar and occurs immediately after Light of Judgment on OT. MT Buddy Mit, OT Kitchen Sink.'
  },
  'dmu-p1-08': {
    actions: [
      { job: 'AST', skill: 'Macrocosmos' },
      { job: 'SCH', skill: 'Sacred Soil + Seraphism' },
    ],
    notes: 'First gravity stack drop.'
  },
  'dmu-p1-08b': {
    notes: 'Ikuya: Revolting Ruin III. MT Provoke during castbar, OT Invulnerability.'
  },
  'dmu-p1-09': {
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'Placed before puddles or expires here' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination' },
      { job: 'SGE', skill: 'Kerachole + Philosophia' },
    ],
    notes: 'Second gravity stack drop.'
  },
  'dmu-p1-10': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Panhaima + Zoe Shields', timingNote: 'Panhaima deployed here' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Puddle soaks' },
    ],
    notes: 'Second statue trap detonation.'
  },
  'dmu-p1-11': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', timingNote: 'Panhaima carryover' },
      { roleSlot: 'melee1', skill: 'Feint' },
    ],
    notes: 'Second raidwide before Tele-trouncing.'
  },
  'dmu-p1-11b': {
    notes: 'Ikuya: Hyperdrive (3x). MT Invulnerability. WAR can alternatively kitchen sink this and Holmgang the first Ultimate Embrace in P2.'
  },
  'dmu-p1-13': {
    actions: [
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Expedient' },
    ],
    notes: 'Third statue trap before arrow knockbacks.'
  },
  'dmu-p1-14': {
    actions: [
      { job: 'WHM', skill: 'Divine Caress', carryOver: true },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Arrow knockback resolution.'
  },
  'dmu-p1-15': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Final P1 raidwide.'
  },
  'dmu-p2-01': {
    actions: [
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'D2 Feints opening buster' },
      { job: 'SCH', skill: 'Spreadlo', timingNote: 'Downtime shield off tank' },
      { job: 'SGE', skill: 'Holos', timingNote: 'Pressed here so it returns for Light of Judgment' },
    ],
    notes: 'Ikuya: D2 Feint and Holos used early on first Ultimate Embrace to cushion tanks and reset for Light of Judgment.'
  },
  'dmu-p2-02': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true, timingNote: 'Spreadlo carryover' },
      { job: 'SGE', skill: 'Kerachole + Zoe Shields', carryOver: true, timingNote: 'Holos carryover' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Ikuya: Forsaken castbar snapshot.'
  },
  'dmu-p2-03': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'GNB/DRK' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'First tower soak.'
  },
  'dmu-p2-05': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'WAR/PLD' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'AST', skill: 'Macrocosmos' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Third tower soak.'
  },
  'dmu-p2-07': {
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell' },
      { job: 'SCH', skill: 'Expedient' },
    ],
    notes: 'Fifth tower soak.'
  },
  'dmu-p2-08': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence + Temperance' },
      { job: 'AST', skill: 'Collective Unconscious + Neutral Sect' },
      { job: 'SCH', skill: 'Seraphism', carryOver: true },
      { job: 'SGE', skill: 'Philosophia' },
    ],
    notes: 'Sixth tower soak.'
  },
  'dmu-p2-09': {
    actions: [
      { job: 'WHM', skill: 'Divine Caress', carryOver: true },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Seventh tower soak.'
  },
  'dmu-p2-11': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole + Holos + Zoe Shields' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Ikuya: Light of Judgment raidwide with Holos returning off cooldown.'
  },
  'dmu-p2-12': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'Press early if WAR to avoid Shake eating shields' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination + Summon Seraph' },
      { job: 'SGE', skill: 'Kerachole + Panhaima' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'D2 Feint covers Wings + Ultimate Embrace 2' },
    ],
    notes: 'Ikuya: Melee 2 Feint explicitly assigned here to mitigate Wings and carry into Ultimate Embrace 2.'
  },
  'dmu-p2-13': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary Indulgence', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination + Summon Seraph', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
    ],
    notes: 'End of P2 tankbuster.'
  },
  'dmu-p3-01': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Press after Kefka textbox disappears' },
      { job: 'SGE', skill: 'Kerachole', timingNote: 'Press after Kefka textbox disappears' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
    ],
    notes: 'Ikuya: Press 30s mitigations after Kefka says "Oh! What other toys..." to cover autos and Bowels.'
  },
  'dmu-p3-03': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { job: 'SCH', skill: 'Expedient' },
      { job: 'SGE', skill: 'Holos' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'Ikuya: Addle on Exdeath for Thunder III' },
    ],
    notes: 'Ikuya: Addle explicitly assigned to Exdeath to cushion Thunder III tankbusters.'
  },
  'dmu-p3-04': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Summon Seraph', carryOver: true },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Second debuff resolution.'
  },
  'dmu-p3-05': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Temperance', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination + Seraphism' },
      { job: 'SGE', skill: 'Kerachole + Panhaima' },
      { roleSlot: 'melee2', skill: 'Feint', target: 'Chaos', timingNote: 'Ikuya: D2 Feint on Chaos' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Ikuya: Phys Ranged Mit covers Blaster + Vacuum Wave' },
    ],
    notes: 'Ikuya: D2 Feint on Chaos and Phys Ranged Mit mitigate Blaster and carry into Vacuum Wave.'
  },
  'dmu-p3-06': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank LB3', timingNote: 'Press at the "W" of Vacuum Wave' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Plenary Indulgence', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Panhaima', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Ikuya: Tank LB3 on "W" of Vacuum Wave.'
  },
  'dmu-p3-09': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'GNB/DRK' },
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'Pop immediately to manage Accretion and autos' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole + Philosophia', timingNote: 'Philosophia after Accretions resolve' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
    ],
    notes: 'Ikuya: Healer Accretion pops 1st, DPS Accretion 2nd. Non-healers must avoid self-heals (Second Wind, Curing Waltz).'
  },
  'dmu-p3-11': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'GNB/DRK' },
      { job: 'WHM', skill: 'Liturgy of the Bell' },
      { job: 'SCH', skill: 'Expedient + Summon Seraph + Sacred Soil' },
      { job: 'SGE', skill: 'Holos + Kerachole' },
    ],
    notes: 'Second raidwide slap.'
  },
  'dmu-p3-12': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'WAR/PLD' },
      { job: 'SCH', skill: 'Summon Seraph', carryOver: true },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Third tether set resolution.'
  },
  'dmu-p3-15': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illumination' },
      { job: 'SGE', skill: 'Kerachole + Panhaima + Zoe Shields' },
      { roleSlot: 'melee2', skill: 'Feint', target: 'Chaos' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath' },
    ],
    notes: 'Ikuya: Feint on Chaos, Addle on Exdeath.'
  },
  'dmu-p3-16': {
    actions: [
      { job: 'WHM', skill: 'Divine Caress' },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Ikuya: Phys Ranged on 6th tether' },
    ],
    notes: 'Ikuya: Phys Ranged mitigation used here for 6th tether and carries over.'
  },
  'dmu-p3-18': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'SCH', skill: 'Seraphism + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos' },
    ],
    notes: 'Ikuya: Double reprisal and tank 90s for dual boss stomps.'
  },
  'dmu-p4-01': {
    actions: [
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole + Philosophia + Holos' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Ikuya: D2 Feint at phase start for tank autos' },
    ],
    notes: 'Ikuya: D2 Feint deployed at phase start to dampen tank auto-attacks.'
  },
  'dmu-p4-02': {
    actions: [
      { job: 'WHM', skill: 'Plenary Indulgence', carryOver: true },
      { job: 'AST', skill: 'Collective Unconscious', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole + Holos', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Ikuya: Phys Ranged Mit on 1st element' },
    ],
    notes: 'Ikuya: Phys Ranged defensive covers elements.'
  },
  'dmu-p4-03': {
    actions: [
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect' },
      { job: 'SCH', skill: 'Expedient + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
    ],
    notes: 'Second raidwide cast.'
  },
  'dmu-p4-08': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Ikuya: Targeted mitigations (Reprisal, Feint, Addle) function only on Ultima Upsurge in P4.'
  },
  'dmu-p4-10': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
    ],
    notes: 'Final P4 raidwide.'
  },
  'dmu-p5-01': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'When staff drops to right side' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole + Holos + Zoe Shields' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'When staff drops to right side' },
    ],
    notes: 'Ikuya: Pre-pop 90s party mitigation when Kefka brings his staff down to his right side.'
  },
  'dmu-p5-04': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Divine Caress' },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Ikuya: D2 Feint on MO1' },
    ],
    notes: 'Ikuya: Melee 2 Feint assigned to Maddening Orchestra 1 and carries into the 2x Fell Forces autos.'
  },
  'dmu-p5-05': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { job: 'AST', skill: 'Sun Sign', carryOver: true },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
    ],
    notes: 'Ikuya: Autos deal massive damage. D2 Feint and OT Reprisal cushion the hits.'
  },
  'dmu-p5-07': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Plenary Indulgence' },
      { job: 'AST', skill: 'Collective Unconscious' },
      { job: 'SCH', skill: 'Sacred Soil' },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Ikuya: D1 Feint after Celestriad tower 3' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Off cd' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Ikuya: Addle after Celestriad tower 3' },
    ],
    notes: 'Ikuya: D1 Feint and Addle used after third Celestriad tower resolves.'
  },
  'dmu-p5-13': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Temperance' },
      { job: 'AST', skill: 'Neutral Sect + Collective Unconscious' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illumination' },
      { job: 'SGE', skill: 'Kerachole + Holos + Zoe Shields' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Ikuya: D2 Feints Forsaken 1st hit' },
    ],
    notes: 'Ikuya: First mitigation cycle. D2 Feint applies to first half of enrage sequence.'
  },
  'dmu-p5-16': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Divine Caress' },
      { job: 'AST', skill: 'Sun Sign' },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Holos + Panhaima', carryOver: true },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Ikuya: D1 Feints Forsaken 5th hit' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Off cd' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Off cd' },
    ],
    notes: 'Ikuya: Second mitigation cycle begins. D1 Feint applies to second half of enrage sequence.'
  }
};

const IKUYA_ROWS: PlanRow[] = calculateCarryOvers(createPlanVariant(LPDU_ROWS, IKUYA_OVERRIDES));

// ==========================================
// 3. JOB BIBLES COMPILE (AUTHENTIC COMMUNITY GUIDES)
// ==========================================
const BIBLES_OVERRIDES: Record<string, { actions?: PlanRow['actions']; notes?: string }> = {
  'dmu-p1-01': {
    actions: [
      { roleSlot: 'mtBusterMit', skill: 'MT Tankbuster CDs', target: 'Self' },
      { roleSlot: 'otSupport', skill: 'OT Single-Target Mit', target: 'MT' },
      { roleSlot: 'otProvoke', skill: 'Provoke', target: 'Boss', timingNote: 'Provoke during castbar' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'MT', timingNote: 'Tetra OT' },
      { job: 'AST', skill: 'Exaltation + CI', target: 'MT', timingNote: '-5s Star / Ewer OT' },
      { job: 'SCH', skill: 'Protraction + Excog', target: 'MT', timingNote: 'Spreadlo off MT after 2nd hit, Excog OT' },
      { job: 'SGE', skill: 'Taurochole + Krasis', target: 'MT', timingNote: 'between hits' },
    ],
    notes: 'Bibles: Heavy magic tankbuster on MT. OT Provokes during castbar to swap. Swap Kardia (SGE) or single-target heals (Tetra/Ewer) to OT immediately after for incoming autos.'
  },
  'dmu-p1-03': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Temperance', timingNote: 'spread/stacks' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'tethers + CU post-KB' },
      { job: 'SCH', skill: 'Spreadlo + Seraphism + Expedient', timingNote: '1 GCD after tethers' },
      { job: 'SGE', skill: 'Physis + Panhaima + Zoe E.Prog', timingNote: 'castbar end' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Bibles: Coordinated opening defensive burst. Seraphism and Panhaima allow continuous movement.'
  },
  'dmu-p1-05': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', carryOver: true },
      { job: 'WHM', skill: 'Temperance', carryOver: true, timingNote: '2x Lily middle' },
      { job: 'AST', skill: 'Sun Sign', carryOver: true, timingNote: 'before confetti' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'covers raidwide' },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Confetti and statue detonation.'
  },
  'dmu-p1-06': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', timingNote: 'late castbar' },
      { job: 'WHM', skill: 'Asylum', timingNote: 'late castbar' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'late castbar' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true, timingNote: '>=3s on confetti' },
      { job: 'SGE', skill: 'Kerachole + E.Prog', timingNote: '@ 1 confetti' },
      { roleSlot: 'melee2', skill: 'Feint' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster2', skill: 'Addle' },
    ],
    notes: 'Bibles: Cooldown preservation. Late soil persists into Hyperdrive; WHM prepares Benison for OT.'
  },
  'dmu-p1-07': {
    actions: [
      { roleSlot: 'otBusterMit', skill: 'OT Tankbuster CDs', target: 'Self' },
      { roleSlot: 'mtSupport', skill: 'MT Single-Target Mit', target: 'OT' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'WHM', skill: 'Divine Benison', target: 'OT' },
      { job: 'AST', skill: 'Celestial Intersection', target: 'OT', timingNote: 'Card mits + CI OT' },
      { job: 'SCH', skill: 'Aetherpact (Tether)', target: 'OT', timingNote: 'Fairy tether OT' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Taurochole', target: 'OT' },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Bibles: Hyperdrive 1 on OT. MT provides Buddy Mit, OT Kitchen Sinks.'
  },
  'dmu-p1-08': {
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'pre-cast' },
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'on cast start' },
      { job: 'SCH', skill: 'Sacred Soil + Fey Illumination', timingNote: 'Soil late 1st puddle' },
      { job: 'SGE', skill: 'Kerachole + Philosophia + E.Prog', timingNote: '1st puddle stack' },
    ],
    notes: 'Bibles: Gravitas II Part 1. High-efficiency automated healing with Bell and Macrocosmos.'
  },
  'dmu-p1-08b': {
    actions: [
      { roleSlot: 'mtProvoke', skill: 'Provoke', target: 'Boss', timingNote: 'Provoke during castbar' },
      { roleSlot: 'otInvuln', skill: 'OT Invulnerability', target: 'Self' },
      { job: 'WHM', skill: 'Benediction', target: 'OT', timingNote: 'If DRK Living Dead' },
    ],
    notes: 'Bibles: Revolting Ruin 2. OT Invuln, MT Provokes during castbar to take boss back.'
  },
  'dmu-p1-09': {
    actions: [
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'walking to middle' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'for confetti' },
      { job: 'SCH', skill: 'Summon Seraph + Sacred Soil', timingNote: 'gravity + confetti' },
      { job: 'SGE', skill: 'Holos + Kerachole', timingNote: 'Holos @ 14s confetti' },
    ],
    notes: 'Bibles: Reqcat SGE Bible: Holos at 14s on confetti debuff. Crow SCH: Soil with >=3s left to carry into raidwide.'
  },
  'dmu-p1-11b': {
    actions: [
      { roleSlot: 'mtInvuln', skill: 'MT Invulnerability', target: 'Self', timingNote: 'Kitchen sink if WAR' },
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)', carryOver: true },
      { job: 'AST', skill: 'Neutral Sect', timingNote: 'Off cd' },
      { job: 'SCH', skill: 'Sacred Soil', carryOver: true },
      { job: 'SGE', skill: 'Kerachole', carryOver: true },
    ],
    notes: 'Bibles: Hyperdrive 2 on MT. MT Invulns (or Kitchen Sinks if WAR saving Holmgang for P2).'
  },
  'dmu-p1-12': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', timingNote: 'arrows' },
      { job: 'WHM', skill: 'Temperance', timingNote: 'off cd for P2' },
      { job: 'AST', skill: 'Sun Sign + Celestial Opposition', timingNote: 'off cd' },
      { job: 'SCH', skill: 'Whispering Dawn + Expedient', timingNote: 'for movement' },
      { job: 'SGE', skill: 'Panhaima + Physis', timingNote: 'after arrows placed' },
    ],
  },
  'dmu-p1-13': {
    actions: [
      { job: 'WHM', skill: 'Temperance', timingNote: 'off cd for P2' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'before confetti' },
      { job: 'SCH', skill: 'Whispering Dawn + Sacred Soil + Expedient', timingNote: 'Expedient post-confetti' },
      { job: 'SGE', skill: 'Panhaima + Physis', timingNote: 'post-arrow placement' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'before arrows' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'before arrows' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'before arrows' },
    ],
    notes: 'Bibles: Tele-trouncing rotation. Temperance sent on cooldown so it resets for P2 Forsaken.'
  },
  'dmu-p2-01': {
    actions: [
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'early buster' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'Tanks', timingNote: 'Benisons MT/OT' },
      { job: 'AST', skill: 'Exaltation + CI', target: 'Tanks', timingNote: 'CIs + Exalt OT' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', timingNote: 'Rampart Spreadlo + Soil' },
      { job: 'SGE', skill: 'Holos', timingNote: 'on 1st Embrace' },
    ],
    notes: 'Bibles: Saybell Tank & Healer Bibles: Spreadlo off tank with Rampart buff. Holos used early to return for LoJ.'
  },
  'dmu-p2-02': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Plenary Indulgence + Asylum', timingNote: 'mid-cast / off cd' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope', timingNote: 'CU on cast' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'hold 3rd Soil for LoJ' },
      { job: 'SGE', skill: 'Kerachole + Zoe Shields + Holos', timingNote: '80% castbar' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Bibles: Forsaken cast snapshot. Healers roll HoTs and prep staggering mitigations across the 8 tower sets.'
  },
  'dmu-p2-04': {
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'Set 2' },
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'Set 2 movement' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination', timingNote: 'Set 3/4' },
    ],
    notes: 'Second tower soak.'
  },
  'dmu-p2-06': {
    actions: [
      { job: 'WHM', skill: 'Temperance', timingNote: 'Set 4' },
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'manual trigger' },
      { job: 'SCH', skill: 'Seraphism', timingNote: '1st Past/Future' },
    ],
    notes: 'Fourth tower soak.'
  },
  'dmu-p2-07': {
    actions: [
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Set 5' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'Set 5' },
      { job: 'SCH', skill: 'Expedient', timingNote: 'Set 5/6' },
      { job: 'SGE', skill: 'Panhaima', timingNote: 'covers Sets 5-7' },
    ],
    notes: 'Fifth tower soak.'
  },
  'dmu-p2-08': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'Set 6' },
      { job: 'AST', skill: 'Celestial Opposition + Horoscope', timingNote: 'Set 6' },
      { job: 'SCH', skill: 'Seraphism', carryOver: true },
      { job: 'SGE', skill: 'Panhaima', carryOver: true },
    ],
    notes: 'Sixth tower soak.'
  },
  'dmu-p2-11': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Asylum', timingNote: 'off cd' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', timingNote: 'Spreadlo + 3rd Soil' },
      { job: 'SGE', skill: 'Kerachole + Zoe Shields', timingNote: 'Zoe shield' },
      { roleSlot: 'melee1', skill: 'Feint' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle' },
    ],
    notes: 'Bibles: Light of Judgment. Crow SCH: Spreadlo and 3rd Soil deployed here.'
  },
  'dmu-p2-12': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'Tanks', timingNote: 'Benison + Aquaveil' },
      { job: 'AST', skill: 'Bole + Celestial Intersection', target: 'Tanks', timingNote: 'Bole MT + CO' },
      { job: 'SCH', skill: 'Excogitation + Sacred Soil', timingNote: 'Excog + Soil TB' },
      { job: 'SGE', skill: 'Haima + Physis', timingNote: 'Physis + Haima' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'covers Wings + Embrace' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'covers Wings + Embrace' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'covers Wings + Embrace' },
    ],
    notes: 'Bibles: Dual tankbusters. Single-target mitigations prioritized on both tanks.'
  },
  'dmu-p3-01': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Asylum', timingNote: 'Asylum center for autos' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope', timingNote: 'CU + CO + Horoscope' },
      { job: 'SCH', skill: 'Whispering Dawn', timingNote: 'Dawn on castbar' },
      { job: 'SGE', skill: 'Kerachole + Philosophia + Holos', timingNote: 'Holos after Bowels' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos', timingNote: 'autos after Bowels' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'Bowels cast' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'Exdeath autos' },
    ],
    notes: 'Bibles: High auto-attack damage on tanks. Non-shield healers rely on HoTs to preserve mana.'
  },
  'dmu-p3-02': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'OT', timingNote: 'non-invuln tank' },
      { job: 'AST', skill: 'Exaltation + CI', target: 'OT', timingNote: 'non-invuln tank' },
      { job: 'SCH', skill: 'Spreadlo', timingNote: 'Spreadlo + tether' },
      { job: 'SGE', skill: 'Zoe Shields + Kerachole', timingNote: 'before 1st TB' },
    ],
    notes: 'Bibles: First elemental debuffs. Focus shielding and single-target defensives on non-invulning tank.'
  },
  'dmu-p3-03': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { job: 'WHM', skill: 'Tetragrammaton + Benison', target: 'MT', timingNote: 'on invuln tank' },
      { job: 'SCH', skill: 'Expedient + Summon Seraph + Fey Illumination', timingNote: 'at 80% TB' },
      { job: 'SGE', skill: 'Holos', carryOver: true },
    ],
    notes: 'Bibles: Thunder III tankbusters. Saybell: 1st Thunder III typically invulned.'
  },
  'dmu-p3-04': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Temperance + Divine Caress', timingNote: '2nd debuffs' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'Sun Sign + Star pop' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination', carryOver: true },
      { job: 'SGE', skill: 'Physis', timingNote: '2nd debuffs' },
    ],
    notes: 'Bibles: Second elemental debuff resolution.'
  },
  'dmu-p3-06': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank LB3', timingNote: 'Vacuum Wave' },
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'after KB' },
      { job: 'AST', skill: 'Macrocosmos + Collective Unconscious', timingNote: 'after KB' },
      { job: 'SCH', skill: 'Sacred Soil + Seraphism', timingNote: 'LC start' },
      { job: 'SGE', skill: 'Panhaima + Kerachole', timingNote: 'on "jealous" cue' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Vacuum Wave' },
    ],
    notes: 'Bibles: Vacuum Wave knockback and Trance. Lilybell, Macrocosmos, and Panhaima sustain party throughout movement.'
  },
  'dmu-p3-08': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (Exdeath)' },
      { job: 'AST', skill: 'Earthly Star', timingNote: 'Earthquake prep' },
      { job: 'SCH', skill: 'Spreadlo', timingNote: 'Spreadlo + Excog' },
      { job: 'SGE', skill: 'Zoe Shields', timingNote: 'before EQ cast ends' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'Decisive Battle' },
    ],
    notes: 'Bibles: Boss transition. Healers pre-cast shields and prep instant burst heals for upcoming Accretions.'
  },
  'dmu-p3-09': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)', timingNote: 'GNB/DRK' },
      { job: 'WHM', skill: 'Benediction', timingNote: 'Accretion healer' },
      { job: 'AST', skill: 'Macrocosmos + Essential Dignity', timingNote: 'Accretion healer' },
      { job: 'SCH', skill: 'Lustrate + Sacred Soil', timingNote: 'Accretion healer' },
      { job: 'SGE', skill: 'Krasis + Kerachole', timingNote: 'Accretion healer' },
      { roleSlot: 'melee1', skill: 'Feint', target: 'Chaos', timingNote: 'autos after EQ' },
    ],
    notes: 'Bibles: Bagels WHM Bible: Benediction reserved exclusively for the Accretion healer. Pop healer Accretion first.'
  },
  'dmu-p3-11': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', timingNote: 'GNB/DRK' },
      { job: 'WHM', skill: 'Temperance + Divine Caress', timingNote: 'Slap Happy 2' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'Slap Happy 2' },
      { job: 'SCH', skill: 'Expedient', timingNote: 'dodge Chaos frontal' },
      { job: 'SGE', skill: 'Holos + Kerachole', timingNote: 'Holos + Kera' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'Slap Happy 2' },
    ],
    notes: 'Bibles: Second slap mechanic. Expedient helps dodge Chaos frontal while mitigations protect tether soakers.'
  },
  'dmu-p3-15': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'OT', timingNote: 'Benison + Aquaveil' },
      { job: 'AST', skill: 'Bole + Exaltation', target: 'Tanks', timingNote: 'Bole MT + Exalt OT' },
      { job: 'SCH', skill: 'Summon Seraph + Fey Illumination', timingNote: '3rd set' },
      { job: 'SGE', skill: 'Panhaima + Philosophia', timingNote: 'Thunder 3' },
      { roleSlot: 'melee2', skill: 'Feint', target: 'Chaos', timingNote: 'BH set 1 / TB' },
      { roleSlot: 'caster', skill: 'Addle', target: 'Exdeath', timingNote: 'TB after Kefka slam' },
    ],
    notes: 'Bibles: Fifth Thunder TB set. Co-healers heavily support tanks through autos and buster hits.'
  },
  'dmu-p3-16': {
    actions: [
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'White Hole' },
      { job: 'AST', skill: 'Horoscope + Earthly Star', timingNote: 'after last tether' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'White Hole' },
      { job: 'SGE', skill: 'Pneuma', timingNote: 'White Hole' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Slap Happy 3' },
    ],
    notes: 'Bibles: White Hole full-party HP check. Burst AoE heals deployed to ensure everyone is at 100% HP.'
  },
  'dmu-p3-18': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'Stomp hits' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'Stomp hits' },
      { job: 'SCH', skill: 'Seraphism + Sacred Soil', timingNote: 'after 1st stack' },
      { job: 'SGE', skill: 'Kerachole + Physis', timingNote: 'Stomp hits' },
      { roleSlot: 'melee2', skill: 'Feint', target: 'Chaos', timingNote: 'Stomp-a-Mole' },
    ],
    notes: 'Bibles: Stomp-a-Mole execution. Seraphism and Plenary stabilize party between stomp hits.'
  },
  'dmu-p4-01': {
    actions: [
      { job: 'WHM', skill: 'Temperance + Asylum', timingNote: 'mid-cast' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'after cast' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil', timingNote: '60-80% castbar' },
      { job: 'SGE', skill: 'Holos + Kerachole', timingNote: 'end of castbar' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'GC 1 & 2' },
    ],
    notes: 'Bibles: Grand Cross 1. Shield healers delay Soil and Kerachole to end of castbar to maximize buff duration.'
  },
  'dmu-p4-03': {
    actions: [
      { job: 'WHM', skill: 'Medica III' },
      { job: 'AST', skill: 'Celestial Opposition' },
      { job: 'SCH', skill: 'Expedient + Fey Illumination + Summon Seraph', timingNote: '60-80% castbar' },
      { job: 'SGE', skill: 'Holos + Panhaima', timingNote: 'GC 2' },
    ],
    notes: 'Bibles: Grand Cross 2. Seraph and Panhaima shields absorb upcoming element pulses.'
  },
  'dmu-p4-05': {
    actions: [
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (WAR/PLD)' },
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'GC 3' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'GC 3' },
      { job: 'SCH', skill: 'Summon Seraph', timingNote: 'GC 3' },
      { job: 'SGE', skill: 'Kerachole + Panhaima', timingNote: 'GC 3' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'GC 3' },
    ],
    notes: 'Bibles: Grand Cross 3. Phys Ranged Mit applied any time after second Grand Cross.'
  },
  'dmu-p4-06': {
    actions: [
      { job: 'WHM', skill: 'Liturgy of the Bell', timingNote: 'pop after hit' },
      { job: 'AST', skill: 'Macrocosmos', timingNote: 'as colours appear' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Exdeath leaves wall' },
      { job: 'SGE', skill: 'Pneuma', timingNote: 'Pneuma after hit' },
    ],
    notes: 'Bibles: Flood of Naught. Crow SCH Bible: Press Soil as Exdeath leaves wall so it resets in time for Upsurge.'
  },
  'dmu-p4-08': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { job: 'WHM', skill: 'Medica III + Afflatus Rapture' },
      { job: 'AST', skill: 'Horoscope + Celestial Opposition' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Upsurge 1' },
      { job: 'SGE', skill: 'Kerachole + Philosophia', timingNote: 'Upsurge 1' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Upsurge 1' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'after "smile"' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Upsurge 1' },
    ],
    notes: 'Bibles: Ultima Upsurge 1. Venaa DPS: Phys Ranged pre-pops as 3rd voiceline disappears.'
  },
  'dmu-p4-10': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Upsurge 2' },
      { job: 'SGE', skill: 'Kerachole', timingNote: 'Upsurge 2' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Upsurge 2' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'on cd' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'Upsurge 2' },
    ],
    notes: 'Bibles: Ultima Upsurge 2. Secondary mitigation rotation finishes P4.'
  },
  'dmu-p5-01': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Temperance + Plenary Indulgence', timingNote: 'mid-cast / end' },
      { job: 'AST', skill: 'Horoscope', timingNote: 'Star on "smile"' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illumination', timingNote: 'Dawn on cast' },
      { job: 'SGE', skill: 'Kerachole + Zoe Shields + Haima', timingNote: 'Zoe E.Prog + Kera' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'Repeater 1' },
    ],
    notes: 'Bibles: P5 opener. Heavy initial shields prepare for repeater blast and upcoming auto attacks.'
  },
  'dmu-p5-02': {
    actions: [
      { job: 'WHM', skill: 'Aquaveil + Benison', target: 'Tanks', timingNote: 'for autos' },
      { job: 'AST', skill: 'Bole + Exaltation', target: 'Tanks', timingNote: 'for autos' },
      { job: 'SGE', skill: 'Holos', timingNote: 'covers flood' },
    ],
    notes: 'Bibles: Saybell Tank & Bagels WHM: Auto attacks deal more damage than Maddening Orchestra TBs! Prioritize single-target defensives on tanks.'
  },
  'dmu-p5-03': {
    actions: [
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Chaotic Flood' },
      { job: 'AST', skill: 'Sun Sign', timingNote: 'Chaotic Flood' },
      { job: 'SCH', skill: 'Expedient', timingNote: 'Chaotic Flood' },
      { job: 'SGE', skill: 'Holos + Panhaima', timingNote: 'Pneuma after last hit' },
    ],
    notes: 'Bibles: Chaotic Flood resolution.'
  },
  'dmu-p5-04': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { job: 'WHM', skill: 'Divine Caress', carryOver: true, timingNote: 'Benison MT' },
      { job: 'AST', skill: 'Sun Sign', carryOver: true, timingNote: 'MT defensives' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'for busters' },
      { job: 'SGE', skill: 'Kerachole + Panhaima', timingNote: 'Kera + Panhaima' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'MO 1' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'MO 1' },
    ],
    notes: 'Bibles: Maddening Orchestra 1. Venaa: Feint 1 and Phys Ranged 2 cover the hits.'
  },
  'dmu-p5-06': {
    actions: [
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'Plenary Set 1' },
      { job: 'AST', skill: 'Collective Unconscious', timingNote: 'CU Set 1' },
      { job: 'SCH', skill: 'Summon Seraph', timingNote: 'as autos end' },
      { job: 'SGE', skill: 'Physis', timingNote: 'Set 1' },
    ],
    notes: 'Bibles: Celestriad tower resolution. Healers pace AoE cooldowns across tower sets.'
  },
  'dmu-p5-07': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Plenary Indulgence', timingNote: 'Plenary + Medica III' },
      { job: 'AST', skill: 'Celestial Opposition', timingNote: 'CO + Lady' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'Soil + Indom' },
      { job: 'SGE', skill: 'Kerachole', timingNote: 'Repeater 2' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Repeater 2' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'after tower 3' },
    ],
    notes: 'Bibles: Ultima Repeater 2. Venaa: Addle 1 deployed right after Celestriad tower 3.'
  },
  'dmu-p5-11': {
    actions: [
      { job: 'WHM', skill: 'Divine Benison', target: 'MT', timingNote: 'for autos' },
      { job: 'AST', skill: 'Exaltation + CI', target: 'Tanks', timingNote: 'for autos' },
      { job: 'SCH', skill: 'Sacred Soil', timingNote: 'after exa spreads' },
      { job: 'SGE', skill: 'Kerachole + Haima', timingNote: 'early Kera' },
    ],
    notes: 'Bibles: Maddening Orchestra 2. Early Soil and Kerachole cover TBs and cushion the following 3x auto attack barrage.'
  },
  'dmu-p5-13': {
    actions: [
      { roleSlot: 'mtReprisal', skill: 'Reprisal (MT)' },
      { roleSlot: 'mtPartyMit', skill: 'Tank 90s (MT)' },
      { job: 'WHM', skill: 'Liturgy of the Bell + Asylum', timingNote: 'mid-cast / end' },
      { job: 'AST', skill: 'Collective Unconscious + Horoscope', timingNote: 'mid-cast / end' },
      { job: 'SCH', skill: 'Spreadlo + Sacred Soil + Fey Illumination + Expedient', timingNote: '80% castbar' },
      { job: 'SGE', skill: 'Kerachole + Holos + Zoe Shields', timingNote: '80% castbar' },
      { roleSlot: 'melee1', skill: 'Feint', timingNote: 'Forsaken cast' },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', timingNote: 'Forsaken cast' },
      { roleSlot: 'caster2', skill: 'Addle', timingNote: 'Forsaken cast' },
    ],
    notes: 'Bibles: Forsaken cast (Hit 1). Venaa: Feint 1, Phys Ranged 2, and Addle 2 mitigate the opening cast and first stack.'
  },
  'dmu-p5-14': {
    actions: [
      { job: 'WHM', skill: 'Temperance', timingNote: 'after stack 1' },
      { job: 'AST', skill: 'Macrocosmos + Sun Sign', timingNote: 'after stack 1' },
      { job: 'SCH', skill: 'Seraphism', timingNote: 'after stack 1' },
      { job: 'SGE', skill: 'Philosophia' },
      { roleSlot: 'melee1', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged2', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster2', skill: 'Addle', carryOver: true },
    ],
    notes: 'Bibles: Enrage stack 1 / raidwide 2. Seraphism, Macrocosmos, and Temperance stabilize party through the pulse.'
  },
  'dmu-p5-15': {
    actions: [
      { job: 'AST', skill: 'Macrocosmos', carryOver: true },
      { job: 'SCH', skill: 'Seraphism', carryOver: true },
      { job: 'SGE', skill: 'Panhaima', timingNote: 'Stack 2' },
    ],
    notes: 'Bibles: Enrage pulse 3.'
  },
  'dmu-p5-16': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)' },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)' },
      { job: 'WHM', skill: 'Divine Caress', timingNote: 'Set 3 / Stack 3' },
      { job: 'AST', skill: 'Earthly Star', timingNote: 'Set 3' },
      { job: 'SCH', skill: 'Expedient', carryOver: true },
      { job: 'SGE', skill: 'Physis', timingNote: 'Stack 3' },
      { roleSlot: 'melee2', skill: 'Feint', timingNote: 'Stack 3' },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', timingNote: 'Stack 3' },
      { roleSlot: 'caster', skill: 'Addle', timingNote: 'Stack 3' },
    ],
    notes: 'Bibles: Enrage stack 3 (Hit 5). Venaa: Second defensive cycle with Feint 2, Phys Ranged 1, and Addle 1.'
  },
  'dmu-p5-18': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph', timingNote: 'off cd' },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Enrage pulse 4.'
  },
  'dmu-p5-19': {
    actions: [
      { roleSlot: 'otReprisal', skill: 'Reprisal (OT)', carryOver: true },
      { roleSlot: 'otPartyMit', skill: 'Tank 90s (OT)', carryOver: true },
      { job: 'SCH', skill: 'Summon Seraph + Sacred Soil', timingNote: 'off cd' },
      { job: 'SGE', skill: 'Kerachole' },
      { roleSlot: 'melee2', skill: 'Feint', carryOver: true },
      { roleSlot: 'physRanged', skill: 'Phys Ranged Mit', carryOver: true },
      { roleSlot: 'caster', skill: 'Addle', carryOver: true },
    ],
    notes: 'Final enrage stack 4.'
  }
};

const BIBLES_ROWS: PlanRow[] = calculateCarryOvers(createPlanVariant(LPDU_ROWS, BIBLES_OVERRIDES));

// Exported registry of selectable mitigation plan variants
export const DMU_PLAN_VARIANTS: MitPlanVariant[] = [
  {
    id: 'lpdu-standard',
    name: 'LPDU Standard Compile',
    shortName: 'LPDU',
    description: 'The community standard mitigation compile approved by LPDU moderation and veteran raid leads.',
    authors: 'Pepi, Crow, Req, Vena, Saybel, Tetra, Bagels, Hisshi',
    sourceUrl: 'https://tinyurl.com/LPDUmitsheet',
    rows: calculateCarryOvers(LPDU_ROWS)
  },
  {
    id: 'ikuya-mitty',
    name: 'Ikuya Mitty',
    shortName: 'Ikuya',
    description: 'Popular high-detail mitigation sheet with explicit carryovers and barrier calculations.',
    authors: 'Ikuya',
    sourceUrl: 'https://docs.google.com/spreadsheets/d/10C3ytfH3irHqkb45rchIq5oqdAs-v_OKTj57M-Twi3k/htmlview',
    rows: IKUYA_ROWS
  },
  {
    id: 'job-bibles',
    name: 'Community Job Bibles',
    shortName: 'Bibles',
    description: 'Granular job-by-job guides (Bagels WHM, Hisshi AST, Crow SCH, Reqcat SGE, Saybell Tanks, Venaa DPS).',
    authors: 'Bagels, Hisshi, Crow, Reqcat, Saybell, Venaa',
    sourceUrl: 'https://pastebin.com/5295etbj',
    rows: BIBLES_ROWS
  }
];

