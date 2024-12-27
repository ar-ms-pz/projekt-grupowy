import { PostType } from '@prisma/client';
import { z } from 'zod';

export const getPostsQuerySchema = z
    .object({
        isFavorite: z
            .boolean({
                invalid_type_error: 'isFavorite must be a boolean',
                coerce: true,
            })
            .optional(),
        limit: z
            .number({
                invalid_type_error: 'Limit must be a number',
                coerce: true,
            })
            .int({
                message: 'Limit must be a non-negative integer',
            })
            .nonnegative({
                message: 'Limit must be a non-negative integer',
            })
            .default(36),
        offset: z
            .number({
                invalid_type_error: 'Offset must be a number',
                coerce: true,
            })
            .int({
                message: 'Offset must be a non-negative integer',
            })
            .nonnegative({
                message: 'Offset must be a non-negative integer',
            })
            .default(0),
        userId: z
            .number({
                invalid_type_error: 'User ID must be a number',
                coerce: true,
            })
            .int({
                message: 'User ID must be a non-negative integer',
            })
            .nonnegative({
                message: 'User ID must be a non-negative integer',
            })
            .optional(),
        title: z
            .string({
                required_error: 'Title is required.',
            })
            .max(255, {
                message: 'Title can be at most 255 characters long.',
            })
            .optional(),

        latitude: z
            .number({ coerce: true })
            .max(90, {
                message: 'Latitude must be between -90 and 90.',
            })
            .min(-90, {
                message: 'Latitude must be between -90 and 90.',
            })
            .optional(),
        longitude: z
            .number({ coerce: true })
            .max(180, {
                message: 'Longitude must be between -180 and 180.',
            })
            .min(-180, {
                message: 'Longitude must be between -180 and 180.',
            })
            .optional(),
        distance: z
            .number({
                invalid_type_error: 'Distance must be a number',
                coerce: true,
            })
            .positive({
                message: 'Distance must be a positive number',
            })
            .optional(),
        address: z
            .string()
            .max(255, {
                message: 'Address can be at most 255 characters long.',
            })
            .optional(),
        type: z
            .enum([PostType.RENTAL, PostType.SALE, 'ALL'], {
                invalid_type_error: `Type must be one of "${PostType.RENTAL}", "${PostType.SALE}, or 'ALL'".`,
            })
            .optional(),
        minPrice: z
            .number({
                coerce: true,
                invalid_type_error: 'maxPrice must be a number.',
            })
            .int('maxPrice must be a positive integer.')
            .positive('maxPrice must be a positive integer.')
            .optional(),
        maxPrice: z
            .number({
                coerce: true,
                invalid_type_error: 'minPrice must be a number.',
            })
            .int('minPrice must be a positive integer.')
            .positive('minPrice must be a positive integer.')
            .optional(),

        minArea: z
            .number({
                coerce: true,
                invalid_type_error: 'minArea must be a number.',
            })
            .positive('minArea must be a positive number.')
            .optional(),

        maxArea: z
            .number({
                coerce: true,
                invalid_type_error: 'maxArea must be a number.',
            })
            .positive('maxArea must be a positive number.')
            .optional(),
        maxRooms: z
            .number({
                coerce: true,
                invalid_type_error: 'Rooms must be a number.',
            })
            .int('Rooms must be a positive integer.')
            .positive('Rooms must be a positive integer.')
            .optional(),

        minRooms: z
            .number({
                coerce: true,
                invalid_type_error: 'Rooms must be a number.',
            })
            .int('Rooms must be a positive integer.')
            .positive('Rooms must be a positive integer.')
            .optional(),
    })
    .refine(
        (data) => {
            if (data.latitude || data.longitude || data.distance)
                return data.latitude && data.longitude && data.distance;

            return true;
        },
        {
            message:
                'If any of latitude, longitude, or distance is provided, all must be provided.',
            params: ['latitude', 'longitude', 'distance'],
            path: ['latitude', 'longitude', 'distance'],
        },
    );

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;
