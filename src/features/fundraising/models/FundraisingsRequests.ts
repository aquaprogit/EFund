export interface SearchFundraisingsRequest {
    title?: string;
    tags?: string[];
    statuses?: number[];
    userId?: string;
}