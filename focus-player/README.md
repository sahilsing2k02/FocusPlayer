# 🧘 FocusPlayer: The Ultimate YouTube Study Companion

FocusPlayer is a premium, glassmorphic web application designed to transform your YouTube learning experience into a productive, distraction-free environment. It combines powerful focus tools, real-time analytics, and community engagement into one seamless dashboard.

## 🚀 Key Features

### ⏱ Premium Focus Timer
- **Smart Sessions**: Custom study and break intervals to keep your momentum.
- **Visual Feedback**: A glowing progress ring and tabular countdown for jitter-free tracking.
- **Audio Alerts**: Subtle notifications to signal the end of a session.

### 📊 Performance Analytics
- **Watch Time tracking**: Measures exactly how much time you spend actively studying.
- **Daily Streaks**: Gamify your productivity and stay consistent.
- **Interactive Charts**: Visualize your weekly progress with a custom built-in dashboard.

### 📝 Smart Timestamp Notes
- **Contextual Learning**: Click anywhere to take a note that captures the *exact* millisecond of the video.
- **Jump-to-Seek**: Click on any previous note to instantly seek the video back to that precise moment.
- **Playlist aware**: Notes track which video in the playlist they belong to.

### 🤝 Community Feedback
- **Global Discussion**: Share your thoughts and ratings with other students worldwide.
- **Cloud Backend**: Powered by Google Firebase for real-time, global synchronization.

### 📺 Advanced Player Integration
- **oEmbed Support**: Dynamic playlist title fetching.
- **Playlist Queue**: View your entire study queue at a glance.
- **Glassmorphic UI**: Ultra-clean, modern design that minimizes visual clutter and maximizes focus.

## 🛠 Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: Pure CSS3 (Glassmorphism, Flexbox, Variable-driven design)
- **Database**: [Google Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Visualization**: [Recharts](https://recharts.org/)
- **API**: YouTube IFrame API & Noembed.com proxy

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/sahilsing2k02/FocusPlayer.git
cd FocusPlayer/focus-player
npm install
```

### 2. Configure Firebase
Create a `src/firebase.js` file with your credentials:
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of your config
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 3. Run Locally
```bash
npm run dev
```

## 📜 License
MIT License - Created with ❤️ for productive students everywhere.
