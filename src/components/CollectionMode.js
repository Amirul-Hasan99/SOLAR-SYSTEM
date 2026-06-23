// CollectionMode.js — Planet collection grid
import { createElement } from '../utils/dom.js';
import { planetsData, planetOrder } from '../data/planets.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createCollectionMode({ onClose }) {
  const screen = createElement('div', 'collection-screen screen-enter');

  const card = createElement('div', 'collection-card');

  // Header
  const header = createElement('div', 'collection-header');
  const title = createElement('div', 'collection-title');
  title.innerHTML = '📦 KOLEKSI PLANET';
  const closeBtn = createElement('button', 'close-btn', { textContent: '✕' });
  closeBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onClose();
  });
  header.appendChild(title);
  header.appendChild(closeBtn);
  card.appendChild(header);

  // Body
  const body = createElement('div', 'collection-body');

  // Grid section
  const gridSection = createElement('div', 'collection-grid-section');
  const gridLabel = createElement('div', 'collection-grid-label', { textContent: 'Astro Quest' });
  const gridSublabel = createElement('div', 'collection-grid-sublabel', { textContent: 'SOLAR EXPLORER' });
  const grid = createElement('div', 'collection-grid');

  // Detail section
  const detail = createElement('div', 'collection-detail');
  const detailImg = createElement('div', 'collection-detail-img');
  const detailName = createElement('div', 'collection-detail-name');
  const detailDesc = createElement('div', 'collection-detail-desc');
  detail.appendChild(detailImg);
  detail.appendChild(detailName);
  detail.appendChild(detailDesc);

  // Select first unlocked planet by default
  let selectedKey = null;
  const unlocked = GameState.getUnlockedPlanets();

  function selectPlanet(key) {
    selectedKey = key;
    const data = planetsData[key];
    detailImg.innerHTML = '';
    const img = createElement('img', '');
    img.src = data.texture;
    img.alt = data.name;
    detailImg.appendChild(img);
    detailName.textContent = data.name.toUpperCase();
    detailDesc.textContent = data.description;

    // Update active states
    grid.querySelectorAll('.collection-planet-thumb').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.planet === key) el.classList.add('active');
    });
  }

  planetOrder.forEach(key => {
    const isUnlocked = unlocked.includes(key);
    const thumb = createElement('div', `collection-planet-thumb${isUnlocked ? '' : ' locked'}`);
    thumb.dataset.planet = key;
    const img = createElement('img', '');
    img.src = planetsData[key].texture;
    img.alt = planetsData[key].name;
    thumb.appendChild(img);

    if (isUnlocked) {
      thumb.addEventListener('click', () => {
        AudioManager.playClick();
        selectPlanet(key);
      });
    }
    grid.appendChild(thumb);
  });

  gridSection.appendChild(gridLabel);
  gridSection.appendChild(gridSublabel);
  gridSection.appendChild(grid);

  body.appendChild(gridSection);
  body.appendChild(detail);
  card.appendChild(body);

  screen.appendChild(card);

  // Select first unlocked planet
  if (unlocked.length > 0) {
    selectPlanet(unlocked[0]);
  } else {
    detailName.textContent = 'Belum ada koleksi';
    detailDesc.textContent = 'Selesaikan kuis untuk membuka planet!';
  }

  // Close on bg click
  screen.addEventListener('click', (e) => {
    if (e.target === screen) {
      AudioManager.playClick();
      onClose();
    }
  });

  return screen;
}
