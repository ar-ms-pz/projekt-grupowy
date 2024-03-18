import { Request, Response } from 'express';
import { RegisterDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { hash } from 'argon2';
import { generateToken } from '../../../../auth/generateToken';
import { COOKIE_NAME, SESSION_LENGTH_MS } from '../../../../config';

export const register = async (req: Request, res: Response) => {
    const dto: RegisterDto = req.body;

    const hashedPassword = await hash(dto.password);

    let user;

    try {
        user = await prisma.user.create({
            data: {
                name: dto.username,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    } catch (error) {
        res.status(400).json({
            error: 'Username already taken',
            code: 'username_taken',
            path: ['username'],
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

    res.status(200).json({ data: user });
};
