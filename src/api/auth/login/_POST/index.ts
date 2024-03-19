import { Request, Response } from 'express';
import { LoginDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { verify } from 'argon2';
import { generateToken } from '../../../../auth/generateToken';
import { COOKIE_NAME, SESSION_LENGTH_MS } from '../../../../config';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { User } from '../../../../models/user';

export const login = errorCatcher(async (req: Request, res: Response) => {
    const { username, password }: LoginDto = req.body;

    const user = await prisma.user.findFirst({
        where: {
            name: username,
        },
    });

    if (!user) {
        res.status(401).json({
            error: 'Invalid credentials',
            code: 'invalid_credentials',
            path: [],
        });

        return;
    }

    const validPassword = await verify(user.password, password);

    if (!validPassword) {
        res.status(401).json({
            error: 'Invalid credentials',
            code: 'invalid_credentials',
            path: [],
        });

        return;
    }

    const token = generateToken();
    const tokenExpiry = new Date(Date.now() + SESSION_LENGTH_MS);

    await prisma.session.create({
        data: {
            userId: user.id,
            token,
            expiresAt: tokenExpiry,
        },
    });

    res.cookie(COOKIE_NAME, token, {
        expires: tokenExpiry,
        httpOnly: true,
    });

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({ data: serializedUser });
});
