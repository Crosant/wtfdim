import { JobId, PartyComposition } from '../types/mitigation';
import { resolveTankAssignments } from '../utils/tankPriorityHelper';
import { JOB_REGISTRY } from '../data/jobs';

export interface TankPriorityCardProps {
  partyComp: PartyComposition;
  activeJob?: JobId;
  collapsible?: boolean;
}

/**
 * Renders the DMU Tank Priority protocol card.
 * Dynamically resolves tank assignments based on the current party's tanks
 * and displays the universal community-standard priority hierarchies.
 */
export function renderTankPriorityCard(props: TankPriorityCardProps): string {
  const t1 = props.partyComp.mt;
  const t2 = props.partyComp.ot;
  const assignments = resolveTankAssignments(t1, t2);

  const metaT1 = JOB_REGISTRY[t1];
  const metaT2 = JOB_REGISTRY[t2];

  const metaWall = JOB_REGISTRY[assignments.wallTank];
  const metaBoss = JOB_REGISTRY[assignments.bossTank];
  const metaLb = JOB_REGISTRY[assignments.lbTank];
  const metaChaos = JOB_REGISTRY[assignments.chaosTank];
  const metaExdeath = JOB_REGISTRY[assignments.exdeathTank];
  const metaP5Inv1 = JOB_REGISTRY[assignments.p5Invuln1Tank];
  const metaP5Boss = JOB_REGISTRY[assignments.p5StartBossTank];

  const isTankActive = props.activeJob && ['WAR', 'PLD', 'DRK', 'GNB'].includes(props.activeJob);

  return `
    <div class="tank-priority-card ${isTankActive ? 'tank-active' : ''}" id="tank-priority-card">
      <div class="tank-priority-header">
        <div class="tank-prio-title-wrap">
          <span class="tank-shield-icon">🛡️</span>
          <div>
            <h4 class="tank-prio-title">Tank Priority Protocol</h4>
            <div class="tank-prio-subtitle">Party Tanks: <span class="badge badge-${t1.toLowerCase()}">${metaT1.name} (MT)</span> + <span class="badge badge-${t2.toLowerCase()}">${metaT2.name} (OT)</span></div>
          </div>
        </div>
        <div class="tank-prio-standard-tag">LPDU / Ikuya Standard</div>
      </div>

      <div class="tank-priority-grid">
        <!-- P2 Wings Wall Priority -->
        <div class="tank-prio-item">
          <div class="tank-prio-phase-tag">P2: Forsaken</div>
          <div class="tank-prio-mech-name">Wings of Destruction (Wall)</div>
          <div class="tank-prio-assignment">
            <span class="prio-role-label">Takes Wall:</span>
            <span class="prio-job-badge badge-${assignments.wallTank.toLowerCase()}">${metaWall.name}</span>
            <span class="prio-vs">|</span>
            <span class="prio-role-label">Boss Uptime:</span>
            <span class="prio-job-badge badge-${assignments.bossTank.toLowerCase()}">${metaBoss.name}</span>
          </div>
          <div class="tank-prio-rule">Rule: <strong>PLD &gt; WAR &gt; DRK &gt; GNB</strong> (Wall tank takes far cleave)</div>
        </div>

        <!-- P3 Tank LB3 Priority -->
        <div class="tank-prio-item">
          <div class="tank-prio-phase-tag">P3: Chaos &amp; Exdeath</div>
          <div class="tank-prio-mech-name">Vacuum Wave (Tank LB3)</div>
          <div class="tank-prio-assignment">
            <span class="prio-role-label">Casts LB3:</span>
            <span class="prio-job-badge badge-${assignments.lbTank.toLowerCase()}">${metaLb.name}</span>
          </div>
          <div class="tank-prio-rule">Rule: <strong>WAR &gt; DRK &gt; PLD &gt; GNB</strong> (Press on "W" of Vacuum Wave)</div>
        </div>

        <!-- P3 Boss & Invuln Priority -->
        <div class="tank-prio-item">
          <div class="tank-prio-phase-tag">P3: Chaos &amp; Exdeath</div>
          <div class="tank-prio-mech-name">Boss Split &amp; Thunder III</div>
          <div class="tank-prio-assignment">
            <span class="prio-role-label">Chaos (Invuln 1 @ 02:35):</span>
            <span class="prio-job-badge badge-${assignments.chaosTank.toLowerCase()}">${metaChaos.name}</span>
            <span class="prio-vs">|</span>
            <span class="prio-role-label">Exdeath (Invuln 2 @ 03:34):</span>
            <span class="prio-job-badge badge-${assignments.exdeathTank.toLowerCase()}">${metaExdeath.name}</span>
          </div>
          <div class="tank-prio-rule">Rule: Chaos = <strong>WAR &gt; DRK &gt; GNB &gt; PLD</strong> | Exdeath = <strong>PLD &gt; GNB &gt; DRK &gt; WAR</strong></div>
        </div>

        <!-- P5 Flare / Holy & Fell Forces -->
        <div class="tank-prio-item">
          <div class="tank-prio-phase-tag">P5: Kefka Reimagined</div>
          <div class="tank-prio-mech-name">Flare / Holy &amp; Fell Forces Autos</div>
          <div class="tank-prio-assignment">
            <span class="prio-role-label">Invuln 1 (@ 01:26):</span>
            <span class="prio-job-badge badge-${assignments.p5Invuln1Tank.toLowerCase()}">${metaP5Inv1.name}</span>
            <span class="prio-vs">|</span>
            <span class="prio-role-label">Start Boss &amp; Invuln 2 (@ 02:58):</span>
            <span class="prio-job-badge badge-${assignments.p5StartBossTank.toLowerCase()}">${metaP5Boss.name}</span>
          </div>
          <div class="tank-prio-rule">Rule: Invuln 1 = <strong>WAR &gt; DRK &gt; GNB &gt; PLD</strong> | Start Threat &amp; Invuln 2 = <strong>PLD &gt; GNB &gt; DRK &gt; WAR</strong></div>
        </div>
      </div>

      <div class="tank-prio-footer">
        <div class="tank-tip-item">💡 <strong>P3 Assignment Rule:</strong> PLD must be OT for P3+ (invuln timings will not align with PLD MT). MT starts on Exdeath and OT starts on Chaos; swap under boss during Decisive Battle castlock (MT holds Chaos, OT holds Exdeath).</div>
        <div class="tank-tip-item">💡 <strong>P5 Rule:</strong> The tank NOT invulning 1st must hold boss aggro to avoid receiving Holy.</div>
        <div class="tank-tip-item">💡 <strong>P5 Autos:</strong> Invulning tanks Provoke immediately on debuff application to solo autos 1 &amp; 2. Auto 3 is shared as invuln expires.</div>
      </div>
    </div>
  `;
}
