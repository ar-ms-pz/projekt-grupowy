import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';

export const params =
    (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
        const parseResult = schema.safeParse(req.params);

        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.errors });
        }

        req.params = parseResult.data;

        next();
    };
