import { useRef, useCallback } from 'react';

/**
 * 무한 스크롤을 위한 IntersectionObserver 훅
 * 단일 책임: 스크롤 감지 및 콜백 실행
 * @param {Function} callback - 스크롤이 끝에 도달했을 때 실행할 함수
 * @param {boolean} hasMore - 더 가져올 데이터가 있는지 여부
 * @param {boolean} isLoading - 현재 로딩 중인지 여부
 * @returns {Object} { ref } - 감지할 요소에 연결할 ref
 */
export function useInfiniteScroll(callback, hasMore, isLoading) {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );

  return { ref: lastElementRef };
}

