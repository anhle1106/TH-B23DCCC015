import { useState, useMemo, useCallback, useEffect } from 'react';

export interface UsePaginationOptions<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  totalItems: number;
  startIndex: number;
  endIndex: number;
  canNext: boolean;
  canPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * Custom hook usePagination<T>
 * Áp dụng phân trang linh hoạt cho bất kỳ danh sách mảng dữ liệu T[] nào.
 */
export function usePagination<T>(
  data: T[] = [],
  itemsPerPage: number = 5,
  initialPage: number = 1
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const totalItems = data.length;

  // Tính tổng số trang (tối thiểu là 1 trang ngay cả khi dữ liệu rỗng)
  const totalPages = useMemo(() => {
    if (itemsPerPage <= 0) return 1;
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Đảm bảo currentPage luôn nằm trong khoảng hợp lệ [1, totalPages] khi data hoặc itemsPerPage thay đổi
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Tính vị trí bắt đầu và kết thúc của mảng dữ liệu trang hiện tại
  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  // Trích xuất dữ liệu của trang hiện tại
  const currentData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  // Các cờ kiểm tra có thể Next/Prev hay không
  const canNext = currentPage < totalPages;
  const canPrev = currentPage > 1;

  // Chuyển tới trang chỉ định có validate giới hạn
  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  // Chuyển trang tiếp theo
  const nextPage = useCallback(() => {
    if (canNext) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  }, [canNext, totalPages]);

  // Trở về trang trước
  const prevPage = useCallback(() => {
    if (canPrev) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  }, [canPrev]);

  return {
    currentPage,
    totalPages,
    currentData,
    totalItems,
    startIndex,
    endIndex,
    canNext,
    canPrev,
    nextPage,
    prevPage,
    goToPage,
  };
}
