import { NextFunction, Request, Response } from 'express';
import { COOKIE_NAME } from '../config';
import { prisma } from '../db/prisma';
import { errorCatcher } from './error-catcher';
import { deserializeSession } from '../auth/deserialize-session';
import { verify } from 'argon2';

const sendUnauthorized = (res: Response) => {
    res.status(401).json({
        errors: [
            {
                message: 'Unauthorized',
                code: 'unauthorized',
                path: [],
            },
        ],
    });
};

export const auth = (isMandatory = true) =>
    errorCatcher(async (req: Request, res: Response, next: NextFunction) => {
        const cookie: string | undefined = req.cookies?.[COOKIE_NAME];

        const cookieSession = cookie ? deserializeSession(cookie) : undefined;

        if (!cookieSession?.id)
            return isMandatory ? sendUnauthorized(res) : next();

        const session = await prisma.session.findFirst({
            where: {
                id: cookieSession.id,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!session) return isMandatory ? sendUnauthorized(res) : next();

        const isTokenValid = await verify(session.token, cookieSession.token);

        if (!isTokenValid) return isMandatory ? sendUnauthorized(res) : next();

        const user = await prisma.user.findFirst({
            where: {
                id: session.userId,
            },
        });

        if (!user) return isMandatory ? sendUnauthorized(res) : next();

        req.user = user;
        req.session = session;

        next();
    });
