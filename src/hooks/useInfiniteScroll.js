import { useRef, useCallback } from 'react';

export const useInfiniteScroll = (loading, hasMore, onIntersect) => {
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    // Trong hook useInfiniteScroll.js
    observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore && !loading) { // Thêm check !loading ở đây
        onIntersect();
    }
    }, { 
    rootMargin: '100px' // Bắt đầu load khi cách đáy 100px thay vì chạm hẳn vào
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, onIntersect]);

  return lastElementRef;
};