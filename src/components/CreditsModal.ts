interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function renderCreditsModal(props: CreditsModalProps): string {
  return `
    <div class="modal-overlay ${props.isOpen ? 'open' : ''}" id="credits-modal-overlay">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Community Credits & Sources</h3>
          <button class="close-modal-btn" id="close-modal-btn" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="credit-section">
            <h4>About WTFDIM!?</h4>
            <p>
              Inspired by <a href="https://wtfdig.info/" target="_blank" rel="noopener noreferrer" class="credit-link">WTFDIG (Where The Fuck Do I Go?)</a>, 
              <strong>WTFDIM</strong> compiles community-vetted raid mitigation plans into an easily browsable, searchable, and customizable reference.
            </p>
          </div>

          <div class="credit-section">
            <h4>LPDU General DMU Mitigation Compile</h4>
            <p>
              Compiled and approved by veteran community contributors: 
              <em>Pepi, Crow, Req, Vena, Saybel, Tetra, Koma, Bagels, Teamalex123, Hisshi, Yuuki, Celis Valer, Kaitou</em>.
            </p>
            <p style="margin-top: 0.35rem;">
              Join the <a href="https://discord.gg/lpdu" target="_blank" rel="noopener noreferrer" class="credit-link">LPDU Discord Community</a>
            </p>
          </div>

          <div class="credit-section">
            <h4>Individual Job Mitigation Guides</h4>
            <ul style="padding-left: 1.25rem; margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0.25rem;">
              <li><strong>White Mage:</strong> Bagels &bull; <a href="https://pastebin.com/fjWaQ5GU" target="_blank" rel="noopener noreferrer" class="credit-link">WHM Bible (Pastebin)</a></li>
              <li><strong>Astrologian:</strong> Hisshi &bull; <a href="https://pastebin.com/iD4wjx9f" target="_blank" rel="noopener noreferrer" class="credit-link">AST Bible (Pastebin)</a></li>
              <li><strong>Scholar:</strong> Crow Kaien & Yuuki No &bull; <a href="https://pastebin.com/5295etbj" target="_blank" rel="noopener noreferrer" class="credit-link">SCH Plan (Pastebin)</a></li>
              <li><strong>Sage:</strong> Reqcat & Saybel &bull; <a href="https://pastebin.com/9BB0B5SX" target="_blank" rel="noopener noreferrer" class="credit-link">SGE Plan (Pastebin)</a></li>
              <li><strong>Tanks:</strong> Saybell Valentine &bull; <a href="https://tinyurl.com/LPDUtankmit" target="_blank" rel="noopener noreferrer" class="credit-link">Tank Mitigation Sheet</a></li>
              <li><strong>DPS:</strong> Venaa &bull; <a href="https://pastebin.com/LZxyyvPC" target="_blank" rel="noopener noreferrer" class="credit-link">DPS Mitigation (Pastebin)</a></li>
            </ul>
          </div>

          <div class="credit-section">
            <h4>Ikuya Mitty & Boss Timeline</h4>
            <p>
              Referencing the <a href="https://docs.google.com/spreadsheets/d/10C3ytfH3irHqkb45rchIq5oqdAs-v_OKTj57M-Twi3k/htmlview" target="_blank" rel="noopener noreferrer" class="credit-link">Ikuya Mitty DMU Sheet</a> and verified combat timelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
