import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiKey = '30095435d613bb02d0764dbd0bf0ecf3';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (title) => {
    const movieTitle = title || query;
    if (movieTitle.trim()) {
      navigate(`/result/${movieTitle}`);
      setQuery('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
        );
        const data = await res.json();

        // ✅ Remove duplicates by movie title
        const unique = [];
        const seen = new Set();

        for (const movie of data.results) {
          if (!seen.has(movie.title)) {
            seen.add(movie.title);
            unique.push(movie);
          }
          if (unique.length === 5) break; // limit to 5 suggestions
        }

        setSuggestions(unique);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce delay
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-bar-container">
      <h1 className="title">Behind The Scenes 🎬</h1>

      <div className="input-group">
        <input
          type="text"
          className="search-input"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={() => handleSearch()}>
          Expose 🎞️
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestion-box">
          {suggestions.map((movie, idx) => (
            <li key={idx} onClick={() => handleSearch(movie.title)}>
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
