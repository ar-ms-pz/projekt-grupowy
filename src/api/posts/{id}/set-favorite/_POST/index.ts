import { Request, Response } from 'express';
import { errorCatcher } from '../../../../../middlewares/error-catcher';
import { SetLikeParams } from './params';
import { prisma } from '../../../../../db/prisma';
import { User } from '@prisma/client';
import { Favorite } from '../../../../../models/favorite';

export const setFavorite = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as SetLikeParams;
    const { like: setLike } = req.body as { like: boolean };
    const { id: userId } = req.user as User;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
        },
    });

    if (!post)
        return res.status(404).json({
            errors: [
                {
                    message: 'Post not found',
                    code: 'not_found',
                    path: ['postId'],
                },
            ],
        });

    const favorite = await prisma.favorite.findFirst({
        where: {
            postId,
            userId,
        },
    });

    if (setLike) {
        if (favorite) {
            const serializedLike = Favorite.fromPrisma(favorite);

            return res.status(200).json({ data: serializedLike });
        }

        const createdFavorite = await prisma.favorite.create({
            data: {
                postId,
                userId,
            },
        });

        const serializedLike = Favorite.fromPrisma(createdFavorite);

        return res.status(201).json({ data: serializedLike });
    }

    if (!favorite) {
        return res.status(200).json({ data: null });
    }

    await prisma.favorite.delete({
        where: {
            id: favorite.id,
        },
    });

    res.status(200).json({ data: null });
});
