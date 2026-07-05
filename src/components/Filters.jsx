import React from 'react';

const POPULAR_GENRES = [
  { id: 'all', name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 878, name: 'Sci-Fi' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 16, name: 'Animation' },
  { id: 14, name: 'Fantasy' }
];

const Filters = ({ selectedGenre, onGenreChange }) => {
  return (
    <div className="flex flex-row items-center justify-center w-full max-w-3xl mx-auto px-1 my-6">
      {/* Genre Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 hide-scrollbar w-full">
        {POPULAR_GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap ${
              selectedGenre === genre.id
                ? 'bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-[#030014] font-bold shadow-md shadow-[#AB8BFF]/20 transform scale-105'
                : 'bg-light-100/5 text-light-200 hover:bg-light-100/10 hover:text-white border border-light-100/10'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
