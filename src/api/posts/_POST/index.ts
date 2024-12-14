import { Request, Response } from 'express';
import { CreatePostDto } from './dto';
import { prisma } from '../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { Post } from '../../../models/post';
import { PostWithCoordinates } from '../../../db/post-with-coordinates';
import { Coordinates } from '../../../schemas/coordinates';
import { rmSync } from 'fs';

export const createPost = errorCatcher(async (req: Request, res: Response) => {
    const {
        description,
        latitude,
        longitude,
        address,
        area,
        price,
        rooms,
        type,
        status,
        title,
    }: CreatePostDto = req.body;
    try {
        const { id: userId } = req.user as User;
        const images = (req.files || []) as Express.Multer.File[];

        const imageData = images.map((file) => ({
            name: file.filename,
        }));

        const post = await prisma.post.create({
            data: {
                address,
                area,
                price,
                rooms,
                type,
                status,
                description,
                title,
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

        await prisma.$executeRaw`
    UPDATE "Post"
    SET coordinates = ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)
    WHERE id = ${post.id}
    `;

        const coordinates: Coordinates[] = await prisma.$queryRaw`
        SELECT
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude
        FROM "Post" p
        WHERE p.id = ${post.id}
    `;

        const serializedPost = Post.fromPrisma(
            {
                latitude: coordinates[0]?.latitude ?? null,
                longitude: coordinates[0]?.longitude ?? null,
                ...post,
            },
            req.user as User,
            0,
            false,
        );

        res.status(201).json({ data: serializedPost });
    } catch (error) {
        if (req.files) {
            (req.files as Express.Multer.File[]).forEach((file) => {
                rmSync(file.path);
            });
        }

        throw error;
    }
});
