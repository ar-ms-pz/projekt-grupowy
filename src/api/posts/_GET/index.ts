import { Request, Response } from 'express';
import { GetPostsQuery } from './query';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';

export const getPosts = errorCatcher(async (req: Request, res: Response) => {
    const { limit, offset, userId } = req.query as unknown as GetPostsQuery;

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
            favorites: {
                where: {
                    userId: req.user?.id,
                },
            },
        },
    });

    const likes = await prisma.favorite.groupBy({
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
            post as any, // TODO
            post.author,
            like?._count.postId || 0,
            req.user?.id ? post.favorites.length > 0 : null,
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
