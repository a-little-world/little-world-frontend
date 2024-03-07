import { isEmpty } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

const useInfiniteScroll = ({
  fetchItems,
  fetchArgs = {},
  fetchCondition = true,
  onSuccess,
  onError,
}) => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const scrollRef = useRef(null);
  var dependencyList: string = JSON.stringify(fetchArgs);

  const fetchData = useCallback(async () => {
    // do not fetch if loading or on the last page
    if (!fetchCondition || loading || (!isEmpty(items) && page >= totalPages))
      return;
    setLoading(true);

    fetchItems({ page: page + 1, ...fetchArgs })
      .then((response: any) => {
        setItems(prevResults => [...prevResults, ...response.results]);
        onSuccess?.();
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
    setPage(0);
    setTotalPages(0);
    setItems([]);
    setInitialLoad(false);
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
    items,
    initialLoad,
    scrollRef,
  };
};

export default useInfiniteScroll;
