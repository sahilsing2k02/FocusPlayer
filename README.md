# 🧘 FocusPlayer: The Ultimate YouTube Study Companion

FocusPlayer is a premium, glassmorphic web application designed to transform your YouTube learning experience into a productive, distraction-free environment. It combines powerful focus tools, real-time analytics, and community engagement into one seamless dashboard.

#NoAds
#NoSignups
#NoDistractions

RealTime Working Link:https://focus-player-mauve.vercel.app/

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
### 4. Some Screenshots of the Projects
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1bb7d890-e744-4f5b-80b4-f1396f0298f0" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/30d2f673-a9dc-49b8-83ca-bceb4d2f719d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/15e71d18-b51c-4a5e-8f5a-6751c5ddd6bb" />
<img width="413" height="688" alt="image" src="https://github.com/user-attachments/assets/ffd3ddc7-ceb4-470c-b5f0-bb0019050328" />
<img width="1916" height="1030" alt="image" src="https://github.com/user-attachments/assets/d74181da-451e-4343-b8a9-6f46f27b32f2" />
<img width="1083" height="905" alt="image" src="https://github.com/user-attachments/assets/e336497d-d23c-4f97-8110-26e43bce092a" />

🚀 FocusTube
A distraction-free YouTube player designed for focused learning and productivity.

✨ Features
🔕 No Ads, Zero Distraction UI
⏱️ Built-in Study Timer
📊 Progress Tracking (playlist & videos)
📈 Real-Time Analytics (watch time, sessions)
🧠 Productivity Feedback & Insights
📝 Timestamp Notes (jump to exact moments)
🎯 Focus Mode (minimal UI)
🔁 Playlist Support & Auto-play
💾 Session Save

## 📜 License & Copyright
© 2026 **Sahil Singh**. All rights reserved.  
Created with ❤️ for productive students everywhere.
