import { Request, Response } from 'express';
import { EditPostParams } from './params';
import { EditPostDto } from './dto';
import { prisma } from '../../../../db/prisma';
import { User } from '@prisma/client';
import { errorCatcher } from '../../../../middlewares/error-catcher';
import { Post } from '../../../../models/post';
import { Coordinates } from '../../../../schemas/coordinates';
import { rmSync } from 'fs';
import { IMAGE_UPLOAD_PATH } from '../../../../config';

export const editPost = errorCatcher(async (req: Request, res: Response) => {
    const { postId } = req.params as unknown as EditPostParams;
    const { id: userId } = req.user as User;
    const dto: EditPostDto = req.body;
    const images = (req.files || []) as Express.Multer.File[];

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

    const imageData = images.map((file) => ({
        name: file.filename,
    }));

    if (dto.removeImages?.length) {
        const imagesToRemove = await prisma.image.findMany({
            where: {
                id: {
                    in: dto.removeImages,
                },
            },
        });

        imagesToRemove.forEach((image) => {
            try {
                rmSync(`${IMAGE_UPLOAD_PATH}/${image.name}`);
            } catch (error) {}
        });
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            description: dto.description,
            address: dto.address,
            area: dto.area,
            price: dto.price,
            rooms: dto.rooms,
            type: dto.type,
            status: dto.status,
            title: dto.title,
            images: {
                create: imageData,
                deleteMany: dto.removeImages
                    ? {
                          id: {
                              in: dto.removeImages,
                          },
                      }
                    : undefined,
            },
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

    const oldCoords: Coordinates[] = await prisma.$queryRaw`
        SELECT
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude
        FROM "Post" p
        WHERE p.id = ${postId}
        `;

    const latitude = dto.latitude ?? oldCoords[0]?.latitude;
    const longitude = dto.longitude ?? oldCoords[0]?.longitude;

    await prisma.$executeRaw`
        UPDATE "Post"
        SET coordinates = ST_SetSRID(ST_MakePoint(${latitude}, ${longitude}), 4326)
        WHERE id = ${postId}
        `;

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
