// SettingsPanel.js — Settings modal with profile and audio controls
import { createElement } from '../utils/dom.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createSettingsPanel({ onClose }) {
  const screen = createElement('div', 'settings-screen screen-enter');

  const card = createElement('div', 'settings-card');

  // Header
  const header = createElement('div', 'settings-header');
  const title = createElement('div', 'settings-title');
  title.innerHTML = '⚙️ PENGATURAN';
  const closeBtn = createElement('button', 'close-btn', { textContent: '✕' });
  closeBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onClose();
  });
  header.appendChild(title);
  header.appendChild(closeBtn);
  card.appendChild(header);

  // Body
  const body = createElement('div', 'settings-body');

  // Profile section
  const profileSection = createElement('div', 'settings-section');
  const profileTitle = createElement('div', 'settings-section-title', { textContent: 'PROFIL' });
  profileSection.appendChild(profileTitle);

  const profile = createElement('div', 'settings-profile');
  const avatar = createElement('div', 'settings-avatar', {
    textContent: GameState.getProfileName().charAt(0).toUpperCase(),
  });
  const profileDetails = createElement('div', 'settings-profile-details');
  const profileName = createElement('div', 'settings-profile-name', {
    textContent: GameState.getProfileName(),
  });
  const editBtn = createElement('button', 'settings-edit-btn', { textContent: 'EDIT PROFIL' });
  editBtn.addEventListener('click', () => {
    const newName = prompt('Masukkan nama baru:', GameState.getProfileName());
    if (newName && newName.trim()) {
      GameState.setProfileName(newName.trim());
      profileName.textContent = newName.trim();
      avatar.textContent = newName.trim().charAt(0).toUpperCase();
    }
  });
  profileDetails.appendChild(profileName);
  profileDetails.appendChild(editBtn);
  profile.appendChild(avatar);
  profile.appendChild(profileDetails);
  profileSection.appendChild(profile);

  // Audio section
  const audioSection = createElement('div', 'settings-section');
  const audioTitle = createElement('div', 'settings-section-title', { textContent: 'AUDIO' });
  audioSection.appendChild(audioTitle);

  // Background volume
  const bgGroup = createElement('div', 'settings-slider-group');
  const bgLabel = createElement('div', 'settings-slider-label');
  const bgName = createElement('span', 'settings-slider-name', { textContent: 'Backsound' });
  const bgValue = createElement('span', 'settings-slider-value', {
    textContent: GameState.state.audio.bgVolume + '%',
  });
  bgLabel.appendChild(bgName);
  bgLabel.appendChild(bgValue);
  const bgSlider = createElement('input', '');
  bgSlider.type = 'range';
  bgSlider.min = 0;
  bgSlider.max = 100;
  bgSlider.value = GameState.state.audio.bgVolume;
  bgSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    bgValue.textContent = val + '%';
    GameState.setBgVolume(val);
    AudioManager.updateVolumes();
  });
  bgGroup.appendChild(bgLabel);
  bgGroup.appendChild(bgSlider);
  audioSection.appendChild(bgGroup);

  // SFX volume
  const sfxGroup = createElement('div', 'settings-slider-group');
  const sfxLabel = createElement('div', 'settings-slider-label');
  const sfxName = createElement('span', 'settings-slider-name', { textContent: 'Click Sound' });
  const sfxValue = createElement('span', 'settings-slider-value', {
    textContent: GameState.state.audio.sfxVolume + '%',
  });
  sfxLabel.appendChild(sfxName);
  sfxLabel.appendChild(sfxValue);
  const sfxSlider = createElement('input', '');
  sfxSlider.type = 'range';
  sfxSlider.min = 0;
  sfxSlider.max = 100;
  sfxSlider.value = GameState.state.audio.sfxVolume;
  sfxSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    sfxValue.textContent = val + '%';
    GameState.setSfxVolume(val);
    AudioManager.updateVolumes();
  });
  sfxGroup.appendChild(sfxLabel);
  sfxGroup.appendChild(sfxSlider);
  audioSection.appendChild(sfxGroup);

  body.appendChild(profileSection);
  body.appendChild(audioSection);
  card.appendChild(body);

  // Footer
  const footer = createElement('div', 'settings-footer');
  const version = createElement('div', 'settings-version', {
    textContent: 'Versi 2.0.4 | © 2026 Solar System 3D',
  });
  const logoutBtn = createElement('button', 'logout-btn', { textContent: 'LOGOUT' });
  logoutBtn.addEventListener('click', () => {
    AudioManager.playClick();
    if (confirm('Yakin ingin logout? Progress akan tetap tersimpan.')) {
      onClose();
    }
  });
  footer.appendChild(version);
  footer.appendChild(logoutBtn);
  card.appendChild(footer);

  screen.appendChild(card);

  // Close on bg click
  screen.addEventListener('click', (e) => {
    if (e.target === screen) {
      AudioManager.playClick();
      onClose();
    }
  });

  return screen;
}
