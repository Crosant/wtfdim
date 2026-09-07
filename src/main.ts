import './style.css';
import { DMU_PLAN_VARIANTS } from './data/dmuPlans';
import { DMU_TIMELINE } from './data/dmuTimeline';
import { JOB_REGISTRY } from './data/jobs';
import { JobId, PartyComposition, PositionSlot, ViewMode } from './types/mitigation';
import { renderHeader } from './components/Header';
import { renderPartyCompBar } from './components/PartyCompBar';
import { renderPhaseNav } from './components/PhaseNav';
import { renderMitMatrix } from './components/MitMatrix';
import { renderQuickCheatDrawer, generateEchoMacro } from './components/QuickCheatDrawer';
import { renderQuickCheatView } from './components/QuickCheatView';
import { renderCreditsModal } from './components/CreditsModal';
import { renderFocusModal } from './components/FocusModal';
import { 
  getAvailablePositionsForJob, 
  getDefaultPositionForJob, 
  createPartyCompForJobAndPosition 
} from './utils/positionHelper';

// Application state container
interface AppState {
  currentView: ViewMode;
  currentPlanId: string;
  currentPhase: number;
  searchQuery: string;
  partyComp: PartyComposition;
  quickCheatJob: JobId;
  selectedPosition: PositionSlot;
  isQuickCheatExpanded: boolean;
  isFocusModalOpen: boolean;
  isCreditsModalOpen: boolean;
  focusModalWidth: number;
  focusModalHeight: number;
  isFocusModalMaximized: boolean;
}

// Initialize application state from URL query parameters if present
const urlParams = new URLSearchParams(window.location.search);
const initialViewParam = urlParams.get('view')?.toLowerCase();
const hasJobParam = urlParams.has('job');
const initialView: ViewMode = (initialViewParam === 'cheat' || (hasJobParam && initialViewParam !== 'matrix')) ? 'cheat' : 'matrix';

const initialPlan = urlParams.get('plan')?.toLowerCase();
const validPlanIds = ['lpdu-standard', 'ikuya-mitty', 'job-bibles'];

const rawJobParam = urlParams.get('job')?.toUpperCase() as JobId | undefined;
const initialJob: JobId = (rawJobParam && JOB_REGISTRY[rawJobParam]) ? rawJobParam : 'WAR';

const availablePositions = getAvailablePositionsForJob(initialJob);
const rawPosParam = urlParams.get('pos')?.toUpperCase() as PositionSlot | undefined;
const initialPos: PositionSlot = (rawPosParam && availablePositions.includes(rawPosParam))
  ? rawPosParam
  : getDefaultPositionForJob(initialJob);

const parsedPhase = parseInt(urlParams.get('phase') || '0', 10);
const initialPhase = (!isNaN(parsedPhase) && parsedPhase >= 0 && parsedPhase <= 5) ? parsedPhase : 0;
const initialQuery = urlParams.get('q') || '';

const state: AppState = {
  currentView: initialView,
  currentPlanId: (initialPlan && validPlanIds.includes(initialPlan)) ? initialPlan : 'lpdu-standard',
  currentPhase: initialPhase,
  searchQuery: initialQuery,
  partyComp: createPartyCompForJobAndPosition(initialJob, initialPos),
  quickCheatJob: initialJob,
  selectedPosition: initialPos,
  isQuickCheatExpanded: false,
  isFocusModalOpen: false,
  isCreditsModalOpen: false,
  focusModalWidth: 1050,
  focusModalHeight: 760,
  isFocusModalMaximized: false,
};

// Synchronizes the application state with the browser URL query string without reloading
function syncUrlParams(): void {
  const url = new URL(window.location.href);

  // View mode, job, position, and mit plan
  if (state.currentView === 'cheat') {
    url.searchParams.set('view', 'cheat');
    url.searchParams.set('job', state.quickCheatJob);
    url.searchParams.set('pos', state.selectedPosition);
    url.searchParams.set('plan', state.currentPlanId);
  } else {
    url.searchParams.delete('view');
    url.searchParams.delete('job');
    url.searchParams.delete('pos');
    if (state.currentPlanId !== 'lpdu-standard') {
      url.searchParams.set('plan', state.currentPlanId);
    } else {
      url.searchParams.delete('plan');
    }
  }

  // Phase selection
  if (state.currentPhase !== 0) {
    url.searchParams.set('phase', String(state.currentPhase));
  } else {
    url.searchParams.delete('phase');
  }

  // Search query
  if (state.searchQuery.trim()) {
    url.searchParams.set('q', state.searchQuery.trim());
  } else {
    url.searchParams.delete('q');
  }

  window.history.replaceState({}, '', url.toString());
}

// Calculate mechanic counts per phase for badge counters
function getMechanicCounts(): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  DMU_TIMELINE.forEach(m => {
    if (counts[m.phase] !== undefined) {
      counts[m.phase]++;
    }
  });
  return counts;
}

// Master render loop
function renderApp(): void {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === state.currentPlanId) || DMU_PLAN_VARIANTS[0];
  const mechanicCounts = getMechanicCounts();

  let mainContentHtml = '';

  if (state.currentView === 'cheat') {
    // Dedicated personal Quick-Cheat View
    mainContentHtml = `
      <main class="quick-cheat-view-section">
        ${renderQuickCheatView({
          selectedJob: state.quickCheatJob,
          selectedPosition: state.selectedPosition,
          currentPlanId: state.currentPlanId,
          rows: currentPlan.rows,
          currentPhase: state.currentPhase,
          searchQuery: state.searchQuery,
          partyComp: state.partyComp,
          onJobChange: () => {},
          onPositionChange: () => {},
          onPlanChange: () => {},
          onPhaseSelect: () => {},
          onSearchChange: () => {},
        })}
      </main>
    `;
  } else {
    // Standard 8-player party matrix view
    mainContentHtml = `
      ${renderPartyCompBar({
        composition: state.partyComp,
        onSlotChange: () => {},
      })}

      ${renderPhaseNav({
        currentPhase: state.currentPhase,
        onPhaseSelect: () => {},
        mechanicCounts,
      })}

      <main class="main-content ${state.isQuickCheatExpanded ? 'cheat-expanded' : ''}">
        <section class="matrix-section">
          ${renderMitMatrix({
            rows: currentPlan.rows,
            currentPhase: state.currentPhase,
            searchQuery: state.searchQuery,
            partyComp: state.partyComp,
            currentPlanId: state.currentPlanId,
          })}
        </section>

        ${renderQuickCheatDrawer({
          selectedJob: state.quickCheatJob,
          rows: currentPlan.rows,
          currentPhase: state.currentPhase,
          partyComp: state.partyComp,
          isExpanded: state.isQuickCheatExpanded,
          onJobChange: () => {},
        })}
      </main>
    `;
  }

  appEl.innerHTML = `
    ${renderHeader({
      currentPlanId: state.currentPlanId,
      searchQuery: state.searchQuery,
      currentView: state.currentView,
      onPlanChange: () => {},
      onSearchChange: () => {},
      onOpenCredits: () => {},
      onViewChange: () => {},
    })}

    ${mainContentHtml}

    ${renderCreditsModal({
      isOpen: state.isCreditsModalOpen,
      onClose: () => {},
    })}

    ${renderFocusModal({
      isOpen: state.isFocusModalOpen,
      selectedJob: state.quickCheatJob,
      rows: currentPlan.rows,
      currentPhase: state.currentPhase,
      partyComp: state.partyComp,
      width: state.focusModalWidth,
      height: state.focusModalHeight,
      isMaximized: state.isFocusModalMaximized,
      onClose: () => {},
    })}

    <footer class="site-footer">
      <div class="footer-inner">
        <div>WTFDIM!? (When The Fuck Do I Mit?) &bull; Final Fantasy XIV Raid Mitigation Utility</div>
        <div class="footer-links">
          <a href="#" id="footer-credits-link">Credits & Community Sources</a>
          <a href="https://wtfdig.info/" target="_blank" rel="noopener noreferrer">WTFDIG (Where The Fuck Do I Go?)</a>
          <a href="https://discord.gg/lpdu" target="_blank" rel="noopener noreferrer">LPDU Discord</a>
        </div>
      </div>
    </footer>
  `;

  attachEventListeners();
}

// DOM event binding
function attachEventListeners(): void {
  // View mode switcher buttons in header
  // Brand logo resets to matrix overview
  const brandHome = document.getElementById('brand-home');
  if (brandHome) {
    brandHome.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentView = 'matrix';
      state.currentPhase = 0;
      state.searchQuery = '';
      syncUrlParams();
      renderApp();
    });
  }

  const tabMatrix = document.getElementById('view-tab-matrix');
  if (tabMatrix) {
    tabMatrix.addEventListener('click', () => {
      state.currentView = 'matrix';
      syncUrlParams();
      renderApp();
    });
  }

  const tabCheat = document.getElementById('view-tab-cheat');
  if (tabCheat) {
    tabCheat.addEventListener('click', () => {
      state.currentView = 'cheat';
      syncUrlParams();
      renderApp();
    });
  }

  // Plan variant selector (Header)
  const planSelect = document.getElementById('plan-select') as HTMLSelectElement | null;
  if (planSelect) {
    planSelect.addEventListener('change', (e) => {
      state.currentPlanId = (e.target as HTMLSelectElement).value;
      syncUrlParams();
      renderApp();
    });
  }

  // Real-time search query (Header)
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = (e.target as HTMLInputElement).value;
      syncUrlParams();
      renderApp();
      // Re-focus and preserve cursor position after re-render
      const freshInput = document.getElementById('search-input') as HTMLInputElement | null;
      if (freshInput) {
        freshInput.focus();
        freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
      }
    });
  }

  // ==========================================
  // QUICK-CHEAT VIEW SPECIFIC LISTENERS
  // ==========================================
  if (state.currentView === 'cheat') {
    // Job selector in Quick-Cheat View
    const qcvJobSelect = document.getElementById('qcv-job-select') as HTMLSelectElement | null;
    if (qcvJobSelect) {
      qcvJobSelect.addEventListener('change', (e) => {
        const newJob = (e.target as HTMLSelectElement).value as JobId;
        state.quickCheatJob = newJob;
        const avail = getAvailablePositionsForJob(newJob);
        if (!avail.includes(state.selectedPosition)) {
          state.selectedPosition = getDefaultPositionForJob(newJob);
        }
        state.partyComp = createPartyCompForJobAndPosition(state.quickCheatJob, state.selectedPosition, state.partyComp);
        syncUrlParams();
        renderApp();
      });
    }

    // Position toggle buttons in Quick-Cheat View
    const posBtns = document.querySelectorAll('.pos-toggle-btn');
    posBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pos = btn.getAttribute('data-pos') as PositionSlot;
        if (pos) {
          state.selectedPosition = pos;
          state.partyComp = createPartyCompForJobAndPosition(state.quickCheatJob, state.selectedPosition, state.partyComp);
          syncUrlParams();
          renderApp();
        }
      });
    });

    // Plan selector in Quick-Cheat View toolbar
    const qcvPlanSelect = document.getElementById('qcv-plan-select') as HTMLSelectElement | null;
    if (qcvPlanSelect) {
      qcvPlanSelect.addEventListener('change', (e) => {
        state.currentPlanId = (e.target as HTMLSelectElement).value;
        syncUrlParams();
        renderApp();
      });
    }

    // Phase buttons in Quick-Cheat View
    const qcvPhaseBtns = document.querySelectorAll('.phase-btn');
    qcvPhaseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const phaseId = parseInt(btn.getAttribute('data-phase') || '0', 10);
        state.currentPhase = phaseId;
        syncUrlParams();
        renderApp();
      });
    });

    // Copy macro button in Quick-Cheat View
    const qcvCopyMacroBtn = document.getElementById('qcv-copy-macro-btn');
    if (qcvCopyMacroBtn) {
      qcvCopyMacroBtn.addEventListener('click', async () => {
        const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === state.currentPlanId) || DMU_PLAN_VARIANTS[0];
        const macroText = generateEchoMacro(state.quickCheatJob, currentPlan.rows, state.partyComp);

        try {
          await navigator.clipboard.writeText(macroText);
          const originalHtml = qcvCopyMacroBtn.innerHTML;
          qcvCopyMacroBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Copied to Clipboard!</span>
          `;
          qcvCopyMacroBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
          setTimeout(() => {
            qcvCopyMacroBtn.innerHTML = originalHtml;
            qcvCopyMacroBtn.style.background = '';
          }, 2200);
        } catch (err) {
          console.error('Failed to copy macro: ', err);
        }
      });
    }

    // Focus modal open button in Quick-Cheat View
    const qcvFocusBtn = document.getElementById('qcv-focus-modal-btn');
    if (qcvFocusBtn) {
      qcvFocusBtn.addEventListener('click', () => {
        state.isFocusModalOpen = true;
        renderApp();
      });
    }
  }

  // ==========================================
  // PARTY MATRIX VIEW SPECIFIC LISTENERS
  // ==========================================
  if (state.currentView === 'matrix') {
    // Phase navigation tabs
    const phaseTabs = document.querySelectorAll('.phase-tab');
    phaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const phaseId = parseInt(tab.getAttribute('data-phase') || '0', 10);
        state.currentPhase = phaseId;
        syncUrlParams();
        renderApp();
      });
    });

    // Party comp roster selects
    const compSelects = document.querySelectorAll('.comp-slot-select');
    compSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const slot = target.getAttribute('data-slot') as keyof PartyComposition;
        const newJob = target.value as JobId;
        if (slot && newJob) {
          state.partyComp[slot] = newJob;
          renderApp();
        }
      });
    });

    // Quick-cheat sidebar job selector
    const quickJobSelect = document.getElementById('quick-job-select') as HTMLSelectElement | null;
    if (quickJobSelect) {
      quickJobSelect.addEventListener('change', (e) => {
        const newJob = (e.target as HTMLSelectElement).value as JobId;
        state.quickCheatJob = newJob;
        const avail = getAvailablePositionsForJob(newJob);
        if (!avail.includes(state.selectedPosition)) {
          state.selectedPosition = getDefaultPositionForJob(newJob);
        }
        state.partyComp = createPartyCompForJobAndPosition(state.quickCheatJob, state.selectedPosition, state.partyComp);
        syncUrlParams();
        renderApp();
      });
    }

    // Copy /echo macro button in sidebar
    const copyBtn = document.getElementById('copy-macro-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === state.currentPlanId) || DMU_PLAN_VARIANTS[0];
        const macroText = generateEchoMacro(state.quickCheatJob, currentPlan.rows, state.partyComp);

        try {
          await navigator.clipboard.writeText(macroText);
          const originalHtml = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Copied to Clipboard!
          `;
          copyBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
            copyBtn.style.background = '';
          }, 2200);
        } catch (err) {
          console.error('Failed to copy macro: ', err);
        }
      });
    }

    // Quick-cheat expand toggle button
    const toggleExpandBtn = document.getElementById('toggle-cheat-expand-btn');
    if (toggleExpandBtn) {
      toggleExpandBtn.addEventListener('click', () => {
        state.isQuickCheatExpanded = !state.isQuickCheatExpanded;
        renderApp();
      });
    }

    // Focus modal open button from sidebar
    const openFocusBtn = document.getElementById('open-focus-modal-btn');
    if (openFocusBtn) {
      openFocusBtn.addEventListener('click', () => {
        state.isFocusModalOpen = true;
        renderApp();
      });
    }
  }

  // ==========================================
  // COMMON MODAL LISTENERS
  // ==========================================
  // Focus modal maximize button
  const maxBtn = document.getElementById('maximize-focus-modal-btn');
  if (maxBtn) {
    maxBtn.addEventListener('click', () => {
      state.isFocusModalMaximized = !state.isFocusModalMaximized;
      renderApp();
    });
  }

  // Focus modal size preset buttons
  const presetBtns = document.querySelectorAll('.focus-preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = (e.target as HTMLElement).getAttribute('data-preset');
      if (preset === 'compact') {
        state.focusModalWidth = 700;
        state.focusModalHeight = 520;
        state.isFocusModalMaximized = false;
      } else if (preset === 'normal') {
        state.focusModalWidth = 1050;
        state.focusModalHeight = 760;
        state.isFocusModalMaximized = false;
      } else if (preset === 'wide') {
        state.focusModalWidth = 1380;
        state.focusModalHeight = 820;
        state.isFocusModalMaximized = false;
      } else if (preset === 'max') {
        state.isFocusModalMaximized = true;
      }
      renderApp();
    });
  });

  // Focus modal close button
  const closeFocusBtn = document.getElementById('close-focus-modal-btn');
  if (closeFocusBtn) {
    closeFocusBtn.addEventListener('click', () => {
      state.isFocusModalOpen = false;
      renderApp();
    });
  }

  // Focus modal overlay click to close
  const focusOverlay = document.getElementById('focus-modal-overlay');
  if (focusOverlay) {
    focusOverlay.addEventListener('click', (e) => {
      if (e.target === focusOverlay) {
        state.isFocusModalOpen = false;
        renderApp();
      }
    });
  }

  // Focus modal copy macro button
  const focusCopyBtn = document.getElementById('focus-copy-macro-btn');
  if (focusCopyBtn) {
    focusCopyBtn.addEventListener('click', async () => {
      const currentPlan = DMU_PLAN_VARIANTS.find(p => p.id === state.currentPlanId) || DMU_PLAN_VARIANTS[0];
      const macroText = generateEchoMacro(state.quickCheatJob, currentPlan.rows, state.partyComp);
      try {
        await navigator.clipboard.writeText(macroText);
        const originalHtml = focusCopyBtn.innerHTML;
        focusCopyBtn.innerHTML = `Copied to Clipboard!`;
        focusCopyBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        setTimeout(() => {
          focusCopyBtn.innerHTML = originalHtml;
          focusCopyBtn.style.background = '';
        }, 2200);
      } catch (err) {
        console.error('Failed to copy macro: ', err);
      }
    });
  }

  // Credits modal triggers
  const creditsBtn = document.getElementById('credits-btn');
  if (creditsBtn) {
    creditsBtn.addEventListener('click', () => {
      state.isCreditsModalOpen = true;
      renderApp();
    });
  }

  const footerCreditsLink = document.getElementById('footer-credits-link');
  if (footerCreditsLink) {
    footerCreditsLink.addEventListener('click', (e) => {
      e.preventDefault();
      state.isCreditsModalOpen = true;
      renderApp();
    });
  }

  const closeModalBtn = document.getElementById('close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      state.isCreditsModalOpen = false;
      renderApp();
    });
  }

  const modalOverlay = document.getElementById('credits-modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        state.isCreditsModalOpen = false;
        renderApp();
      }
    });
  }

  if (state.isFocusModalOpen) {
    setupFocusModalResize();
  }
}

// Directional and corner drag resize handler for the focus modal
function setupFocusModalResize(): void {
  const cornerHandle = document.getElementById('focus-resize-handle');
  const rightHandle = document.getElementById('focus-resize-handle-right');
  const bottomHandle = document.getElementById('focus-resize-handle-bottom');
  const card = document.getElementById('focus-modal-card');
  if (!card) return;

  const initDrag = (
    handle: HTMLElement | null, 
    resizeX: boolean, 
    resizeY: boolean, 
    cursorStyle: string
  ) => {
    if (!handle) return;

    const startDrag = (clientX: number, clientY: number) => {
      card.classList.add('is-resizing');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = cursorStyle;
      const startX = clientX;
      const startY = clientY;
      const rect = card.getBoundingClientRect();
      const startWidth = rect.width;
      const startHeight = rect.height;

      const onMove = (currX: number, currY: number) => {
        const deltaX = currX - startX;
        const deltaY = currY - startY;
        const maxWidth = window.innerWidth * 0.98;
        const maxHeight = window.innerHeight * 0.98;

        if (resizeX) {
          const newWidth = Math.min(Math.max(startWidth + deltaX * 2, 460), maxWidth);
          card.style.width = `${newWidth}px`;
          state.focusModalWidth = Math.round(newWidth);
        }

        if (resizeY) {
          const newHeight = Math.min(Math.max(startHeight + deltaY * 2, 350), maxHeight);
          card.style.height = `${newHeight}px`;
          state.focusModalHeight = Math.round(newHeight);
        }

        state.isFocusModalMaximized = false;
      };

      const onMouseMove = (e: MouseEvent) => {
        onMove(e.clientX, e.clientY);
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const onEnd = () => {
        card.classList.remove('is-resizing');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onEnd);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onEnd);
    };

    handle.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    handle.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  };

  initDrag(rightHandle, true, false, 'ew-resize');
  initDrag(bottomHandle, false, true, 'ns-resize');
  initDrag(cornerHandle, true, true, 'nwse-resize');

  // Sync state if resized via native browser resize grip
  if (window.ResizeObserver) {
    let debounceTimer: number | undefined;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!state.isFocusModalMaximized && !card.classList.contains('is-resizing')) {
          const w = entry.contentBoxSize?.[0]?.inlineSize || entry.target.getBoundingClientRect().width;
          const h = entry.contentBoxSize?.[0]?.blockSize || entry.target.getBoundingClientRect().height;
          if (w > 400 && h > 300) {
            window.clearTimeout(debounceTimer);
            debounceTimer = window.setTimeout(() => {
              state.focusModalWidth = Math.round(w);
              state.focusModalHeight = Math.round(h);
            }, 100);
          }
        }
      }
    });
    observer.observe(card);
  }
}

// Handle browser Back / Forward navigation
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const vParam = params.get('view')?.toLowerCase();
  const hasJob = params.has('job');
  state.currentView = (vParam === 'cheat' || (hasJob && vParam !== 'matrix')) ? 'cheat' : 'matrix';

  const planP = params.get('plan')?.toLowerCase();
  if (planP && validPlanIds.includes(planP)) {
    state.currentPlanId = planP;
  }

  const jobP = params.get('job')?.toUpperCase() as JobId | undefined;
  if (jobP && JOB_REGISTRY[jobP]) {
    state.quickCheatJob = jobP;
  }

  const avail = getAvailablePositionsForJob(state.quickCheatJob);
  const posP = params.get('pos')?.toUpperCase() as PositionSlot | undefined;
  state.selectedPosition = (posP && avail.includes(posP)) ? posP : getDefaultPositionForJob(state.quickCheatJob);

  state.partyComp = createPartyCompForJobAndPosition(state.quickCheatJob, state.selectedPosition);

  const phaseNum = parseInt(params.get('phase') || '0', 10);
  state.currentPhase = (!isNaN(phaseNum) && phaseNum >= 0 && phaseNum <= 5) ? phaseNum : 0;
  state.searchQuery = params.get('q') || '';

  renderApp();
});

// Initial bootstrap
renderApp();
