import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must not exceed 50 characters')
});

export type SignInFormData = z.infer<typeof signInSchema>; 