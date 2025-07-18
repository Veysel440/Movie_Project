import { useState, useEffect, useRef } from "react";

export default function useInfiniteScroll(fetchFunction) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMore = async () => {
    setIsLoading(true);
    const more = await fetchFunction(page);
    if (!more) setHasMore(false);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, isLoading]);

  const retry = () => {
    setHasMore(true);
    setIsLoading(false);
    setPage(1);
  };

  return { observerRef, isLoading, hasMore, currentPage: page, retry };
}
