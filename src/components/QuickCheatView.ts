import { JobId, PartyComposition, PlanRow, PositionSlot } from '../types/mitigation';
import { JOB_REGISTRY } from '../data/jobs';
import { DMU_TIMELINE, DMU_PHASE_CONFIG } from '../data/dmuTimeline';
import { DMU_PLAN_VARIANTS } from '../data/dmuPlans';
import { actionAppliesToJob, getSkillNameForJob } from '../utils/actionResolver';
import { getAvailablePositionsForJob, getPositionLabel } from '../utils/positionHelper';
import { renderTankPriorityCard } from './TankPriorityCard';

export interface QuickCheatViewProps {
  selectedJob: JobId;
  selectedPosition: PositionSlot;
  currentPlanId: string;
  rows: PlanRow[];
  currentPhase: number;
  searchQuery: string;
  partyComp: PartyComposition;
  onJobChange: (job: JobId) => void;
  onPositionChange: (pos: PositionSlot) => void;
  onPlanChange: (planId: string) => void;
  onPhaseSelect: (phase: number) => void;
  onSearchChange: (query: string) => void;
}

export function renderQuickCheatView(props: QuickCheatViewProps): string {
  const currentMeta = JOB_REGISTRY[props.selectedJob];
  const availablePositions = getAvailablePositionsForJob(props.selectedJob);
  const mechPhaseMap = new Map(DMU_TIMELINE.map(m => [m.id, m.phase]));

  // Extract all timeline items for this job across all rows
  const allJobTimelineItems: {
    phase: number;
    mechanicId: string;
    timestamp: string;
    mechanicName: string;
    damageType: string;
    rawDamage?: string;
    skill: string;
    timingNote?: string;
    carryOver?: boolean;
    target?: string;
    slotTag?: string;
    notes?: string;
  }[] = [];

  props.rows.forEach(row => {
    const phase = mechPhaseMap.get(row.mechanicId) || 1;
    const applicableActions = row.actions.filter(a => actionAppliesToJob(a, props.selectedJob, props.partyComp));

    applicableActions.forEach(action => {
      let slotTag: string | undefined = undefined;
      if (['WAR', 'PLD', 'DRK', 'GNB'].includes(props.selectedJob)) {
        slotTag = props.selectedPosition;
      } else if (['D1', 'D2', 'D3', 'D4'].includes(props.selectedPosition)) {
        slotTag = props.selectedPosition;
      }

      allJobTimelineItems.push({
        phase,
        mechanicId: row.mechanicId,
        timestamp: row.timestamp,
        mechanicName: row.mechanicName,
        damageType: row.damageType,
        rawDamage: row.rawDamage,
        skill: getSkillNameForJob(action, props.selectedJob),
        timingNote: action.timingNote,
        carryOver: action.carryOver,
        target: action.target,
        slotTag,
        notes: row.notes
      });
    });
  });

  // Calculate action counts per phase for this specific job
  const jobPhaseCounts: Record<number, number> = { 0: allJobTimelineItems.length, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allJobTimelineItems.forEach(item => {
    if (jobPhaseCounts[item.phase] !== undefined) {
      jobPhaseCounts[item.phase]++;
    }
  });

  // Filter items by selected phase and search query
  const filteredItems = allJobTimelineItems.filter(item => {
    if (props.currentPhase !== 0 && item.phase !== props.currentPhase) {
      return false;
    }
    if (props.searchQuery.trim()) {
      const q = props.searchQuery.toLowerCase();
      const matchMech = item.mechanicName.toLowerCase().includes(q);
      const matchSkill = item.skill.toLowerCase().includes(q);
      const matchTime = item.timestamp.includes(q);
      const matchNotes = (item.notes || '').toLowerCase().includes(q);
      const matchTiming = (item.timingNote || '').toLowerCase().includes(q);
      return matchMech || matchSkill || matchTime || matchNotes || matchTiming;
    }
    return true;
  });

  // Build Job Select Dropdown grouped by role
  const roleGroups: { roleName: string; jobs: typeof currentMeta[] }[] = [
    { roleName: 'Tanks', jobs: ['WAR', 'PLD', 'DRK', 'GNB'].map(id => JOB_REGISTRY[id as JobId]) },
    { roleName: 'Healers', jobs: ['WHM', 'AST', 'SCH', 'SGE'].map(id => JOB_REGISTRY[id as JobId]) },
    { roleName: 'Melee DPS', jobs: ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'].map(id => JOB_REGISTRY[id as JobId]) },
    { roleName: 'Phys Ranged', jobs: ['BRD', 'MCH', 'DNC'].map(id => JOB_REGISTRY[id as JobId]) },
    { roleName: 'Casters', jobs: ['BLM', 'SMN', 'RDM', 'PCT'].map(id => JOB_REGISTRY[id as JobId]) },
  ];

  const jobSelectOptions = roleGroups.map(group => `
    <optgroup label="${group.roleName}">
      ${group.jobs.map(j => `
        <option value="${j.id}" ${j.id === props.selectedJob ? 'selected' : ''}>
          ${j.id} - ${j.name}
        </option>
      `).join('')}
    </optgroup>
  `).join('');

  // Build Position Toggle Buttons
  const positionButtonsHtml = availablePositions.map(pos => {
    const isActive = pos === props.selectedPosition;
    return `
      <button 
        type="button"
        class="pos-toggle-btn ${isActive ? 'active' : ''}" 
        data-pos="${pos}"
        title="View as ${getPositionLabel(pos)}"
      >
        <span class="slot-badge slot-${pos.toLowerCase()}">${pos}</span>
        <span class="pos-label">${getPositionLabel(pos)}</span>
      </button>
    `;
  }).join('');

  // Build Plan Options
  const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === props.currentPlanId) || DMU_PLAN_VARIANTS[0];
  const planOptions = DMU_PLAN_VARIANTS.map(p => `
    <option value="${p.id}" ${p.id === props.currentPlanId ? 'selected' : ''}>
      ${p.name}
    </option>
  `).join('');

  // Build Phase Tabs
  const phaseNavTabs = [
    { id: 0, label: 'All Phases', count: jobPhaseCounts[0] },
    { id: 1, label: 'P1: Kefka', count: jobPhaseCounts[1] },
    { id: 2, label: 'P2: Forsaken', count: jobPhaseCounts[2] },
    { id: 3, label: 'P3: Chaos & Exdeath', count: jobPhaseCounts[3] },
    { id: 4, label: 'P4: Kefka Says', count: jobPhaseCounts[4] },
    { id: 5, label: 'P5: Reimagined', count: jobPhaseCounts[5] },
  ].map(tab => `
    <button 
      type="button"
      class="phase-tab phase-btn ${props.currentPhase === tab.id ? 'active' : ''}" 
      data-phase="${tab.id}"
      title="Filter by ${tab.label}"
    >
      <span>${tab.label}</span>
      <span class="phase-count-badge">${tab.count}</span>
    </button>
  `).join('');

  // Build Table Rows
  let lastPhase = 0;
  const tableRowsHtml = filteredItems.length > 0
    ? filteredItems.map(item => {
        let dividerHtml = '';
        if (props.currentPhase === 0 && item.phase !== lastPhase) {
          lastPhase = item.phase;
          const conf = DMU_PHASE_CONFIG[item.phase];
          if (conf) {
            dividerHtml = `
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
                      <span class="phase-divider-count">${jobPhaseCounts[item.phase] || 0} Mitigations</span>
                    </div>
                  </div>
                </td>
              </tr>
            `;
          }
        }

        return `
          ${dividerHtml}
          <tr>
            <td class="cell-time">${item.timestamp}</td>
            <td>
              <div class="cell-mechanic">
                <span class="mech-name">${item.mechanicName}</span>
                <div class="mech-meta">
                  <span class="tag-badge tag-${item.damageType}">${item.damageType}</span>
                  ${item.rawDamage ? `<span class="raw-damage-pill">${item.rawDamage}</span>` : ''}
                </div>
              </div>
            </td>
            <td>
              <div class="action-stack">
                <div class="action-chip ${item.carryOver ? 'carry-over' : ''}" style="opacity: 1;" title="${props.selectedJob}: ${item.skill}${item.timingNote ? ` (${item.timingNote})` : ''}">
                  ${item.carryOver ? `<span class="carry-arrow" title="Carry over from previous cast">➔</span>` : ''}
                  ${item.slotTag ? `<span class="slot-badge slot-${item.slotTag.toLowerCase()}">${item.slotTag}</span>` : ''}
                  <span class="job-tag" style="color: ${currentMeta?.color || '#fff'}">${props.selectedJob}</span>
                  <span class="skill-name">${item.skill}</span>
                  ${item.target && item.target !== 'Party' && item.target !== 'Self' ? `<span class="target-badge">➔ ${item.target}</span>` : ''}
                  ${item.timingNote ? `<span class="action-note">${item.timingNote}</span>` : ''}
                </div>
              </div>
            </td>
            <td class="cell-notes">${item.notes || '—'}</td>
          </tr>
        `;
      }).join('')
    : `
      <tr>
        <td colspan="4" style="text-align: center; padding: 3.5rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No mitigations recorded for ${currentMeta.name} (${props.selectedPosition}) in this filter selection.</p>
          <p style="font-size: 0.85rem;">Try selecting "All Phases" or clearing your search query.</p>
        </td>
      </tr>
    `;

  return `
    <div class="quick-cheat-view-wrapper">
      <!-- Control Bar -->
      <div class="cheat-view-toolbar">
        <div class="cheat-toolbar-left">
          <!-- Job Selector -->
          <div class="cheat-control-group">
            <span class="cheat-control-label">Job:</span>
            <div class="job-select-wrapper">
              <span class="job-tag" style="color: ${currentMeta.color}; background: ${currentMeta.iconBg}; font-size: 0.9rem; padding: 0.25rem 0.5rem;">
                ${props.selectedJob}
              </span>
              <select id="qcv-job-select" class="cheat-select" title="Choose your job">
                ${jobSelectOptions}
              </select>
            </div>
          </div>

          <!-- Position Selector -->
          <div class="cheat-control-group">
            <span class="cheat-control-label">Position:</span>
            <div class="pos-toggle-group" id="qcv-pos-toggle-group">
              ${positionButtonsHtml}
            </div>
          </div>

          <!-- Mit Plan Selector -->
          <div class="cheat-control-group">
            <span class="cheat-control-label">Mit Plan:</span>
            <div class="cheat-plan-wrapper">
              <select id="qcv-plan-select" class="plan-select" title="Choose mitigation plan">
                ${planOptions}
              </select>
            </div>
          </div>
        </div>

        <div class="cheat-toolbar-right">
          <div class="cheat-view-summary-badge">
            <span class="summary-highlight">${props.selectedJob}</span>
            <span class="slot-badge slot-${props.selectedPosition.toLowerCase()}">${props.selectedPosition}</span>
            <span>&bull; ${jobPhaseCounts[props.currentPhase]} Mitigations</span>
          </div>

          <button id="qcv-copy-macro-btn" class="btn btn-primary btn-sm" title="Copy in-game /echo macro for this job">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>Copy /echo Macro</span>
          </button>

          <button id="qcv-focus-modal-btn" class="btn btn-secondary btn-sm" title="Open resizable Focus Mode">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <span>Focus Mode</span>
          </button>
        </div>
      </div>

      <!-- Phase Navigation -->
      <nav class="phase-nav qcv-phase-nav">
        <div class="phase-tabs">
          ${phaseNavTabs}
        </div>
      </nav>

      <!-- Tank Priority Protocol Card (Prominently rendered for tanks) -->
      ${['WAR', 'PLD', 'DRK', 'GNB'].includes(props.selectedJob) ? renderTankPriorityCard({ partyComp: props.partyComp, activeJob: props.selectedJob }) : ''}

      <!-- Main Timeline Card -->
      <div class="matrix-card">
        <div class="plan-info-strip">
          <div class="plan-info-left">
            <span class="plan-tag-badge">${currentPlan.shortName}</span>
            <span class="plan-info-title">${currentPlan.name} &bull; ${currentMeta.name} [${props.selectedPosition}] Cheat Sheet</span>
            <span class="plan-info-authors">&bull; Sourced by ${currentPlan.authors}</span>
          </div>
          <div class="plan-info-right">
            <a href="${currentPlan.sourceUrl}" target="_blank" rel="noopener noreferrer" class="plan-source-link" title="Open original reference document">
              Original Reference &nearr;
            </a>
          </div>
        </div>

        <div class="table-responsive">
          <table class="mit-table qcv-table">
            <colgroup>
              <col style="width: 72px;">
              <col style="width: 240px;">
              <col style="width: 380px;">
              <col style="width: auto;">
            </colgroup>
            <thead>
              <tr>
                <th style="width: 72px;">Time</th>
                <th style="width: 240px;">Mechanic</th>
                <th style="width: 380px;">Ability To Press</th>
                <th>Notes & Timing</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
