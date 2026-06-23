// AchievementMode.js — Achievements list screen
import { createElement } from '../utils/dom.js';
import { achievementsList } from '../data/achievements.js';
import { GameState } from '../services/GameState.js';
import { AudioManager } from '../services/AudioManager.js';

export function createAchievementMode({ onClose }) {
  const screen = createElement('div', 'achievement-screen screen-enter');

  const card = createElement('div', 'achievement-card');

  // Header
  const header = createElement('div', 'achievement-header');
  const title = createElement('div', 'achievement-title');
  title.innerHTML = '🏆 PENCAPAIAN';
  const closeBtn = createElement('button', 'close-btn', { textContent: '✕' });
  closeBtn.addEventListener('click', () => {
    AudioManager.playClick();
    onClose();
  });
  header.appendChild(title);
  header.appendChild(closeBtn);
  card.appendChild(header);

  // List
  const list = createElement('div', 'achievement-list');

  achievementsList.forEach(ach => {
    const isUnlocked = GameState.isAchievementUnlocked(ach.id);
    const item = createElement('div', `achievement-item${isUnlocked ? ' unlocked' : ''}`);

    const icon = createElement('div', 'achievement-icon', { textContent: ach.icon });
    const info = createElement('div', 'achievement-info');
    const name = createElement('div', 'achievement-name', { textContent: ach.name });
    const desc = createElement('div', 'achievement-desc', { textContent: ach.description });
    info.appendChild(name);
    info.appendChild(desc);

    const status = createElement('div', 'achievement-status', {
      textContent: isUnlocked ? '✅' : '🔒',
    });

    item.appendChild(icon);
    item.appendChild(info);
    item.appendChild(status);
    list.appendChild(item);
  });

  card.appendChild(list);
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
