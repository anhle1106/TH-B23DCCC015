import { useState, useMemo, useCallback } from 'react';

interface UseVirtualListOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualList({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualListOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { startIndex, endIndex, virtualItems, offsetY } = useMemo(() => {
    const rawStartIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);

    const start = Math.max(0, rawStartIndex - overscan);
    const end = Math.min(itemCount, rawStartIndex + visibleCount + overscan);

    const items: { index: number; top: number }[] = [];
    for (let i = start; i < end; i++) {
      items.push({
        index: i,
        top: i * itemHeight,
      });
    }

    return {
      startIndex: start,
      endIndex: end,
      virtualItems: items,
      offsetY: start * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, itemCount]);

  return {
    totalHeight,
    virtualItems,
    startIndex,
    endIndex,
    offsetY,
    onScroll,
  };
}
