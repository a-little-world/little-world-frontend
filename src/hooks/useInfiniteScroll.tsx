import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

const useInfiniteScroll = ({
  fetchItems,
  fetchArgs = {},
  fetchCondition = true,
  items,
  setItems,
  onError,
}) => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(!isEmpty(items));
  const scrollRef = useRef(null);
  var dependencyList: string = JSON.stringify(fetchArgs);

  const fetchData = useCallback(async () => {
    // do not fetch if loading or on the last page
    if (!fetchCondition || loading || (!isEmpty(items) && page >= totalPages))
      return;

    setLoading(true);

    fetchItems({ page: page + 1, ...fetchArgs })
      .then((response: any) => {
        setItems([...items, ...response.results]);
        setPage(prevPage => prevPage + 1);
        setTotalPages(response.pages_total);
        setLoading(false);
        setInitialLoad(true);
      })
      .catch(() => {
        onError?.();
        setLoading(false);
      });
  }, [page, loading, dependencyList]);

  useEffect(() => {
    // only fetch on mount and when page is reset to 0
    if (!page) fetchData();
  }, [page, dependencyList]);

  // reset hook
  useEffect(() => {
    if (isEmpty(items)) {
      setPage(0);
      setTotalPages(0);
    }
  }, [dependencyList]);

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
  }, [fetchData]);

  return {
    initialLoad,
    scrollRef,
  };
};

export default useInfiniteScroll;
