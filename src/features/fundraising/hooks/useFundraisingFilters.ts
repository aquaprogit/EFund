import { useCallback, useState } from 'react';

export interface FundraisingFilters {
    searchQuery: string;
    selectedTags: string[];
    selectedStatuses: number[];
    selectedUser: string | undefined;
}

interface UseFundraisingFiltersProps {
    initialSearchQuery?: string;
    initialUserId?: string;
    defaultStatuses?: number[];
}

export const useFundraisingFilters = ({
    initialSearchQuery = '',
    initialUserId,
    defaultStatuses = [1] // Default to Open status
}: UseFundraisingFiltersProps = {}) => {
    const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>(defaultStatuses);
    const [selectedUser, setSelectedUser] = useState<string | undefined>(initialUserId);

    const getFilters = useCallback((): FundraisingFilters => ({
        searchQuery,
        selectedTags,
        selectedStatuses,
        selectedUser
    }), [searchQuery, selectedTags, selectedStatuses, selectedUser]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedTags([]);
        setSelectedStatuses(defaultStatuses);
        setSelectedUser(undefined);
    }, [defaultStatuses]);

    const updateFilters = useCallback((filters: Partial<FundraisingFilters>) => {
        if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
        if (filters.selectedTags !== undefined) setSelectedTags(filters.selectedTags);
        if (filters.selectedStatuses !== undefined) setSelectedStatuses(filters.selectedStatuses);
        if (filters.selectedUser !== undefined) setSelectedUser(filters.selectedUser);
    }, []);

    return {
        // Current filter values
        searchQuery,
        selectedTags,
        selectedStatuses,
        selectedUser,

        // Individual setters
        setSearchQuery,
        setSelectedTags,
        setSelectedStatuses,
        setSelectedUser,

        // Utility functions
        getFilters,
        resetFilters,
        updateFilters
    };
}; 