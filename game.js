/* =============================================
   js/app.js — Main application controller
   ============================================= */
'use strict';

const App = {
  currentScreen:      'auth',
  currentLevelModal:  null,
  diffFilterLevels:   'all',
  surahFilterLevels:  'all',

  init() {
    UI.initStars();
    UI.applyTheme(DB.getTheme());

    // Check existing session
    if (Auth.init()) {
      this._postLogin(Auth.getUser(), false);
    } else {
      this.showScreen('auth');
    }

    this._bindGlobalEvents();
    UI.startLiveFeedRotation();
  },

  _postLogin(user, greet = true) {
    UI.updateNavAvatar(user);
    document.getElementById('mainNav').style.display = 'flex';
    this.showScreen('dashboard');
    if (greet) UI.toast(`Welcome, ${user.fname}! 🎮`, 'success');
  },

  // ===================== SCREENS =====================
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById('screen-' + name);
    if (screen) screen.classList.add('active');
    this.currentScreen = name;

    // Update nav active state
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.classList.toggle('active', el.dataset.screen === name);
    });

    // Screen-specific init
    if (name === 'dashboard')   this._renderDashboard();
    if (name === 'levels')      this._renderLevels();
    if (name === 'leaderboard') { Leaderboard.render('all'); }
    if (name === 'profile')     Profile.render();
  },

  // ===================== AUTH =====================
  _bindAuthForms() {
    // Sign In
    document.getElementById('form-signin')?.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('signin-user').value.trim();
      const pass = document.getElementById('signin-pass').value;
      const res  = Auth.signIn(user, pass);
      if (res.ok) this._postLogin(res.user);
      else UI.toast(res.msg, 'error');
    });

    // Sign Up
    document.getElementById('form-signup')?.addEventListener('submit', e => {
      e.preventDefault();
      const res = Auth.signUp({
        fname:    document.getElementById('signup-fname').value.trim(),
        lname:    document.getElementById('signup-lname').value.trim(),
        username: document.getElementById('signup-username').value.trim(),
        email:    document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-pass').value,
        country:  document.getElementById('signup-country').value,
      });
      if (res.ok) { this._postLogin(res.user, false); UI.toast('Welcome to TypeQuest! 🌟', 'success'); }
      else UI.toast(res.msg, 'error');
    });

    // Demo
    document.getElementById('demoBtn')?.addEventListener('click', () => {
      const res = Auth.demoLogin();
      if (res.ok) { this._postLogin(res.user, false); UI.toast('Demo account loaded 🎮', 'info'); }
    });

    // Tab switch
    document.querySelectorAll('.tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.tab;
        document.querySelectorAll('.tab[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
        document.getElementById('form-signin').classList.toggle('hidden', name !== 'signin');
        document.getElementById('form-signup').classList.toggle('hidden', name !== 'signup');
      });
    });

    // Password eye toggles
    document.querySelectorAll('.input-eye').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        target.type = target.type === 'password' ? 'text' : 'password';
        btn.textContent = target.type === 'password' ? '👁' : '🙈';
      });
    });
  },

  // ===================== DASHBOARD =====================
  _renderDashboard() {
    const user = Auth.getUser();
    if (!user) return;

    UI.setText('welcome-name', `Welcome back, ${user.fname}!`);
    UI.setText('welcome-sub',  'Continue your journey through the Quran');

    // Rank
    const rankIdx = Math.min(Math.floor(((user.currentLevel || 1) - 1) / 30), 4);
    UI.setText('user-rank-badge', '⚔️ ' + RANK_TITLES[rankIdx]);
    UI.setText('user-streak',     '🔥 ' + (user.streak || 0) + ' day streak');

    // Stats
    const completed = Object.keys(user.completedLevels || {}).length;
    const avgAcc    = (user.totalAcc || []).length
      ? Math.round(user.totalAcc.reduce((a, b) => a + b, 0) / user.totalAcc.length) : 0;
    const rank      = Leaderboard.getMyRank();

    UI.setText('dash-wpm',        user.bestWpm || 0);
    UI.setText('dash-acc',        avgAcc + '%');
    UI.setText('dash-level',      user.currentLevel || 1);
    UI.setText('dash-completed',  completed);
    UI.setText('dash-rank',       rank > 0 ? '#' + rank : '#--');
    UI.setText('dash-keystrokes', UI.fmtNum(user.keystrokes || 0));

    // Progress bars
    const easyC = Object.keys(user.completedLevels || {}).filter(k => k.endsWith('_easy')).length;
    const medC  = Object.keys(user.completedLevels || {}).filter(k => k.endsWith('_medium')).length;
    const hardC = Object.keys(user.completedLevels || {}).filter(k => k.endsWith('_hard')).length;

    UI.setProgress('prog-easy',  easyC / 50 * 100);
    UI.setProgress('prog-med',   medC  / 50 * 100);
    UI.setProgress('prog-hard',  hardC / 50 * 100);
    UI.setProgress('prog-total', completed / 150 * 100);
    UI.setText('prog-easy-text',  `${easyC}/50`);
    UI.setText('prog-med-text',   `${medC}/50`);
    UI.setText('prog-hard-text',  `${hardC}/50`);
    UI.setText('prog-total-text', `${completed}/150`);

    UI.renderLiveFeed();
    this._renderMiniLB();
    this._renderRecentSessions(user);
  },

  _renderMiniLB() {
    const top3   = Leaderboard.getMergedData('all').slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const el     = document.getElementById('miniLb');
    if (!el) return;
    el.innerHTML = top3.length
      ? top3.map((e, i) => `
          <div class="mini-lb-row">
            <span>${medals[i]}</span>
            <span style="flex:1">${e.name}</span>
            <span class="stat-num gold" style="font-size:0.82rem">${e.wpm} WPM</span>
          </div>`).join('')
      : '<p class="empty-state">No scores yet</p>';
  },

  _renderRecentSessions(user) {
    const sessions = [...(user.scores || [])].reverse().slice(0, 5);
    const el       = document.getElementById('recentSessions');
    if (!el) return;
    const diffIcons = { easy: '🟢', medium: '🟡', hard: '🔴' };
    if (!sessions.length) {
      el.innerHTML = '<p class="empty-state">No sessions yet. Start playing!</p>';
      return;
    }
    el.innerHTML = sessions.map(s => `
      <div class="session-row">
        <div class="session-icon">${diffIcons[s.difficulty] || '⚪'}</div>
        <div>
          <div class="session-name">Level ${s.levelId}</div>
          <div class="session-date">${new Date(s.date).toLocaleDateString()}</div>
        </div>
        <div class="stat-num gold" style="font-size:0.88rem">${s.wpm} WPM</div>
        <div>${'⭐'.repeat(s.stars)}</div>
      </div>`).join('');
  },

  // ===================== LEVELS =====================
  _renderLevels() {
    const grid = document.getElementById('levelGrid');
    if (!grid) return;
    const user = Auth.getUser() || { currentLevel: 1, completedLevels: {} };
    const completed = user.completedLevels || {};
    const filter    = this.diffFilterLevels;
    const surah     = this.surahFilterLevels;

    // Populate surah select once
    const surahSel = document.getElementById('surahFilter');
    if (surahSel && surahSel.children.length <= 1) {
      SURAHS.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.name; opt.textContent = s.name;
        surahSel.appendChild(opt);
      });
    }

    grid.innerHTML = '';
    let shown = 0, done = 0;

    LEVELS_DATA.forEach(lv => {
      if (surah !== 'all' && lv.surah !== surah) return;

      const isCompleted = Object.keys(completed).some(k => k.startsWith(lv.id + '_'));
      const isCurrent   = lv.id === (user.currentLevel || 1);
      const isLocked    = lv.id > (user.currentLevel || 1) + 3;

      // Show/count per difficulty filter
      if (filter !== 'all') {
        const key = `${lv.id}_${filter}`;
        // Show all nodes, mark which ones have been done in this diff
      }

      const stars = this._getStars(lv.id, completed);
      shown++;
      if (isCompleted) done++;

      const node = document.createElement('div');
      const cls  = ['level-node'];
      if (isCompleted) cls.push('completed');
      if (isCurrent)   cls.push('current');
      if (isLocked)    cls.push('locked');
      node.className = cls.join(' ');
      node.title     = `Level ${lv.id} — ${lv.surah}`;
      node.innerHTML = `
        <div class="level-num">${lv.id}</div>
        <div class="level-surah">${lv.surah.split(' ').pop()}</div>
        <div class="level-stars">
          ${[1,2,3].map(i =>
            `<span class="star-icon ${stars >= i ? 'earned' : 'empty'}">${stars >= i ? '★' : '☆'}</span>`
          ).join('')}
        </div>`;

      if (!isLocked) node.addEventListener('click', () => this._openLevelModal(lv.id));
      grid.appendChild(node);
    });

    UI.setText('levelProgressText', `${done}/${shown}`);
  },

  _getStars(levelId, completed) {
    return Math.max(0, ...['easy', 'medium', 'hard'].map(d => completed[`${levelId}_${d}`] || 0));
  },

  _openLevelModal(levelId) {
    const lv = LEVELS_DATA[levelId - 1];
    if (!lv) return;
    this.currentLevelModal = levelId;

    UI.setText('modalLevelTitle', `Level ${levelId}: ${lv.surah}`);
    UI.setText('modalLevelSub',   `${lv.title} · 30 Questions`);
    UI.setText('modalSurah',      lv.surah);
    UI.setText('modalEasyTime',   lv.easyTime + 's/Q');
    UI.setText('modalMedTime',    lv.medTime  + 's/Q');
    UI.setText('modalHardTime',   lv.hardTime + 's/Q');

    const user    = Auth.getUser();
    const scores  = (user?.scores || []).filter(s => s.levelId === levelId);
    const bestWpm = scores.length ? Math.max(...scores.map(s => s.wpm)) : 0;
    UI.setText('modalBestWpm', bestWpm > 0 ? bestWpm + ' WPM' : '—');

    const stars = this._getStars(levelId, user?.completedLevels || {});
    UI.setHTML('modalStars', [1,2,3].map(i => stars >= i ? '⭐' : '☆').join(''));

    UI.openModal('modal-level-select');
  },

  startLevel(difficulty) {
    if (!this.currentLevelModal) return;
    UI.closeModal('modal-level-select');
    Game.init(this.currentLevelModal, difficulty);
    this.showScreen('game');
  },

  quickPlay(difficulty) {
    const user = Auth.getUser();
    const lvl  = user?.currentLevel || 1;
    this.currentLevelModal = lvl;
    this.startLevel(difficulty);
  },

  // ===================== GLOBAL EVENTS =====================
  _bindGlobalEvents() {
    this._bindAuthForms();

    // Nav screen links
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.addEventListener('click', () => this.showScreen(el.dataset.screen));
    });

    // Theme toggle
    document.getElementById('themeBtn')?.addEventListener('click', () => UI.toggleTheme());

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      Auth.signOut();
      document.getElementById('mainNav').style.display = 'none';
      this.showScreen('auth');
      UI.toast('Logged out. See you next time! 👋', 'info');
    });

    // Mobile nav
    const drawer        = document.getElementById('navDrawer');
    const drawerOverlay = document.getElementById('navDrawerOverlay');
    document.getElementById('navHamburger')?.addEventListener('click', () => {
      drawer?.classList.add('open');
      drawerOverlay?.classList.add('open');
    });
    document.getElementById('navDrawerClose')?.addEventListener('click', () => {
      drawer?.classList.remove('open');
      drawerOverlay?.classList.remove('open');
    });
    drawerOverlay?.addEventListener('click', () => {
      drawer?.classList.remove('open');
      drawerOverlay?.classList.remove('open');
    });
    document.querySelectorAll('.nav-drawer-link').forEach(el => {
      el.addEventListener('click', () => {
        drawer?.classList.remove('open');
        drawerOverlay?.classList.remove('open');
        this.showScreen(el.dataset.screen);
      });
    });

    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => UI.closeModal(btn.dataset.close));
    });

    // Modal overlay click to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });

    // Level difficulty select
    document.querySelectorAll('.diff-btn[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => this.startLevel(btn.dataset.diff));
    });

    // Dashboard quick play
    document.querySelectorAll('[data-quick]').forEach(btn => {
      btn.addEventListener('click', () => this.quickPlay(btn.dataset.quick));
    });

    // Continue button
    document.getElementById('continueBtn')?.addEventListener('click', () => {
      const user = Auth.getUser();
      this._openLevelModal(user?.currentLevel || 1);
    });

    // Game controls
    document.getElementById('pauseBtn')?.addEventListener('click', () => {
      Game.state?.paused ? Game.resume() : Game.pause();
    });
    document.getElementById('restartBtn')?.addEventListener('click', () => Game.restart());
    document.getElementById('stopBtn')?.addEventListener('click', () => Game.stop());
    document.getElementById('resumeGameBtn')?.addEventListener('click', () => Game.resume());
    document.getElementById('restartFromPauseBtn')?.addEventListener('click', () => Game.restart());
    document.getElementById('stopFromPauseBtn')?.addEventListener('click', () => Game.stop());
    document.getElementById('nextBtn')?.addEventListener('click', () => Game.nextQuestion());

    // Result modal
    document.getElementById('retryBtn')?.addEventListener('click', () => Game.restart());
    document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
      UI.closeModal('modal-result');
      const next = (Game.getLevelId() || 1) + 1;
      if (next <= 150) {
        this.currentLevelModal = next;
        this.startLevel(Game.getDifficulty() || 'easy');
      } else {
        this.showScreen('levels');
      }
    });

    // Typing input
    document.getElementById('typingInput')?.addEventListener('input', e => Game.handleInput(e));
    document.getElementById('typingInput')?.addEventListener('keydown', e => {
      if (e.key === 'Tab') e.preventDefault();
    });

    // Level map filters
    document.querySelectorAll('#difficultyFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#difficultyFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.diffFilterLevels = btn.dataset.filter;
        this._renderLevels();
      });
    });

    document.getElementById('surahFilter')?.addEventListener('change', e => {
      this.surahFilterLevels = e.target.value;
      this._renderLevels();
    });

    // Leaderboard tabs
    document.querySelectorAll('[data-lbtab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.lbtab;
        document.querySelectorAll('[data-lbtab]').forEach(b => b.classList.toggle('active', b.dataset.lbtab === tab));
        document.getElementById('lbWorldPanel').classList.toggle('hidden', tab !== 'world');
        document.getElementById('lbMyPanel').classList.toggle('hidden', tab !== 'me');
        if (tab === 'me') Leaderboard.renderMyScores();
      });
    });

    // Leaderboard filters
    document.querySelectorAll('#lbFilters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#lbFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Leaderboard.render(btn.dataset.lbfilter);
      });
    });

    // Profile edit
    document.getElementById('editProfileBtn')?.addEventListener('click', () => Profile.openEdit());
    document.getElementById('editProfileBtn2')?.addEventListener('click', () => Profile.openEdit());

    document.getElementById('editProfileForm')?.addEventListener('submit', e => {
      e.preventDefault();
      Profile.save();
    });

    // Avatar color selection
    document.querySelectorAll('.avatar-color-opt').forEach((el, i) => {
      el.addEventListener('click', () => Profile.selectColor(i));
    });

    // Keyboard shortcut: Escape closes top modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const open = document.querySelector('.modal-overlay.open');
        if (open) open.classList.remove('open');
      }
    });

    // Auth page player count
    const users = DB.getUsers();
    const count = Object.keys(users).length + 2847;
    UI.setText('auth-player-count', count.toLocaleString());
  },
};

// ===================== BOOT =====================
document.addEventListener('DOMContentLoaded', () => App.init());
