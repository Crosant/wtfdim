interface PhaseNavProps {
  currentPhase: number; // 0 = all, 1 = P1, etc.
  onPhaseSelect: (phase: number) => void;
  mechanicCounts: Record<number, number>;
}

const PHASES = [
  { id: 0, label: 'All Phases' },
  { id: 1, label: 'P1: Kefka' },
  { id: 2, label: 'P2: Forsaken' },
  { id: 3, label: 'P3: Chaos & Exdeath' },
  { id: 4, label: 'P4: Kefka Says' },
  { id: 5, label: 'P5: Reimagined' },
];

export function renderPhaseNav(props: PhaseNavProps): string {
  const tabsHtml = PHASES.map(phase => {
    const isActive = props.currentPhase === phase.id;
    const count = phase.id === 0 
      ? Object.values(props.mechanicCounts).reduce((a, b) => a + b, 0)
      : (props.mechanicCounts[phase.id] || 0);

    return `
      <button 
        class="phase-tab ${isActive ? 'active' : ''}" 
        data-phase="${phase.id}"
      >
        <span>${phase.label}</span>
        <span class="phase-count-badge">${count}</span>
      </button>
    `;
  }).join('');

  return `
    <nav class="phase-nav">
      <div class="phase-tabs">
        ${tabsHtml}
      </div>
    </nav>
  `;
}
