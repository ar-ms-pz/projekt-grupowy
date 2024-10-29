import { Post as PrismaPost, Image as PrismaImage } from '@prisma/client';

export interface PostWithCoordinates extends PrismaPost {
    images: PrismaImage[];
    latitude: number | null;
    longitude: number | null;
}
