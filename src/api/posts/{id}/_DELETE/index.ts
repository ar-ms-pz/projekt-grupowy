import { Request, Response } from 'express';
import { DeletePostParams } from './params';
import { prisma } from '../../../../db/prisma';
import { rmSync } from 'fs';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../../middlewares/error-catcher';

export const deletePost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as DeletePostParams;
    const { id: userId } = req.user as User;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            authorId: userId,
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

    await prisma.post.delete({
        where: {
            id: postId,
        },
    });

    // TODO
    // rmSync(post.images);

    res.status(200).json({
        data: null,
    });
});
