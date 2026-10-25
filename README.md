<div align="center">

# 🧘 FocusPlayer

**The Ultimate Distraction-Free YouTube Study Companion & Productivity Suite**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://focus-player-mauve.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license--author)

**[🌐 Open Live App](https://focus-player-mauve.vercel.app/)** • **[🐙 GitHub Repository](https://github.com/sahilsing2k02/FocusPlayer)** • **[🐛 Report an Issue](https://github.com/sahilsing2k02/FocusPlayer/issues)**

</div>

---

## 🌟 Why FocusPlayer?

YouTube hosts world-class educational lectures, courses, and tutorials, but its recommendation algorithms, sidebars, clickbait feeds, and comment sections are engineered to fragment attention.

**FocusPlayer** removes every distraction and turns any YouTube playlist or video into an intentional study dashboard. It pairs a distraction-free player with integrated productivity tools: smart Pomodoro sessions, timestamped notes with one-click PDF export, daily streak analytics, task management, and ambient soundscapes — **all with zero signups or ads**.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔕 **Distraction-Free Playback** | Clean player interface with no algorithmic feed, sidebar rabbit holes, or video ads. Automatically saves and restores your playlist queue and playback timestamp across refreshes. |
| ⏱️ **Focus Pomodoro Timer** | Configurable study and break cycles with sound alerts and an unobtrusive oval status badge in the header during active sessions. |
| 📝 **Timestamped Notes** | Take notes tied to exact video timestamps. Click any saved timestamp chip to instantly seek to that moment in the video. Categorize notes with color-coded tags (`Important`, `Code`, `Review`). |
| 📄 **One-Click PDF Export** | Download your study notes as an organized, paginated PDF with automatic line-wrapping powered by `jsPDF`. |
| 📊 **Productivity Analytics** | Monitor active watch time, completed videos, and daily streaks with weekly interactive bar charts powered by `Recharts`. |
| ✅ **Persistent To-Do List** | Integrated task manager with custom checkboxes to set and check off study milestones. |
| 🌧️ **Ambient Focus Audio** | Built-in rain noise generator with volume controls to drown out background noise and maintain focus. |
| 🌓 **Glassmorphic UI & Themes** | Sleek frosted glass aesthetics with dynamic Light and Dark mode toggles and zero-flash initial loading. |
| 💬 **Community Feedback** | Share ratings and discuss study sessions anonymously in real-time via Google Firebase Firestore. |

---

## 📸 Screenshots

<div align="center">

### Distraction-Free Study Dashboard
<img width="950" alt="FocusPlayer Dashboard" src="https://github.com/user-attachments/assets/1bb7d890-e744-4f5b-80b4-f1396f0298f0" />

### Timestamped Notes & Playlist Queue
<img width="950" alt="Study Notes and Playlist Queue" src="https://github.com/user-attachments/assets/30d2f673-a9dc-49b8-83ca-bceb4d2f719d" />

### Weekly Analytics & Study Streaks
<img width="950" alt="Analytics Dashboard" src="https://github.com/user-attachments/assets/15e71d18-b51c-4a5e-8f5a-6751c5ddd6bb" />

<p align="center">
  <img width="48%" alt="Ambient Sounds & Tools" src="https://github.com/user-attachments/assets/d74181da-451e-4343-b8a9-6f46f27b32f2" />
  <img width="48%" alt="Community Feedback Board" src="https://github.com/user-attachments/assets/e336497d-d23c-4f97-8110-26e43bce092a" />
</p>

</div>

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: Pure CSS3 (Glassmorphism, CSS Custom Properties, Responsive Layouts)
- **Database**: [Google Firebase Firestore](https://firebase.google.com/) (real-time feedback & anonymous multi-device state syncing)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **APIs**: YouTube IFrame API & Noembed.com proxy (metadata fetching)
- **Hosting**: [Vercel](https://vercel.com/)

---

## 💾 Data & Privacy Architecture

FocusPlayer adopts a **privacy-first, client-centric hybrid architecture**:

- **Local Storage (100% Client-Side)**: Your tasks, notes, watch time analytics, active playlist, and UI theme preferences are stored locally in your browser (`localStorage`).
- **Anonymous Cloud Sync**: A persistent client ID allows anonymous syncing of public feedback and opt-in settings through Firebase Firestore without asking for passwords or emails.
- **Detailed Specifications**: See [DATA_STORAGE.md](file:///c:/Users/sahil/OneDrive/Desktop/FocusPlayer/DATA_STORAGE.md) and [Focus Player README.md](file:///c:/Users/sahil/OneDrive/Desktop/FocusPlayer/Focus%20Player%20README.md) for full architectural breakdowns and data models.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and `npm` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sahilsing2k02/FocusPlayer.git
   cd FocusPlayer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 💡 How to Use FocusPlayer

1. **Load a Playlist / Video**: Paste any YouTube playlist or video URL into the top search input and click **Load**.
2. **Take Timestamped Notes**: While studying, jot down notes in the notes section. FocusPlayer automatically attaches the video's current timestamp and your selected category tag (`Important`, `Code`, `Review`).
3. **Seek via Notes**: Click any saved timestamp chip to instantly jump the video to that moment.
4. **Export Notes**: Click **Export as PDF** to generate and download a clean summary document of all your timestamped notes.
5. **Track Consistency**: Open the **Analytics** modal to check your 7-day watch time charts, completed video count, and daily streak.
6. **Ambient Sound**: Toggle rain audio in the tools sidebar and set your desired volume to stay in the zone.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License & Author

Distributed under the MIT License.

Created with ❤️ by **[Sahil Singh](https://github.com/sahilsing2k02)**  
- GitHub: [@sahilsing2k02](https://github.com/sahilsing2k02)  
- Live Project: [https://focus-player-mauve.vercel.app/](https://focus-player-mauve.vercel.app/)
