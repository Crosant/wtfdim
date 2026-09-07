import { MitPlanVariant } from '../types/mitigation';
import { calculateCarryOvers } from '../utils/carryOverCalculator';
import { LPDU_PLAN_ROWS } from './plans/lpduPlan';
import { IKUYA_PLAN_ROWS } from './plans/ikuyaPlan';
import { JOB_BIBLES_PLAN_ROWS } from './plans/jobBiblesPlan';

/**
 * Registry of full, standalone mitigation plan variants.
 * Each plan is fully populated with all 85 encounter mechanics without inheritance or overrides.
 */
export const DMU_PLAN_VARIANTS: MitPlanVariant[] = [
  {
    id: 'lpdu-standard',
    name: 'LPDU Standard Compile',
    shortName: 'LPDU',
    description: 'The community standard mitigation compile approved by LPDU moderation and veteran raid leads.',
    authors: 'Pepi, Crow, Req, Vena, Saybel, Tetra, Bagels, Hisshi',
    sourceUrl: 'https://tinyurl.com/LPDUmitsheet',
    rows: calculateCarryOvers(LPDU_PLAN_ROWS),
  },
  {
    id: 'ikuya-mitty',
    name: 'Ikuya Mitty',
    shortName: 'Ikuya',
    description: 'Popular high-detail mitigation sheet with explicit carryovers and barrier calculations.',
    authors: 'Ikuya',
    sourceUrl: 'https://docs.google.com/spreadsheets/d/10C3ytfH3irHqkb45rchIq5oqdAs-v_OKTj57M-Twi3k/htmlview',
    rows: calculateCarryOvers(IKUYA_PLAN_ROWS),
  },
  {
    id: 'job-bibles',
    name: 'Community Job Bibles',
    shortName: 'Bibles',
    description: 'Granular job-by-job guides (Bagels WHM, Hisshi AST, Crow SCH, Reqcat SGE, Saybell Tanks, Venaa DPS).',
    authors: 'Bagels, Hisshi, Crow, Reqcat, Saybell, Venaa',
    sourceUrl: 'https://pastebin.com/5295etbj',
    rows: calculateCarryOvers(JOB_BIBLES_PLAN_ROWS),
  },
];

// Re-exports for direct access or backward compatibility
export { LPDU_PLAN_ROWS, IKUYA_PLAN_ROWS, JOB_BIBLES_PLAN_ROWS };
export const LPDU_ROWS = LPDU_PLAN_ROWS;
export const IKUYA_ROWS = IKUYA_PLAN_ROWS;
export const BIBLES_ROWS = JOB_BIBLES_PLAN_ROWS;
