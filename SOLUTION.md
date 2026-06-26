# Movie Watchlist Debugging Challenge Solution

## Bug 1: Watchlist Count Drifts After Deletions

## Affected Files

- `src/App.tsx`

## Expected Behavior

When a movie is deleted, all UI derived from the movie collection should update together. If a movie was in the watchlist, deleting it should also reduce the watchlist count.

## Actual Behavior

After deleting a movie that is in the watchlist, the movie card disappears, but the watchlist statistic can remain too high.

## Steps to Reproduce

1. Open the app.
2. Add any visible movie to the watchlist, or choose one already in the watchlist.
3. Delete that movie.
4. Compare the visible cards with the watchlist count.

## Root Cause

The app stores watchlist membership twice: once on each movie as `inWatchlist`, and again in a separate `watchlistIds` state array. The delete handler removes the movie from `movies`, but it does not remove the same id from `watchlistIds`. The statistics use `watchlistIds.length`, so the count can drift away from the actual movie data.

## How to Find It

Use React DevTools Components tab to inspect `App` state after deleting a watchlisted movie. You will see that `movies` no longer contains the deleted movie, but `watchlistIds` still contains the deleted id. Console logs in `deleteMovie` and the stats calculation also make the mismatch visible.

Helpful tools:

- Components tab
- Console logs
- Breakpoints in `deleteMovie`
- Profiler to confirm the stats component re-renders with stale derived data

## Correct Solution

Do not duplicate derived watchlist state. Compute the watchlist count directly from `movies`, or update both pieces of state together every time a movie is removed. The cleaner fix is to remove `watchlistIds` entirely.

## Code Before

```tsx
const [watchlistIds, setWatchlistIds] = useState<number[]>(
  () => readStoredMovies().filter((movie) => movie.inWatchlist).map((movie) => movie.id),
)

const watchlistCount = watchlistIds.length

const deleteMovie = useCallback((movieId: number) => {
  setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId))
}, [])
```

## Code After

```tsx
const watchlistCount = movies.filter((movie) => movie.inWatchlist).length

const deleteMovie = useCallback((movieId: number) => {
  setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId))
}, [])
```

## Why the Fix Works

The statistic is derived from the single source of truth: `movies`. Deleting, toggling, loading, and adding movies all update one data structure, so the count cannot become stale through missed synchronization.

## Bug 2: New Movies Reuse the Same Id

## Affected Files

- `src/App.tsx`

## Expected Behavior

Every newly added movie should receive a unique id. Toggling or deleting one newly added movie should affect only that movie.

## Actual Behavior

After adding more than one movie, the new movies can share the same id. Toggling watchlist, toggling watched, or deleting one of those cards can affect multiple newly added movies.

## Steps to Reproduce

1. Open the app.
2. Add a new movie.
3. Add a second new movie.
4. Click watched, watchlist, or delete on one of the newly added cards.
5. Notice that another newly added card may change or disappear too.

## Root Cause

`nextMovieId` is memoized once from the initial mock data length. Because the memoized value never changes, every movie added during the session receives the same id.

## How to Find It

Use React DevTools Components tab to inspect the `movies` array after adding two movies. Both new objects have the same `id`. You can also set a breakpoint in `addMovie` and watch `nextMovieId`; it stays frozen across submissions.

Helpful tools:

- Components tab
- Breakpoints in `addMovie`
- Console logs around newly created movie objects
- Profiler to notice multiple rows changing from one interaction

## Correct Solution

Generate a unique id for each new movie. A `useRef` counter works well for this app because it can be incremented without causing extra renders.

## Code Before

```tsx
const nextMovieId = useMemo(() => initialMovies.length + 1, [])

const addMovie = useCallback((movie: NewMovie) => {
  const newMovie: Movie = {
    ...movie,
    id: nextMovieId,
    watched: false,
    inWatchlist: false,
  }

  setMovies((currentMovies) => [newMovie, ...currentMovies])
}, [nextMovieId])
```

## Code After

```tsx
const nextMovieId = useRef(initialMovies.length + 1)

const addMovie = useCallback((movie: NewMovie) => {
  const newMovie: Movie = {
    ...movie,
    id: nextMovieId.current,
    watched: false,
    inWatchlist: false,
  }

  nextMovieId.current += 1
  setMovies((currentMovies) => [newMovie, ...currentMovies])
}, [])
```

## Why the Fix Works

The ref stores mutable data that survives renders. Each call to `addMovie` reads the current id and increments it before the next add, so every movie gets a distinct identifier.

## Bug 3: Older localStorage Saves Overwrite Newer State

## Affected Files

- `src/App.tsx`

## Expected Behavior

The browser should persist the latest movie state. After making changes and refreshing, the app should restore the most recent UI state.

## Actual Behavior

If several changes happen quickly, an older snapshot can write to localStorage after a newer snapshot. Refreshing the app may bring back deleted movies or restore an older watched/watchlist state.

## Steps to Reproduce

1. Open DevTools and go to the Application tab.
2. Clear the app's localStorage entry.
3. Toggle a movie, then quickly toggle another movie or delete a movie.
4. Watch the localStorage value change over the next second.
5. Refresh the page and compare the restored state with the last visible UI state.

## Root Cause

Every `movies` change schedules a delayed localStorage write. The effect does not cancel previous pending timeouts. Because different saves use different delays, an older snapshot can finish after a newer one and overwrite it.

## How to Find It

Use the Application tab to observe localStorage changing after the UI has already settled. Add console logs inside the save timeout with the save order and movie titles. Breakpoints in the persistence effect show that multiple pending callbacks exist at the same time.

Helpful tools:

- Application tab
- Console
- Breakpoints in the save effect
- Console logs with save order and timestamps
- React DevTools Components tab to compare React state with persisted state

## Correct Solution

Cancel pending async saves when a newer state arrives, or save synchronously for this small app. If using a delayed save, return a cleanup function from the effect.

## Code Before

```tsx
useEffect(() => {
  saveOrderRef.current += 1
  const saveOrder = saveOrderRef.current
  const delay = saveOrder % 2 === 0 ? 700 : 140

  window.setTimeout(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(movies))
  }, delay)
}, [movies])
```

## Code After

```tsx
useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(movies))
  }, 140)

  return () => {
    window.clearTimeout(timeoutId)
  }
}, [movies])
```

## Why the Fix Works

React runs the previous effect cleanup before running the next effect. Clearing the old timeout prevents outdated snapshots from writing after newer state has already been saved.

## Debugging Walkthrough

### Bug 1: Watchlist Count Drifts After Deletions

Start with the symptom: a movie card disappears, but the watchlist count does not match what is visible. The first hypothesis should be that either the stats calculation is wrong or it is using a different source of truth than the cards.

Open React DevTools Components tab and inspect `App`. Look at the state values after deleting a movie that was in the watchlist. The important evidence is that `movies` and `watchlistIds` disagree. Set a breakpoint in `deleteMovie` and step through the state update. You will see `movies` change, but no matching update to the watchlist id collection.

To verify the fix, remove the duplicated derived state or update it consistently. Then repeat the same reproduction steps. The deleted movie should disappear and the watchlist count should drop on the same render.

### Bug 2: New Movies Reuse the Same Id

The symptom looks strange at first: one card interaction changes more than one newly added movie. A good first hypothesis is that the event handler is too broad, but the better React-specific suspicion is unstable or duplicate list identity.

Open React DevTools Components tab and inspect the `movies` array after adding two movies. Confirm that both new entries have the same id. Then set a breakpoint inside `addMovie` and submit a third movie. Watch the id value used for the new object. It never advances.

The evidence points to id generation, not the card button itself. Replace the frozen memoized id with a ref counter or another unique id generator. Verify by adding several movies and confirming that each id is unique before testing toggles and deletes again.

### Bug 3: Older localStorage Saves Overwrite Newer State

The symptom appears across time rather than immediately in the UI: the app looks right, but refresh restores older data. The first hypothesis should be that persistence is saving different data than React is rendering.

Open Chrome DevTools Application tab and watch the localStorage entry while making quick changes. Then add console logs inside the save effect showing save order, delay, and movie titles. You should see multiple delayed saves pending at once, and an earlier snapshot may write after a later one.

Use breakpoints in the effect to confirm that no cleanup cancels old saves. The correct fix is to clear previous timeouts or save synchronously. After applying the fix, repeat the quick-change sequence and verify that localStorage settles on the same state shown in React DevTools.
