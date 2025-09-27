// src/pages/ExplorePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const apiKey = '30095435d613bb02d0764dbd0bf0ecf3';

export default function ExplorePage() {
  const [movies, setMovies] = useState([]);
  const [heading, setHeading] = useState('🎬 Explore');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const genreCode = queryParams.get('genre');
    const language = queryParams.get('language');

    const fetchMovies = async () => {
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;

        // Add filters to URL
        if (genreCode) url += `&with_genres=${genreCode}`;
        if (language) url += `&with_original_language=${language}`;

        // Update heading
        if (genreCode && language) {
          setHeading(`🎬 ${language.toUpperCase()} Genre Picks`);
        } else if (genreCode) {
          setHeading('🎭 Movies by Genre');
        } else if (language) {
          setHeading(`🌐 ${language.toUpperCase()} Language Films`);
        } else {
          setHeading('🎬 Explore');
        }

        // Fetch movies
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, [location.search]);

  const queryParams = new URLSearchParams(location.search);
  const genreCode = queryParams.get('genre');
  const language = queryParams.get('language');

  return (
    <div className="result-page">
      <h2>{heading}</h2>

      {/* Filter Info Display */}
      {(genreCode || language) && (
        <div style={{ marginBottom: '20px', color: '#ccc' }}>
          {genreCode && <span style={{ marginRight: '12px' }}>🎭 Genre: {genreCode}</span>}
          {language && <span>🌐 Language: {language.toUpperCase()}</span>}
        </div>
      )}

      {/* No results */}
      {movies.length === 0 ? (
        <p style={{ color: '#ffcc70', marginTop: '20px' }}>
          😓 No movies found for this filter.
        </p>
      ) : (
        <div className="recommend-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/result/${movie.title}`)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/300x450?text=No+Poster'
                }
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
