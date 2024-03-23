import { z } from 'zod';

const sessionSchema = z.object({
    id: z.number().nonnegative(),
    userId: z.number().nonnegative(),
    token: z.string(),
});

export const deserializeSession = (sessionData: string) => {
    const session = JSON.parse(sessionData);

    const validatedSession = sessionSchema.safeParse(session);

    if (!validatedSession.success) {
        return undefined;
    }

    return validatedSession.data;
};
