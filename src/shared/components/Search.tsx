import React, { useEffect, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';

interface SearchProps extends Omit<TextFieldProps, 'onChange'> {
    onSearch: (query: string) => void;
    initialValue?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, InputProps, sx, initialValue, ...props }) => {
    const [searchQuery, setSearchQuery] = useState<string>(initialValue ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    return (
        <TextField
            {...props}
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
                ...InputProps,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon
                            sx={{
                                color: 'text.secondary',
                                fontSize: 20
                            }}
                        />
                    </InputAdornment>
                ),
                ...InputProps
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                        borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                    },
                },
                ...sx
            }}
        />
    );
};

export default Search;
