# Gary Wild The Great — Project Map & Setup Guide

## Folder Structure

```
GaryWild/
│
├── index.html                          ← App entry point (do not edit)
├── package.json                        ← Dependencies (React, Vite, Zustand)
├── vite.config.js                      ← Dev server config (runs on port 3000)
│
├── public/
│   └── assets/
│       ├── images/                     ← Drop your cover photo and any static images here
│       ├── audio/                      ← Optional: static audio files
│       └── video/                      ← Optional: static video files
│
└── src/
    │
    ├── main.jsx                        ← React bootstrapper (do not edit)
    ├── App.jsx                         ← Router — maps URLs to pages
    │
    ├── styles/
    │   └── global.css                  ← CSS variables, fonts, shared button/input styles
    │
    ├── store/
    │   └── bookStore.js                ← ALL book data lives here (Zustand + localStorage)
    │                                      Chapters, pages, media library, dedication, cover
    │
    ├── utils/
    │   ├── aiClient.js                 ← All Anthropic API calls (format text, mascot, titles)
    │   └── exportBook.js               ← HTML and JSON export functions
    │
    ├── hooks/
    │   └── useRecorder.js              ← Audio + video recording (MediaRecorder API)
    │                                      useAudioRecorder() / useVideoRecorder()
    │
    ├── pages/                          ← One file per screen
    │   ├── HomePage.jsx + .css         ← Cover page (title, portrait, Enter button)
    │   ├── ContentsPage.jsx + .css     ← Table of contents (auto-updates with chapters)
    │   ├── ReaderPage.jsx + .css       ← Book reader (parchment pages, turn buttons, edit)
    │   ├── StudioPage.jsx + .css       ← Write studio (upload / live audio / live video)
    │   └── AdminPage.jsx + .css        ← Admin shell with sidebar navigation
    │
    └── components/
        │
        ├── shared/                     ← Used on every page
        │   ├── NavBar.jsx + .css       ← Top navigation bar
        │   ├── Toast.jsx               ← Pop-up notification (no CSS — uses global)
        │   ├── AiMascot.jsx + .css     ← 🦁 Wilde AI chat bubble (bottom right)
        │
        ├── reader/
        │   ├── EditPageModal.jsx       ← Inline page editor (opens from Read screen)
        │   └── EditPageModal.css
        │
        └── admin/
            ├── Admin.css               ← Shared CSS for all admin panels
            ├── AdminChapters.jsx       ← Add / rename / delete chapters
            ├── AdminPages.jsx          ← View / edit / delete individual pages
            ├── AdminMedia.jsx          ← Upload images, audio; add video/SoundCloud links
            ├── AdminDedication.jsx     ← Edit the dedication page
            └── AdminExport.jsx         ← Download as HTML or JSON
```

---

## Setup Instructions (one time)

1. Make sure you have **Node.js** installed (v18 or newer).
   Download from: https://nodejs.org

2. Open a terminal and `cd` into your GaryWild folder:
   ```
   cd /path/to/GaryWild
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser to: **http://localhost:3000**

---

## How Your Book Data is Saved

- Everything is automatically saved to your browser's **localStorage**
- This means your chapters survive page refreshes and browser restarts
- To back up your work: go to **Admin → Export → Download as JSON**
- To publish online: go to **Admin → Export → Download as HTML**

---

## How to Add Your Cover Photo

Drop any image file into: `public/assets/images/`
Then on the home/cover screen click the circular portrait frame to upload it live.

---

## Key URLs When Running

| URL                        | What it is              |
|----------------------------|-------------------------|
| http://localhost:3000/     | Cover / Home page       |
| http://localhost:3000/contents | Table of contents   |
| http://localhost:3000/reader   | Book reader         |
| http://localhost:3000/studio   | Write / record      |
| http://localhost:3000/admin    | Admin panel         |

---

## Adding a Real Speech-to-Text Service (Optional)

The studio records audio and video, but auto-transcription (audio → text)
requires a third-party API. When you're ready, add to `src/utils/aiClient.js`:

- **OpenAI Whisper** — https://platform.openai.com/docs/guides/speech-to-text
- **AssemblyAI** — https://www.assemblyai.com
- **Deepgram** — https://deepgram.com

---

## Build for Production (Publishing Online)

```
npm run build
```

This creates a `dist/` folder. Upload its contents to any static host:
- Netlify (free): drag & drop the dist folder at netlify.com
- Vercel (free): `npx vercel` in the project folder
- GitHub Pages, Cloudflare Pages, etc.
