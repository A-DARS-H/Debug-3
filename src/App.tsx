import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { initialMovies } from './data/movies'
import type { Movie, NewMovie } from './types/movie'
import MovieFilter from './components/MovieFilter'
import MovieForm from './components/MovieForm'
import MovieList from './components/MovieList'
import MovieStats from './components/MovieStats'
import SearchBar from './components/SearchBar'

type SortOption = 'rating' | 'year'
const storageKey = 'movie-watchlist-debug-state'

function readStoredMovies() {
  if (typeof window === 'undefined') {
    return initialMovies
  }

  const savedMovies = window.localStorage.getItem(storageKey)

  if (!savedMovies) {
    return initialMovies
  }

  try {
    return JSON.parse(savedMovies) as Movie[]
  } catch {
    window.localStorage.removeItem(storageKey)
    return initialMovies
  }
}

function App() {
  const [movies, setMovies] = useState<Movie[]>(() => readStoredMovies())
  const [watchlistIds, setWatchlistIds] = useState<number[]>(
    () => readStoredMovies().filter((movie) => movie.inWatchlist).map((movie) => movie.id),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const nextMovieId = useMemo(() => initialMovies.length + 1, [])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const saveOrderRef = useRef(0)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    saveOrderRef.current += 1
    const saveOrder = saveOrderRef.current
    const delay = saveOrder % 2 === 0 ? 700 : 140

    window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(movies))
    }, delay)
  }, [movies])

  const genres = useMemo(() => {
    return ['All', ...Array.from(new Set(movies.map((movie) => movie.genre))).sort()]
  }, [movies])

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return movies
      .filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(normalizedSearch)
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre
        return matchesSearch && matchesGenre
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating || b.year - a.year
        }

        return b.year - a.year || b.rating - a.rating
      })
  }, [movies, searchTerm, selectedGenre, sortBy])

  const stats = useMemo(() => {
    const totalMovies = movies.length
    const watchlistCount = watchlistIds.length
    const watchedCount = movies.filter((movie) => movie.watched).length
    const averageRating =
      totalMovies === 0
        ? 0
        : movies.reduce((sum, movie) => sum + movie.rating, 0) / totalMovies

    return {
      averageRating,
      totalMovies,
      watchedCount,
      watchlistCount,
    }
  }, [movies, watchlistIds])

  const addMovie = useCallback((movie: NewMovie) => {
    const newMovie: Movie = {
      ...movie,
      id: nextMovieId,
      watched: false,
      inWatchlist: false,
    }

    setMovies((currentMovies) => [newMovie, ...currentMovies])
  }, [nextMovieId])

  const deleteMovie = useCallback((movieId: number) => {
    setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId))
  }, [])

  const toggleWatchlist = useCallback((movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, inWatchlist: !movie.inWatchlist }
          : movie,
      ),
    )
    setWatchlistIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    )
  }, [])

  const toggleWatched = useCallback((movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, watched: !movie.watched } : movie,
      ),
    )
  }, [])

  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedGenre('All')
    setSortBy('rating')
    searchInputRef.current?.focus()
  }, [])

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Movie Watchlist</p>
          <h1>Find, sort, and track movies</h1>
        </div>
      </header>

      <MovieStats stats={stats} />

      <section className="panel controls-section" aria-label="Movie controls">
        <SearchBar
          inputRef={searchInputRef}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <MovieFilter
          genres={genres}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          onGenreChange={setSelectedGenre}
          onResetFilters={resetFilters}
          onSortChange={setSortBy}
        />
      </section>

      <MovieForm onAddMovie={addMovie} />

      <MovieList
        movies={filteredMovies}
        onDeleteMovie={deleteMovie}
        onToggleWatched={toggleWatched}
        onToggleWatchlist={toggleWatchlist}
      />
    </main>
  )
}

export default App
