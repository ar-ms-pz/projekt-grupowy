import { Session } from '@prisma/client';
import { prisma } from '../../../../db/prisma';
import { Request, Response } from 'express';
import { COOKIE_NAME } from '../../../../config';
import { errorCatcher } from '../../../../middlewares/error-catcher';

export const logout = errorCatcher(async (req: Request, res: Response) => {
    const { id: sessionId } = req.session as Session;

    await prisma.session.delete({
        where: {
            id: sessionId,
        },
    });

    res.clearCookie(COOKIE_NAME);

    res.status(200).json({ data: null });
});
