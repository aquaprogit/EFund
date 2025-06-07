import { useCallback, useEffect, useState } from 'react';
import { Tag } from '../../tags/models/Tag';
import { UserDetails } from '../../users/models/UserDetails';
import Fundraising from '../models/Fundraising';
import { MapFromPublicStatus } from '../models/FundraisingStatus';
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import { useFundraisingFilters } from './useFundraisingFilters';
import { usePagination } from './usePagination';
import { useTags } from './useTags';
import { useUsers } from './useUsers';

interface UseFundraisingSearchProps {
    pageSize?: number;
    initialSearchQuery?: string;
    userId?: string;
    defaultStatuses?: number[];
}

interface UseFundraisingSearchResult {
    // Data
    fundraisings: Fundraising[];
    loading: boolean;

    // Pagination
    page: number;
    totalPages: number;
    totalFundraisings: number;
    setPage: (page: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    // Filters
    searchQuery: string;
    selectedTags: string[];
    selectedStatuses: number[];
    selectedUser: string | undefined;
    setSearchQuery: (query: string) => void;
    setSelectedTags: (tags: string[]) => void;
    setSelectedStatuses: (statuses: number[]) => void;
    setSelectedUser: (userId: string) => void;
    resetFilters: () => void;

    // Tags
    allTags: Tag[];

    // Users
    allUsers: UserDetails[];

    // Actions
    refreshFundraisings: () => Promise<void>;
}

export const useFundraisingSearch = ({
    pageSize = 6,
    initialSearchQuery = '',
    userId,
    defaultStatuses = [1]
}: UseFundraisingSearchProps = {}): UseFundraisingSearchResult => {

    // Separated concerns
    const filters = useFundraisingFilters({
        initialSearchQuery,
        initialUserId: userId,
        defaultStatuses
    });

    const pagination = usePagination({ pageSize });
    const tags = useTags();
    const users = useUsers({ initialUserId: userId });

    // Main data state
    const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch fundraisings function
    const fetchFundraisings = useCallback(async () => {
        setLoading(true);
        try {
            const internalStatuses = filters.selectedStatuses.map(status => MapFromPublicStatus(status)).flat();

            const response = await fundraisingsRepository.getFundraisings(
                {
                    title: filters.searchQuery,
                    tags: filters.selectedTags,
                    statuses: internalStatuses,
                    userId: filters.selectedUser ?? undefined
                },
                pagination.page,
                pagination.pageSize
            );

            if (response?.data) {
                setFundraisings(response.data.items);
                pagination.updatePaginationData(
                    response.data.totalPages,
                    response.data.totalCount
                );
            } else {
                setFundraisings([]);
                pagination.resetPagination();
            }
        } catch (error) {
            console.error('Failed to fetch fundraisings:', error);
            setFundraisings([]);
            pagination.resetPagination();
        } finally {
            setLoading(false);
        }
    }, [
        filters.searchQuery,
        filters.selectedTags,
        filters.selectedStatuses,
        filters.selectedUser,
        pagination.page,
        pagination.pageSize
    ]);

    // Reset to first page when filters change
    useEffect(() => {
        pagination.goToFirstPage();
    }, [
        filters.searchQuery,
        filters.selectedTags,
        filters.selectedStatuses,
        filters.selectedUser
    ]);

    // Fetch data when dependencies change
    useEffect(() => {
        fetchFundraisings();
    }, [fetchFundraisings]);

    return {
        // Data
        fundraisings,
        loading,

        // Pagination
        page: pagination.page,
        totalPages: pagination.totalPages,
        totalFundraisings: pagination.totalCount,
        setPage: pagination.setPage,
        hasNextPage: pagination.hasNextPage,
        hasPreviousPage: pagination.hasPreviousPage,

        // Filters
        searchQuery: filters.searchQuery,
        selectedTags: filters.selectedTags,
        selectedStatuses: filters.selectedStatuses,
        selectedUser: filters.selectedUser,
        setSearchQuery: filters.setSearchQuery,
        setSelectedTags: filters.setSelectedTags,
        setSelectedStatuses: filters.setSelectedStatuses,
        setSelectedUser: filters.setSelectedUser,
        resetFilters: filters.resetFilters,

        // Tags
        allTags: tags.allTags,

        // Users
        allUsers: users.allUsers,

        // Actions
        refreshFundraisings: fetchFundraisings
    };
}; 