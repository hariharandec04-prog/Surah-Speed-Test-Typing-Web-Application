/* =============================================
   js/ui.js — UI helpers, toast, modals, nav
   ============================================= */
'use strict';

const UI = {
  // ---- DOM helpers ----
  el: id => document.getElementById(id),

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  setStyle(id, prop, val) {
    const el = document.getElementById(id);
    if (el) el.style[prop] = val;
  },

  setAttr(id, attr, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  },

  show(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  },

  hide(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  },

  addClass(id, cls) {
    const el = document.getElementById(id);
    if (el) el.classList.add(cls);
  },

  removeClass(id, cls) {
    const el = document.getElementById(id);
    if (el) el.classList.remove(cls);
  },

  // ---- Modals ----
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  },

  // ---- Toast ----
  toast(msg, type = 'info', duration = 3200) {
    const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(t);
    setTimeout(() => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 320);
    }, duration);
  },

  // ---- Theme ----
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    UI.setText('themeBtn', theme === 'dark' ? '🌙' : '☀️');
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next    = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    DB.setTheme(next);
  },

  // ---- Stars background ----
  initStars(count = 80) {
    const container = document.getElementById('bgStars');
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--d:${2 + Math.random() * 4}s`,
        `--delay:${Math.random() * 6}s`,
        `opacity:${0.08 + Math.random() * 0.5}`,
      ].join(';');
      container.appendChild(s);
    }
  },

  // ---- Nav avatar ----
  updateNavAvatar(user) {
    if (!user) return;
    const initials = ((user.fname || '')[0] + (user.lname || '')[0]).toUpperCase() || 'TQ';
    const el = document.getElementById('navAvatar');
    if (el) {
      el.textContent = initials;
      el.style.background = AVATAR_COLORS[user.avatarColor || 0];
    }
  },

  // ---- Progress fill helper ----
  setProgress(id, pct) {
    this.setStyle(id, 'width', Math.min(100, Math.max(0, pct)) + '%');
  },

  // ---- Number formatting ----
  fmtNum(n) {
    return Number(n).toLocaleString();
  },

  // ---- Live feed ----
  renderLiveFeed() {
    const feed = document.getElementById('liveFeed');
    if (!feed) return;
    const events = LIVE_EVENTS.slice(0, 7);
    const timeAgo = ['just now', '1m ago', '3m ago', '5m ago', '8m ago', '12m ago', '18m ago'];
    feed.innerHTML = events.map((e, i) => `
      <div class="feed-row">
        <span>${e.icon}</span>
        <span class="feed-user">${e.user}</span>
        <span class="feed-event">${e.action}</span>
        <span class="feed-time">${timeAgo[i]}</span>
      </div>
    `).join('');
  },

  // ---- Rotate live feed periodically ----
  startLiveFeedRotation() {
    setInterval(() => {
      // Rotate array
      LIVE_EVENTS.push(LIVE_EVENTS.shift());
      this.renderLiveFeed();
    }, 7000);
  },
};
