export type ComplaintAcceptRequest = {
    complaintId: string;
    ratingChange: number;
};

export type ComplaintRejectRequest = {
    complaintId: string;
};

export type ComplaintRequestChangesRequest = {
    complaintId: string;
    message: string;
};
