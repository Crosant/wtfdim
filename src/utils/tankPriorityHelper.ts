import { JobId } from '../types/mitigation';

// Community standard tank priorities for Dancing Mad Ultimate (LPDU, Ikuya Mitty, Job Bibles)
export const TANK_INVULN_PRIORITY: JobId[] = ['WAR', 'DRK', 'GNB', 'PLD'];
export const TANK_WALL_PRIORITY: JobId[] = ['PLD', 'WAR', 'DRK', 'GNB'];
export const TANK_LB_PRIORITY: JobId[] = ['WAR', 'DRK', 'PLD', 'GNB'];

export interface TankAssignments {
  // P2 Wings of Destruction Wall
  wallTank: JobId;
  bossTank: JobId;

  // P3 Vacuum Wave Tank LB3
  lbTank: JobId;

  // P3 Chaos & Exdeath
  chaosTank: JobId;
  exdeathTank: JobId;
  p3Invuln1Tank: JobId; // Set 2 invuln (Chaos Tank)
  p3Invuln2Tank: JobId; // Set 4 invuln (Exdeath Tank)

  // P5 Flare / Holy & Fell Forces
  p5Invuln1Tank: JobId;   // Invulns 1st Flare/Holy & Fell Forces 2 solo
  p5StartBossTank: JobId; // Starts with boss aggro, invulns 2nd Flare/Holy & Fell Forces 4 solo
}

/**
 * Computes exact tank assignments for a given party's two tanks.
 */
export function resolveTankAssignments(t1: JobId, t2: JobId): TankAssignments {
  const idx1Invuln = TANK_INVULN_PRIORITY.indexOf(t1);
  const idx2Invuln = TANK_INVULN_PRIORITY.indexOf(t2);

  // Tank with lower index in WAR > DRK > GNB > PLD is higher priority
  const higherInvuln = idx1Invuln <= idx2Invuln ? t1 : t2;
  const lowerInvuln = idx1Invuln <= idx2Invuln ? t2 : t1;

  // P2 Wall Priority: PLD > WAR > DRK > GNB
  const idx1Wall = TANK_WALL_PRIORITY.indexOf(t1);
  const idx2Wall = TANK_WALL_PRIORITY.indexOf(t2);
  const wallTank = idx1Wall <= idx2Wall ? t1 : t2;
  const bossTank = idx1Wall <= idx2Wall ? t2 : t1;

  // P3 Tank LB3 Priority: WAR > DRK > PLD > GNB
  const idx1Lb = TANK_LB_PRIORITY.indexOf(t1);
  const idx2Lb = TANK_LB_PRIORITY.indexOf(t2);
  const lbTank = idx1Lb <= idx2Lb ? t1 : t2;

  return {
    wallTank,
    bossTank,
    lbTank,
    chaosTank: higherInvuln,
    exdeathTank: lowerInvuln,
    p3Invuln1Tank: higherInvuln,
    p3Invuln2Tank: lowerInvuln,
    p5Invuln1Tank: higherInvuln,
    p5StartBossTank: lowerInvuln
  };
}
