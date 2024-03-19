import { z } from 'zod';

export const setLikeDtoSchema = z.object({
    like: z.boolean(),
});

export type SetLikeDto = z.infer<typeof setLikeDtoSchema>;
