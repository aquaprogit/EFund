export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    adminToken?: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
    accessToken: string;
}

export { };

