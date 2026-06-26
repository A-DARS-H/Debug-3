export type Movie = {
  id: number
  title: string
  genre: string
  year: number
  rating: number
  watched: boolean
  inWatchlist: boolean
}

export type NewMovie = Pick<Movie, 'title' | 'genre' | 'year' | 'rating'>