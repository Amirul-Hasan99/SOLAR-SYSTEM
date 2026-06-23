// GameState.js — LocalStorage-based game state management
const STORAGE_KEY = 'astroquest_state';

const defaultState = {
  profile: {
    name: 'Astro Quest',
    avatar: 'A',
  },
  audio: {
    bgVolume: 50,
    sfxVolume: 70,
  },
  unlockedPlanets: [],
  exploredPlanets: [],
  quizHistory: [],
  totalCorrectAnswers: 0,
  totalQuizzesTaken: 0,
  bestScore: 0,
  achievements: {},
  firstLogin: false,
};

class GameStateManager {
  constructor() {
    this._state = this._load();
    this._listeners = [];
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load game state:', e);
    }
    return { ...defaultState };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save game state:', e);
    }
    this._notify();
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  }

  onChange(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  }

  get state() {
    return this._state;
  }

  // Profile
  setProfileName(name) {
    this._state.profile.name = name;
    this._save();
  }

  getProfileName() {
    return this._state.profile.name;
  }

  // Audio
  setBgVolume(vol) {
    this._state.audio.bgVolume = vol;
    this._save();
  }

  setSfxVolume(vol) {
    this._state.audio.sfxVolume = vol;
    this._save();
  }

  // Planets
  unlockPlanet(planetName) {
    if (!this._state.unlockedPlanets.includes(planetName)) {
      this._state.unlockedPlanets.push(planetName);
      this._save();
    }
  }

  isPlanetUnlocked(planetName) {
    return this._state.unlockedPlanets.includes(planetName);
  }

  getUnlockedPlanets() {
    return [...this._state.unlockedPlanets];
  }

  explorePlanet(planetName) {
    if (!this._state.exploredPlanets.includes(planetName)) {
      this._state.exploredPlanets.push(planetName);
      this._save();
    }
  }

  isExplored(planetName) {
    return this._state.exploredPlanets.includes(planetName);
  }

  // Quiz
  recordQuizResult(score, total, planetReward) {
    this._state.quizHistory.push({
      score,
      total,
      planetReward,
      date: Date.now(),
    });
    this._state.totalCorrectAnswers += score;
    this._state.totalQuizzesTaken += 1;
    if (score > this._state.bestScore) {
      this._state.bestScore = score;
    }
    if (planetReward) {
      this.unlockPlanet(planetReward);
    }
    this._save();
  }

  // Achievements
  unlockAchievement(id) {
    if (!this._state.achievements[id]) {
      this._state.achievements[id] = { unlockedAt: Date.now() };
      this._save();
      return true;
    }
    return false;
  }

  isAchievementUnlocked(id) {
    return !!this._state.achievements[id];
  }

  // First login tracking
  markFirstLogin() {
    if (!this._state.firstLogin) {
      this._state.firstLogin = true;
      this.unlockAchievement('solar_explorer');
      this._save();
    }
  }

  hasLoggedInBefore() {
    return this._state.firstLogin;
  }

  // Check achievements after actions
  checkAchievements() {
    // Solar Explorer: first login
    if (this._state.firstLogin) {
      this.unlockAchievement('solar_explorer');
    }
    // Quiz Master: 50+ correct answers
    if (this._state.totalCorrectAnswers >= 50) {
      this.unlockAchievement('quiz_master');
    }
    // First Discovery: at least 1 unlocked planet
    if (this._state.unlockedPlanets.length >= 1) {
      this.unlockAchievement('first_discovery');
    }
    // Full Collection
    if (this._state.unlockedPlanets.length >= 9) {
      this.unlockAchievement('full_collection');
    }
    // Perfect Score
    if (this._state.bestScore >= 9) {
      this.unlockAchievement('interstellar');
    }
  }

  // Reset
  resetProgress() {
    this._state = { ...defaultState };
    this._save();
  }
}

export const GameState = new GameStateManager();
