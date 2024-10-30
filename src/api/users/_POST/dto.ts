import { UserType } from '@prisma/client';
import { z } from 'zod';

export const createUserDtoSchema = z.object({
    name: z
        .string()
        .min(3, {
            message: 'Username must be at least 3 characters long.',
        })
        .max(32, {
            message: 'Username can be at most 32 characters long.',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
                'Username can only contain letters, numbers, and underscores.',
        }),
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
        }),
    type: z.enum([UserType.ADMIN, UserType.USER]).default(UserType.USER),
});

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;
