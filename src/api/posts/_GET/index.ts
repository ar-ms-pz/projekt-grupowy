import { Request, Response } from 'express';
import { GetPostsQuery } from './query';
import { prisma } from '../../../db/prisma';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';
import {
    Image,
    Prisma,
    Post as PrismaPost,
    User as PrismaUser,
} from '@prisma/client';
import { Coordinates } from '../../../schemas/coordinates';
import { buildDbQuery } from './build-db-query';
import { PostWithCoordinates } from '../../../db/post-with-coordinates';

interface PostReturnType {
    id: number;
    title: string;
    description: string;
    price: number;
    status: string;
    type: string;
    area: number;
    rooms: number;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    longitude: number;
    latitude: number;
    imageId: number;
    imageName: string;
    imagePostId: number;
    imageCreatedAt: Date;
    imageUpdatedAt: Date;
    authorName: string;
    authorCreatedAt: Date;
    authorUpdatedAt: Date;
    favoriteId: number | null;
}

/*
 * BEWARE UGLY CODE AHEAD
 */
export const getPosts = errorCatcher(async (req: Request, res: Response) => {
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

    const [countQuery, countParams] = buildDbQuery(
        dto,
        currentUserId,
        true,
        'DRAFT',
    );

    const [{ postCount }]: { postCount: BigInt }[] =
        await prisma.$queryRawUnsafe(countQuery, ...countParams);

    const [postQuery, postParams] = buildDbQuery(
        dto,
        currentUserId,
        false,
        'DRAFT',
    );

    const rawPosts: PostReturnType[] = await prisma.$queryRawUnsafe(
        postQuery,
        ...postParams,
    );

    const groupedPosts = rawPosts.reduce(
        (acc, post) => {
            if (!acc[post.id]) {
                acc[post.id] = {
                    ...post,
                    author: {
                        id: post.authorId,
                        name: post.authorName,
                        createdAt: post.authorCreatedAt,
                        updatedAt: post.authorUpdatedAt,
                    },
                    images: [] as Image[],
                };
            }

            acc[post.id].images.push({
                id: post.imageId,
                name: post.imageName,
                postId: post.imagePostId,
                createdAt: post.imageCreatedAt,
                updatedAt: post.imageUpdatedAt,
            });

            return acc;
        },
        {} as Record<number, any>,
    );

    const posts = Object.values(groupedPosts);

    const favorites = await prisma.favorite.groupBy({
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
        const favorite = favorites.find(
            (favorite) => favorite.postId === post.id,
        );

        return Post.fromPrisma(
            post,
            post.author,
            favorite?._count.postId || 0,
            req.user?.id ? !!post.favoriteId : null,
        );
    });

    res.status(200).json({
        data: serializedPosts,
        info: {
            limit,
            offset,
            total: Number(postCount),
        },
    });
});
