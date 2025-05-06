import React from 'react';

const SearchBox = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter your name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
      />
      <button onClick={onSearchSubmit}>Search</button>
    </div>
  );
};

export default SearchBox;