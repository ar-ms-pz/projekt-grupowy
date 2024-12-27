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
    public latitude: number | null;
    public longitude: number | null;
    public address: string;
    public area: number;
    public price: number;
    public rooms: number;
    public status: string;
    public type: string;

    constructor(
        id: number,
        images: Image[],
        description: string,
        createdAt: Date,
        updatedAt: Date,
        favorites: number,
        isFavorite: boolean | null,
        author: User,
        latitude: number | null,
        longitude: number | null,
        address: string,
        area: number,
        price: number,
        rooms: number,
        status: string,
        type: string,
    ) {
        this.id = id;
        this.images = images;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
        this.favorites = favorites;
        this.isFavorite = isFavorite;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.area = area;
        this.price = price;
        this.rooms = rooms;
        this.status = status;
        this.type = type;
    }

    public static fromPrisma(
        {
            id,
            createdAt,
            description,
            images,
            updatedAt,
            latitude,
            longitude,
            address,
            area,
            price,
            rooms,
            status,
            type,
        }: PostWithCoordinates,
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
            latitude,
            longitude,
            address,
            area,
            price,
            rooms,
            status,
            type,
        );
    }
}
