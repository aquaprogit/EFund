import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    ManageAccounts as ManageAccountsIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Delete as DeleteIcon,
    Restore as RestoreIcon,
    Assessment as AssessmentIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useToast } from '../../../../contexts/ToastContext';
import { FundraisingStatus } from '../../models/FundraisingStatus';
import { fundraisingsRepository } from '../../repository/fundraisingsRepository';
import {
    getAvailableStatusActions,
    canOwnerChangeStatus,
    getStatusDisplayInfo,
    StatusAction
} from '../../utils/statusTransitions';

interface StatusManagementSectionProps {
    currentStatus: FundraisingStatus;
    fundraisingId: string;
    fundraisingTitle: string;
    onStatusChange: () => void; // Callback to refresh data
}

const noJumpForBoxStyle = {
    '&:hover': {
        transform: 'none !important'
    }
}

const StatusManagementSection = ({
    currentStatus,
    fundraisingId,
    fundraisingTitle,
    onStatusChange
}: StatusManagementSectionProps) => {
    const [confirmationDialog, setConfirmationDialog] = useState<{
        open: boolean;
        action: StatusAction | null;
    }>({ open: false, action: null });
    const [isUpdating, setIsUpdating] = useState(false);

    const { showError, showSuccess } = useToast();
    const statusInfo = getStatusDisplayInfo(currentStatus);
    const availableActions = getAvailableStatusActions(currentStatus);

    const getActionIcon = (iconName: string) => {
        switch (iconName) {
            case 'Lock': return <LockIcon />;
            case 'LockOpen': return <LockOpenIcon />;
            case 'Delete': return <DeleteIcon />;
            case 'Restore': return <RestoreIcon />;
            case 'Assessment': return <AssessmentIcon />;
            default: return <InfoIcon />;
        }
    };

    const handleStatusChange = async (action: StatusAction) => {
        if (action.confirmationRequired) {
            setConfirmationDialog({ open: true, action });
            return;
        }

        await executeStatusChange(action);
    };

    const executeStatusChange = async (action: StatusAction) => {
        setIsUpdating(true);
        try {
            const response = await fundraisingsRepository.updateFundraisingStatus(
                fundraisingId,
                action.targetStatus
            );

            if (response?.error) {
                showError(response.error.message);
            } else {
                showSuccess(`Fundraising status updated to ${action.label.toLowerCase()}`);
                onStatusChange(); // Refresh the data
            }
        } catch (error) {
            showError('Failed to update status');
        } finally {
            setIsUpdating(false);
            setConfirmationDialog({ open: false, action: null });
        }
    };

    const handleConfirmStatusChange = async () => {
        if (confirmationDialog.action) {
            await executeStatusChange(confirmationDialog.action);
        }
    };

    if (!canOwnerChangeStatus(currentStatus)) {
        return (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <ManageAccountsIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Campaign Status
                        </Typography>
                    </Box>

                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                variant="filled"
                                size="medium"
                            />
                        </Box>

                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            <Typography variant="body2">
                                {statusInfo.description}
                            </Typography>
                            {currentStatus === FundraisingStatus.ReadyForReview && (
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                                    Please wait for admin review. You cannot make changes while in review.
                                </Typography>
                            )}
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <ManageAccountsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Campaign Status
                        </Typography>
                    </Box>

                    <Stack spacing={3}>
                        {/* Current Status */}
                        <Box sx={{ ...noJumpForBoxStyle }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Current Status
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...noJumpForBoxStyle }}>
                                <Chip
                                    label={statusInfo.label}
                                    color={statusInfo.color}
                                    variant="filled"
                                    size="medium"
                                />
                                <Tooltip title={statusInfo.description}>
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {statusInfo.description}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Available Actions */}
                        <Box sx={{ ...noJumpForBoxStyle }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                Available Actions
                            </Typography>
                            <Stack spacing={2}>
                                {availableActions.map((action) => (
                                    <Button
                                        key={action.targetStatus}
                                        variant="outlined"
                                        color={action.color}
                                        startIcon={getActionIcon(action.icon)}
                                        onClick={() => handleStatusChange(action)}
                                        disabled={isUpdating}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            textAlign: 'left',
                                            borderRadius: 2,
                                            p: 2,
                                            textTransform: 'none'
                                        }}
                                    >
                                        <Box sx={{ flex: 1, ...noJumpForBoxStyle }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {action.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.description}
                                            </Typography>
                                        </Box>
                                    </Button>
                                ))}
                            </Stack>
                        </Box>

                        {/* Status Guidelines */}
                        <Alert severity="info" sx={{ borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                Status Guidelines:
                            </Typography>
                            <Typography variant="body2" component="div">
                                • <strong>Open:</strong> Fundraising accepts donations<br />
                                • <strong>Closed:</strong> Goal reached, no new donations needed<br />
                                • <strong>Ready for Review:</strong> Submitted for admin's review<br />
                                • <strong>Deleted:</strong> Hidden from public view
                            </Typography>
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmationDialog.open}
                onClose={() => setConfirmationDialog({ open: false, action: null })}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {confirmationDialog.action && getActionIcon(confirmationDialog.action.icon)}
                        <Typography variant="h6">
                            Confirm Status Change
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body1">
                            {confirmationDialog.action?.confirmationMessage}
                        </Typography>

                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            <Typography variant="body2">
                                <strong>Fundraising:</strong> {fundraisingTitle}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Action:</strong> {confirmationDialog.action?.label}
                            </Typography>
                        </Alert>

                        {confirmationDialog.action?.targetStatus === FundraisingStatus.ReadyForReview && (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                <Typography variant="body2">
                                    <strong>Note:</strong> Once submitted for review, you won't be able to edit
                                    this fundraising until the admin completes the review process.
                                </Typography>
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={() => setConfirmationDialog({ open: false, action: null })}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmStatusChange}
                        variant="contained"
                        color={confirmationDialog.action?.color || 'primary'}
                        disabled={isUpdating}
                        startIcon={confirmationDialog.action && getActionIcon(confirmationDialog.action.icon)}
                    >
                        {isUpdating ? 'Updating...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusManagementSection; 