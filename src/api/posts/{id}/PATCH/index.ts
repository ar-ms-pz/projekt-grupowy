import { Request, Response } from 'express';
import { EditPostParams } from './params';
import { EditPostDto } from './dto';
import { prisma } from '../../../../db/prisma';

export const editPost = async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as EditPostParams;
    const dto: EditPostDto = req.body;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
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
    });

    res.status(200).json({
        data: updatedPost,
    });
};
