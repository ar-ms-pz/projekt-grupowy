import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { GetPostParams } from './params';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { Post } from '../../../../models/post';
import { Coordinates } from '../../../../schemas/coordinates';

export const getPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as GetPostParams;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
        },
        include: {
            images: true,
            author: true,
            favorites: {
                where: {
                    userId: req.user?.id,
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

    const coordinates = await prisma.$queryRaw<
        (Coordinates & { postId: number })[]
    >`
    SELECT
    p.id as "postId",
    ST_X(p.coordinates) as longitude,
    ST_Y(p.coordinates) as latitude
    FROM "Post" p
    WHERE p.id = ${post.id}
    `;

    const favorites = await prisma.favorite.groupBy({
        by: ['postId'],
        _count: {
            postId: true,
        },
        where: {
            postId,
        },
    });

    const serializedPost = Post.fromPrisma(
        {
            ...post,
            latitude: coordinates[0]?.latitude ?? null,
            longitude: coordinates[0]?.longitude ?? null,
        },
        post.author,
        favorites[0]?._count.postId || 0,
        req.user?.id ? post.favorites.length > 0 : null,
    );

    res.status(200).json({
        data: serializedPost,
    });
});
