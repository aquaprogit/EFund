import api from '../../../shared/api/api';
import { urls } from '../../../shared/api/urls';
import { ApiResponse } from '../../../shared/models/api/pagination/ApiResponse';
import { AuthResponse } from '../models/AuthResponse';
import { ConfirmEmailRequest } from '../models/ConfirmEmailRequest';
import { SignInRequest } from '../models/SignInRequest';
import { SignUpRequest } from '../models/SignUpRequest';
import { SignUpResponse } from '../models/SignUpResponse';

export const authRepository = {
    async signIn(request: SignInRequest): Promise<ApiResponse<AuthResponse>> {
        return await api.post<SignInRequest, AuthResponse>(urls.signIn, request);
    },

    async signUp(request: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
        return await api.post<SignUpRequest, SignUpResponse>(urls.signUp, request);
    },

    async confirmEmail(request: ConfirmEmailRequest): Promise<ApiResponse<AuthResponse>> {
        return await api.post<ConfirmEmailRequest, AuthResponse>(urls.confirmEmail, request);
    },

    async refresh(accessToken: string, refreshToken: string): Promise<ApiResponse<AuthResponse>> {
        return await api.post<{ accessToken: string; refreshToken: string }, AuthResponse>(
            urls.refresh,
            { accessToken, refreshToken }
        );
    },

    async googleSignIn(token: string): Promise<ApiResponse<AuthResponse>> {
        return await api.post<{}, AuthResponse>(urls.signInGoogle, {}, { 'Authorization-Code': token });
    },

    async googleSignUp(token: string): Promise<ApiResponse<AuthResponse>> {
        return await api.post<{}, AuthResponse>(urls.signUpGoogle, {}, { 'Authorization-Code': token });
    }
}; 