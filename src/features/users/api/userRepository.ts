import api from '../../../shared/api/api';
import { urls } from '../../../shared/api/urls';
import { ApiResponse } from '../../../shared/models/api/pagination/ApiResponse';
import { PagedResponse } from '../../../shared/models/api/pagination/PagedResponse';
import User from '../models/User';
import { UserDetails, UserDetails as UserDetailsType } from '../models/UserDetails';
import { SearchUsersRequest } from '../models/UsersRequest';

export type UpdateUserInfo = { name: string, description: string };
export type AddPassword = { password: string };
export type ChangePassword = { oldPassword: string; newPassword: string };
export type ConfirmChangeEmail = { newEmail: string, code: number };
export type ResendCode = { userId: string };

export const userRepository = {
    async me(): Promise<ApiResponse<User>> {
        return await api.get<User>(urls.me);
    },

    async getUser(userId: string): Promise<ApiResponse<UserDetailsType>> {
        return await api.get<UserDetailsType>(urls.user(userId));
    },

    async changeEmail(newEmail: string): Promise<ApiResponse<{}>> {
        return await api.post<{ newEmail: string }, {}>(urls.changeEmail, { newEmail });
    },

    async confirmChangeEmail(request: ConfirmChangeEmail): Promise<ApiResponse<{}>> {
        return await api.post<ConfirmChangeEmail, {}>(urls.confirmChangeEmail, request);
    },

    async resendConfirmationCode(request: ResendCode): Promise<ApiResponse<{}>> {
        return await api.post<ResendCode, {}>(urls.resendConfirmationCode, request);
    },

    async forgotPassword(email: string): Promise<ApiResponse<{}>> {
        return await api.post<{ email: string }, {}>(urls.forgotPassword, { email });
    },

    async resetPassword(request: { email: string, token: string, newPassword: string }): Promise<ApiResponse<{}>> {
        return await api.post<typeof request, {}>(urls.resetPassword, request);
    },

    async uploadAvatar(file: File): Promise<ApiResponse<{}>> {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post<FormData, {}>(urls.userAvatar, formData);
    },

    async deleteAvatar(): Promise<ApiResponse<{}>> {
        return await api.delete(urls.userAvatar);
    },

    async updateInfo(request: UpdateUserInfo): Promise<ApiResponse<{}>> {
        return await api.put<UpdateUserInfo, {}>(urls.userInfo, request);
    },

    async addPassword(request: AddPassword): Promise<ApiResponse<{}>> {
        return await api.post<AddPassword, {}>(urls.addPassword, request);
    },

    async changePassword(request: ChangePassword): Promise<ApiResponse<{}>> {
        return await api.post<ChangePassword, {}>(urls.changePassword, request);
    },

    async getUsers(request: SearchUsersRequest, page: number, pageSize: number): Promise<ApiResponse<PagedResponse<User>>> {
        return await api.postPaginated<SearchUsersRequest, User>(urls.searchUsers, { request, page, pageSize });
    },

    async makeAdmin(userId: string): Promise<ApiResponse<{}>> {
        return await api.post<{ userId: string }, {}>(urls.makeAdmin, { userId });
    },

    async userAction(userId: string, action: 'block' | 'unblock'): Promise<ApiResponse<{}>> {
        return await api.post<{ userId: string, action: string }, {}>(urls.userAction, { userId, action });
    },

    async inviteAdmin(email: string): Promise<ApiResponse<{}>> {
        return await api.post<{ email: string }, {}>(urls.inviteAdmin, { email });
    },

    async getUsersMinimized(searchQuery: string): Promise<ApiResponse<UserDetails[]>> {
        return await api.get<UserDetails[]>(urls.searchUsersMinimized, { params: { searchQuery } });
    }
}; 