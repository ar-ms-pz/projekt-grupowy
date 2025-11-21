import { rmSync } from 'fs';
import { DELETED_POST_TTL, IMAGE_UPLOAD_PATH } from '../config';
import { prisma } from '../db/prisma';

export const clearDeletedPosts = async () => {
    const postsToDelete = await prisma.post.findMany({
        where: {
            status: 'DELETED',
            deletedAt: {
                lt: new Date(Date.now() - DELETED_POST_TTL),
            },
        },
        include: {
            images: true,
        },
    });

    await prisma.post.deleteMany({
        where: {
            id: {
                in: postsToDelete.map((post) => post.id),
            },
        },
    });

    postsToDelete.forEach((post) => {
        post.images.forEach((image) => {
            try {
                rmSync(`${IMAGE_UPLOAD_PATH}/${image.name}`);
            } catch (error) {
                console.error(
                    `Failed to delete image ${image.name} in post ${post.id}:`,
                    error,
                );
            }
        });
    });
};
