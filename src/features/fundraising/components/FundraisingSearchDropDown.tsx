import { useCallback, useEffect, useState } from "react";
import Fundraising from "../models/Fundraising";
import { fundraisingsRepository } from "../repository/fundraisingsRepository";
import { useNavigate } from "react-router-dom";
import { Box, InputAdornment, Skeleton, TextField, Typography, useTheme } from "@mui/material";
import { ClickAwayListener } from "@mui/material";
import { pageWrapperStyles } from "../../../shared/components/PageWrapper.styles";
import { Search as SearchIcon } from "@mui/icons-material";

const FundraisingSearchDropDown = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Fundraising[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const debounce = useCallback((func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    }, []);

    const searchFundraisings = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fundraisingsRepository.getFundraisings(
                { title: query },
                1,
                3
            );

            if (response?.isSuccess && response.data) {
                setSearchResults(response.data.items);
                setShowSearchDropdown(true);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const debouncedSearch = useCallback(
        debounce(searchFundraisings, 300),
        [searchFundraisings]
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
            setShowSearchDropdown(false);
        }
    };

    const handleSearchResultClick = (fundraisingId: string) => {
        navigate(`/fundraising/${fundraisingId}`);
        setShowSearchDropdown(false);
        setSearchTerm('');
    };

    return (
        <ClickAwayListener onClickAway={() => setShowSearchDropdown(false)}>
            <Box sx={pageWrapperStyles.searchContainer}>
                <form onSubmit={handleSearchSubmit}>
                    <TextField
                        fullWidth
                        placeholder="Search fundraisings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowSearchDropdown(true);
                            }
                        }}
                    />
                </form>
                {(showSearchDropdown && searchResults.length > 0) || (searchLoading && searchTerm.trim()) || (!searchLoading && searchTerm.trim() && searchResults.length === 0) ? (
                    <Box sx={pageWrapperStyles.searchDropdown(theme)}>
                        {searchLoading && searchTerm.trim() ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <Box
                                    key={`skeleton-${index}`}
                                    sx={pageWrapperStyles.searchSkeletonItem(theme)}
                                >
                                    <Skeleton
                                        variant="text"
                                        sx={{ fontSize: '0.875rem', mb: 0.5 }}
                                        width="80%"
                                    />
                                    <Skeleton
                                        variant="text"
                                        sx={{ fontSize: '0.75rem' }}
                                        width="60%"
                                    />
                                </Box>
                            ))
                        ) : searchResults.length > 0 ? (
                            searchResults.map((fundraising) => (
                                <Box
                                    key={fundraising.id}
                                    sx={pageWrapperStyles.searchResultItem(theme)}
                                    onClick={() => handleSearchResultClick(fundraising.id)}
                                >
                                    <Typography sx={pageWrapperStyles.searchResultTitle}>
                                        {fundraising.title}
                                    </Typography>
                                    <Typography sx={pageWrapperStyles.searchResultDescription(theme)}>
                                        {fundraising.description}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Box sx={pageWrapperStyles.searchNoResults(theme)}>
                                <Typography>
                                    No results found for "{searchTerm}"
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : null}
            </Box>
        </ClickAwayListener>

    )
}

export default FundraisingSearchDropDown;