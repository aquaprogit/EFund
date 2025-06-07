export const notificationsUrls = {
    notifications: '/notifications',
    readNotification: (id: string) => `/notifications/${id}/read`,
    readNotifications: '/notifications/batch-read',
} as const;