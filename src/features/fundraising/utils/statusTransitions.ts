import { FundraisingStatus, FundraisingStatusLabels } from '../models/FundraisingStatus';

export interface StatusAction {
    targetStatus: FundraisingStatus;
    label: string;
    description: string;
    color: 'primary' | 'success' | 'warning' | 'error' | 'info';
    icon: string; // Material-UI icon name
    confirmationRequired: boolean;
    confirmationMessage?: string;
}

/**
 * Get available status actions based on current status and user permissions
 * Rules:
 * - Open -> Closed, Deleted
 * - Closed -> ReadyForReview, Open, Deleted  
 * - ReadyForReview -> No changes allowed (only admin can change)
 * - Archived -> No changes allowed (only admin can change)
 * - Hidden -> No changes allowed (only admin can change)
 * - Deleted -> Open
 */
export const getAvailableStatusActions = (currentStatus: FundraisingStatus): StatusAction[] => {
    const actions: StatusAction[] = [];

    switch (currentStatus) {
        case FundraisingStatus.Open:
            actions.push(
                {
                    targetStatus: FundraisingStatus.Closed,
                    label: 'Mark as Closed',
                    description: 'Mark this fundraising as completed - stops accepting new donations',
                    color: 'warning',
                    icon: 'Lock',
                    confirmationRequired: true,
                    confirmationMessage: 'Are you sure you want to close this fundraising? You can reopen it later if needed.'
                },
                {
                    targetStatus: FundraisingStatus.Deleted,
                    label: 'Delete',
                    description: 'Hide this fundraising from public view',
                    color: 'error',
                    icon: 'Delete',
                    confirmationRequired: true,
                    confirmationMessage: 'Are you sure you want to delete this fundraising? You can restore it later.'
                }
            );
            break;

        case FundraisingStatus.Closed:
            actions.push(
                {
                    targetStatus: FundraisingStatus.ReadyForReview,
                    label: 'Submit for Review',
                    description: 'Submit this fundraising for admin review to mark it as archived',
                    color: 'info',
                    icon: 'Assessment',
                    confirmationRequired: true,
                    confirmationMessage: 'Submit this fundraising for admin review? Once submitted, you cannot make changes until reviewed.'
                },
                {
                    targetStatus: FundraisingStatus.Open,
                    label: 'Reopen',
                    description: 'Reopen this fundraising to continue accepting donations',
                    color: 'success',
                    icon: 'LockOpen',
                    confirmationRequired: false
                },
                {
                    targetStatus: FundraisingStatus.Deleted,
                    label: 'Delete',
                    description: 'Hide this fundraising from public view',
                    color: 'error',
                    icon: 'Delete',
                    confirmationRequired: true,
                    confirmationMessage: 'Are you sure you want to delete this fundraising? You can restore it later.'
                }
            );
            break;

        case FundraisingStatus.Deleted:
            actions.push({
                targetStatus: FundraisingStatus.Open,
                label: 'Restore',
                description: 'Restore this fundraising and make it public again',
                color: 'success',
                icon: 'Restore',
                confirmationRequired: false
            });
            break;

        // These statuses can only be changed by admin
        case FundraisingStatus.ReadyForReview:
        case FundraisingStatus.Archived:
        case FundraisingStatus.Hidden:
        default:
            // No actions available for owner
            break;
    }

    return actions;
};

/**
 * Check if the owner can change the status
 */
export const canOwnerChangeStatus = (currentStatus: FundraisingStatus): boolean => {
    return getAvailableStatusActions(currentStatus).length > 0;
};

/**
 * Get status info for display
 */
export const getStatusDisplayInfo = (status: FundraisingStatus) => {
    switch (status) {
        case FundraisingStatus.Open:
            return {
                label: FundraisingStatusLabels[status],
                color: 'success' as const,
                description: 'This fundraising is actively accepting donations',
                canEdit: true
            };
        case FundraisingStatus.Closed:
            return {
                label: FundraisingStatusLabels[status],
                color: 'warning' as const,
                description: 'This fundraising has been closed but can be reopened',
                canEdit: true
            };
        case FundraisingStatus.ReadyForReview:
            return {
                label: FundraisingStatusLabels[status],
                color: 'info' as const,
                description: 'This fundraising is awaiting admin review',
                canEdit: false
            };
        case FundraisingStatus.Archived:
            return {
                label: FundraisingStatusLabels[status],
                color: 'default' as const,
                description: 'This fundraising has been archived by admin',
                canEdit: false
            };
        case FundraisingStatus.Hidden:
            return {
                label: FundraisingStatusLabels[status],
                color: 'error' as const,
                description: 'This fundraising is hidden by admin',
                canEdit: false
            };
        case FundraisingStatus.Deleted:
            return {
                label: FundraisingStatusLabels[status],
                color: 'error' as const,
                description: 'This fundraising has been deleted',
                canEdit: true
            };
        default:
            return {
                label: 'Unknown',
                color: 'default' as const,
                description: 'Unknown status',
                canEdit: false
            };
    }
}; 