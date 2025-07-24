import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import MovieMain from "./MovieMain";
import MovieActors from "./MovieActors";
import MovieComments from "./MovieComments";
import { fetchMovieDetail } from "../../lib/api/movies";
import styles from "../../styles/movieDetail.module.css";
import { logError } from "../../utils/logger";

export default function MovieDetail() {
  const router = useRouter();
  const { link } = router.query;

  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMovie = useCallback(async (linkParam) => {
    setLoading(true);
    try {
      const data = await fetchMovieDetail(linkParam);
      setMovie(data.movie || null);
      setActors(data.actors || []);
      setGenres(data.genres || []);
      setComments(data.comments || []);
      setAvgRating(data.avg_rating || 0);
      setRatingCount(data.rating_count || 0);
    } catch (err) {
      logError("MovieDetail:fetchMovieDetail", err, "high");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (link) loadMovie(link);
  }, [link, loadMovie]);

  if (loading) {
    return <div className={styles.loadingSpinner}>Yükleniyor...</div>;
  }

  if (error || !movie) {
    logError("MovieDetail:render", error || "Film bulunamadı", "mid");
    return (
      <div className={styles.errorContainer}>{error || "Film bulunamadı"}</div>
    );
  }

  return (
    <div className={styles.movieDetailContainer}>
      <MovieMain
        movie={movie}
        genres={genres}
        avgRating={avgRating}
        ratingCount={ratingCount}
      />
      <MovieActors actors={actors} />
      <MovieComments
        link={link}
        comments={comments}
        reload={() => loadMovie(link)}
      />
    </div>
  );
}
