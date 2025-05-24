import { Request, Response } from 'express';
import { PostRestorePostParams } from './params';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../../../middlewares/error-catcher';
import { prisma } from '../../../../../db/prisma';
import { Coordinates } from '../../../../../schemas/coordinates';
import { Post } from '../../../../../models/post';

export const restorePost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as PostRestorePostParams;
    const { id: userId } = req.user as User;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            authorId: userId,
        },
        include: {
            images: true,
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

    if (post.status !== 'DELETED') {
        return res.status(400).json({
            errors: [
                {
                    message: 'Post is not deleted',
                    path: ['postId'],
                    code: 'not_deleted',
                },
            ],
        });
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            status: 'ARCHIVED',
            deletedAt: null,
        },
        include: {
            images: true,
            author: true,
            favorites: {
                where: {
                    userId,
                },
            },
        },
    });

    const coordinates: Coordinates[] = await prisma.$queryRaw`
                SELECT
                ST_X(p.coordinates) as latitude,
                ST_Y(p.coordinates) as longitude
                FROM "Post" p
                WHERE p.id = ${postId}
            `;

    const favoritesCount = await prisma.favorite.count({
        where: {
            postId,
        },
    });

    const serializedPost = Post.fromPrisma(
        {
            ...updatedPost,
            latitude: coordinates[0]?.latitude ?? null,
            longitude: coordinates[0]?.longitude ?? null,
        },
        updatedPost.author,
        favoritesCount,
        updatedPost.favorites.length > 0,
    );

    res.status(200).json({
        data: serializedPost,
    });
});
