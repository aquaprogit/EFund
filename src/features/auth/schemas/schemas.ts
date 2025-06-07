import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&.,:;])[A-Za-z\d@$!%*#?&.,:;]+$/;
const passwordMessage = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character';

export const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, passwordMessage);

export const signUpSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .trim(),
    email: z.string()
        .email('Email is invalid'),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export const addPasswordSchema = resetPasswordSchema;

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type AddPasswordFormData = z.infer<typeof addPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>; 