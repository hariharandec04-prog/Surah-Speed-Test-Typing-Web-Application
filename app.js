/* =============================================
   css/variables.css — Design tokens
   ============================================= */

:root {
  /* Colors - Dark Theme (default) */
  --bg:           #050a14;
  --bg-card:      #0a1628;
  --bg-card2:     #0d1e38;
  --bg-input:     #0f2040;

  --gold:         #d4a843;
  --gold2:        #f0c060;
  --gold-glow:    rgba(212,168,67,0.35);

  --teal:         #00c8aa;
  --teal2:        #00ffdd;
  --teal-glow:    rgba(0,200,170,0.35);

  --red:          #ff4444;
  --red-glow:     rgba(255,68,68,0.35);

  --green:        #00e676;
  --green-glow:   rgba(0,230,118,0.25);

  --purple:       #9b59b6;
  --blue:         #3498db;
  --orange:       #ff7043;
  --yellow:       #ffc107;

  --text:         #e8f0ff;
  --text-muted:   #7a8ba8;
  --text-faint:   #3a4a60;

  --border:       rgba(212,168,67,0.2);
  --border-soft:  rgba(255,255,255,0.06);
  --border-hover: rgba(212,168,67,0.45);

  /* Shadows */
  --shadow-card:  0 8px 40px rgba(0,0,0,0.5);
  --shadow-gold:  0 0 24px rgba(212,168,67,0.3);
  --shadow-teal:  0 0 24px rgba(0,200,170,0.3);

  /* Typography */
  --font-heading: 'Cinzel Decorative', serif;
  --font-body:    'Rajdhani', sans-serif;
  --font-arabic:  'Noto Naskh Arabic', serif;
  --font-mono:    'Orbitron', monospace;

  /* Spacing */
  --gap-xs:  4px;
  --gap-sm:  8px;
  --gap-md:  16px;
  --gap-lg:  24px;
  --gap-xl:  40px;

  /* Radii */
  --radius-sm:  8px;
  --radius-md:  12px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  --transition-fast: all 0.15s ease;

  /* Nav */
  --nav-h: 64px;
}

/* ---- Light Theme ---- */
[data-theme="light"] {
  --bg:        #f0f4ff;
  --bg-card:   #ffffff;
  --bg-card2:  #f5f8ff;
  --bg-input:  #edf2ff;

  --gold:      #b8860b;
  --gold2:     #d4a843;
  --gold-glow: rgba(184,134,11,0.25);

  --teal:      #007a66;
  --teal2:     #009980;
  --teal-glow: rgba(0,122,102,0.25);

  --red:       #cc2222;
  --green:     #00875a;
  --purple:    #6c3483;
  --blue:      #1a6fa8;
  --orange:    #c84b1a;
  --yellow:    #a07000;

  --text:       #1a2540;
  --text-muted: #5a6a85;
  --text-faint: #bcc8d8;

  --border:       rgba(184,134,11,0.25);
  --border-soft:  rgba(0,0,0,0.07);
  --border-hover: rgba(184,134,11,0.5);

  --shadow-card: 0 4px 24px rgba(0,0,0,0.1);
}
