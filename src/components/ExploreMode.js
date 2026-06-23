// ExploreMode.js — 3D solar system explore screen with controls
import { createElement, isMobile } from '../utils/dom.js';
import { AudioManager } from '../services/AudioManager.js';
import { GameState } from '../services/GameState.js';

export function createExploreMode({ solarSystem, onBack, onPlanetInfo, onARCamera }) {
  const screen = createElement('div', 'explore-mode screen-enter');

  // Header
  const header = createElement('div', 'explore-header');
  const backBtn = createElement('button', 'back-btn', { textContent: '←' });
  backBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onBack();
  });
  const title = createElement('div', 'explore-title', { textContent: 'SIMULASI 3D & INFO PLANET' });
  header.appendChild(backBtn);
  header.appendChild(title);

  // Controls panel
  const controls = createElement('div', 'explore-controls');

  // Simulation control card
  const controlPanel = createElement('div', 'control-panel');

  const panelHeader = createElement('div', 'control-panel-header');
  const panelTitle = createElement('div', 'control-panel-title');
  panelTitle.innerHTML = '⚙️ KONTROL SIMULASI';
  const indicators = createElement('div', 'control-panel-indicators');
  indicators.innerHTML = '<div class="indicator-dot green"></div><div class="indicator-dot amber"></div>';
  panelHeader.appendChild(panelTitle);
  panelHeader.appendChild(indicators);
  controlPanel.appendChild(panelHeader);

  // Orbit speed
  const orbitRow = createSliderRow('🔄', 'KECEPATAN ORBIT', 1, 0, 5, 0.1, (val) => {
    solarSystem.setOrbitSpeed(val);
  });
  controlPanel.appendChild(orbitRow);

  // Rotation speed
  const rotationRow = createSliderRow('🌀', 'KECEPATAN ROTASI', 1, 0, 5, 0.1, (val) => {
    solarSystem.setRotationSpeed(val);
  });
  controlPanel.appendChild(rotationRow);

  // Sun intensity
  const sunRow = createSliderRow('☀️', 'CAHAYA MATAHARI', 1.9, 0, 5, 0.1, (val) => {
    solarSystem.setSunIntensity(val);
  });
  controlPanel.appendChild(sunRow);

  // Action buttons
  const actions = createElement('div', 'control-actions');
  const pauseBtn = createElement('button', 'control-action-btn');
  pauseBtn.innerHTML = '⏸ Jeda Orbit';
  pauseBtn.addEventListener('click', () => {
    AudioManager.playClick();
    solarSystem.pauseOrbit();
  });
  const resetBtn = createElement('button', 'control-action-btn');
  resetBtn.innerHTML = '🔄 Reset Semua';
  resetBtn.addEventListener('click', () => {
    AudioManager.playClick();
    solarSystem.resetAll();
    // Reset slider visuals
    orbitRow.querySelector('input').value = 1;
    orbitRow.querySelector('.control-slider-value').textContent = '1.0x';
    rotationRow.querySelector('input').value = 1;
    rotationRow.querySelector('.control-slider-value').textContent = '1.0x';
    sunRow.querySelector('input').value = 1.9;
    sunRow.querySelector('.control-slider-value').textContent = '1.9x';
  });
  actions.appendChild(pauseBtn);
  actions.appendChild(resetBtn);
  controlPanel.appendChild(actions);

  // AR Camera button
  const arBtn = createElement('button', 'ar-btn');
  arBtn.innerHTML = '📷 KAMERA AR';
  arBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onARCamera();
  });

  controls.appendChild(controlPanel);
  controls.appendChild(arBtn);

  // Hints (desktop only)
  const hints = createElement('div', 'explore-hints');
  [
    { icon: '🖱️', text: 'Klik planet' },
    { icon: '👆', text: 'Geser' },
    { icon: '🔍', text: 'Scroll' },
  ].forEach(h => {
    const item = createElement('div', 'hint-item');
    item.innerHTML = `<span class="hint-item-icon">${h.icon}</span> ${h.text}`;
    hints.appendChild(item);
  });

  screen.appendChild(header);
  screen.appendChild(controls);
  screen.appendChild(hints);

  return screen;
}

function createSliderRow(icon, label, defaultVal, min, max, step, onChange) {
  const row = createElement('div', 'control-slider-row');
  const iconEl = createElement('span', 'control-slider-icon', { textContent: icon });
  const labelEl = createElement('span', 'control-slider-label', { textContent: label });
  const slider = createElement('input', '');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = defaultVal;
  const valueEl = createElement('span', 'control-slider-value', { textContent: defaultVal.toFixed(1) + 'x' });

  slider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valueEl.textContent = val.toFixed(1) + 'x';
    onChange(val);
  });

  row.appendChild(iconEl);
  row.appendChild(labelEl);
  row.appendChild(slider);
  row.appendChild(valueEl);
  return row;
}
