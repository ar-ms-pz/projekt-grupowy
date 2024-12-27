import { Image as PrismaImage } from '@prisma/client';

export class Image {
    id: number;
    url: string;
    name: string;

    constructor(id: number, name: string, url: string) {
        this.id = id;
        this.url = url;
        this.name = name;
    }

    static fromPrisma({ id, name }: PrismaImage): Image {
        console.log(name);

        return new Image(id, name, `/images/${name}`);
    }
}
