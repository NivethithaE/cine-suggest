import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const genres = [
    { name: 'Action', code: 28 },
    { name: 'Comedy', code: 35 },
    { name: 'Drama', code: 18 },
    { name: 'Horror', code: 27 },
    { name: 'Animation', code: 16 },
    { name: 'Romance', code: 10749 },
  ];

  return (
    <div className="home-container">
      <h1 className="hero-title">Behind The Scenes 🎬</h1>
      <p className="hero-sub">From popcorn to plot twists — we’re in!

</p>

      <button className="start-button" onClick={() => navigate('/search')}>
        🎬 Start Exploring
      </button>

      <div className="grid-section">
        {genres.map((genre) => (
          <div
            key={genre.code}
            className="grid-card"
            onClick={() => navigate(`/explore?genre=${genre.code}`)}
          >
            🎭 {genre.name}
          </div>
        ))}
      </div>
    </div>
  );
}
