const Router = {
  currentPage: 'login',
  init() {
    window.addEventListener('hashchange', () => this.render());
    this.render();
  },
  navigate(p) { window.location.hash = p; },
  getCurrent() { return window.location.hash.slice(1) || 'login'; },
  render() {
    const p = this.getCurrent();
    this.currentPage = p;
    const el = document.getElementById('app');
    if (!el) return;
    el.innerHTML = Pages[p] ? Pages[p]() : Pages.login();
    if (p !== 'login' && p !== 'register') {
      if (!App.isLoggedIn()) { this.navigate('login'); return; }
    }
    App.updateNav();
  }
};
window.navigate = p => Router.navigate(p);
