import { z } from 'zod';
import { PostStatus, PostType } from '@prisma/client';

export const createPostDtoSchema = z.object({
    description: z
        .string({
            required_error: 'Description is required.',
        })
        .max(32384, {
            message: 'Description can be at most 32384 characters long.',
        }),
    title: z
        .string({
            required_error: 'Title is required.',
        })
        .max(255, {
            message: 'Title can be at most 255 characters long.',
        }),
    latitude: z
        .number({ coerce: true })
        .max(90, {
            message: 'Latitude must be between -90 and 90.',
        })
        .min(-90, {
            message: 'Latitude must be between -90 and 90.',
        }),
    longitude: z
        .number({ coerce: true })
        .max(180, {
            message: 'Longitude must be between -180 and 180.',
        })
        .min(-180, {
            message: 'Longitude must be between -180 and 180.',
        }),
    address: z.string().max(255, {
        message: 'Address can be at most 255 characters long.',
    }),
    status: z
        .enum([PostStatus.DRAFT, PostStatus.PUBLISHED, PostStatus.ARCHIVED], {
            invalid_type_error: `Status must be one of "${PostStatus.DRAFT}", "${PostStatus.PUBLISHED}", or "${PostStatus.ARCHIVED}".`,
        })
        .default(PostStatus.DRAFT),
    type: z.enum([PostType.RENTAL, PostType.SALE], {
        invalid_type_error: `Type must be one of "${PostType.RENTAL}", or "${PostType.SALE}".`,
        required_error: 'Type is required.',
    }),
    price: z
        .number({
            coerce: true,
            invalid_type_error: 'Price must be a number.',
            required_error: 'Price is required.',
        })
        .int('Price must be a positive integer.')
        .positive('Price must be a positive integer.'),
    area: z
        .number({
            coerce: true,
            invalid_type_error: 'Area must be a number.',
            required_error: 'Area is required.',
        })
        .positive('Area must be a positive number.'),
    rooms: z
        .number({
            coerce: true,
            invalid_type_error: 'Rooms must be a number.',
            required_error: 'Rooms is required.',
        })
        .int('Rooms must be a positive integer.')
        .positive('Rooms must be a positive integer.'),
});

export type CreatePostDto = z.infer<typeof createPostDtoSchema>;
