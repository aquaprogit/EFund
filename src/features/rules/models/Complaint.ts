import { ComplaintStatus } from "./ComplaintStatus";
import { Violation } from "./Violation";

export interface Complaint {
    id: string;
    number: number;
    status: ComplaintStatus;
    comment: string;
    requestedAt: string;
    reviewedAt?: string;
    fundraisingId: string;
    requestedBy: string;
    requestedByUserName: string;
    requestedFor: string;
    requestedForUserName: string;
    reviewedBy?: string;
    reviewedByUserName?: string;
    violations: Violation[];
}