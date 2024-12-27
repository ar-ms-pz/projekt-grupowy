import { Favorite as PrismaFavorite } from '@prisma/client';

export class Favorite {
    id: number;
    postId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        postId: number,
        userId: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.postId = postId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromPrisma({
        id,
        postId,
        userId,
        createdAt,
        updatedAt,
    }: PrismaFavorite): Favorite {
        return new Favorite(id, postId, userId, createdAt, updatedAt);
    }
}
