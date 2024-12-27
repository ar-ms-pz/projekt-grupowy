import { z } from 'zod';

export const setLikeDtoSchema = z.object({
    favorite: z.boolean(),
});

export type SetLikeDto = z.infer<typeof setLikeDtoSchema>;
