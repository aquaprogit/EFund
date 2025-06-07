import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { ViolationGroup } from "../models/ViolationGroup";
import { urls } from "./urls";


export const violationsRepository = {
    getViolationsGroups: async (): Promise<ApiResponse<ViolationGroup[]>> => {
        return await api.get<ViolationGroup[]>(urls.getViolations);
    }
};
