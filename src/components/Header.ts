import { DMU_PLAN_VARIANTS } from '../data/dmuPlans';
import { ViewMode } from '../types/mitigation';

interface HeaderProps {
  currentPlanId: string;
  searchQuery: string;
  currentView: ViewMode;
  onPlanChange: (newPlanId: string) => void;
  onSearchChange: (query: string) => void;
  onOpenCredits: () => void;
  onViewChange: (view: ViewMode) => void;
}

export function renderHeader(props: HeaderProps): string {
  const planOptions = DMU_PLAN_VARIANTS.map(plan => `
    <option value="${plan.id}" ${plan.id === props.currentPlanId ? 'selected' : ''}>
      ${plan.name}
    </option>
  `).join('');

  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="#" class="branding-group" id="brand-home">
          <div class="brand-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          </div>
          <div class="brand-text">
            <h1>WTFDIM!? <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 600;">[DMU / UMAD]</span></h1>
            <div class="brand-subtitle">When The Fuck Do I Mit? &bull; FFXIV Mitigation Planner</div>
          </div>
        </a>

        <div class="header-controls">
          <div class="view-mode-tabs" role="tablist" aria-label="View Mode">
            <button 
              id="view-tab-matrix"
              class="view-tab-btn ${props.currentView === 'matrix' ? 'active' : ''}" 
              data-view="matrix"
              title="Full 8-player party mitigation matrix"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              <span>Party Matrix</span>
            </button>
            <button 
              id="view-tab-cheat"
              class="view-tab-btn ${props.currentView === 'cheat' ? 'active' : ''}" 
              data-view="cheat"
              title="Personal job quick-cheat sheet"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span>Quick-Cheat</span>
            </button>
          </div>

          <div class="plan-selector-container">
            <span class="selector-label">Mit Plan:</span>
            <select id="plan-select" class="plan-select" title="Choose mitigation plan variant">
              ${planOptions}
            </select>
          </div>

          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              id="search-input" 
              class="search-input" 
              placeholder="Search mechanic or skill..." 
              value="${props.searchQuery}"
            />
          </div>

          <button id="credits-btn" class="btn btn-secondary" title="View community source links and authors">
            Credits & Sources
          </button>

          <a href="https://wtfdig.info/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="Where The Fuck Do I Go? Strat boards">
            WTFDIG &nearr;
          </a>
        </div>
      </div>
    </header>
  `;
}
