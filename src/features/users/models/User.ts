export default interface User {
    id: string;
    email: string;
    name: string;
    rating: number;
    isAdmin: boolean;
    avatarUrl: string;
    hasPassword: boolean;
    hasMonobankToken: boolean;
    description: string | null;
    isBlocked: boolean;
}