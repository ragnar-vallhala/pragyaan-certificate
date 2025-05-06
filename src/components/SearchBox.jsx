import React from 'react';
import './SearchBox.css';

const SearchBox = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="search-component">
      <input
        type="text"
        placeholder="Enter your full name as it appears on certificate..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearchSubmit()}
        className="search-input"
      />
      <button onClick={onSearchSubmit} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBox;