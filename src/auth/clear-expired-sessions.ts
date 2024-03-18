import { prisma } from '../db/prisma';

export const clearExpiredSessions = async () => {
    await prisma.session.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(),
            },
        },
    });
};
