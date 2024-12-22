import { User as PrismaUser } from '@prisma/client';

export class User {
    public id: number;
    public name: string;
    public phone: string;
    public email: string;
    public type: string | undefined;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: number,
        name: string,
        phone: string,
        email: string,
        createdAt: Date,
        updatedAt: Date,
        type: string | undefined,
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.type = type;
    }

    public static fromPrisma(user: PrismaUser, hideRole = false): User {
        return new User(
            user.id,
            user.name,
            user.phone,
            user.email,
            user.createdAt,
            user.updatedAt,
            !hideRole ? user.type : undefined,
        );
    }
}
