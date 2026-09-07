import { PlanRow, PartyComposition, DamageType } from '../types/mitigation';
import { JOB_REGISTRY } from '../data/jobs';
import { DMU_TIMELINE, DMU_PHASE_CONFIG } from '../data/dmuTimeline';
import { DMU_PLAN_VARIANTS } from '../data/dmuPlans';
import { resolveActionForParty, ResolvedAction } from '../utils/actionResolver';

interface MitMatrixProps {
  rows: PlanRow[];
  currentPhase: number;
  searchQuery: string;
  partyComp: PartyComposition;
  currentPlanId?: string;
}

function getTagClass(type: DamageType): string {
  switch (type) {
    case 'magic': return 'tag-magic';
    case 'physical': return 'tag-physical';
    case 'unique':
    case 'darkness': return 'tag-unique';
    default: return 'tag-magic';
  }
}

function renderActionStack(actions: ResolvedAction[], partyJobs: Set<string>): string {
  if (!actions.length) {
    return `<span style="color: var(--text-muted); font-size: 0.75rem;">—</span>`;
  }

  return `
    <div class="action-stack">
      ${actions.map(act => {
        const meta = JOB_REGISTRY[act.job];
        const isAssigned = partyJobs.has(act.job);
        const styleOpacity = isAssigned ? '1' : '0.55';

        return `
          <div class="action-chip ${act.carryOver ? 'carry-over' : ''}" style="opacity: ${styleOpacity};" title="${act.job}: ${act.skill}${act.timingNote ? ` (${act.timingNote})` : ''}">
            ${act.carryOver ? `<span class="carry-arrow" title="Carry over from previous cast">➔</span>` : ''}
            ${act.slotTag ? `<span class="slot-badge slot-${act.slotTag.toLowerCase()}">${act.slotTag}</span>` : ''}
            <span class="job-tag" style="color: ${meta?.color || '#fff'}">${act.job}</span>
            <span class="skill-name">${act.skill}</span>
            ${act.target && act.target !== 'Party' && act.target !== 'Self' ? `<span class="target-badge">➔ ${act.target}</span>` : ''}
            ${act.timingNote ? `<span class="action-note">${act.timingNote}</span>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderMitMatrix(props: MitMatrixProps): string {
  const partyJobSet = new Set(Object.values(props.partyComp));

  // Map mechanic id to phase number
  const mechPhaseMap = new Map(DMU_TIMELINE.map(m => [m.id, m.phase]));

  // Filter rows by phase and search query
  const filteredRows = props.rows.filter(row => {
    const phase = mechPhaseMap.get(row.mechanicId) || 1;
    if (props.currentPhase !== 0 && phase !== props.currentPhase) {
      return false;
    }

    if (props.searchQuery.trim()) {
      const q = props.searchQuery.toLowerCase();
      const matchMech = row.mechanicName.toLowerCase().includes(q);
      const matchTime = row.timestamp.includes(q);
      const matchNotes = (row.notes || '').toLowerCase().includes(q);
      const matchActions = row.actions.some(a => {
        const resolved = resolveActionForParty(a, props.partyComp);
        if (!resolved) return false;
        return (
          resolved.skill.toLowerCase().includes(q) || 
          resolved.job.toLowerCase().includes(q) ||
          (resolved.timingNote || '').toLowerCase().includes(q)
        );
      });
      return matchMech || matchTime || matchNotes || matchActions;
    }

    return true;
  });

  if (!filteredRows.length) {
    return `
      <div class="matrix-card" style="padding: 3rem; text-align: center; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No mechanics matched your filter criteria.</p>
        <p style="font-size: 0.85rem;">Try clearing your search query or selecting a different phase.</p>
      </div>
    `;
  }

  // Calculate mechanics count per phase for current filtered view
  const phaseCounts: Record<number, number> = {};
  filteredRows.forEach(row => {
    const p = mechPhaseMap.get(row.mechanicId) || 1;
    phaseCounts[p] = (phaseCounts[p] || 0) + 1;
  });

  let lastPhase = 0;
  const tableRowsHtml = filteredRows.map(row => {
    const phase = mechPhaseMap.get(row.mechanicId) || 1;
    let dividerHtml = '';

    // In All Phases view (currentPhase === 0), inject visual phase separator at each phase boundary
    if (props.currentPhase === 0 && phase !== lastPhase) {
      lastPhase = phase;
      const conf = DMU_PHASE_CONFIG[phase];
      if (conf) {
        dividerHtml = `
          <tr class="phase-divider-row" data-phase="${phase}">
            <td colspan="6" class="phase-divider-td">
              <div class="phase-divider-banner" style="--phase-color: ${conf.colorVar};">
                <div class="phase-divider-left">
                  <span class="phase-pill-badge" style="color: ${conf.colorVar}; border-color: ${conf.colorVar}; background: ${conf.bgVar};">
                    ${conf.shortLabel}
                  </span>
                  <span class="phase-divider-title">${conf.name}</span>
                </div>
                <div class="phase-divider-right">
                  <span class="phase-divider-count">${phaseCounts[phase] || 0} Mechanics</span>
                </div>
              </div>
            </td>
          </tr>
        `;
      }
    }

    // Resolve actions dynamically for current party composition, filtering out inactive conditional slots
    const resolvedActions: ResolvedAction[] = row.actions
      .map(a => resolveActionForParty(a, props.partyComp))
      .filter((a): a is ResolvedAction => a !== null);

    // Categorize actions into Tank, Healer, and DPS
    const tankActions = resolvedActions.filter(a => ['PLD', 'WAR', 'DRK', 'GNB'].includes(a.job));
    const allHealerActions = resolvedActions.filter(a => ['WHM', 'AST', 'SCH', 'SGE'].includes(a.job));
    const partyHealerActions = allHealerActions.filter(a => partyJobSet.has(a.job));
    const healerActions = partyHealerActions.length > 0 ? partyHealerActions : allHealerActions;
    const dpsActions = resolvedActions.filter(a => !['PLD', 'WAR', 'DRK', 'GNB', 'WHM', 'AST', 'SCH', 'SGE'].includes(a.job));

    return `
      ${dividerHtml}
      <tr>
        <td class="cell-time">${row.timestamp}</td>
        <td>
          <div class="cell-mechanic">
            <span class="mech-name">${row.mechanicName}</span>
            <div class="mech-meta">
              <span class="tag-badge ${getTagClass(row.damageType)}">${row.damageType}</span>
              ${row.rawDamage ? `<span class="raw-damage-pill">${row.rawDamage}</span>` : ''}
            </div>
          </div>
        </td>
        <td>${renderActionStack(tankActions, partyJobSet)}</td>
        <td>${renderActionStack(healerActions, partyJobSet)}</td>
        <td>${renderActionStack(dpsActions, partyJobSet)}</td>
        <td class="cell-notes">${row.notes || '—'}</td>
      </tr>
    `;
  }).join('');

  const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === props.currentPlanId) || DMU_PLAN_VARIANTS[0];

  return `
    <div class="matrix-card">
      <div class="plan-info-strip">
        <div class="plan-info-left">
          <span class="plan-tag-badge">${currentPlan.shortName}</span>
          <span class="plan-info-title">${currentPlan.name}</span>
          <span class="plan-info-authors">&bull; Sourced by ${currentPlan.authors}</span>
        </div>
        <div class="plan-info-right">
          <a href="${currentPlan.sourceUrl}" target="_blank" rel="noopener noreferrer" class="plan-source-link" title="Open original reference document">
            Original Reference &nearr;
          </a>
        </div>
      </div>
      <div class="table-responsive">
        <table class="mit-table">
          <colgroup>
            <col style="width: 72px;">
            <col style="width: 210px;">
            <col style="width: 26%;">
            <col style="width: 28%;">
            <col style="width: 19%;">
            <col style="width: 27%;">
          </colgroup>
          <thead>
            <tr>
              <th style="width: 72px;">Time</th>
              <th style="width: 210px;">Mechanic</th>
              <th style="width: 26%;">Tank Defensives</th>
              <th style="width: 28%;">Healer Defensives</th>
              <th style="width: 19%;">DPS Defensives</th>
              <th style="width: 27%;">Notes & Timing</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
