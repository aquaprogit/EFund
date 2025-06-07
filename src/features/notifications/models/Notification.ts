export interface Notification {
    id: string;
    userId: string;
    reason: NotificationReason;
    isRead: boolean;
    args: ComplaintAcceptedArgs | FundraisingComplaintAcceptedArgs | FundraisingNeedChangesArgs;
}

type ComplaintAcceptedArgs = {
}

type FundraisingComplaintAcceptedArgs = {
    fundraisingId: string;
    fundraisingTitle: string;
    violations: string[];
}

type FundraisingNeedChangesArgs = {
    fundraisingId: string;
    fundraisingTitle: string;
    message: string;
}

export enum NotificationReason {
    Empty = 0,
    // for user who requested for complaint and it was accepted
    ComplaintAccepted = 1,
    // for user whose fundraising's complaint was accepted
    FundraisingComplaintAccepted = 2,
    // for user whose fundraising's need changes
    FundraisingNeedChanges = 3,
}
