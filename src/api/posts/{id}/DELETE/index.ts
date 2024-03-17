import { Request, Response } from 'express';
import { DeletePostParams } from './params';
import { prisma } from '../../../../db/prisma';
import { rmSync } from 'fs';

export const deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as DeletePostParams;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
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

    rmSync(post.image);
    await prisma.post.delete({
        where: {
            id: postId,
        },
    });

    res.status(200).json({
        data: null,
    });
};
