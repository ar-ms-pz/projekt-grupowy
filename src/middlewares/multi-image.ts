import { NextFunction, Request, RequestHandler, Response } from 'express';
import { imageUploadHandler } from '../files/image-upload-handler';
import multer from 'multer';

const createError = (message: string) => ({
    code: 'invalid_file_type',
    message,
    path: ['images'],
});

const multiImageHandler = imageUploadHandler.array('images', 32);

export const multiImage = (req: Request, res: Response, next: NextFunction) =>
    multiImageHandler(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            return res
                .status(400)
                .json({ errors: [createError(error.message)] });
        }

        next(error);
    });
