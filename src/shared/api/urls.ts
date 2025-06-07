export const urls = {
    // Auth
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    confirmEmail: '/auth/confirm-email',
    refresh: '/auth/refresh-token',
    signInGoogle: '/google-auth/sign-in',
    signUpGoogle: '/google-auth/sign-up',

    // User
    me: '/users/me',
    changeEmail: '/users/change-email',
    confirmChangeEmail: '/users/confirm-change-email',
    resendConfirmationCode: '/auth/resend-confirmation-code',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    userAvatar: '/users/avatar',
    userInfo: '/users/me',
    addPassword: '/users/add-password',
    changePassword: '/users/change-password',
    searchUsers: '/users/search',
    makeAdmin: '/users/make-admin',
    userAction: '/users/action',
    inviteAdmin: '/users/invite-admin',
    user: (userId: string) => `/users/${userId}`,
    searchUsersMinimized: '/users/search-minimized'
} as const; 