import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../../../contexts/ToastContext";
import { UpdateUserInfo, userRepository } from "../../api/userRepository";
import User from "../../models/User";
import { useUser } from "../../../../contexts/UserContext";

interface EditableInfoFieldProps {
    label: string;
    value: string;
    fieldName: 'name' | 'description';
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    onRefresh: () => Promise<User | null>;
}

export const EditableInfoField = ({
    label,
    value,
    fieldName,
    multiline = false,
    rows = 1,
    placeholder,
    onRefresh
}: EditableInfoFieldProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value || '');
    const { showSuccess, showError } = useToast();
    const { user, refreshUser } = useUser();

    const handleSave = async () => {
        try {
            if (!user) {
                showError('User not found');
                setIsEditing(false);
                return;
            }
            await refreshUser();

            const response = await userRepository.updateInfo({ ...user, [fieldName]: fieldValue } as UpdateUserInfo);

            if (response.isSuccess) {
                await onRefresh();
                setIsEditing(false);
                showSuccess(`${label} updated successfully`);
            } else {
                showError(response.error?.message || `Failed to update ${label.toLowerCase()}`);
            }
        } catch (error) {
            showError('An unexpected error occurred');
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
        }}>
            <Typography variant="body1" >{label}:</Typography>

            <Box>
                {
                    isEditing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <TextField
                                sx={{ width: '200px' }}
                                size="small"
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                            />
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ ml: 1 }} variant="body1">{value}</Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        </Box>
                    )
                }
            </Box>
        </Box>
    );
}; 