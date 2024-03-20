import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { GetPostParams } from './params';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { Post } from '../../../../models/post';

export const getPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as GetPostParams;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
        },
        include: {
            author: true,
            likes: {
                where: {
                    userId: req.user?.id,
                },
            },
        },
    });

    const likes = await prisma.like.groupBy({
        by: ['postId'],
        _count: {
            postId: true,
        },
        where: {
            postId,
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

    const serializedPost = Post.fromPrisma(
        post,
        post.author,
        likes[0]?._count.postId || 0,
        req.user?.id ? post.likes.length > 0 : null,
    );

    res.status(200).json({
        data: serializedPost,
    });
});
