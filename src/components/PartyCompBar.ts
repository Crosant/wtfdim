import { JobId, PartyComposition } from '../types/mitigation';
import { JOB_REGISTRY } from '../data/jobs';

interface PartyCompBarProps {
  composition: PartyComposition;
  onSlotChange: (slot: keyof PartyComposition, newJob: JobId) => void;
}

const SLOT_OPTIONS: Record<keyof PartyComposition, { label: string; jobs: JobId[] }> = {
  mt: { label: 'MT', jobs: ['WAR', 'PLD', 'DRK', 'GNB'] },
  ot: { label: 'OT', jobs: ['PLD', 'WAR', 'DRK', 'GNB'] },
  h1: { label: 'H1', jobs: ['WHM', 'AST'] },
  h2: { label: 'H2', jobs: ['SCH', 'SGE'] },
  d1: { label: 'D1', jobs: ['SAM', 'NIN', 'MNK', 'DRG', 'RPR', 'VPR'] },
  d2: { label: 'D2', jobs: ['NIN', 'SAM', 'MNK', 'DRG', 'RPR', 'VPR', 'BLM', 'PCT', 'SMN', 'RDM'] },
  d3: { label: 'D3', jobs: ['DNC', 'BRD', 'MCH'] },
  d4: { label: 'D4', jobs: ['PCT', 'SMN', 'RDM', 'BLM'] },
};

export function renderPartyCompBar(props: PartyCompBarProps): string {
  const chipsHtml = (Object.keys(SLOT_OPTIONS) as (keyof PartyComposition)[]).map(slot => {
    const currentJob = props.composition[slot];
    const meta = JOB_REGISTRY[currentJob];
    const slotDef = SLOT_OPTIONS[slot];

    return `
      <div class="comp-slot-item" style="position: relative; display: inline-flex; align-items: center;">
        <select 
          class="job-chip-btn comp-slot-select" 
          data-slot="${slot}"
          title="${slotDef.label}: ${meta.name}"
          style="border-color: ${meta.color}; background: ${meta.iconBg};"
        >
          ${slotDef.jobs.map(job => `
            <option value="${job}" ${job === currentJob ? 'selected' : ''}>
              ${slotDef.label}: ${job}
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }).join('');

  return `
    <div class="comp-bar">
      <div class="comp-inner">
        <div class="comp-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Party Composition:
        </div>
        <div class="comp-chips">
          ${chipsHtml}
        </div>
      </div>
    </div>
  `;
}
