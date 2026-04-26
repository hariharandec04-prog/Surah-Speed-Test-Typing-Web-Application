/* =============================================
   js/profile.js — Profile & achievements
   ============================================= */
'use strict';

const Profile = {
  pendingAvatarColor: null,

  render() {
    const user = Auth.getUser();
    if (!user) return;

    // Avatar
    const initials = ((user.fname || '')[0] + (user.lname || '')[0]).toUpperCase() || 'TQ';
    const avEl = document.getElementById('profileAvatarDisplay');
    if (avEl) {
      avEl.textContent = initials;
      avEl.style.background = AVATAR_COLORS[user.avatarColor || 0];
    }

    UI.setText('profileName',         `${user.fname || ''} ${user.lname || ''}`.trim());
    UI.setText('profileUsername',      '@' + (user.username || ''));
    UI.setText('profileEmail',         user.email || '');
    UI.setText('profileBio',           user.bio || 'No bio yet. Share your typing journey!');
    UI.setText('profileCountryBadge',  '🌍 ' + (user.country || 'Unknown'));

    const rankIdx = Math.min(Math.floor(((user.currentLevel || 1) - 1) / 30), 4);
    UI.setText('profileTitleBadge', RANK_TITLES[rankIdx]);

    this._renderStats(user);
    this._renderAchievements(user);
    this._renderScoreHistory(user);
  },

  _renderStats(user) {
    const completed = Object.keys(user.completedLevels || {}).length;
    const avgAcc    = (user.totalAcc || []).length
      ? Math.round(user.totalAcc.reduce((a, b) => a + b, 0) / user.totalAcc.length)
      : 0;
    const rank = Leaderboard.getMyRank();

    const stats = [
      { label: 'Best WPM',   value: user.bestWpm || 0,     color: 'gold',   icon: '⚡' },
      { label: 'Avg Accuracy', value: avgAcc + '%',         color: 'green',  icon: '🎯' },
      { label: 'Level',      value: user.currentLevel || 1, color: 'purple', icon: '🏅' },
      { label: 'Completed',  value: completed,              color: 'teal',   icon: '✅' },
      { label: 'Keystrokes', value: UI.fmtNum(user.keystrokes || 0), color: 'orange', icon: '⌨️' },
      { label: 'Streak',     value: (user.streak || 0) + 'd', color: 'red',  icon: '🔥' },
      { label: 'World Rank', value: rank > 0 ? '#' + rank : '#--', color: 'gold', icon: '🏆' },
      { label: 'Sessions',   value: (user.scores || []).length,  color: 'blue',   icon: '📋' },
    ];

    const grid = document.getElementById('profileStatsGrid');
    if (grid) {
      grid.innerHTML = stats.map(s => `
        <div class="stat-card">
          <div class="stat-card-icon">${s.icon}</div>
          <div class="stat-card-value ${s.color}">${s.value}</div>
          <div class="stat-card-label">${s.label}</div>
        </div>
      `).join('');
    }
  },

  _renderAchievements(user) {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map(a => {
      const earned = a.check(user);
      return `
        <div class="achievement-item ${earned ? 'earned' : ''}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>`;
    }).join('');
  },

  _renderScoreHistory(user) {
    const el = document.getElementById('scoreHistory');
    if (!el) return;
    const scores = [...(user.scores || [])].reverse().slice(0, 15);
    if (!scores.length) {
      el.innerHTML = '<p class="empty-state">No scores yet. Start playing!</p>';
      return;
    }
    const diffIcons = { easy: '🟢', medium: '🟡', hard: '🔴' };
    el.innerHTML = scores.map(s => `
      <div class="score-row">
        <span style="font-size:1.1rem">${diffIcons[s.difficulty] || '⚪'}</span>
        <span style="font-weight:600">Level ${s.levelId}</span>
        <span class="badge badge-${s.difficulty}" style="margin:0 4px">${s.difficulty}</span>
        <span style="color:var(--text-muted);font-size:0.75rem;flex:1">${new Date(s.date).toLocaleDateString()}</span>
        <span class="stat-num gold" style="font-size:0.9rem">${s.wpm} WPM</span>
        <span style="color:var(--green);margin-left:8px">${s.accuracy}%</span>
        <span style="margin-left:8px">${'⭐'.repeat(s.stars)}</span>
      </div>
    `).join('');
  },

  openEdit() {
    const user = Auth.getUser();
    if (!user) return;
    this.pendingAvatarColor = user.avatarColor || 0;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('edit-fname',    user.fname);
    set('edit-lname',    user.lname);
    set('edit-username', user.username);
    set('edit-bio',      user.bio);
    set('edit-country',  user.country);

    // Highlight current color
    document.querySelectorAll('.avatar-color-opt').forEach((el, i) => {
      el.classList.toggle('selected', i === this.pendingAvatarColor);
    });

    UI.openModal('modal-edit-profile');
  },

  selectColor(idx) {
    this.pendingAvatarColor = idx;
    document.querySelectorAll('.avatar-color-opt').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });
  },

  save() {
    const user = Auth.getUser();
    if (!user) return;

    const fname    = document.getElementById('edit-fname')?.value.trim();
    const lname    = document.getElementById('edit-lname')?.value.trim();
    const username = document.getElementById('edit-username')?.value.trim();
    const bio      = document.getElementById('edit-bio')?.value.trim();
    const country  = document.getElementById('edit-country')?.value;

    if (!fname || !username) { UI.toast('Name and username are required', 'error'); return; }
    if (username !== user.username && DB.usernameExists(username)) {
      UI.toast('Username already taken', 'error'); return;
    }

    Auth.updateUser({
      fname, lname, username, bio, country,
      avatarColor: this.pendingAvatarColor ?? user.avatarColor,
    });

    UI.updateNavAvatar(Auth.getUser());
    UI.closeModal('modal-edit-profile');
    this.render();
    UI.toast('Profile updated! 💾', 'success');
  },
};
