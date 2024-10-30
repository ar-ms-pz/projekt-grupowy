import { Request, Response } from 'express';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { CreateUserDto } from './dto';
import { User } from '../../../models/user';
import { UserType } from '@prisma/client';
import { hash } from 'argon2';

export const createUser = errorCatcher(async (req: Request, res: Response) => {
    const { name, password, type } = req.body as unknown as CreateUserDto;
    const currentUserType = req.user!.type;

    if (currentUserType !== UserType.ADMIN)
        return res.status(403).json({
            message: `Role '${UserType.ADMIN}' is required to edit users`,
        });

    const userExists = await prisma.user.findFirst({
        where: {
            name,
        },
    });

    if (userExists)
        return res.status(400).json({
            errors: [
                {
                    error: 'User already exists',
                    code: 'already_exists',
                    path: ['name'],
                },
            ],
        });

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            type,
        },
    });

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({
        data: serializedUser,
    });
});
