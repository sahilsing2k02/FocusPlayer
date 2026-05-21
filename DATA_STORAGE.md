# 💾 Data Storage Architecture in FocusPlayer

FocusPlayer is designed to be a highly private and frictionless study companion. It operates under a **no-signup, no-accounts model** for the vast majority of its features. 

Here is a detailed breakdown of how and where your data is stored.

---

## 🖥️ Local Storage (100% Client-Side)

Most of your personal study data, including the **Task List (To-Do list)** and **Study Notes**, is stored directly in your web browser's `localStorage`. 

This data **never leaves your computer** and is completely private to your device. It remains saved even if you refresh the page or close your browser, but will be cleared if you clear your browser's site cookies/cache.

| Feature / Data | Storage Key | Location / Medium | Data Format | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Task List (To-Do List)** | `focus_todos` | `localStorage` | JSON Array | An array of tasks: `[{ id: 1716..., text: "Task name", done: false }]`. |
| **Timestamp Notes** | `timestampNotes` | `localStorage` | JSON Array | Array of notes taken at specific video timings: `[{ text: "Note...", time: "2:15", seconds: 135, videoIndex: 0, tag: "Code" }]`. |
| **Quick Thoughts** | `notes` | `localStorage` | String | Draft note content currently written in the active note text area before it is saved. |
| **Active Note Tag** | `noteTag` | `localStorage` | String | Selected category filter tag (`None`, `Important`, `Code`, or `Review`). |
| **Theme Setting** | `theme` | `localStorage` | String | Current UI mode preference (`light` or `dark`). |
| **Analytics & Streaks** | `focus_analytics` | `localStorage` | JSON Object | Stores total watch time, total videos completed, last active date stamp, current consecutive streak, and daily study durations: `{"watchTime": 1200, "streak": 3, "dailyWatchTime": {"2026-05-21": 360}}`. |

> [!TIP]
> **Data Privacy Control**: If you want to clear your local data, you can do so directly from the UI (e.g., via the *Clear All Notes* button) or by clearing your browser's cache for the FocusPlayer website.

---

## ☁️ Cloud Database (Firebase Firestore)

Only one specific feature uses cloud storage: the **Community Feedback & Discussion** board. 

When you open the **⭐ Community Feedback** modal and submit a rating or review, that information is uploaded to a shared cloud database hosted on Google Firebase Firestore.

- **Storage Collection**: `feedbacks`
- **Database Provider**: Google Firebase
- **Data Shared**:
  - `name`: User-provided name (defaults to `"Anonymous Student"` if left blank)
  - `rating`: Star rating (1 to 5 stars)
  - `message`: Text content of the comment
  - `date` & `timestamp`: Date and time the review was posted
- **Accessibility**: This feedback is public and synced in real-time, allowing any student using FocusPlayer worldwide to read your review.

> [!WARNING]
> Do not write private study notes, passwords, or personal credentials inside the **Community Feedback** modal, as this is the only section of the application where data is uploaded to a public cloud database. All other tools (To-Do lists, timestamp notes, analytics) are strictly local to your device.
