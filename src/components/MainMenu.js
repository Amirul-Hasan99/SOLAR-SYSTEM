// MainMenu.js — Home screen with logo, menu buttons, and profile
import { createElement } from '../utils/dom.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createMainMenu({ onExplore, onQuiz, onCollection, onAchievements, onSettings }) {
  const screen = createElement('div', 'main-menu screen-enter');

  // Left side — Logo and subtitle
  const left = createElement('div', 'menu-left');
  const logo = createElement('div', 'menu-logo');
  logo.innerHTML = 'ASTRO<br>QUEST';
  const subtitle = createElement('p', 'menu-subtitle', {
    textContent: 'Jelajahi alam semesta dalam 3D dan uji pengetahuan antariksamu melalui misi kuis yang menantang.',
  });
  left.appendChild(logo);
  left.appendChild(subtitle);

  // Right side — Menu card
  const right = createElement('div', 'menu-right');
  const card = createElement('div', 'menu-card');

  const menuItems = [
    { icon: '🔭', label: 'JELAJAH AR', action: onExplore, primary: true },
    { icon: '📝', label: 'MISI QUIS', action: onQuiz },
    { icon: '📦', label: 'KOLEKSI', action: onCollection },
    { icon: '🏆', label: 'PENCAPAIAN', action: onAchievements },
    { icon: '⚙️', label: 'PENGATURAN', action: onSettings },
  ];

  menuItems.forEach(item => {
    const btn = createElement('button', `menu-btn${item.primary ? ' primary' : ''}`);
    const iconSpan = createElement('span', 'menu-btn-icon', { textContent: item.icon });
    const labelSpan = createElement('span', '', { textContent: item.label });
    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);
    btn.addEventListener('click', () => {
      AudioManager.playClick();
      item.action();
    });
    card.appendChild(btn);
  });

  // Profile section
  const profile = createElement('div', 'menu-profile');
  const avatar = createElement('div', 'menu-profile-avatar', {
    textContent: GameState.getProfileName().charAt(0).toUpperCase(),
  });
  const info = createElement('div', 'menu-profile-info');
  const name = createElement('div', 'menu-profile-name', { textContent: GameState.getProfileName() });
  const status = createElement('div', 'menu-profile-status', { textContent: 'Online' });
  info.appendChild(name);
  info.appendChild(status);

  const logoutBtn = createElement('div', 'menu-profile-logout', { textContent: '🚪' });
  logoutBtn.setAttribute('title', 'Logout');

  profile.appendChild(avatar);
  profile.appendChild(info);
  profile.appendChild(logoutBtn);

  right.appendChild(card);
  right.appendChild(profile);

  screen.appendChild(left);
  screen.appendChild(right);

  // Mark first login
  GameState.markFirstLogin();

  return screen;
}
