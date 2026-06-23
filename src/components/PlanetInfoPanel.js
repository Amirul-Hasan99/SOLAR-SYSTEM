// PlanetInfoPanel.js — Planet detail panel overlay
import { createElement } from '../utils/dom.js';
import { planetsData } from '../data/planets.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createPlanetInfoPanel(planetKey, onClose) {
  const data = planetsData[planetKey];
  if (!data) return null;

  // Track exploration
  GameState.explorePlanet(planetKey);

  const panel = createElement('div', 'planet-info-panel');

  // Close button
  const closeBtn = createElement('button', 'close-btn planet-info-close', { textContent: '✕' });
  closeBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onClose();
  });
  panel.appendChild(closeBtn);

  // Planet icon
  const iconWrapper = createElement('div', 'planet-info-icon');
  const iconImg = createElement('img', '');
  iconImg.src = data.texture;
  iconImg.alt = data.name;
  iconWrapper.appendChild(iconImg);
  panel.appendChild(iconWrapper);

  // Name
  const name = createElement('h2', 'planet-info-name', { textContent: `${data.emoji} ${data.name}` });
  panel.appendChild(name);

  // Badges
  const badges = createElement('div', 'planet-info-badges');
  const catBadge = createElement('span', 'badge badge-cyan', { textContent: data.category });
  const orderBadge = createElement('span', 'badge badge-cyan', { textContent: data.order });
  badges.appendChild(catBadge);
  badges.appendChild(orderBadge);
  panel.appendChild(badges);

  // Data grid
  const grid = createElement('div', 'planet-info-grid');
  const dataItems = [
    { label: 'Jari-jari', value: data.radius },
    { label: 'Kemiringan', value: data.tilt },
    { label: 'Rotasi', value: data.rotation },
    { label: 'Orbit', value: data.orbit },
    { label: 'Jarak Matahari', value: data.distance },
    { label: 'Satelit Alami', value: data.moons },
  ];

  dataItems.forEach(item => {
    const dataEl = createElement('div', 'planet-data-item');
    const valueEl = createElement('div', 'planet-data-value', { textContent: item.value });
    const labelEl = createElement('div', 'planet-data-label', { textContent: item.label });
    dataEl.appendChild(valueEl);
    dataEl.appendChild(labelEl);
    grid.appendChild(dataEl);
  });
  panel.appendChild(grid);

  // Description
  const desc = createElement('p', 'planet-info-desc', { textContent: data.description });
  panel.appendChild(desc);

  return panel;
}
