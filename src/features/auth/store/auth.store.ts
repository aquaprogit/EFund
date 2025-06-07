import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ConfirmEmailRequest } from '../models/ConfirmEmailRequest';
import { SignInRequest } from '../models/SignInRequest';
import { SignUpRequest } from '../models/SignUpRequest';
import { authRepository } from '../repository/authRepository';

type AuthState = {
    isAuth: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    signUpUserId: string | null;
    signIn: (request: SignInRequest) => Promise<string | undefined>;
    signUp: (request: SignUpRequest) => Promise<{ userId: string | undefined, error: string | undefined }>;
    confirmEmail: (request: ConfirmEmailRequest) => Promise<{ success: boolean, error: string | undefined }>;
    signOut: () => void;
    refresh: (accessToken: string, refreshToken: string) => void;
    googleSignIn: (token: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            isAuth: false,
            accessToken: null,
            refreshToken: null,
            signUpUserId: null,
            signIn: async (request: SignInRequest) => {
                const response = await authRepository.signIn(request);

                if (response.isSuccess && response.data?.accessToken) {
                    set({
                        isAuth: true,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                    return undefined;
                }
                return response.error?.message;
            },
            signOut: () => {
                set({
                    isAuth: false,
                    accessToken: null,
                    refreshToken: null,
                    signUpUserId: null
                });
            },
            signUp: async (request: SignUpRequest) => {
                const response = await authRepository.signUp(request);

                if (response.isSuccess && response.data?.userId) {
                    set({
                        signUpUserId: response.data.userId
                    });
                    return { userId: response.data.userId, error: undefined };
                }
                return { userId: undefined, error: response.error?.message };
            },
            confirmEmail: async (request: ConfirmEmailRequest) => {
                const response = await authRepository.confirmEmail(request);

                if (response.isSuccess && response.data?.accessToken) {
                    set({
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                        isAuth: true,
                        signUpUserId: null
                    });
                    return { success: true, error: undefined };
                }
                return { success: false, error: response.error?.message };
            },
            refresh: (accessToken: string, refreshToken: string) => {
                set({
                    isAuth: true,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            },
            googleSignIn: async (token: string) => {
                const response = await authRepository.googleSignIn(token);

                if (response.isSuccess && response.data) {
                    set({
                        isAuth: true,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 