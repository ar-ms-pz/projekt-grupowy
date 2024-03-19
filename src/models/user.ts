import { User as PrismaUser } from '@prisma/client';

export class User {
    public id: number;
    public name: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(id: number, name: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static fromPrisma(user: PrismaUser): User {
        return new User(user.id, user.name, user.createdAt, user.updatedAt);
    }
}
