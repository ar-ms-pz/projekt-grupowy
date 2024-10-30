import { UserType } from '@prisma/client';
import { z } from 'zod';

export const editUserDtoSchema = z.object({
    password: z
        .string()
        .min(8, {
            message: 'Password must be at least 8 characters long.',
        })
        .max(32, {
            message: 'Password can be at most 32 characters long.',
        })
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).+$/, {
            message: `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character from the following: #?!@$ %^&*-`,
        })
        .optional(),
    type: z.enum([UserType.ADMIN, UserType.USER]).optional(),
});

export type EditUserDto = z.infer<typeof editUserDtoSchema>;
