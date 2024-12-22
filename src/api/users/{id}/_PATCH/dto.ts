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

    email: z
        .string()
        .email({
            message: 'Email must be a valid email address.',
        })
        .optional(),
    phone: z
        .string()
        .regex(/^[+]?[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
            message: 'Phone number must be a valid phone number.',
        })
        .optional(),
});

export type EditUserDto = z.infer<typeof editUserDtoSchema>;
