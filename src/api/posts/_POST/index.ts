import { Request, Response } from 'express';
import { CreatePostDto } from './dto';
import { prisma } from '../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';
import { PostWithCoordinates } from '../../../db/post-with-coordinates';

export const createPost = errorCatcher(async (req: Request, res: Response) => {
    const { description, latitude, longitude }: CreatePostDto = req.body;
    const { id: userId } = req.user as User;
    const images = (req.files || []) as Express.Multer.File[];

    // Transform images array to match Prisma's expected format for creating associated images
    const imageData = images.map((file) => ({
        name: file.filename, // Adjust according to your file storage logic
    }));

    const post = await prisma.post.create({
        data: {
            description,
            author: {
                connect: { id: userId },
            },
            images: {
                create: imageData,
            },
        },
        include: {
            images: true,
        },
    });

    const postWithCoords = (await prisma.$executeRaw`
    UPDATE "Post"
    SET coordinates = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
    WHERE id = ${post.id}
    RETURNING id, description, "createdAt", "updatedAt", "authorId",
                      ST_Y(coordinates) AS latitude,
                      ST_X(coordinates) AS longitude
    `) as unknown as Omit<PostWithCoordinates, 'images'>[];

    const serializedPost = Post.fromPrisma(
        { ...postWithCoords[0], images: post.images },
        req.user as User,
        0,
        false,
    );

    res.status(201).json({ data: serializedPost });
});
