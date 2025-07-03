import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  fetchItems: (args: { page: number;[key: string]: any }) => Promise<any>;
  fetchArgs?: { [key: string]: any };
  fetchCondition?: boolean;
  items?: any[];
  currentPage?: number;
  totalPages?: number;
  setItems: (items: any) => void;
  onError?: () => void;
}

const useInfiniteScroll = ({
  fetchItems,
  fetchArgs = {},
  fetchCondition = true,
  items = [],
  currentPage = 0,
  totalPages = 0,
  setItems,
  onError,
}: UseInfiniteScrollProps) => {
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const dependencyList: string = JSON.stringify(fetchArgs);

  const fetchData = useCallback(async () => {
    // do not fetch if loading or on the last page
    if (
      !fetchCondition ||
      loading ||
      (!isEmpty(items) && currentPage >= totalPages)
    )
      return;

    setLoading(true);

    fetchItems({ page: currentPage + 1, ...fetchArgs })
      .then((response: any) => {
        setItems({
          pages_total: response.pages_total || response.last_page,
          page: currentPage + 1,
          results: [...items, ...response.results],
        });

        setLoading(false);
      })
      .catch(() => {
        onError?.();
        setLoading(false);
      });
  }, [currentPage, loading, dependencyList, items, fetchArgs]);

  useEffect(() => {
    // only fetch on mount and when page is reset to 0
    if (!currentPage) fetchData();
  }, [currentPage, dependencyList]);

  // fetch on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const target = entries[0];
      if (target.isIntersecting && !isEmpty(items)) {
        fetchData();
      }
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current);
    }

    return () => {
      if (scrollRef.current) {
        observer.unobserve(scrollRef.current);
      }
    };
  }, [fetchData, items, currentPage, totalPages]);

  return {
    scrollRef,
  };
};

export default useInfiniteScroll;
