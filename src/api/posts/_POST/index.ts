import { Request, Response } from 'express';
import { CreatePostDto } from './dto';
import { prisma } from '../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';

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
    });

    const serializedPost = Post.fromPrisma(post, req.user as User, 0, false);

    res.status(201).json({ data: serializedPost });
});
