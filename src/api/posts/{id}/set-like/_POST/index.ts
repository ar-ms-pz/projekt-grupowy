import { Request, Response } from 'express';
import { errorCatcher } from '../../../../../middlewares/error-catcher';
import { SetLikeParams } from './params';
import { prisma } from '../../../../../db/prisma';
import { User } from '@prisma/client';
import { Like } from '../../../../../models/like';

export const setLike = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as SetLikeParams;
    const { like: setLike } = req.body as { like: boolean };
    const { id: userId } = req.user as User;

    const like = await prisma.like.findFirst({
        where: {
            postId,
            userId,
        },
    });

    if (setLike) {
        if (like) {
            const serializedLike = Like.fromPrisma(like);

            return res.status(200).json({ data: serializedLike });
        }

        const createdLike = await prisma.like.create({
            data: {
                postId,
                userId,
            },
        });

        const serializedLike = Like.fromPrisma(createdLike);

        return res.status(201).json({ data: serializedLike });
    }

    if (!like) {
        return res.status(200).json({ data: null });
    }

    await prisma.like.delete({
        where: {
            id: like.id,
        },
    });

    res.status(200).json({ data: null });
});
