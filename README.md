# 🏋️ Isaac's Gym Tracker

A mobile-first workout tracker PWA built with Next.js 14, Tailwind CSS, and TypeScript. Designed to be used at the gym between sets.

## Features

- **5-day program** — 3 core + 2 optional days with full exercise details
- **Set tracking** — Tap to check off sets as you complete them
- **Weight logging** — Track weights per exercise across 4 weeks
- **Week selector** — Switch between Week 1-4 with phase labels
- **Rest timer** — Quick-access countdown timer with haptic feedback
- **Progress tracking** — Per-day and per-week completion percentages
- **PWA ready** — Add to home screen for native app feel
- **100% offline** — All data stored in localStorage, no backend needed
- **Dark theme** — Easy on the eyes in any gym lighting

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone (same WiFi network).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Click Deploy — zero config needed

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Add to Home Screen (iPhone)

1. Open the deployed URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. The app runs fullscreen like a native app

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icons
- **localStorage** — Client-side persistence (no database needed)

## Customizing the Program

Edit `lib/program-data.ts` to modify exercises, sets, reps, or add new days. The UI adapts automatically.

## Project Structure

```
├── app/
│   ├── globals.css          # Tailwind + custom styles
│   ├── layout.tsx           # Root layout + PWA metadata
│   └── page.tsx             # Main page with navigation
├── components/
│   ├── dashboard.tsx        # Home screen with day cards
│   ├── exercise-card.tsx    # Exercise with set checkboxes
│   ├── rest-timer.tsx       # Sticky rest timer
│   ├── weight-log.tsx       # Weight tracking grid
│   └── workout-day.tsx      # Full workout day view
├── lib/
│   ├── hooks.ts             # localStorage hooks + timer
│   └── program-data.ts      # All program data
└── public/
    └── manifest.json        # PWA manifest
```
