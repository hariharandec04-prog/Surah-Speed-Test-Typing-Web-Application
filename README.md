/* =============================================
   css/base.css — Reset & base typography
   ============================================= */

*, *::before, *::after {
  margin: 0; padding: 0;
  box-sizing: border-box;
}

html { scroll-behavior: smooth; font-size: 16px; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background 0.3s, color 0.3s;
  overflow-x: hidden;
  line-height: 1.6;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

/* Fonts */
h1, h2, h3 { font-family: var(--font-heading); }
.stat-num   { font-family: var(--font-mono); font-weight: 700; }

/* Links */
a { color: var(--teal); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Focus */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Selection */
::selection { background: rgba(212,168,67,0.25); }

/* Utility */
.hidden    { display: none !important; }
.invisible { visibility: hidden; }
.sr-only   { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); }

.gold   { color: var(--gold); }
.teal   { color: var(--teal); }
.green  { color: var(--green); }
.red    { color: var(--red); }
.purple { color: var(--purple); }
.blue   { color: var(--blue); }
.orange { color: var(--orange); }
.muted  { color: var(--text-muted); }

.flex-1 { flex: 1; }
.center { text-align: center; }

/* Animations */
@keyframes fadeInUp {
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; } to { opacity:1; }
}
@keyframes twinkle {
  0%,100% { opacity:0.15; transform:scale(1); }
  50%      { opacity:0.9;  transform:scale(1.6); }
}
@keyframes pulse {
  0%,100% { transform:scale(1); }
  50%      { transform:scale(1.04); }
}
@keyframes cursorBlink {
  0%,100% { background: rgba(212,168,67,0.25); }
  50%      { background: rgba(212,168,67,0.60); }
}
@keyframes shimmer {
  0%   { background-position:-400% center; }
  100% { background-position: 400% center; }
}
@keyframes slideInRight {
  from { transform:translateX(120px); opacity:0; }
  to   { transform:translateX(0); opacity:1; }
}
@keyframes slideOutRight {
  from { transform:translateX(0); opacity:1; }
  to   { transform:translateX(120px); opacity:0; }
}
@keyframes float {
  0%,100% { transform:translateY(0); }
  50%      { transform:translateY(-8px); }
}
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.fade-in-up       { animation: fadeInUp 0.6s ease both; }
.fade-in          { animation: fadeIn   0.4s ease both; }
.delay-1          { animation-delay: 0.15s; }
.delay-2          { animation-delay: 0.30s; }
.delay-3          { animation-delay: 0.45s; }
