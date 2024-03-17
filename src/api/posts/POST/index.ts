import { Request, Response } from 'express';
import { CreatePostDto } from './dto';
import { prisma } from '../../../db/prisma';

export const createPost = async (req: Request, res: Response) => {
    const dto: CreatePostDto = req.body;
    const image = req.file as Express.Multer.File;

    const post = await prisma.post.create({
        data: {
            image: image.path,
            description: dto.description,
        },
    });

    res.status(201).json({ data: post });
};
