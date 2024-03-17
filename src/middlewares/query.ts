import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';

export const query =
    (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
        const parseResult = schema.safeParse(req.query);

        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.errors });
        }

        req.query = parseResult.data;

        next();
    };
