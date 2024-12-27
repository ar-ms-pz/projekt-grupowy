import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';
import { User } from './user';

export class Post {
    public id: number;
    public image: string;
    public description: string | null;
    public createdAt: Date;
    public updatedAt: Date;
    public author: User | null;
    public likes: number;
    public isLiked: boolean | null;

    constructor(
        id: number,
        image: string,
        createdAt: Date,
        updatedAt: Date,
        likes: number,
        isLiked: boolean | null,
        description: string | null,
        author: User | null,
    ) {
        this.id = id;
        this.image = image;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
        this.likes = likes;
        this.isLiked = isLiked;
    }

    public static fromPrisma(
        post: PrismaPost,
        author: PrismaUser,
        likes: number,
        isLiked: boolean | null = null,
    ): Post {
        return new Post(
            post.id,
            post.image,
            post.createdAt,
            post.updatedAt,
            likes,
            isLiked,
            post.description,
            User.fromPrisma(author),
        );
    }
}
