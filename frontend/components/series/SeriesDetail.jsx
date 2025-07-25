import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import SeriesMain from "./SeriesMain";
import SeriesActors from "./SeriesActors";
import SeriesComments from "./SeriesComments";
import { fetchSeriesDetail } from "../../lib/api/series";
import styles from "../../styles/seriesDetail.module.css";
import { logClientError } from "../../services/logger";

export default function SeriesDetail() {
  const router = useRouter();
  const { link } = router.query;

  const [series, setSeries] = useState(null);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSeries = useCallback(async (linkParam) => {
    setLoading(true);
    try {
      const data = await fetchSeriesDetail(linkParam);
      setSeries(data.series || null);
      setActors(data.actors || []);
      setGenres(data.genres || []);
      setComments(data.comments || []);
      setAvgRating(data.avg_rating || 0);
      setRatingCount(data.rating_count || 0);
    } catch (err) {
      setError(err.message);

      logClientError(
        "SeriesDetail",
        "Dizi yüklenirken hata",
        err.message,
        "high"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (link) loadSeries(link);
  }, [link, loadSeries]);

  if (loading) {
    return <div className={styles.loadingSpinner}>Yükleniyor...</div>;
  }

  if (error || !series) {
    return (
      <div className={styles.errorContainer}>{error || "Dizi bulunamadı"}</div>
    );
  }

  return (
    <div className={styles.seriesDetailContainer}>
      <SeriesMain
        series={series}
        genres={genres}
        avgRating={avgRating}
        ratingCount={ratingCount}
      />
      <SeriesActors actors={actors} />
      <SeriesComments
        link={link}
        comments={comments}
        reload={() => loadSeries(link)}
      />
    </div>
  );
}
