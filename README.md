# Gene Paul Mar Javier Portfolio

A multi-year portfolio platform built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Three.js, Zustand, and next-intl.

This repository has evolved far beyond the original single-page portfolio. It now contains multiple yearly portfolio experiences, each with its own presentation style, interaction model, and feature set.

## Overview

The app currently includes these public year experiences:

- `2024`: the classic portfolio focused on profile, projects, skills, resume, and contact.
- `2025`: a more cinematic visual refresh with a darker presentation.
- `2026`: a macOS-inspired interactive desktop with draggable windows, dock, terminal, chat, settings, and built-in games.
- `2027`: a coming-soon preview for the next version.

The root route automatically redirects to the latest enabled year.

## Main Features

- Next.js App Router architecture.
- React 19 and strict TypeScript.
- Multi-year navigation system driven by a shared year config.
- Fully interactive `2026` desktop experience.
- Responsive desktop and mobile layouts.
- Localization support for English, Japanese, Filipino, and Cebuano.
- Persistent settings using Zustand.
- Theme, color, and font customization.
- Three.js and animated visual effects.
- Game windows with persistent high scores.
- SEO assets including manifest and favicon setup.

## 2026 Desktop Experience

The `2026` portfolio is the most advanced part of the project. It includes:

- Menu bar, dock, desktop icons, draggable windows, and window controls.
- About, Projects, Skills, Resume, Contact, Books, Testimonials, Settings, Terminal, and Chat windows.
- Mobile-specific version of the experience.
- Intro splash and fullscreen recommendation flow.
- Mini games:
  - GPM Snake
  - GPM Tetris
  - GPM Jump
  - Tower of GPM
  - Bomber GPM
- Local leaderboard persistence for supported games.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- next-intl
- Three.js
- React Three Fiber
- Radix UI primitives
- Zod
- Axios
- Vercel Analytics
- Vercel Speed Insights

## Project Structure

- `src/app`: App Router pages, layouts, metadata, sitemap, and route entry points.
- `src/components/2024`, `src/components/2025`, `src/components/2026`, `src/components/2027`: year-specific UI systems.
- `src/config/years.ts`: source of truth for enabled years and default redirect.
- `src/i18n`: translation setup and locale message files.
- `src/stores`: Zustand stores for settings, language, UI state, and game high scores.
- `public`: favicons, wallpapers, logos, textures, and static assets.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/javiergenepaul/my-portfolio.git
cd my-portfolio
```

Install dependencies:

```bash
pnpm install
```

Create your local environment file if needed:

```bash
cp .env.local.example .env.local
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `pnpm dev`: start the Next.js development server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production server.
- `pnpm lint`: run ESLint with Next.js rules.
- `pnpm typecheck`: run TypeScript without emitting files.
- `pnpm format`: format the repository with Prettier.
- `pnpm format:check`: verify formatting.

## Localization

The project currently supports:

- English
- Japanese
- Filipino
- Cebuano

Locale files are stored in `src/i18n/locale` and are used across the portfolio experiences, including the `2026` desktop windows and games.

## Game Data

The `2026` games store high scores in browser local storage. That includes persistent score saving for supported titles and difficulty-specific leaderboards where applicable.

## Deployment

This project follows the normal Next.js production workflow and is suitable for deployment on Vercel.

Typical production flow:

```bash
pnpm build
pnpm start
```

## Notes

- This repository is no longer Vite-based. The current app runs on Next.js.
- The latest enabled year is configured in `src/config/years.ts`.
- The `2026` experience contains the most custom interaction logic in the codebase.
