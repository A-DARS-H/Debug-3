# Movie Watchlist Debugging Challenge

This React + TypeScript Vite app is a working movie watchlist with a few realistic production-style bugs hidden in the interaction flow. The app should compile, run, and look normal at first glance.

## Project Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Features

- Display movie cards
- Search movies by title
- Filter movies by genre
- Sort movies by rating or year
- Add and remove movies from the watchlist
- Mark movies as watched or unwatched
- Add a new movie using a form
- Delete a movie
- Reset filters
- Show movie statistics
- Persist movie state in the browser

## Debugging Objectives

Find and explain three bugs:

- A derived state synchronization bug
- A memoization or callback-related bug
- An async persistence bug

Each bug appears only after interacting with the app. The goal is to investigate symptoms, form hypotheses, inspect state changes, and identify the root cause.

## Recommended Debugging Tools

- Chrome DevTools Console
- React DevTools Components tab
- React DevTools Profiler
- Breakpoints in event handlers and effects
- Console logging around state transitions
- Browser Application tab for localStorage

## Small Hints

- Compare visible movie cards with the statistics after several operations.
- Try adding more than one movie before interacting with the new cards.
- Make several quick changes, then inspect saved browser state.
- Watch how state differs between what React renders and what the browser persists.
