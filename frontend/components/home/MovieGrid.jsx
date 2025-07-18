import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  if (!movies.length) return <p>Hiç film bulunamadı.</p>;

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.link} movie={movie} />
      ))}
    </div>
  );
}
