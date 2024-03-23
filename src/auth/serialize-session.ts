import { Session } from '@prisma/client';

export const serializeSession = (session: Session, plainToken: string) => {
    const sessionData = {
        id: session.id,
        userId: session.userId,
        token: plainToken,
    };

    return JSON.stringify(sessionData);
};
