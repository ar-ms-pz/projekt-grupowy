import { z } from 'zod';

export const getUsersQuerySchema = z.object({
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
    name: z
        .string()
        .min(3, {
            message: 'Username must be at least 3 characters long.',
        })
        .max(32, {
            message: 'Username can be at most 32 characters long.',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
                'Username can only contain letters, numbers, and underscores.',
        })
        .optional(),
});

export interface GetUsersQuery extends z.infer<typeof getUsersQuerySchema> {}
