import { z } from 'zod';

export const editUserParamsSchema = z.object({
    userId: z
        .number({
            invalid_type_error: 'postId must be a number',
            coerce: true,
        })
        .int({
            message: 'postId must be a non-negative integer',
        })
        .nonnegative({
            message: 'postId must be a non-negative integer',
        }),
});

export type EditUserParams = z.infer<typeof editUserParamsSchema>;
