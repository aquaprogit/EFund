import { Box, Chip, OutlinedInput, SelectChangeEvent } from "@mui/material"
import { MenuItem } from "@mui/material"
import { Select } from "@mui/material";
import { useState } from "react";
import { FundraisingStatus, FundraisingStatusLabels } from "../../models/FundraisingStatus";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

type StatusSelectProps = {
    defaultValue?: FundraisingStatus[];
    onChange?: (selectedStatuses: FundraisingStatus[]) => void;
}

const mapStatusToLabel = (status: FundraisingStatus) => {
    return FundraisingStatusLabels[status as keyof typeof FundraisingStatusLabels];
}

const publicStatusOptions = [
    { value: FundraisingStatus.Open, label: mapStatusToLabel(FundraisingStatus.Open) },
    { value: FundraisingStatus.Closed, label: mapStatusToLabel(FundraisingStatus.Closed) },
    { value: FundraisingStatus.Archived, label: mapStatusToLabel(FundraisingStatus.Archived) },
];

const StatusSelect = ({ defaultValue = [], onChange }: StatusSelectProps) => {

    const [selectedStatuses, setSelectedStatuses] = useState<FundraisingStatus[]>(defaultValue);

    const handleStatusChange = (event: SelectChangeEvent<FundraisingStatus[]>) => {
        const value = event.target.value as FundraisingStatus[];
        setSelectedStatuses(value);

        // Call the onChange callback if provided
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Select
            multiple
            value={selectedStatuses}
            onChange={handleStatusChange}
            input={<OutlinedInput label="Select Status" />}
            renderValue={(selected) => (
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                    {selected.map((value) => (
                        <Chip
                            key={value}
                            label={mapStatusToLabel(value)}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                                maxWidth: '150px',
                                '& .MuiChip-label': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        />
                    ))}
                </Box>
            )}
            MenuProps={MenuProps}
        >
            {publicStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    )
}

export default StatusSelect;
