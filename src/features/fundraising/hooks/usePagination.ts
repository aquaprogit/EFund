import { useCallback, useState } from 'react';

interface UsePaginationProps {
    initialPage?: number;
    pageSize?: number;
}

export const usePagination = ({
    initialPage = 1,
    pageSize = 6
}: UsePaginationProps = {}) => {
    const [page, setPage] = useState<number>(initialPage);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);

    const resetPagination = useCallback(() => {
        setPage(1);
        setTotalPages(1);
        setTotalCount(0);
    }, []);

    const goToPage = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }, [totalPages]);

    const goToFirstPage = useCallback(() => {
        setPage(1);
    }, []);

    const updatePaginationData = useCallback((newTotalPages: number, newTotalCount: number) => {
        setTotalPages(newTotalPages);
        setTotalCount(newTotalCount);
    }, []);

    return {
        // Current state
        page,
        totalPages,
        totalCount,
        pageSize,

        // Actions
        setPage: goToPage,
        goToFirstPage,
        resetPagination,
        updatePaginationData,

        // Computed values
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        startIndex: (page - 1) * pageSize + 1,
        endIndex: Math.min(page * pageSize, totalCount)
    };
}; 