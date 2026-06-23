// Router.js — Simple hash-based SPA router
export class Router {
  constructor() {
    this.routes = {};
    this.currentScreen = null;
    this.onNavigate = null;
    window.addEventListener('hashchange', () => this._handleRoute());
  }

  register(name, handler) {
    this.routes[name] = handler;
  }

  navigate(name, data = {}) {
    this.currentScreen = name;
    window.location.hash = name;
    if (this.routes[name]) {
      this.routes[name](data);
    }
    if (this.onNavigate) {
      this.onNavigate(name, data);
    }
  }

  _handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'splash';
    if (this.routes[hash]) {
      this.currentScreen = hash;
      this.routes[hash]();
      if (this.onNavigate) {
        this.onNavigate(hash, {});
      }
    }
  }

  getCurrentScreen() {
    return this.currentScreen;
  }
}
