import { User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { errorCatcher } from '../../../middlewares/error-catcher';
import { User } from '../../../models/user';

export const whoAmI = errorCatcher(async (req: Request, res: Response) => {
    const user = User.fromPrisma(req.user as PrismaUser);

    res.status(200).json({ data: user });
});
