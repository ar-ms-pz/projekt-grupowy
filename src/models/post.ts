import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';
import { User } from './user';
import { PostWithCoordinates } from '../db/post-with-coordinates';
import { Image } from './image';

export class Post {
    public id: number;
    public images: Image[];
    public description: string;
    public createdAt: Date;
    public updatedAt: Date;
    public author: User;
    public favorites: number;
    public isFavorite: boolean | null;

    constructor(
        id: number,
        images: Image[],
        description: string,
        createdAt: Date,
        updatedAt: Date,
        favorites: number,
        isFavorite: boolean | null,
        author: User,
    ) {
        this.id = id;
        this.images = images;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
        this.favorites = favorites;
        this.isFavorite = isFavorite;
    }

    public static fromPrisma(
        { id, createdAt, description, images, updatedAt }: PostWithCoordinates,
        author: PrismaUser,
        favorites: number,
        isFavorite: boolean | null = null,
    ): Post {
        return new Post(
            id,
            images.map((image) => Image.fromPrisma(image)),
            description,
            createdAt,
            updatedAt,
            favorites,
            isFavorite,
            User.fromPrisma(author),
        );
    }
}
