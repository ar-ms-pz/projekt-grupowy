import { Request, Response } from 'express';
import { EditUserDto } from './dto';
import { UserType } from '@prisma/client';
import { hash } from 'argon2';
import { User } from '../../../../models/user';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { prisma } from '../../../../db/prisma';
import { EditUserParams } from './params';

export const editUser = errorCatcher(async (req: Request, res: Response) => {
    const { password, type } = req.body as unknown as EditUserDto;
    const currentUserType = req.user!.type;
    const { userId } = req.params as unknown as EditUserParams;

    if (currentUserType !== UserType.ADMIN)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to edit users`,
        });

    const editedUser = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (currentUserType !== UserType.ADMIN && type !== editedUser?.type)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to change user role`,
        });

    const hashedPassword = password ? await hash(password) : undefined;

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
            type,
        },
    });

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({
        data: serializedUser,
    });
});
