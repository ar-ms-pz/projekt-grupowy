import { Request, Response } from 'express';
import { GetPostsQuery } from './query';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';

export const getPosts = errorCatcher(async (req: Request, res: Response) => {
    const { limit, offset } = req.query as unknown as GetPostsQuery;

    const postCount = await prisma.post.count();

    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        skip: offset,
        take: limit,
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

    res.status(200).json({
        data: posts,
        info: {
            limit,
            offset,
            total: postCount,
        },
    });
});
