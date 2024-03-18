import { Session, User } from '@prisma/client';

declare global {
    namespace Express {
        export interface Request {
            user?: Omit<User, 'password'>;
            session?: Session;
        }
    }
}