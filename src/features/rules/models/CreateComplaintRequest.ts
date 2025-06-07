export interface CreateComplaintRequest {
    fundraisingId: string;
    comment?: string;
    violationIds: string[];
}