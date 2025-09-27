export default function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        style={{ borderRadius: '10px', width: '150px' }}
      />
      <p>{movie.title}</p>
    </div>
  );
}
