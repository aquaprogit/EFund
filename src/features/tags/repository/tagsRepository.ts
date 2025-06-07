import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { Tag } from "../models/Tag";
import { urls } from "./urls";

export const tagsRepository = {
    getTags: async (): Promise<ApiResponse<Tag[]>> => {
        return await api.get<Tag[]>(urls.tags);
    },
};