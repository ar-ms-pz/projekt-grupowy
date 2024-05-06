import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { User } from '../../../../models/user';
import { GetUserParams } from './params';

export const getUser = errorCatcher(async (req: Request, res: Response) => {
    const { userId } = req.params as unknown as GetUserParams;

    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (!user) {
        res.status(404).json({
            errors: [
                {
                    error: 'User not found',
                    code: 'not_found',
                    path: ['userId'],
                },
            ],
        });

        return;
    }

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({ data: serializedUser });
});
