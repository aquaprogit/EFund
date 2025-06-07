export const ComplaintReviewResultAction = {
    Accept: 1,
    Reject: 2,
    RequestChanges: 3
} as const;

export type ComplaintReviewResultAction = typeof ComplaintReviewResultAction[keyof typeof ComplaintReviewResultAction];