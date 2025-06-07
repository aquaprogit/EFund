import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { PagedResponse } from "../../../shared/models/api/pagination/PagedResponse";
import { Complaint } from "../models/Complaint";
import { ComplaintAcceptRequest, ComplaintRejectRequest, ComplaintRequestChangesRequest } from "../models/ComplaintAcceptRequest";
import { ComplaintsCount } from "../models/ComplaintsCount";
import { ComplaintStatus } from "../models/ComplaintStatus";
import { CreateComplaintRequest } from "../models/CreateComplaintRequest";
import { urls } from "./urls";

export const complaintRepository = {
    createComplaint: async (request: CreateComplaintRequest): Promise<ApiResponse<Complaint>> => {
        return await api.post<CreateComplaintRequest, Complaint>(urls.createComplaint, request);
    },

    getComplaints: async (status?: ComplaintStatus, page: number = 1, pageSize: number = 10): Promise<ApiResponse<PagedResponse<Complaint>>> => {
        return await api.getPaginated<Complaint>(urls.getComplaints, { page, pageSize, request: { status } });
    },

    getComplaint: async (id: string): Promise<ApiResponse<Complaint>> => {
        return await api.get<Complaint>(urls.getComplaint(id));
    },

    rejectComplaint: async (request: ComplaintRejectRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintRejectRequest, {}>(urls.rejectComplaint, request);
    },

    acceptComplaint: async (request: ComplaintAcceptRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintAcceptRequest, {}>(urls.acceptComplaint, request);
    },

    requestChanges: async (request: ComplaintRequestChangesRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintRequestChangesRequest, {}>(urls.requestChanges, request);
    },

    getComplaintsTotals: async (): Promise<ApiResponse<ComplaintsCount>> => {
        const result = await api.get<{
            totalsByStatus: ComplaintsCount;
            overallTotal: number;
        }>(urls.getComplaintsTotals);

        if (result.isSuccess && result.data) {
            return { isSuccess: true, data: { ...result.data.totalsByStatus, All: result.data.overallTotal } };
        }

        return { isSuccess: false, error: result.error };
    }
};
