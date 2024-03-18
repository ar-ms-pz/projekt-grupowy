import { Request, Response } from 'express';
import { EditPostParams } from './params';
import { EditPostDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../../middlewares/error-catcher';

export const editPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as EditPostParams;
    const { id: userId } = req.user as User;
    const dto: EditPostDto = req.body;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            authorId: userId,
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

    if (!post) {
        return res.status(404).json({
            errors: [
                {
                    message: 'Post not found',
                    path: ['postId'],
                    code: 'not_found',
                },
            ],
        });
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            description: dto.description,
        },
    });

    res.status(200).json({
        data: updatedPost,
    });
});
