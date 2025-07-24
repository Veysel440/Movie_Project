import { useState, useEffect } from "react";
import { logClientError } from "../services/logger";

export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/movies");
        const data = await res.json();
        if (data.status === "success") {
          setMovies(data.movies);
          setFilteredMovies(data.movies);
        } else {
          setMovies([]);
          setFilteredMovies([]);
          logClientError(
            "useMovies",
            "API response success değil",
            JSON.stringify(data),
            "mid"
          );
        }
      } catch (error) {
        setMovies([]);
        setFilteredMovies([]);
        logClientError(
          "useMovies",
          "Film listesi yükleme hatası",
          error?.message,
          "high"
        );
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [search, movies]);

  return {
    loading,
    movies: filteredMovies,
    search,
    setSearch,
  };
}
