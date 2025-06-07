import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { Notification } from "../models/Notification";
import { notificationsUrls as urls } from "./urls";

const notificationsRepository = {
    getNotifications: async (withRead: boolean = false): Promise<ApiResponse<Notification[]>> => {
        return await api.get<Notification[]>(urls.notifications, { withRead });
    },
    markAsRead: async (notificationId: string): Promise<ApiResponse<{}>> => {
        return await api.post<{}, {}>(urls.readNotification(notificationId), {});
    },
    markAllAsRead: async (notificationIds: string[]): Promise<ApiResponse<{}>> => {
        return await api.post<{ notificationIds: string[] }, {}>(urls.readNotifications, { notificationIds });
    }
}

export default notificationsRepository;