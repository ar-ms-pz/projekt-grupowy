import { Request, Response } from 'express';
import { EditPostParams } from './params';
import { EditPostDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { Post } from '../../../../models/post';

export const editPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as EditPostParams;
    const { id: userId } = req.user as User;
    const dto: EditPostDto = req.body;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            authorId: userId,
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

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            description: dto.description,
        },
        include: {
            author: true,
            likes: {
                where: {
                    userId,
                },
            },
        },
    });

    const likesCount = await prisma.like.count({
        where: {
            postId,
        },
    });

    const serializedPost = Post.fromPrisma(
        updatedPost,
        updatedPost.author,
        likesCount,
        updatedPost.likes.length > 0,
    );

    res.status(200).json({
        data: serializedPost,
    });
});
