# TypeQuest — The Quran Typing Arena 🕌⌨️

> Master Quranic transliteration through 150 progressive typing levels. Compete globally, track your WPM, and improve your accuracy.

![TypeQuest Screenshot](assets/screenshot.png)

## 🌟 Features

- **150 Levels** across 10 Surahs with progressive difficulty
- **3 Difficulty modes** per level — Easy (90s), Medium (60s), Hard (30s)
- **30 Questions** per level from authentic Quranic transliterations
- **Real-time WPM & Accuracy** tracking with sub-50ms keystroke response
- **Timer ring** with visual color feedback (green → yellow → red)
- **⏸ Pause / 🔄 Restart / ⏹ Stop** controls during gameplay
- **Star ratings** (1–3 ⭐) per level per difficulty
- **World Leaderboard** (global rankings)
- **Personal score history** and statistics
- **20 Achievements** to unlock
- **Profile editor** with avatar colors and bio
- **🌙 Dark / ☀️ Light mode** toggle
- **Fully responsive** — works on mobile, tablet, and desktop
- **No server required** — runs entirely in the browser via LocalStorage

---

## 🚀 Live Demo

👉 **[Play on GitHub Pages](https://yourusername.github.io/typequest)**

---

## 📁 Project Structure

```
typequest/
├── index.html              # Main HTML (all screens)
├── css/
│   ├── variables.css       # Design tokens & theme vars
│   ├── base.css            # Reset, typography, animations
│   ├── components.css      # Buttons, cards, badges, modals
│   ├── layout.css          # Nav, screens, dashboard, profile
│   ├── game.css            # Game screen & typing display
│   └── responsive.css      # Mobile breakpoints
├── js/
│   ├── data.js             # Quran verses, levels, achievements
│   ├── db.js               # LocalStorage database layer
│   ├── auth.js             # Sign in / sign up / session
│   ├── game.js             # Game engine (timer, WPM, input)
│   ├── ui.js               # UI helpers, toast, theme, stars
│   ├── leaderboard.js      # Leaderboard rendering & ranking
│   ├── profile.js          # Profile & achievements
│   └── app.js              # Main controller & event bindings
└── assets/
    └── favicon.svg
```

---

## 🔧 Running Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/typequest.git
cd typequest

# Option 1: Open directly
open index.html

# Option 2: Serve with any static server
npx serve .
# or
python3 -m http.server 3000
```

No build step, no dependencies, no Node.js required.

---

## 🌐 Deploy to GitHub Pages

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit — TypeQuest"
git remote add origin https://github.com/yourusername/typequest.git
git push -u origin main
```

2. Go to **Settings → Pages → Source → main branch / root**
3. Your site will be live at `https://yourusername.github.io/typequest`

---

## 🗄️ Database

TypeQuest uses **LocalStorage** as its database — no backend required.

| Data | Key | Description |
|------|-----|-------------|
| Users | `tq_users` | All registered accounts |
| Session | `tq_currentUser` | Currently logged-in user ID |
| Theme | `tq_theme` | dark / light preference |

**Each user object contains:**
- Profile: name, username, email, country, bio, avatarColor
- Progress: currentLevel, completedLevels (levelId_difficulty → stars)
- Stats: scores[], bestWpm, totalAcc[], keystrokes, streak
- Timestamps: joined, lastPlay, lastPlayDate

### Upgrading to a Real Database

To add multiplayer with real shared leaderboard, replace `js/db.js` with Firebase:

```bash
npm install firebase
```

```js
// js/db.js — Firebase version
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const app = initializeApp({ /* your config */ });
const db  = getFirestore(app);
// Replace DB.saveUser / DB.getUser with Firestore calls
```

---

## 🎮 How to Play

1. **Sign up** or use the Demo account
2. Go to **Levels** and pick any unlocked level
3. Choose **Easy**, **Medium**, or **Hard** difficulty
4. **Type the transliterated Quranic text** shown on screen
5. The timer starts on your first keystroke
6. Complete all **30 questions** to finish the level
7. Earn **1–3 stars** based on accuracy and completion
8. Unlock the next level and climb the **world leaderboard**!

### Controls
| Key | Action |
|-----|--------|
| Start typing | Begins the timer |
| ⏸ Pause | Pauses the timer |
| 🔄 Restart | Restarts current level |
| ⏹ Stop | Returns to level map |
| Tab | Disabled (no switching) |
| Escape | Closes open modals |

---

## 📊 Scoring & Stars

| Stars | Criteria |
|-------|----------|
| ⭐    | Complete the level |
| ⭐⭐  | 80%+ accuracy, 18+ correct questions |
| ⭐⭐⭐ | 95%+ accuracy, 25+ correct questions |

WPM is calculated as: `(characters typed / 5) / minutes elapsed`

---

## 🏆 Achievements (20 total)

| Achievement | Condition |
|-------------|-----------|
| First Keystroke | Complete any question |
| Speed Demon | Reach 50 WPM |
| Centurion | Reach 100 WPM |
| On Fire | 3-day streak |
| Week Warrior | 7-day streak |
| Scholar | Reach Level 50 |
| Hafiz | Reach Level 100 |
| Grand Master | Complete all 150 levels |
| ... and 12 more! | |

---

## 🙏 Credits

- Quranic content from authentic Islamic sources
- Fonts: [Cinzel Decorative](https://fonts.google.com/specimen/Cinzel+Decorative), [Rajdhani](https://fonts.google.com/specimen/Rajdhani), [Noto Naskh Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic), [Orbitron](https://fonts.google.com/specimen/Orbitron)
- Built with pure HTML5, CSS3, JavaScript (ES6+)

---

## 📄 License

MIT License — free to use, modify, and distribute.
