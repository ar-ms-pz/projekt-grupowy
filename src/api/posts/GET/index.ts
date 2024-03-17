import { Request, Response } from 'express';
import { GetPostsQuery } from './query';
import { prisma } from '../../../db/prisma';

export const getPosts = async (req: Request, res: Response) => {
    const { limit, offset } = req.query as unknown as GetPostsQuery;

    const postCount = await prisma.post.count();

    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        skip: offset,
        take: limit,
    });

    res.status(200).json({
        data: posts,
        info: {
            limit,
            offset,
            total: postCount,
        },
    });
};
