import { Request, Response } from 'express';
import { errorCatcher } from '../../../../../middlewares/error-catcher';
import { SetLikeParams } from './params';
import { prisma } from '../../../../../db/prisma';
import { User } from '@prisma/client';
import { Favorite } from '../../../../../models/favorite';

export const setLike = errorCatcher(async (req: Request, res: Response) => {
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

    const like = await prisma.favorite.findFirst({
        where: {
            postId,
            userId,
        },
    });

    if (setLike) {
        if (like) {
            const serializedLike = Favorite.fromPrisma(like);

            return res.status(200).json({ data: serializedLike });
        }

        const createdLike = await prisma.favorite.create({
            data: {
                postId,
                userId,
            },
        });

        const serializedLike = Favorite.fromPrisma(createdLike);

        return res.status(201).json({ data: serializedLike });
    }

    if (!like) {
        return res.status(200).json({ data: null });
    }

    await prisma.favorite.delete({
        where: {
            id: like.id,
        },
    });

    res.status(200).json({ data: null });
});
