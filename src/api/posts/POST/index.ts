import { Request, Response } from 'express';
import { CreatePostDto } from './dto';
import { prisma } from '../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../middlewares/error-catcher';

export const createPost = errorCatcher(async (req: Request, res: Response) => {
    const dto: CreatePostDto = req.body;
    const { id: userId } = req.user as User;
    const image = req.file as Express.Multer.File;

    const post = await prisma.post.create({
        data: {
            image: image.path,
            description: dto.description,
            author: {
                connect: {
                    id: userId,
                },
            },
        },
        select: {
            id: true,
            description: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });

    res.status(201).json({ data: post });
});
