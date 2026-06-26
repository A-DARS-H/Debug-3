type MovieFilterProps = {
  genres: string[]
  selectedGenre: string
  sortBy: 'rating' | 'year'
  onGenreChange: (genre: string) => void
  onResetFilters: () => void
  onSortChange: (sortBy: 'rating' | 'year') => void
}

function MovieFilter({
  genres,
  selectedGenre,
  sortBy,
  onGenreChange,
  onResetFilters,
  onSortChange,
}: MovieFilterProps) {
  return (
    <div className="filter-row">
      <label className="field">
        <span>Genre</span>
        <select
          value={selectedGenre}
          onChange={(event) => onGenreChange(event.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as 'rating' | 'year')}
        >
          <option value="rating">Rating</option>
          <option value="year">Year</option>
        </select>
      </label>

      <button type="button" className="button secondary" onClick={onResetFilters}>
        Reset filters
      </button>
    </div>
  )
}

export default MovieFilter
