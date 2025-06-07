import { z } from 'zod';

export const changeEmailSchema = z.object({
    newEmail: z.string()
        .email('Invalid email format')
        .min(1, 'New email is required')
});

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>; 