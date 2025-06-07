import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    CircularProgress,
    Avatar,
    Box,
    Typography,
    Chip
} from '@mui/material';
import { UserDetails } from '../models/UserDetails';
import { userRepository } from '../api/userRepository';
import PersonIcon from '@mui/icons-material/Person';

interface UserSearchDropdownProps {
    selectedUser?: UserDetails | null;
    onUserSelect: (user: UserDetails | null) => void;
    label?: string;
    placeholder?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    required?: boolean;
}

const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
    selectedUser = null,
    onUserSelect,
    label = "Search Users",
    placeholder = "Type to search users...",
    size = 'medium',
    fullWidth = true,
    disabled = false,
    required = false
}) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<UserDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const performSearch = async (query: string) => {
        if (!query.trim()) {
            setOptions([]);
            return;
        }

        try {
            setLoading(true);
            const result = await userRepository.getUsersMinimized(query);

            if (result.isSuccess && result.data) {
                setOptions(result.data);
            } else {
                setOptions([]);
            }
        } catch (error) {
            console.error('Failed to search users:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: any, value: string) => {
        setInputValue(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Only search if there's input text
        if (value.trim()) {
            // Debounce search for 300ms
            const timeout = setTimeout(() => {
                performSearch(value);
            }, 300);
            setSearchTimeout(timeout);
        } else {
            setOptions([]);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        // Don't auto-search on open, only search when user types
    };

    const handleClose = () => {
        setOpen(false);
        // Keep options available even when closed
    };

    const handleChange = (event: any, value: UserDetails | null) => {
        onUserSelect(value);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    return (
        <Autocomplete
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            value={selectedUser}
            onChange={handleChange}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            options={options}
            loading={loading}
            disabled={disabled}
            fullWidth
            size={size}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ''}
            noOptionsText={
                inputValue.trim() ?
                    (loading ? "Searching..." : "No users found") :
                    "Type to search users"
            }
            loadingText="Searching users..."
            renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Avatar
                        src={option.avatarUrl}
                        sx={{ width: 32, height: 32 }}
                    >
                        {option.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {option.email}
                        </Typography>
                    </Box>
                    {option.badges && option.badges.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {option.badges.slice(0, 2).map((badge, index) => (
                                <Chip
                                    key={index}
                                    label={badge.title}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        ),
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'divider',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
            )}
            sx={{
                '& .MuiAutocomplete-listbox': {
                    maxHeight: 300,
                },
                '& .MuiAutocomplete-option': {
                    padding: 1,
                },
            }}
        />
    );
};

export default UserSearchDropdown; 