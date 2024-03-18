import { NextFunction, Request, Response } from 'express';
import { COOKIE_NAME } from '../config';
import { prisma } from '../db/prisma';
import { errorCatcher } from './error-catcher';

export const auth = errorCatcher(
    async (req: Request, res: Response, next: NextFunction) => {
        const cookie: string | undefined = req.cookies?.[COOKIE_NAME];

        if (!cookie) {
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
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });

        if (!user) {
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
    },
);
