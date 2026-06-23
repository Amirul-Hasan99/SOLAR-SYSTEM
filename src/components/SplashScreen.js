// SplashScreen.js — Loading screen with astronaut, title, and progress bar
import { createElement } from '../utils/dom.js';

export function createSplashScreen(onComplete) {
  const screen = createElement('div', 'splash-screen screen-enter');

  // Astronaut
  const astronaut = createElement('div', 'splash-astronaut');
  astronaut.innerHTML = `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#glow)">
      <ellipse cx="100" cy="170" rx="40" ry="8" fill="rgba(0,212,255,0.1)"/>
      <g transform="translate(50,20) scale(0.5)">
        <!-- Astronaut body -->
        <ellipse cx="100" cy="180" rx="55" ry="65" fill="#D0D0D0" stroke="#888" stroke-width="2"/>
        <!-- Helmet -->
        <circle cx="100" cy="90" r="50" fill="#E0E0E0" stroke="#999" stroke-width="2"/>
        <circle cx="100" cy="90" r="38" fill="#1a1a3a"/>
        <ellipse cx="90" cy="85" rx="12" ry="8" fill="rgba(100,180,255,0.2)" transform="rotate(-15,90,85)"/>
        <!-- Visor reflection -->
        <path d="M75 75 Q85 65 105 70" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="none"/>
        <!-- Backpack -->
        <rect x="130" y="130" width="35" height="60" rx="8" fill="#B0B0B0" stroke="#888" stroke-width="2"/>
        <!-- Arms -->
        <path d="M55 160 Q20 140 30 110" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M145 160 Q180 130 175 100" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <!-- Legs -->
        <path d="M80 240 Q75 280 70 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M120 240 Q125 280 130 300" stroke="#C0C0C0" stroke-width="18" stroke-linecap="round" fill="none"/>
        <!-- Boots -->
        <ellipse cx="65" cy="305" rx="18" ry="10" fill="#888"/>
        <ellipse cx="135" cy="305" rx="18" ry="10" fill="#888"/>
      </g>
    </g>
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  </svg>`;

  // Title
  const title = createElement('div', 'splash-title', { textContent: 'ASTRO QUEST' });

  // Progress
  const progress = createElement('div', 'splash-progress');
  const progressBar = createElement('div', 'splash-progress-bar');
  const progressFill = createElement('div', 'splash-progress-fill');
  progressBar.appendChild(progressFill);
  const progressText = createElement('div', 'splash-progress-text', { textContent: 'Menginisialisasi Alam Semesta... 0%' });
  progress.appendChild(progressBar);
  progress.appendChild(progressText);

  screen.appendChild(astronaut);
  screen.appendChild(title);
  screen.appendChild(progress);

  // Animate progress
  let current = 0;
  const interval = setInterval(() => {
    current += Math.random() * 8 + 2;
    if (current >= 100) {
      current = 100;
      clearInterval(interval);
      progressFill.style.width = '100%';
      progressText.textContent = 'Menginisialisasi Alam Semesta... 100%';
      setTimeout(() => {
        screen.classList.add('screen-exit');
        setTimeout(() => onComplete(), 300);
      }, 500);
    } else {
      progressFill.style.width = current + '%';
      progressText.textContent = `Menginisialisasi Alam Semesta... ${Math.floor(current)}%`;
    }
  }, 150);

  return screen;
}
