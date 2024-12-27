import { Request, Response } from 'express';
import { GetPostsQuery } from './query';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';

export const getPosts = errorCatcher(async (req: Request, res: Response) => {
<<<<<<< HEAD
    const dto = req.query as unknown as GetPostsQuery;
    const { limit, offset } = dto;
    const currentUserId = req.user?.id;

    if (query.isFavorite && !currentUserId) {
        res.status(403).json({
            error: 'Unauthorized',
            message: 'You need to be logged in to see your favorites',
        });
        return;
    }
=======
    const { limit, offset, userId } = req.query as unknown as GetPostsQuery;
>>>>>>> parent of dd397bb (Make geo posts work)

    const postCount = await prisma.post.count({
        where: {
            authorId: userId,
        },
    });

    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        where: {
            authorId: userId,
        },
        skip: offset,
        take: limit,
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
            postId: {
                in: posts.map((post) => post.id),
            },
        },
    });

    const serializedPosts = posts.map((post) => {
        const like = likes.find((like) => like.postId === post.id);

        return Post.fromPrisma(
            post,
            post.author,
            like?._count.postId || 0,
            req.user?.id ? post.likes.length > 0 : null,
        );
    });

    res.status(200).json({
        data: serializedPosts,
        info: {
            limit,
            offset,
            total: postCount,
        },
    });
});
