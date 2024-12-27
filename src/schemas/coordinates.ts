import { z } from 'zod';

export const coordinates = z.object({
    latitude: z
        .number()
        .max(90, {
            message: 'Latitude must be between -90 and 90.',
        })
        .min(-90, {
            message: 'Latitude must be between -90 and 90.',
        }),
    longitude: z
        .number()
        .max(180, {
            message: 'Longitude must be between -180 and 180.',
        })
        .min(-180, {
            message: 'Longitude must be between -180 and 180.',
        }),
});

export type Coordinates = z.infer<typeof coordinates>;
