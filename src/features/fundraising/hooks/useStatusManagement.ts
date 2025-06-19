import { useCallback, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { FundraisingStatus } from '../models/FundraisingStatus';
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import {
    canOwnerChangeStatus,
    getAvailableStatusActions,
    getStatusDisplayInfo,
    StatusAction
} from '../utils/statusTransitions';

interface UseStatusManagementProps {
    fundraisingId: string;
    currentStatus: FundraisingStatus;
    onStatusChange?: () => void;
}

export const useStatusManagement = ({
    fundraisingId,
    currentStatus,
    onStatusChange
}: UseStatusManagementProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState<{
        open: boolean;
        action: StatusAction | null;
    }>({ open: false, action: null });

    const { showError, showSuccess } = useToast();

    const statusInfo = getStatusDisplayInfo(currentStatus);
    const availableActions = getAvailableStatusActions(currentStatus);
    const canChange = canOwnerChangeStatus(currentStatus);

    const updateStatus = useCallback(async (targetStatus: FundraisingStatus, actionLabel: string) => {
        setIsUpdating(true);
        try {
            const response = await fundraisingsRepository.updateFundraisingStatus(
                fundraisingId,
                targetStatus
            );

            if (response?.error) {
                showError(response.error.message);
                return false;
            } else {
                showSuccess(`Fundraising status updated to ${actionLabel.toLowerCase()}`);
                onStatusChange?.();
                return true;
            }
        } catch (error) {
            showError('Failed to update status');
            return false;
        } finally {
            setIsUpdating(false);
        }
    }, [fundraisingId, showError, showSuccess, onStatusChange]);

    const handleStatusChange = useCallback(async (action: StatusAction) => {
        if (action.confirmationRequired) {
            setConfirmationDialog({ open: true, action });
            return;
        }

        await updateStatus(action.targetStatus, action.label);
    }, [updateStatus]);

    const confirmStatusChange = useCallback(async () => {
        if (confirmationDialog.action) {
            const success = await updateStatus(
                confirmationDialog.action.targetStatus,
                confirmationDialog.action.label
            );
            if (success) {
                setConfirmationDialog({ open: false, action: null });
            }
        }
    }, [confirmationDialog.action, updateStatus]);

    const cancelStatusChange = useCallback(() => {
        setConfirmationDialog({ open: false, action: null });
    }, []);

    return {
        // Status info
        statusInfo,
        availableActions,
        canChange,
        currentStatus,

        // Loading state
        isUpdating,

        // Confirmation dialog
        confirmationDialog,

        // Actions
        handleStatusChange,
        confirmStatusChange,
        cancelStatusChange,
        updateStatus
    };
};

export default useStatusManagement; 