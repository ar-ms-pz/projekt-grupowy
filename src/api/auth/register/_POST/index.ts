import { Request, Response } from 'express';
import { RegisterDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { hash } from 'argon2';
import { generateToken } from '../../../../auth/generate-token';
import {
    COOKIE_DOMAIN,
    COOKIE_NAME,
    SESSION_LENGTH_MS,
} from '../../../../config';
import { User } from '../../../../models/user';
import { serializeSession } from '../../../../auth/serialize-session';

export const register = async (req: Request, res: Response) => {
    const dto: RegisterDto = req.body;

    const hashedPassword = await hash(dto.password);

    let user;

    try {
        user = await prisma.user.create({
            data: {
                name: dto.username,
                password: hashedPassword,
                email: dto.email,
                phone: dto.phone,
            },
        });
    } catch (error) {
        res.status(400).json({
            errors: [
                {
                    error: 'Username already taken',
                    code: 'username_taken',
                    path: ['username'],
                },
            ],
        });

        return;
    }

    const token = generateToken();
    const tokenExpiry = new Date(Date.now() + SESSION_LENGTH_MS);

    const hashedToken = await hash(token);

    const session = await prisma.session.create({
        data: {
            userId: user.id,
            token: hashedToken,
            expiresAt: tokenExpiry,
        },
    });

    res.cookie(COOKIE_NAME, serializeSession(session, token), {
        expires: tokenExpiry,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: COOKIE_DOMAIN,
    });

    const serializedUser = User.fromPrisma(user);

    res.status(200).json({ data: serializedUser });
};
