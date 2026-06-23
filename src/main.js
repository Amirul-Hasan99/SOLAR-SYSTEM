// main.js — Astro Quest App Bootstrap
import './style.css';
import { clearElement } from './utils/dom.js';
import { GameState } from './services/GameState.js';
import { AudioManager } from './services/AudioManager.js';
import { SolarSystem } from './core/SolarSystem.js';
import { createSplashScreen } from './components/SplashScreen.js';
import { createPlayScreen } from './components/PlayScreen.js';
import { createMainMenu } from './components/MainMenu.js';
import { createExploreMode } from './components/ExploreMode.js';
import { createPlanetInfoPanel } from './components/PlanetInfoPanel.js';
import { createQuizMode } from './components/QuizMode.js';
import { createCollectionMode } from './components/CollectionMode.js';
import { createAchievementMode } from './components/AchievementMode.js';
import { createSettingsPanel } from './components/SettingsPanel.js';
import { createARCamera } from './components/ARCamera.js';

class AstroQuestApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.canvasContainer = document.getElementById('three-canvas-container');
    this.overlayContainer = document.getElementById('overlay-container');
    this.solarSystem = null;
    this.currentScreen = null;

    this._init();
  }

  _init() {
    this._showSplash();
  }

  _clearApp() {
    clearElement(this.appContainer);
    clearElement(this.overlayContainer);
    this.appContainer.style.pointerEvents = 'auto';
  }

  _clearOverlay() {
    clearElement(this.overlayContainer);
  }

  _hideApp() {
    this.appContainer.style.pointerEvents = 'none';
    clearElement(this.appContainer);
  }

  // ===== SCREENS =====

  _showSplash() {
    this._clearApp();
    this.currentScreen = 'splash';
    const splash = createSplashScreen(() => this._showPlay());
    this.appContainer.appendChild(splash);
  }

  _showPlay() {
    this._clearApp();
    this.currentScreen = 'play';
    const play = createPlayScreen(() => this._showMenu());
    this.appContainer.appendChild(play);
  }

  _showMenu() {
    this._destroySolarSystem();
    this._clearApp();
    this.currentScreen = 'menu';

    const menu = createMainMenu({
      onExplore: () => this._showExplore(),
      onQuiz: () => this._showQuiz(),
      onCollection: () => this._showCollection(),
      onAchievements: () => this._showAchievements(),
      onSettings: () => this._showSettings(),
    });
    this.appContainer.appendChild(menu);
  }

  _showExplore() {
    this._clearApp();
    this._hideApp();
    this.currentScreen = 'explore';

    // Initialize solar system if not already
    if (!this.solarSystem) {
      this.solarSystem = new SolarSystem(this.canvasContainer, (planetName) => {
        this._showPlanetInfo(planetName);
      });
    }
    this.solarSystem.start();

    // Show explore UI overlay
    const exploreUI = createExploreMode({
      solarSystem: this.solarSystem,
      onBack: () => this._showMenu(),
      onPlanetInfo: (name) => this._showPlanetInfo(name),
      onARCamera: () => this._showAR(),
    });
    this.overlayContainer.appendChild(exploreUI);
  }

  _showPlanetInfo(planetKey) {
    this._clearOverlay();

    // Re-add explore UI first
    const exploreUI = createExploreMode({
      solarSystem: this.solarSystem,
      onBack: () => {
        if (this.solarSystem) {
          this.solarSystem.closeInfoAndZoomOut();
        }
        this._showMenu();
      },
      onPlanetInfo: (name) => this._showPlanetInfo(name),
      onARCamera: () => this._showAR(),
    });
    this.overlayContainer.appendChild(exploreUI);

    // Add planet info panel
    const panel = createPlanetInfoPanel(planetKey, () => {
      this._clearOverlay();
      if (this.solarSystem) {
        this.solarSystem.closeInfoAndZoomOut();
      }
      // Re-show explore overlay
      const ui = createExploreMode({
        solarSystem: this.solarSystem,
        onBack: () => this._showMenu(),
        onPlanetInfo: (name) => this._showPlanetInfo(name),
        onARCamera: () => this._showAR(),
      });
      this.overlayContainer.appendChild(ui);
    });
    if (panel) {
      this.overlayContainer.appendChild(panel);
    }
  }

  _showQuiz() {
    this._clearApp();
    this._destroySolarSystem();
    this.currentScreen = 'quiz';

    const quiz = createQuizMode({
      onBack: () => this._showMenu(),
      onComplete: () => this._showMenu(),
    });
    this.appContainer.appendChild(quiz);
  }

  _showCollection() {
    this.currentScreen = 'collection';
    const collection = createCollectionMode({
      onClose: () => {
        this._clearOverlay();
      },
    });
    this.overlayContainer.appendChild(collection);
  }

  _showAchievements() {
    this.currentScreen = 'achievements';
    const achievements = createAchievementMode({
      onClose: () => {
        this._clearOverlay();
      },
    });
    this.overlayContainer.appendChild(achievements);
  }

  _showSettings() {
    this.currentScreen = 'settings';
    const settings = createSettingsPanel({
      onClose: () => {
        this._clearOverlay();
      },
    });
    this.overlayContainer.appendChild(settings);
  }

  _showAR() {
    this._clearApp();
    this._clearOverlay();
    if (this.solarSystem) {
      this.solarSystem.stop();
    }
    this.currentScreen = 'ar';

    const ar = createARCamera({
      onBack: () => {
        if (ar._cleanup) ar._cleanup();
        this._showExplore();
      },
    });
    this.appContainer.appendChild(ar);
    this.appContainer.style.pointerEvents = 'auto';
  }

  _destroySolarSystem() {
    if (this.solarSystem) {
      this.solarSystem.dispose();
      this.solarSystem = null;
      clearElement(this.canvasContainer);
    }
  }
}

// Initialize audio context on first user interaction
document.addEventListener('click', () => {
  AudioManager.resume();
}, { once: true });

// Start app
const app = new AstroQuestApp();

// PWA service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Service worker registration failed, not critical
    });
  });
}
