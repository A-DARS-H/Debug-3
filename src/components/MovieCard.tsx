import type { Movie } from '../types/movie'

type MovieCardProps = {
  movie: Movie
  onDeleteMovie: (movieId: number) => void
  onToggleWatched: (movieId: number) => void
  onToggleWatchlist: (movieId: number) => void
}

function MovieCard({
  movie,
  onDeleteMovie,
  onToggleWatched,
  onToggleWatchlist,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card-header">
        <div>
          <h3>{movie.title}</h3>
          <p>
            {movie.genre} • {movie.year}
          </p>
        </div>
        <strong>{movie.rating.toFixed(1)}</strong>
      </div>

      <div className="status-row">
        <span className={movie.inWatchlist ? 'status active' : 'status'}>
          {movie.inWatchlist ? 'In watchlist' : 'Not in watchlist'}
        </span>
        <span className={movie.watched ? 'status active' : 'status'}>
          {movie.watched ? 'Watched' : 'Unwatched'}
        </span>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="button"
          onClick={() => onToggleWatchlist(movie.id)}
        >
          {movie.inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => onToggleWatched(movie.id)}
        >
          Mark {movie.watched ? 'unwatched' : 'watched'}
        </button>
        <button
          type="button"
          className="button danger"
          onClick={() => onDeleteMovie(movie.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default MovieCard
