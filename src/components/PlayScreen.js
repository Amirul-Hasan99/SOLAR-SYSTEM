// PlayScreen.js — Ready screen with astronaut and "Play Now" button
import { createElement } from '../utils/dom.js';
import { AudioManager } from '../services/AudioManager.js';

export function createPlayScreen(onPlay) {
  const screen = createElement('div', 'play-screen screen-enter');

  // Astronaut
  const astronaut = createElement('div', 'play-astronaut');
  astronaut.innerHTML = `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#glow2)">
      <g transform="translate(40,10) scale(0.55)">
        <ellipse cx="100" cy="180" rx="55" ry="65" fill="#D0D0D0" stroke="#888" stroke-width="2"/>
        <circle cx="100" cy="90" r="50" fill="#E0E0E0" stroke="#999" stroke-width="2"/>
        <circle cx="100" cy="90" r="38" fill="#1a1a3a"/>
        <ellipse cx="90" cy="85" rx="12" ry="8" fill="rgba(100,180,255,0.2)" transform="rotate(-15,90,85)"/>
        <path d="M75 75 Q85 65 105 70" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>
        <rect x="130" y="130" width="35" height="60" rx="8" fill="#B0B0B0" stroke="#888" stroke-width="2"/>
        <path d="M55 160 Q20 140 30 110" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M145 160 Q180 130 175 100" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M80 240 Q75 280 70 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M120 240 Q125 280 130 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <ellipse cx="65" cy="305" rx="18" ry="10" fill="#888"/>
        <ellipse cx="135" cy="305" rx="18" ry="10" fill="#888"/>
      </g>
    </g>
    <defs>
      <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  </svg>`;

  // Title
  const title = createElement('div', 'play-title', { textContent: 'ASTRO QUEST' });

  // Status
  const status = createElement('div', 'play-status');
  status.innerHTML = '<span class="checkmark">✔</span> Alam Semesta Siap Dijelajahi!';

  // Play button
  const playBtn = createElement('button', 'btn play-btn', { textContent: '🚀  MAINKAN SEKARANG' });
  playBtn.addEventListener('click', () => {
    AudioManager.playClick();
    AudioManager.startBgMusic();
    screen.classList.add('screen-exit');
    setTimeout(() => onPlay(), 300);
  });

  screen.appendChild(astronaut);
  screen.appendChild(title);
  screen.appendChild(status);
  screen.appendChild(playBtn);

  return screen;
}
