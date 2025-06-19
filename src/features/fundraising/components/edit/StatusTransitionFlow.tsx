import { Box, Typography, Chip, Card, CardContent, Alert } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FundraisingStatus, FundraisingStatusLabels } from '../../models/FundraisingStatus';
import { getStatusDisplayInfo } from '../../utils/statusTransitions';

const StatusTransitionFlow = () => {
    const getStatusChip = (status: FundraisingStatus, isActive = false) => {
        const info = getStatusDisplayInfo(status);
        return (
            <Chip
                label={info.label}
                color={info.color}
                variant={isActive ? "filled" : "outlined"}
                size="small"
                sx={{
                    fontWeight: isActive ? 600 : 400,
                    ...(isActive && {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        transform: 'scale(1.05)'
                    })
                }}
            />
        );
    };

    return (
        <Card elevation={2} sx={{ borderRadius: 2, mt: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Status Transition Flow
                </Typography>

                {/* Open -> Closed/Deleted */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusChip(FundraisingStatus.Open)}
                        <ArrowForwardIcon fontSize="small" />
                        {getStatusChip(FundraisingStatus.Closed)}
                        <Typography variant="body2" color="text.secondary">or</Typography>
                        {getStatusChip(FundraisingStatus.Deleted)}
                    </Box>
                </Box>

                {/* Closed -> Open/ReadyForReview/Deleted */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        {getStatusChip(FundraisingStatus.Closed)}
                        <ArrowForwardIcon fontSize="small" />
                        {getStatusChip(FundraisingStatus.Open)}
                        <Typography variant="body2" color="text.secondary">or</Typography>
                        {getStatusChip(FundraisingStatus.ReadyForReview)}
                        <Typography variant="body2" color="text.secondary">or</Typography>
                        {getStatusChip(FundraisingStatus.Deleted)}
                    </Box>
                </Box>

                {/* Deleted -> Open */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusChip(FundraisingStatus.Deleted)}
                        <ArrowForwardIcon fontSize="small" />
                        {getStatusChip(FundraisingStatus.Open)}
                    </Box>
                </Box>

                <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0.5 }}>
                    <Typography variant="caption">
                        <strong>Note:</strong> ReadyForReview, Archived, and Hidden statuses can only be changed by administrators.
                    </Typography>
                </Alert>
            </CardContent>
        </Card>
    );
};

export default StatusTransitionFlow; 