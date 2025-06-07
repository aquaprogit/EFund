export type UserDetails = {
    id: string;
    email: string;
    name: string;
    description: string;
    avatarUrl: string;
    hasPassword: boolean;
    hasMonobankToken: boolean;
    isAdmin: boolean;
    createdAt: string;
    rating: number;
    badges: Badge[];
    notifications: Notification[];
}

export type Badge = {
    type: number;
    title: string;
    description: string;
}

export type Notification = {
    userId: string;
    reason: number;
    isRead: boolean;
    message: string;
}