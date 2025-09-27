import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/Moviecard';

const apiKey = "30095435d613bb02d0764dbd0bf0ecf3";

export default function Result() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        // 🎬 Step 1: Fetch selected movie from TMDB
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
        );
        const searchData = await searchRes.json();
        const selected = searchData.results?.[0];

        if (!selected) {
          setError("Movie not found.");
          setMovie(null);
          setLoading(false);
          return;
        }

        // 🎞️ Step 2: Fetch details and credits
        const [details, credits] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${selected.id}?api_key=${apiKey}`).then(res => res.json()),
          fetch(`https://api.themoviedb.org/3/movie/${selected.id}/credits?api_key=${apiKey}`).then(res => res.json()),
        ]);

        setMovie({ ...selected, details, credits });

        // 🤖 Step 3: Get ML recommendations
        const recRes = await fetch("http://localhost:5000/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movie: query }),
        });

        const recData = await recRes.json();

        if (recData.recommendations) {
          const posters = await Promise.all(
            recData.recommendations.map(async (title) => {
              const res = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`
              );
              const data = await res.json();
              return data.results?.[0] || { title }; // fallback with title
            })
          );

          setRecommendations(posters);
        } else {
          console.warn("No recommendations:", recData.error);
          setRecommendations([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Server error. Please try again.");
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  // 🔁 UI States
  if (loading) return <p style={{ color: 'white' }}>Loading...</p>;

  if (error && !movie) {
    return (
      <div className="error-container">
        <h2>🎬 Oops!</h2>
        <p className="error-text">{error}</p>
        <button className="search-button" onClick={() => navigate('/')}>🔙 Back to Search</button>
      </div>
    );
  }

  const director = movie.credits.crew.find(p => p.job === 'Director')?.name || 'Unknown';
  const cast = movie.credits.cast.slice(0, 3).map(p => p.name).join(', ');

  return (
    <div className="result-page">
      <h2>{movie.title} ({movie.release_date?.slice(0, 4)})</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width="300"
      />
      <p><strong>Director:</strong> {director}</p>
      <p><strong>Cast:</strong> {cast}</p>
      <p><strong>Rating:</strong> {movie.vote_average}</p>
      <p><strong>Ladder Line:</strong> "{movie.details.tagline || 'No tagline'}"</p>

      <h3>🎯 Next in Your Cinematic Journey</h3>
      <div className="recommend-grid">
        {recommendations.length > 0 ? (
          recommendations.map((movie, index) => (
            <MovieCard
              key={index}
              movie={movie}
              onClick={() => navigate(`/result/${movie.title}`)}
            />
          ))
        ) : (
          <p style={{
            color: 'lightgray',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            marginTop: '16px',
            lineHeight: '1.5'
          }}>
            Nothing better than this one 🎬💯<br />
            It's already a gem of its kind 💖
          </p>
        )}
      </div>

      <button className="search-button" onClick={() => navigate('/')}>🔙 Back</button>
    </div>
  );
}
