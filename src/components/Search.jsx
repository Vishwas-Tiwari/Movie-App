import React from 'react';
// import searchIcon from '../search.svg';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Release Date: Newest' },
  { value: 'primary_release_date.asc', label: 'Release Date: Oldest' }
];

const Search = ({ searchTerm, onSearch, sortBy, onSortChange }) => {
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <img src="/search.svg" alt="search icon" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Divider - only on desktop */}
      <div className="hidden sm:block h-6 w-[1px] bg-light-100/10" />

      {/* Sort Select */}
      <div className="relative shrink-0 flex items-center border-t border-light-100/10 pt-3 sm:pt-0 sm:border-t-0 w-full sm:w-auto">
        <label htmlFor="search-sort-select" className="text-xs font-semibold text-light-200 uppercase tracking-wider mr-2 sm:hidden">
          Sort By
        </label>
        <div className="relative flex-1 sm:flex-initial">
          <select
            id="search-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-transparent text-light-200 pl-2 pr-8 py-2 text-sm font-semibold focus:outline-none cursor-pointer hover:text-white transition-all duration-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#0f0d23] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-light-200">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
