import { z } from 'zod';

export const editPostDtoSchema = z.object({
    description: z
        .string()
        .max(255, {
            message: 'Description can be at most 255 characters long.',
        })
        .optional(),
});

export type EditPostDto = z.infer<typeof editPostDtoSchema>;
