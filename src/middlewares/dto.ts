import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';
import { rmSync } from 'fs';

export const dto =
    (schema: Schema, imageRequired = false) =>
    (req: Request, res: Response, next: NextFunction) => {
        const parseResult = schema.safeParse(req.body);

        const errors = [];

        if (imageRequired && !req.file) {
            errors.push({
                path: ['image'],
                message: 'Image is required',
                code: 'missing_file',
            });
        }

        if (!parseResult.success) {
            errors.push(...parseResult.error.errors);
        }

        if (errors.length > 0 || !parseResult.success) {
            req.file && rmSync(req.file.path);

            return res.status(400).json({ errors });
        }

        req.body = parseResult.data;

        next();
    };
