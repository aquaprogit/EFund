export enum FundraisingStatus {
    // PUBLIC: Fundraising just created and visible to the public (default)
    Open = 0,
    // PUBLIC: Fundraising funded enough and don't need more donations (set by owner)
    Closed = 1,
    // PUBLIC (AS CLOSED): Fundraising is ready for review by the admin (set by owner)
    ReadyForReview = 2,
    // PUBLIC: Fundraising is reviewed by the admin, marked as finished (set by admin)
    Archived = 3,
    // Fundraising is hidden from the public (set after review action 'Request changes')
    Hidden = 4,
    // Fundraising is deleted (set after review action 'Approve complaint')
    Deleted = 5,
    // Impossible status
    Impossible = 6
}

export const FundraisingStatusLabels = {
    [FundraisingStatus.Open]: 'Open',
    [FundraisingStatus.Closed]: 'Closed',
    [FundraisingStatus.ReadyForReview]: 'Ready for Review',
    [FundraisingStatus.Archived]: 'Archived',
    [FundraisingStatus.Hidden]: 'Hidden',
    [FundraisingStatus.Deleted]: 'Deleted',
    [FundraisingStatus.Impossible]: 'Impossible'
};


export const MapToPublicStatus = (internalStatus: FundraisingStatus): FundraisingStatus => {
    return internalStatus === FundraisingStatus.Open || internalStatus === FundraisingStatus.Closed ? internalStatus
        : internalStatus == FundraisingStatus.ReadyForReview ? FundraisingStatus.Closed :
            internalStatus == FundraisingStatus.Archived ? FundraisingStatus.Archived : FundraisingStatus.Impossible;
}

export const MapFromPublicStatus = (publicStatus: FundraisingStatus): FundraisingStatus[] => {
    return publicStatus === FundraisingStatus.Open ? [publicStatus]
        : publicStatus === FundraisingStatus.Closed ? [FundraisingStatus.Closed, FundraisingStatus.ReadyForReview]
            : publicStatus === FundraisingStatus.Archived ? [publicStatus] : [];
}
