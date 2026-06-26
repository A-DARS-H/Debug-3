import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'

type MovieListProps = {
  movies: Movie[]
  onDeleteMovie: (movieId: number) => void
  onToggleWatched: (movieId: number) => void
  onToggleWatchlist: (movieId: number) => void
}

function MovieList({
  movies,
  onDeleteMovie,
  onToggleWatched,
  onToggleWatchlist,
}: MovieListProps) {
  if (movies.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <h2>No movies found</h2>
        <p>Try a different title, genre, or reset your filters.</p>
      </section>
    )
  }

  return (
    <section className="movie-grid" aria-label="Movies">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDeleteMovie={onDeleteMovie}
          onToggleWatched={onToggleWatched}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </section>
  )
}

export default MovieList
