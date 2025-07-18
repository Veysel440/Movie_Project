import { useRouter } from "next/router";

export default function MovieCard({ movie }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/movies/${encodeURIComponent(movie.link)}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img src={movie.poster} alt={movie.title} />
      <div className="title">{movie.title}</div>
    </div>
  );
}
