import { Session } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { generateToken } from '../../../../auth/generateToken';
import { COOKIE_NAME, SESSION_LENGTH_MS } from '../../../../config';
import { errorCatcher } from '../../../../middlewares/error-catcher';

export const extendSession = errorCatcher(
    async (req: Request, res: Response) => {
        const { id: sessionId } = req.session as Session;

        const token = generateToken();
        const tokenExpiry = new Date(Date.now() + SESSION_LENGTH_MS);

        await prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                token,
                expiresAt: tokenExpiry,
            },
        });

        res.cookie(COOKIE_NAME, token, {
            expires: tokenExpiry,
            httpOnly: true,
        });

        res.status(200).json({ data: req.user });
    },
);
