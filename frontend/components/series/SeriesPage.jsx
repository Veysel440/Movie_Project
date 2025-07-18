import { useState, useCallback } from "react";
import SeriesList from "./SeriesList";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import styles from "../../styles/series.module.css";
import { fetchSeries } from "../../lib/api/series";

const SERIES_PER_PAGE = 25;

export default function SeriesPage() {
  const [series, setSeries] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  const loadSeries = useCallback(async (pageNum) => {
    try {
      const data = await fetchSeries(pageNum, SERIES_PER_PAGE);
      const newSeries = data.series || [];
      setSeries((prev) => [...prev, ...newSeries]);
      setTotal(data.total || 0);
      return (
        newSeries.length >= SERIES_PER_PAGE &&
        pageNum * SERIES_PER_PAGE < data.total
      );
    } catch (err) {
      console.error("Veri çekme hatası:", err.message);
      setError(err.message);
      return false;
    }
  }, []);

  const { observerRef, isLoading, hasMore, currentPage, retry } =
    useInfiniteScroll(loadSeries);

  if (error) {
    return <ErrorMessage message={error} onRetry={() => retry(currentPage)} />;
  }

  return (
    <div className={styles.seriesPage}>
      <h1 className={styles.seriesTitle}>Diziler</h1>
      {isLoading && series.length === 0 ? (
        <LoadingSpinner text="Yükleniyor..." />
      ) : (
        <>
          <SeriesList series={series} />
          {hasMore && (
            <div ref={observerRef} className={styles.loadingSpinner}>
              Daha fazla dizi yükleniyor...
            </div>
          )}
        </>
      )}
    </div>
  );
}
