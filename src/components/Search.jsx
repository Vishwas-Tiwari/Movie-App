import React, { useState } from 'react';
// import searchIcon from '../search.svg';

const Search = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  return (
    <div className="search">
      <div>
        <img src="/search.svg" alt="search icon" style={{ height: '24px', width: '24px', marginRight: '8px' }} />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Search;
