import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { GetPostParams } from './params';
import { errorCatcher } from '../../../../middlewares/error-catcher';

export const getPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as GetPostParams;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
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

    res.status(200).json({
        data: post,
    });
});
