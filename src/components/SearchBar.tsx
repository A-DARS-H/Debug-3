import type { RefObject } from 'react'

type SearchBarProps = {
  inputRef: RefObject<HTMLInputElement | null>
  searchTerm: string
  onSearchChange: (value: string) => void
}

function SearchBar({ inputRef, searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <label className="field search-field">
      <span>Search by title</span>
      <input
        ref={inputRef}
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search movies"
      />
    </label>
  )
}

export default SearchBar
