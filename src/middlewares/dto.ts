import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';
import { rmSync } from 'fs';
import multer from 'multer';

export const dto =
    (schema: Schema, image: 'none' | 'single' | 'many' = 'none') =>
    (req: Request, res: Response, next: NextFunction) => {
        const parseResult = schema.safeParse(req.body);

        const errors = [];

        if (image === 'single' && !req.file) {
            errors.push({
                path: ['image'],
                message: 'Image is required',
                code: 'missing_file',
            });
        }

        if (image === 'many' && !req.files) {
            errors.push({
                path: ['image'],
                message: 'Images are required',
                code: 'missing_file',
            });
        }

        if (!parseResult.success) {
            errors.push(...parseResult.error.errors);
        }

        if (errors.length > 0 || !parseResult.success) {
            req.file && rmSync(req.file.path);
            req.files &&
                (req.files as Express.Multer.File[] | undefined)?.forEach(
                    (file) => rmSync(file.path),
                );

            return res.status(400).json({ errors });
        }

        req.body = parseResult.data;

        next();
    };
