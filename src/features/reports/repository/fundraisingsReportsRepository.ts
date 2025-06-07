import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";

export type AddReportBody = {
    title: string,
    description: string,
    fundraisingId: string
}

export const fundraisingsReportsRepository = {
    addReport: async (body: AddReportBody): Promise<ApiResponse<{}>> => {
        return await api.post(urls.fundraisingsReports, body)
    },
    addAttachments: async (id: string, body: FormData): Promise<ApiResponse<{}>> => {
        return await api.post(urls.fundraisingsReportsAttachments(id), body)
    },
    getReport: async (id: string): Promise<ApiResponse<{}>> => {
        return await api.get(urls.fundraisingsReportsReport(id))
    },
    deleteReport: async (id: string): Promise<ApiResponse<{}>> => {
        return await api.delete(urls.fundraisingsReportsReport(id))
    },
    deleteAttachment: async (reportId: string, id: string): Promise<ApiResponse<{}>> => {
        return await api.delete(urls.fundraisingsReportsReportAttachment(reportId, id))
    }
}

export const urls = {
    fundraisingsReports: '/fundraising-reports',
    fundraisingsReportsAttachments: (id: string) => `/fundraising-reports/${id}/attachments`,
    fundraisingsReportsReport: (id: string) => `/fundraising-reports/${id}`,
    fundraisingsReportsReportAttachment: (reportId: string, id: string) => `/fundraising-reports/${reportId}/attachments/${id}`
} as const;
