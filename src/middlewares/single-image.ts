import { NextFunction, Request, RequestHandler, Response } from 'express';
import { imageUploadHandler } from '../files/image-upload-handler';
import multer from 'multer';

const createError = (message: string) => ({
    code: 'invalid_file_type',
    message,
    path: ['image'],
});

const singleImageHandler = imageUploadHandler.single('image');

export const singleImage = (req: Request, res: Response, next: NextFunction) =>
    singleImageHandler(req, res, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            return res
                .status(400)
                .json({ errors: [createError(error.message)] });
        }

        next(error);
    });
