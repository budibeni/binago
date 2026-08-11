import React from 'react';

export interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export function useInfiniteScroll({
  hasNextPage = false,
  isFetchingNextPage = false,
  onFetchNextPage,
  threshold = 0.5,
  disabled = false,
}: UseInfiniteScrollOptions) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (disabled || !hasNextPage || isFetchingNextPage || !onFetchNextPage) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onFetchNextPage();
        }
      },
      {
        threshold,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage, threshold, disabled]);

  return { sentinelRef };
}
