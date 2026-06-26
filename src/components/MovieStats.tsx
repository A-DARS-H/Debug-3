type MovieStatsProps = {
  stats: {
    totalMovies: number
    watchlistCount: number
    watchedCount: number
    averageRating: number
  }
}

function MovieStats({ stats }: MovieStatsProps) {
  return (
    <section className="stats-grid" aria-label="Movie statistics">
      <div className="stat-card">
        <span>Total movies</span>
        <strong>{stats.totalMovies}</strong>
      </div>
      <div className="stat-card">
        <span>Watchlist</span>
        <strong>{stats.watchlistCount}</strong>
      </div>
      <div className="stat-card">
        <span>Watched</span>
        <strong>{stats.watchedCount}</strong>
      </div>
      <div className="stat-card">
        <span>Average rating</span>
        <strong>{stats.averageRating.toFixed(1)}</strong>
      </div>
    </section>
  )
}

export default MovieStats
