import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, useTheme, Paper } from '@mui/material';
import { useToast } from '../../contexts/ToastContext';

const MultiSelectWithChip = (props: {
    label: string,
    values: string[],
    defaultValues?: string[],
    value?: string[],
    limitTags?: number,
    freeSolo?: boolean,
    width?: string,
    onChange: (selected: string[]) => void
}) => {
    const { showError } = useToast();
    const theme = useTheme();
    const [selectedOptions, setSelectedOptions] = useState<string[]>(props.defaultValues || []);

    const handleChange = (event: React.SyntheticEvent, value: string[]) => {
        if (value.length > (props.limitTags || 5)) {
            showError('You can select up to 5 tags');
            return;
        }
        props.onChange(value);
        if (!props.value) {
            setSelectedOptions(value);
        }
    };

    useEffect(() => {
        if (props.defaultValues && !props.value) {
            setSelectedOptions(props.defaultValues);
        }
    }, [props.defaultValues]);

    useEffect(() => {
        if (props.value) {
            setSelectedOptions(props.value);
        }
    }, [props.value]);

    return (
        <Autocomplete
            sx={{
                width: props.width,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                    }
                },
                '& .MuiAutocomplete-tag': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: 1,
                    '& .MuiChip-deleteIcon': {
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            color: theme.palette.primary.contrastText,
                        }
                    }
                },
                '& .MuiInputLabel-root': {
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                    }
                }
            }}
            PaperComponent={(paperProps) => (
                <Paper
                    {...paperProps}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        marginTop: 1,
                        boxShadow: theme.shadows[4],
                        '& .MuiAutocomplete-option': {
                            py: 1,
                            px: 2,
                            '&[aria-selected="true"]': {
                                backgroundColor: theme.palette.primary.light,
                            },
                            '&[aria-selected="true"].Mui-focused': {
                                backgroundColor: theme.palette.primary.light,
                            },
                            '&.Mui-focused': {
                                backgroundColor: theme.palette.action.hover,
                            }
                        }
                    }}
                />
            )}
            multiple
            limitTags={props.limitTags}
            freeSolo={props.freeSolo}
            defaultValue={props.defaultValues}
            options={props.values}
            value={props.value || selectedOptions}
            onChange={handleChange}
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option.toLowerCase()}
                        sx={{
                            height: 24,
                            fontSize: '0.85rem',
                            fontWeight: 500
                        }}
                    />
                ))
            }
            getOptionLabel={(option) => option.toLowerCase()}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    placeholder={props.label}
                />
            )}
            ListboxProps={{
                style: {
                    maxHeight: '200px'
                }
            }}
        />
    );
};

export default MultiSelectWithChip;