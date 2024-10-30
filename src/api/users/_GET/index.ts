import { Request, Response } from 'express';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { User } from '../../../models/user';
import { UserType } from '@prisma/client';
import { GetUsersQuery } from './query';

export const getUsers = errorCatcher(async (req: Request, res: Response) => {
    const { limit, offset, name } = req.query as unknown as GetUsersQuery;
    const { type } = req.user!;

    if (type !== UserType.ADMIN)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to see all users`,
        });

    const totalUsers = await prisma.user.count({
        where: {
            name: {
                contains: name,
            },
        },
    });

    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: name,
            },
        },
        skip: offset,
        take: limit,
    });

    const serializedUsers = users.map((user) => User.fromPrisma(user));

    res.status(200).json({
        data: serializedUsers,
        info: {
            total: totalUsers,
            limit,
            offset,
        },
    });
});
