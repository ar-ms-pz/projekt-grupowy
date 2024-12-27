import { z } from 'zod';
<<<<<<< HEAD
<<<<<<< HEAD
import { PostStatus, PostType } from '@prisma/client';
=======
import { coordinates } from '../../../schemas/coordinates';
>>>>>>> parent of dd397bb (Make geo posts work)
=======
>>>>>>> parent of 187282f (Add post)

export const createPostDtoSchema = z.object({
    description: z
        .string()
        .max(255, {
            message: 'Description can be at most 255 characters long.',
        })
        .optional(),
});

export type CreatePostDto = z.infer<typeof createPostDtoSchema>;
