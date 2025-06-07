import { Chip, Tooltip, Box, Typography } from "@mui/material";
import { FundraisingStatus } from "../models/FundraisingStatus";
import PublicIcon from '@mui/icons-material/Public';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const getStatusInfo = (status: FundraisingStatus) => {
    switch (status) {
        case FundraisingStatus.Open:
            return {
                label: 'Open',
                color: 'success' as const,
                isPublicStatus: true,
                description: 'This fundraising is actively accepting donations'
            };
        case FundraisingStatus.Closed:
            return {
                label: 'Closed',
                color: 'default' as const,
                isPublicStatus: true,
                description: 'This fundraising has reached its goal or been completed'
            };
        case FundraisingStatus.ReadyForReview:
            return {
                label: 'Ready for Review',
                color: 'warning' as const,
                isPublicStatus: false,
                description: 'This fundraising is awaiting admin review'
            };
        case FundraisingStatus.Archived:
            return {
                label: 'Archived',
                color: 'default' as const,
                isPublicStatus: true,
                description: 'This fundraising has been archived'
            };
        case FundraisingStatus.Hidden:
            return {
                label: 'Hidden',
                color: 'error' as const,
                isPublicStatus: false,
                description: 'This fundraising is hidden from public view'
            };
        case FundraisingStatus.Deleted:
            return {
                label: 'Deleted',
                color: 'error' as const,
                isPublicStatus: false,
                description: 'This fundraising has been marked for deletion'
            };
        default:
            return {
                label: 'Unknown',
                color: 'default' as const,
                description: 'Status information is not available'
            };
    }
};

interface FundraisingStatusChipProps {
    status: FundraisingStatus;
    showTooltip?: boolean;
}

const FundraisingStatusChip = ({ status, showTooltip = false }: FundraisingStatusChipProps) => {
    const statusInfo = getStatusInfo(status);

    const tooltipContent = (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {statusInfo.isPublicStatus ? (
                    <PublicIcon sx={{ fontSize: 16, color: 'success.light' }} />
                ) : (
                    <VisibilityOffIcon sx={{ fontSize: 16, color: 'warning.light' }} />
                )}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                    {statusInfo.isPublicStatus ? 'Public Status' : 'Internal Status'}
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.3 }}>
                {statusInfo.description}
            </Typography>
            <Typography variant="caption" sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic',
                display: 'block',
                mt: 0.5
            }}>
                {statusInfo.isPublicStatus ? 'Visible to everyone' : 'Only visible to owner and admins'}
            </Typography>
        </Box>
    );

    return (
        <Tooltip
            title={showTooltip ? tooltipContent : ''}
            placement="top"
            arrow
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        maxWidth: 280,
                        p: 0
                    }
                },
                arrow: {
                    sx: {
                        color: 'rgba(0, 0, 0, 0.9)',
                        '&::before': {
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }
                    }
                }
            }}
        >
            <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                variant={statusInfo.isPublicStatus ? 'filled' : 'outlined'}
                size="medium"
                sx={{

                    fontSize: '0.875rem',
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    height: 'fit-content',
                    cursor: showTooltip ? 'help' : 'default',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 2
                    }
                }}
            />
        </Tooltip>
    )
}

export default FundraisingStatusChip;
