# Surah Speed Test – Typing Web Application

A responsive single-page typing application for testing and improving
your typing speed using Quranic Surahs.

## Features
- 5+ progressive difficulty levels
- Real-time WPM & accuracy tracking
- Under 50ms keystroke response time
- Backend-free authentication via EmailJS
- Persistent leaderboard & session tracking via LocalStorage

## Tech Stack
HTML5 · CSS3 · JavaScript (ES6) · EmailJS API · LocalStorage

## Setup
1. Clone the repo
```bash
   git clone https://github.com/your-username/surah-speed-test.git
```
2. Add your EmailJS credentials in `config.js`
```js
   emailjs.init("YOUR_PUBLIC_KEY");
```
3. Open `index.html` in your browser

## Usage
- Register/login with email verification
- Select a difficulty level
- Start typing and track your WPM
- View leaderboard and personal progress

## License
MIT
