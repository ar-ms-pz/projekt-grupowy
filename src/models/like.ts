import { Like as PrismaLike } from '@prisma/client';

export class Like {
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

    static fromPrisma(like: PrismaLike): Like {
        return new Like(
            like.id,
            like.postId,
            like.userId,
            like.createdAt,
            like.updatedAt,
        );
    }
}
