import { Session, User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { generateToken } from '../../../../auth/generate-token';
import {
    COOKIE_NAME,
    SESSION_LENGTH_MS,
} from '../../../../config';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { User } from '../../../../models/user';
import { serializeSession } from '../../../../auth/serialize-session';
import { hash } from 'argon2';

export const extendSession = errorCatcher(
    async (req: Request, res: Response) => {
        const { id: sessionId } = req.session as Session;

        const token = generateToken();
        const tokenExpiry = new Date(Date.now() + SESSION_LENGTH_MS);

        const hashedToken = await hash(token);

        const session = await prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                token: hashedToken,
                expiresAt: tokenExpiry,
            },
        });

        res.cookie(COOKIE_NAME, serializeSession(session, token), {
            expires: tokenExpiry,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: req.headers.origin?.replace('https://', '').replace('http://', '') || '',
        });

        const user = User.fromPrisma(req.user as PrismaUser);

        res.status(200).json({ data: user });
    },
);
