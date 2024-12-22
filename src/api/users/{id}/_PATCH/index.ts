import { Request, Response } from 'express';
import { EditUserDto } from './dto';
import { UserType } from '@prisma/client';
import { hash } from 'argon2';
import { User } from '../../../../models/user';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { prisma } from '../../../../db/prisma';
import { EditUserParams } from './params';

export const editUser = errorCatcher(async (req: Request, res: Response) => {
    const { password, type, phone, email } = req.body as unknown as EditUserDto;
    const currentUserType = req.user!.type;
    const currentUserId = req.user!.id;
    const { userId } = req.params as unknown as EditUserParams;

    if (currentUserType !== UserType.ADMIN && currentUserId !== userId)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to edit other users`,
        });

    const hashedPassword = password ? await hash(password) : undefined;

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
            phone,
            email,
            type,
        },
    });

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({
        data: serializedUser,
    });
});
