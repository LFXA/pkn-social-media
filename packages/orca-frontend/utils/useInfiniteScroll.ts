import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

interface useInfiniteScrollProps {
  key: any;
  apiCall: any;
  dataLimit: number;
  enabled?: boolean;
}

interface useInfiniteScrollReturnType {
  data: any;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  refetch?: any;
}

const useInfiniteScroll = ({
  key,
  dataLimit,
  apiCall,
  enabled = true,
}: useInfiniteScrollProps): useInfiniteScrollReturnType => {
  const { data, fetchNextPage, isFetching, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: key,
    queryFn: apiCall,
    getNextPageParam: (lastPage, allPages) => (lastPage.length > 0 ? allPages.length * dataLimit : undefined),
    enabled,
    initialPageParam: 0,
  });
 
  const debounce = (func: () => void, wait = 200) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

useEffect(() => {
    const onScroll = debounce(() => {
      if (!data) return;

      const windowHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const scrolled = windowHeight + scrollTop > offsetHeight - offsetHeight / 3;

      if (data.pages[data.pages.length - 1].length === 0) {
        window.removeEventListener('scroll', onScroll);
        return;
      }

      if (scrolled) {
        fetchNextPage();
      }
    }, 150);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [data, fetchNextPage]);

  return { data, isFetching, isFetchingNextPage, refetch };
};

export default useInfiniteScroll;
