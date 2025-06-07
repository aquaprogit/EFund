import { api } from "../../../shared/api/api";

import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { CreateReviewRequest } from "../models/CreateReviewRequest";
import urls from "./urls";

const reviewsRepository = {
    createReview: async (request: CreateReviewRequest): Promise<ApiResponse<{}>> => {
        return await api.post<CreateReviewRequest, {}>(urls.reviews, request)
    }
}

export default reviewsRepository;
