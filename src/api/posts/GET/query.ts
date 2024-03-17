import { z } from 'zod';

export const getPostsQuerySchema = z.object({
    limit: z
        .number({
            invalid_type_error: 'Limit must be a number',
            coerce: true,
        })
        .int({
            message: 'Limit must be a non-negative integer',
        })
        .nonnegative({
            message: 'Limit must be a non-negative integer',
        })
        .default(36),
    offset: z
        .number({
            invalid_type_error: 'Offset must be a number',
            coerce: true,
        })
        .int({
            message: 'Offset must be a non-negative integer',
        })
        .nonnegative({
            message: 'Offset must be a non-negative integer',
        })
        .default(0),
    userId: z
        .number({
            invalid_type_error: 'User ID must be a number',
            coerce: true,
        })
        .int({
            message: 'User ID must be a non-negative integer',
        })
        .nonnegative({
            message: 'User ID must be a non-negative integer',
        })
        .optional(),
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
