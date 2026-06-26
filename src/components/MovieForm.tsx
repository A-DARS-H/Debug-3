import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NewMovie } from '../types/movie'

type MovieFormProps = {
  onAddMovie: (movie: NewMovie) => void
}

const currentYear = new Date().getFullYear()

function MovieForm({ onAddMovie }: MovieFormProps) {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [year, setYear] = useState(String(currentYear))
  const [rating, setRating] = useState('8')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedGenre = genre.trim()
    const numericYear = Number(year)
    const numericRating = Number(rating)

    if (!trimmedTitle || !trimmedGenre || Number.isNaN(numericYear) || Number.isNaN(numericRating)) {
      return
    }

    onAddMovie({
      title: trimmedTitle,
      genre: trimmedGenre,
      year: numericYear,
      rating: numericRating,
    })

    setTitle('')
    setGenre('')
    setYear(String(currentYear))
    setRating('8')
  }

  return (
    <section className="panel" aria-labelledby="add-movie-heading">
      <h2 id="add-movie-heading">Add a movie</h2>
      <form className="movie-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Movie title"
            required
          />
        </label>

        <label className="field">
          <span>Genre</span>
          <input
            type="text"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            placeholder="Genre"
            required
          />
        </label>

        <label className="field">
          <span>Year</span>
          <input
            type="number"
            value={year}
            min="1888"
            max={currentYear + 5}
            onChange={(event) => setYear(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Rating</span>
          <input
            type="number"
            value={rating}
            min="0"
            max="10"
            step="0.1"
            onChange={(event) => setRating(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="button">
          Add movie
        </button>
      </form>
    </section>
  )
}

export default MovieForm
