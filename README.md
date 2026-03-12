<p align="center">
  <img src="https://github.com/user-attachments/assets/52f49a77-db2a-4e30-9fb0-c850c3a6aea3" alt="OwnYourFeed" width="80" />
</p>

<h1 align="center">OwnYourFeed</h1>

<p align="center">
  <strong>Take control of your YouTube feed. Replace distractions with content that actually grows you.</strong>
</p>

<p align="center">
  <a href="https://github.com/nishhhannt27/ownyourfeed/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" /></a>
  <a href="#"><img src="https://img.shields.io/badge/manifest-v3-blue.svg" alt="Manifest V3" /></a>
  <a href="#"><img src="https://img.shields.io/badge/chrome-%2F%20brave-%2F%20edge-orange.svg" alt="Chrome / Brave / Edge" /></a>
  <a href="#"><img src="https://img.shields.io/badge/zero-data%20collection-brightgreen.svg" alt="Zero Data Collection" /></a>
</p>

---

## What It Does

OwnYourFeed is a browser extension that **completely replaces** YouTube's algorithm-driven feed with a curated, focused feed based on topics **you** choose.

- **Hides all distracting recommendations** — homepage, sidebar, shorts, end screens — gone
- **Replaces them with real YouTube videos** on topics you care about (with real thumbnails, titles, view counts)
- **Infinite scroll** — never runs out of content. The algorithm rotates through 150+ search queries
- **Motivational stats & phrases** on every card — "🔥 4,200+ people leveled up watching this"
- **Hustle quotes** on the watch page — a new one every time you click a video
- **Fully customizable** — swap the topics to anything you want in 3 minutes (see below)

### Default Categories

| Category | Topics | Examples |
|---|---|---|
| 🧠 Growth Mindset | ~40 queries | Atomic Habits, discipline, stoicism, productivity, learning techniques |
| 💻 Coding | ~50 queries | Python, JavaScript, React, system design, Docker, DSA, career |
| 🛡️ CompTIA & IT | ~40 queries | A+, Network+, Security+, career paths, ethical hacking, home labs |

> **But you can change these to literally anything** — finance, stocks, geopolitics, fitness, music production, design — whatever fuels your growth.

---

## Screenshots
<img width="1904" height="1027" alt="sshot1_before" src="https://github.com/user-attachments/assets/36e7ffe5-8653-461b-8110-72ac76920f19" />
All distracting recommendations without OwnYourFeed.
<br><br>
<img width="1915" height="1031" alt="sshot2_after" src="https://github.com/user-attachments/assets/260d6fe6-6b7b-4702-b278-7788621af7c7" />
As soon as you turn on OwnYourFeed it starts its magic of just showing you what you need to see with 0 distractions.
<br><br>
<img width="1180" height="747" alt="sshot3_divides pageintotopics" src="https://github.com/user-attachments/assets/1ad46b92-7b11-4228-b017-d0bc8576e79a" />
Subdivides each topic and scrapes the best video from the algorithm.
<br><br>


---

## Install

### From Chrome Web Store

<!-- [Install OwnYourFeed](https://chrome.google.com/webstore/detail/nishhhannt27) -->

Coming soon.

### Manual Install (Chrome / Brave / Edge)

1. **Download** this repo — click the green **Code** button → **Download ZIP**
2. **Unzip** the folder somewhere permanent (don't delete it after)
3. Go to `chrome://extensions` (or `brave://extensions` or `edge://extensions`)
4. Turn on **Developer mode** (top-right toggle)
5. Click **"Load unpacked"**
6. Select the unzipped folder (the one with `manifest.json` in it)
7. Open YouTube — you're in control now

> **Tip:** After installing, do a hard refresh on YouTube: `Ctrl + Shift + R`

---

## Customize Your Feed (3 Steps)

This is the best part. **You can make OwnYourFeed about anything.**

Want finance, stocks, and geopolitics? Gaming and 3D art? Cooking and fitness? It takes 3 minutes.

### Step 1: Open `content.js`

Find the `QUERIES` object (around line 30). It looks like this:

```javascript
const QUERIES = {
  growth: [
    "growth mindset motivation",
    "atomic habits summary",
    // ... more queries
  ],
  coding: [
    "python tutorial for beginners 2025",
    // ... more queries
  ],
  comptia: [
    "comptia a+ full course 2025",
    // ... more queries
  ],
};
```

### Step 2: Change the topics

**Option A — Do it yourself:**

Replace the category names and queries with your own interests:

```javascript
const QUERIES = {
  finance: [
    "stock market investing for beginners",
    "how to read financial statements",
    "warren buffett investing strategy",
    "index fund vs ETF explained",
    // add as many as you want — more queries = more variety
  ],
  geopolitics: [
    "geopolitics explained",
    "world economics explained",
    "international relations basics",
    // ...
  ],
  fitness: [
    "beginner strength training program",
    "progressive overload explained",
    // ...
  ],
};
```

Then update `CAT_META` right below it:

```javascript
const CAT_META = {
  finance:     { label: "Finance",     emoji: "💰", color: "#10b981" },
  geopolitics: { label: "Geopolitics", emoji: "🌍", color: "#3b82f6" },
  fitness:     { label: "Fitness",     emoji: "💪", color: "#f59e0b" },
};
```

**Option B — Use AI (easiest):**

1. Copy the entire `content.js` file
2. Paste it into ChatGPT or Claude
3. Say: *"Change the categories and queries to: finance, stocks, and geopolitics. Keep everything else the same. Give me 40+ queries per category."*
4. Copy the result back into `content.js`
5. Reload the extension in `chrome://extensions`

That's it. **You only ever edit `content.js`.** Nothing else needs to change.

### Step 3: Reload

Go to `chrome://extensions` → click the refresh icon on OwnYourFeed → hard refresh YouTube.

---

## How It Works

The extension uses three layers:

1. **content.js** — Runs on YouTube pages. Hides the original feed, injects the curated feed with TrustedTypes support, handles infinite scroll
2. **background.js** — Service worker that fetches YouTube search results (content scripts can't do this due to CORS)
3. **popup.html/js** — Extension popup for toggling categories on/off

### The Algorithm

- **150+ search queries** across 3 categories, each returning up to 8 real videos
- **Smart rotation** — tracks which queries have been used, picks unused ones first
- **Global deduplication** — never shows the same video twice
- **Infinite scroll** — when you reach the bottom, it automatically fetches the next batch using fresh queries
- **When all queries are used up** — resets and starts over (YouTube returns different results each time)
- **Motivational quotes** injected between scroll batches to keep you focused

### Why It Works on YouTube (Technical)

YouTube uses **Trusted Types** which blocks normal `innerHTML` assignments. OwnYourFeed creates a Trusted Types policy to inject content safely. The extension also hides the entire `ytd-browse` element (not individual items) because YouTube's SPA re-renders individual items dynamically.

---

## File Structure

```
ownyourfeed/
├── manifest.json      # Extension config (permissions, scripts)
├── background.js      # Service worker (fetches YouTube search results)
├── content.js         # ⚡ Main script — THIS IS THE FILE YOU CUSTOMIZE
├── content.css        # Styles (cards, grid, quotes, animations)
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic (toggle categories)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## FAQ

**Q: Does this collect any data?**
No. Zero data collection. Everything runs locally in your browser. No analytics, no tracking, no servers.

**Q: Does this work on Brave / Edge?**
Yes. Any Chromium-based browser that supports Manifest V3.

**Q: Can I have more than 3 categories?**
Yes! Add as many as you want in the `QUERIES` and `CAT_META` objects. The grid, scroll, and algorithm adapt automatically.

**Q: Will YouTube ban me for using this?**
No. The extension only hides/shows DOM elements and fetches public YouTube search pages. It doesn't violate any YouTube terms.

**Q: The feed shows "Could not load videos"**
Try a hard refresh (`Ctrl+Shift+R`). If it persists, check that the extension has permissions for youtube.com in your browser's extension settings.

---

## Contributing

Contributions are welcome! Some ideas:

- **More default query packs** — submit a PR with a themed `content.js` (fitness, design, music, etc.)
- **Better UI/UX** — improve the card design, animations, or layout
- **Firefox support** — port to Manifest V2 for Firefox
- **Category presets** — a dropdown in the popup to switch between topic packs

---

## License

MIT — do whatever you want with it. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Stop letting the algorithm control you. Own your feed.</strong>
</p>
