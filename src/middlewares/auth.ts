import { NextFunction, Request, Response } from 'express';
import { COOKIE_NAME } from '../config';
import { prisma } from '../db/prisma';
import { errorCatcher } from './error-catcher';

export const auth = (isMandatory = true) =>
    errorCatcher(async (req: Request, res: Response, next: NextFunction) => {
        const cookie: string | undefined = req.cookies?.[COOKIE_NAME];

        if (!cookie) {
            if (!isMandatory) next();
            return res.status(401).json({
                errors: [
                    {
                        message: 'Unauthorized',
                        code: 'unauthorized',
                        path: [],
                    },
                ],
            });
        }

        const session = await prisma.session.findFirst({
            where: {
                token: cookie,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!session) {
            if (!isMandatory) next();

            return res.status(401).json({
                errors: [
                    {
                        message: 'Unauthorized',
                        code: 'unauthorized',
                        path: [],
                    },
                ],
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                id: session.userId,
            },
        });

        if (!user) {
            if (!isMandatory) next();

            return res.status(401).json({
                errors: [
                    {
                        message: 'Unauthorized',
                        code: 'unauthorized',
                        path: [],
                    },
                ],
            });
        }

        req.user = user;
        req.session = session;

        next();
    });
