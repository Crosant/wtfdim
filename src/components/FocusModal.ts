import { JobId, PartyComposition, PlanRow } from '../types/mitigation';
import { JOB_REGISTRY } from '../data/jobs';
import { DMU_TIMELINE, DMU_PHASE_CONFIG } from '../data/dmuTimeline';
import { actionAppliesToJob, getSkillNameForJob } from '../utils/actionResolver';

interface FocusModalProps {
  isOpen: boolean;
  selectedJob: JobId;
  rows: PlanRow[];
  currentPhase: number;
  partyComp: PartyComposition;
  width: number;
  height: number;
  isMaximized: boolean;
  onClose: () => void;
}

export function renderFocusModal(props: FocusModalProps): string {
  if (!props.isOpen) return '';

  const jobMeta = JOB_REGISTRY[props.selectedJob];
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

  const phaseCounts: Record<number, number> = {};
  jobTimelineItems.forEach(item => {
    phaseCounts[item.phase] = (phaseCounts[item.phase] || 0) + 1;
  });

  let lastPhase = 0;
  const tableRows = jobTimelineItems.length > 0 
    ? jobTimelineItems.map(item => {
        let phaseDividerHtml = '';
        if (props.currentPhase === 0 && item.phase !== lastPhase) {
          lastPhase = item.phase;
          const conf = DMU_PHASE_CONFIG[item.phase];
          if (conf) {
            phaseDividerHtml = `
              <tr class="phase-divider-row" data-phase="${item.phase}">
                <td colspan="4" class="phase-divider-td">
                  <div class="phase-divider-banner" style="--phase-color: ${conf.colorVar};">
                    <div class="phase-divider-left">
                      <span class="phase-pill-badge" style="color: ${conf.colorVar}; border-color: ${conf.colorVar}; background: ${conf.bgVar};">
                        ${conf.shortLabel}
                      </span>
                      <span class="phase-divider-title">${conf.name}</span>
                    </div>
                    <div class="phase-divider-right">
                      <span class="phase-divider-count">${phaseCounts[item.phase] || 0} Actions</span>
                    </div>
                  </div>
                </td>
              </tr>
            `;
          }
        }

        return `
          ${phaseDividerHtml}
          <tr class="focus-row">
            <td class="focus-time">${item.timestamp}</td>
            <td class="focus-mech">
              <div style="font-weight: 700; font-size: 1.05rem;">${item.mechanicName}</div>
              <span class="tag-badge tag-${item.damageType}">${item.damageType}</span>
            </td>
            <td class="focus-skill">
              <div class="focus-skill-chip">
                ${item.carryOver ? '<span style="color: var(--accent-blue); font-weight: bold;">➔</span> ' : ''}
                <span>${item.skill}</span>
              </div>
              ${item.timingNote ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">${item.timingNote}</div>` : ''}
            </td>
            <td class="focus-notes">${item.notes || '—'}</td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No mitigations recorded for ${jobMeta.name} in this selection.</td></tr>`;

  const inlineSizeStyle = props.isMaximized 
    ? '' 
    : `width: ${props.width}px; height: ${props.height}px; max-width: 98vw; min-width: 460px; max-height: 98vh;`;

  return `
    <div class="modal-overlay open" id="focus-modal-overlay">
      <div 
        class="modal-card focus-modal-card ${props.isMaximized ? 'is-maximized' : ''}" 
        id="focus-modal-card"
        style="${inlineSizeStyle}"
      >
        <div class="modal-header focus-modal-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="job-tag" style="background: ${jobMeta.iconBg}; color: ${jobMeta.color}; font-size: 1rem; padding: 0.3rem 0.6rem;">
              ${jobMeta.id}
            </span>
            <div>
              <h3 style="font-size: 1.2rem;">${jobMeta.name} &bull; Focus Mode</h3>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Resizable high-visibility timeline for raid monitoring</div>
            </div>
          </div>

          <div class="modal-header-actions">
            <div class="focus-presets-group" title="Quick size presets">
              <button class="focus-preset-btn" data-preset="compact" title="Compact size (700x520)">Compact</button>
              <button class="focus-preset-btn" data-preset="normal" title="Standard size (1050x760)">Standard</button>
              <button class="focus-preset-btn" data-preset="wide" title="Wide size (1380x820)">Wide</button>
              <button class="focus-preset-btn" data-preset="max" title="Full size">Max</button>
            </div>

            <button class="modal-ctrl-btn" id="maximize-focus-modal-btn" title="${props.isMaximized ? 'Restore normal size' : 'Maximize window'}">
              ${props.isMaximized 
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <polyline points="4 14 10 14 10 20"/>
                     <polyline points="20 10 14 10 14 4"/>
                     <line x1="14" y1="10" x2="21" y2="3"/>
                     <line x1="3" y1="21" x2="10" y2="14"/>
                   </svg>`
                : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                   </svg>`
              }
            </button>

            <button class="close-modal-btn" id="close-focus-modal-btn" aria-label="Close focus modal">&times;</button>
          </div>
        </div>

        <div class="modal-body focus-modal-body">
          <div class="table-responsive focus-table-responsive">
            <table class="mit-table focus-table">
              <thead>
                <tr>
                  <th style="width: 85px;">Time</th>
                  <th style="width: 220px;">Mechanic</th>
                  <th style="width: 260px;">Ability To Press</th>
                  <th>Strategic Notes</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer focus-modal-footer">
          <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>Showing ${jobTimelineItems.length} actions for ${jobMeta.name}</span>
            <span style="color: var(--border-subtle);">&bull;</span>
            <span style="color: var(--accent-blue); font-size: 0.76rem;">Drag right border ⇹ or corner ◢ to resize</span>
          </div>
          <button id="focus-copy-macro-btn" class="btn btn-primary" title="Copy clean in-game /echo macro">
            Copy /echo Macro
          </button>
        </div>

        <!-- Directional Edge and Corner Resize Handles -->
        <div class="focus-resize-edge-right" id="focus-resize-handle-right" title="Drag to resize width"></div>
        <div class="focus-resize-edge-bottom" id="focus-resize-handle-bottom" title="Drag to resize height"></div>
        <div class="focus-resize-handle" id="focus-resize-handle" title="Drag corner to resize both width & height">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}
