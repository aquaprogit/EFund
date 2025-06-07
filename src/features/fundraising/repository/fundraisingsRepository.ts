import { api } from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { PagedResponse } from "../../../shared/models/api/pagination/PagedResponse";
import Fundraising from "../models/Fundraising";
import { SearchFundraisingsRequest } from "../models/FundraisingsRequests";
import { FundraisingStatus } from "../models/FundraisingStatus";
import { urls } from "./urls";

type AddFundraisingBody = {
    title: string,
    description: string,
    monobankJarId: string,
    tags: Array<string>
}

export const fundraisingsRepository = {
    getFundraisings: async (request: SearchFundraisingsRequest, page: number, pageSize: number): Promise<ApiResponse<PagedResponse<Fundraising>> | undefined> => {
        return await api.postPaginated<SearchFundraisingsRequest, Fundraising>(urls.fundraisingSearch, { page, pageSize, request });
    },

    getMyFundraising: async (page: number, pageSize: number): Promise<ApiResponse<PagedResponse<Fundraising>> | undefined> => {
        return await api.getPaginated<Fundraising>(urls.myFundraising, { page, pageSize, request: {} })
    },

    getFundraising: async (id: string): Promise<ApiResponse<Fundraising> | undefined> => {
        return await api.get<Fundraising>(urls.fundraising(id));
    },
    createFundraising: async (requestBody: AddFundraisingBody): Promise<ApiResponse<Fundraising>> => {
        return await api.post<AddFundraisingBody, Fundraising>(urls.fundraisingCreate, requestBody)
    },

    deleteFundraising: async (id: string): Promise<ApiResponse<{}>> => {
        return await api.delete(urls.fundraising(id))
    },

    uploadImage: async (id: string, file: File): Promise<ApiResponse<{}>> => {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post(urls.fundraisingAvatar(id), formData)
    },
    deleteImage: async (id: string): Promise<ApiResponse<{}>> => {
        return await api.delete(urls.fundraisingAvatar(id))
    },
    updateFundraising: async (id: string, requestBody: AddFundraisingBody): Promise<ApiResponse<Fundraising>> => {
        return await api.put<AddFundraisingBody, Fundraising>(urls.fundraising(id), requestBody)
    },

    updateFundraisingStatus: async (id: string, status: FundraisingStatus): Promise<ApiResponse<Fundraising>> => {
        return await api.put<{ status: FundraisingStatus }, Fundraising>(urls.updateFundraisingStatus(id), { status })
    },

    // updateFundraisingStatusByAdmin: async (id: string, status: FundraisingStatus): Promise<ApiResponse<Fundraising>> => {
    //     return await api.put<{ status: FundraisingStatus }, Fundraising>(urls.updateFundraisingStatusByAdmin(id), { status })
    // }
};