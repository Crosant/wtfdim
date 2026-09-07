import { JobId, PartyComposition, PlanRow } from '../types/mitigation';
import { JOB_REGISTRY } from '../data/jobs';
import { DMU_TIMELINE, DMU_PHASE_CONFIG } from '../data/dmuTimeline';
import { actionAppliesToJob, getSkillNameForJob } from '../utils/actionResolver';

interface QuickCheatDrawerProps {
  selectedJob: JobId;
  rows: PlanRow[];
  currentPhase: number;
  partyComp: PartyComposition;
  isExpanded: boolean;
  onJobChange: (newJob: JobId) => void;
}

export function renderQuickCheatDrawer(props: QuickCheatDrawerProps): string {
  const currentMeta = JOB_REGISTRY[props.selectedJob];

  // All jobs grouped for dropdown
  const jobOptions = Object.values(JOB_REGISTRY).map(j => `
    <option value="${j.id}" ${j.id === props.selectedJob ? 'selected' : ''}>
      ${j.id} - ${j.name}
    </option>
  `).join('');

  const mechPhaseMap = new Map(DMU_TIMELINE.map(m => [m.id, m.phase]));

  // Extract all occurrences where an action applies to the selected job
  const jobTimelineItems: {
    phase: number;
    timestamp: string;
    mechanicName: string;
    damageType: string;
    skill: string;
    timingNote?: string;
    carryOver?: boolean;
    notes?: string;
  }[] = [];

  props.rows.forEach(row => {
    const phase = mechPhaseMap.get(row.mechanicId) || 1;
    if (props.currentPhase !== 0 && phase !== props.currentPhase) {
      return;
    }

    const applicableActions = row.actions.filter(a => actionAppliesToJob(a, props.selectedJob, props.partyComp));
    applicableActions.forEach(action => {
      jobTimelineItems.push({
        phase,
        timestamp: row.timestamp,
        mechanicName: row.mechanicName,
        damageType: row.damageType,
        skill: getSkillNameForJob(action, props.selectedJob),
        timingNote: action.timingNote,
        carryOver: action.carryOver,
        notes: row.notes
      });
    });
  });

  let lastPhase = 0;
  const timelineHtml = jobTimelineItems.length > 0 
    ? jobTimelineItems.map(item => {
        let phaseDividerHtml = '';
        if (props.currentPhase === 0 && item.phase !== lastPhase) {
          lastPhase = item.phase;
          const conf = DMU_PHASE_CONFIG[item.phase];
          if (conf) {
            phaseDividerHtml = `
              <div class="cheat-phase-divider" style="--phase-color: ${conf.colorVar};">
                <span class="cheat-phase-badge" style="color: ${conf.colorVar}; border-color: ${conf.colorVar}; background: ${conf.bgVar};">
                  ${conf.shortLabel}
                </span>
                <span class="cheat-phase-title">${conf.name}</span>
              </div>
            `;
          }
        }

        if (props.isExpanded) {
          return `
            ${phaseDividerHtml}
            <div class="cheat-item expanded">
              <div class="cheat-col-time-val">
                <span class="cheat-time">${item.timestamp}</span>
              </div>
              <div class="cheat-col-mech-val">
                <div class="cheat-mech-name">${item.mechanicName}</div>
                <span class="tag-badge tag-${item.damageType}">${item.damageType}</span>
              </div>
              <div class="cheat-col-skill-val">
                <div class="cheat-skill-badge">
                  ${item.carryOver ? '<span style="color: var(--accent-blue); font-weight: bold;">➔</span> ' : ''}
                  <span>${item.skill}</span>
                </div>
                ${item.timingNote ? `<div class="cheat-hint">${item.timingNote}</div>` : ''}
              </div>
              <div class="cheat-col-notes-val">
                <div class="cheat-notes-text">${item.notes || '—'}</div>
              </div>
            </div>
          `;
        }

        return `
          ${phaseDividerHtml}
          <div class="cheat-item">
            <div class="cheat-top">
              <span class="cheat-time">${item.timestamp}</span>
              <span class="cheat-mech-name" title="${item.mechanicName}">${item.mechanicName}</span>
            </div>
            <div class="cheat-skill-badge">
              ${item.carryOver ? '<span style="color: var(--accent-blue)">➔</span> ' : ''}
              ${item.skill}
            </div>
            ${item.timingNote ? `<div class="cheat-hint">${item.timingNote}</div>` : ''}
          </div>
        `;
      }).join('')
    : `<div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        No mitigations found for ${currentMeta.name} in this selection.
      </div>`;

  return `
    <aside class="quick-cheat-panel ${props.isExpanded ? 'is-expanded' : ''}">
      <div class="cheat-header">
        <div class="cheat-title-group">
          <div class="cheat-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Quick-Cheat</span>
          </div>
          <div class="job-select-wrapper">
            <select id="quick-job-select" title="Select your job">
              ${jobOptions}
            </select>
          </div>
        </div>

        <div class="cheat-header-controls">
          <button id="toggle-cheat-expand-btn" class="btn btn-secondary btn-sm" title="${props.isExpanded ? 'Restore compact drawer width' : 'Expand Quick-Cheat to wide view with notes'}">
            ${props.isExpanded 
              ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <polyline points="4 14 10 14 10 20"/>
                   <polyline points="20 10 14 10 14 4"/>
                   <line x1="14" y1="10" x2="21" y2="3"/>
                   <line x1="3" y1="21" x2="10" y2="14"/>
                 </svg>
                 <span>Compact</span>`
              : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                   <polyline points="15 3 21 3 21 9"/>
                   <polyline points="9 21 3 21 3 15"/>
                   <line x1="21" y1="3" x2="14" y2="10"/>
                   <line x1="3" y1="21" x2="10" y2="14"/>
                 </svg>
                 <span>Bigger</span>`
            }
          </button>
          <button id="open-focus-modal-btn" class="btn btn-secondary btn-sm" title="Open Fullscreen Focus Mode">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <span>Focus</span>
          </button>
        </div>
      </div>

      <!-- Column Header Bar for the cheat table -->
      <div class="cheat-col-header ${props.isExpanded ? 'expanded-col-header' : ''}">
        <span class="cheat-col-th-time">Time</span>
        <span class="cheat-col-th-mech">Mechanic</span>
        <span class="cheat-col-th-skill">Ability To Press</span>
        ${props.isExpanded ? '<span class="cheat-col-th-notes">Notes & Timing</span>' : ''}
      </div>

      <div class="cheat-timeline" id="cheat-timeline-list">
        ${timelineHtml}
      </div>

      <div class="cheat-actions-bar">
        <button id="copy-macro-btn" class="btn btn-primary copy-btn" title="Copy clean FFXIV in-game /echo macro">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copy /echo Macro
        </button>
      </div>
    </aside>
  `;
}

// Generates clean soundless in-game echo macro with job-resolved skills
export function generateEchoMacro(job: JobId, rows: PlanRow[], partyComp: PartyComposition): string {
  const lines: string[] = [`/echo === WTFDIM: ${job} Mit Plan ===`];

  rows.forEach(row => {
    const applicableActions = row.actions.filter(a => actionAppliesToJob(a, job, partyComp));
    if (applicableActions.length) {
      const skills = applicableActions.map(a => {
        const skillName = getSkillNameForJob(a, job);
        return `${a.carryOver ? '➔ ' : ''}${skillName}${a.timingNote ? ` (${a.timingNote})` : ''}`;
      }).join(' + ');
      lines.push(`/echo [${row.timestamp}] ${row.mechanicName}: ${skills}`);
    }
  });

  return lines.join('\n');
}
