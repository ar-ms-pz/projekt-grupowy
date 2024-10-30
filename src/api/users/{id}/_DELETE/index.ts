import { Request, Response } from 'express';
import { UserType } from '@prisma/client';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { prisma } from '../../../../db/prisma';
import { DeleteUserParams } from './params';

export const deleteUser = errorCatcher(async (req: Request, res: Response) => {
    const currentUserType = req.user!.type;
    const { userId } = req.params as unknown as DeleteUserParams;

    if (currentUserType !== UserType.ADMIN)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to delete users`,
        });

    await prisma.user.delete({
        where: {
            id: userId,
        },
    });

    res.status(200).json({
        data: null,
    });
});
