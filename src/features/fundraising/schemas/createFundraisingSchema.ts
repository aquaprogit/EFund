import { z } from 'zod';

export const createFundraisingSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(70, 'Title must be at most 70 characters'),
    description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be at most 500 characters'),
    monobankJarId: z.string()
        .min(1, 'Please select a Monobank jar'),
    tags: z.array(z.string())
        .optional()
        .default([]),
});

export type CreateFundraisingData = z.infer<typeof createFundraisingSchema>; 