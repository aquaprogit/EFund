import { z } from 'zod';

const baseSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters'),
    email: z.string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must not exceed 50 characters'),
    confirmPassword: z.string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const signUpSchema = baseSchema;

export type SignUpFormData = z.infer<typeof baseSchema>;

export const transformSignUpData = (data: SignUpFormData) => {
    const { confirmPassword, ...rest } = data;
    return rest;
};

// If you need a type without confirmPassword for API calls
export type SignUpRequestData = Omit<SignUpFormData, 'confirmPassword'>; 