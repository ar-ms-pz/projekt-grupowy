import { Request } from 'express';
import { FileFilterCallback } from 'multer';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif'];

export const imageFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
        return cb(new Error('Only images are allowed.'));
    }

    cb(null, true);
};
