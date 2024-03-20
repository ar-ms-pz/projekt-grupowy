import { NextFunction, Request, Response } from 'express';

export const errorHandler = async (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!err) return;

    res.status(500).send({
        errors: [
            {
                message: err.message,
                code: 'internal_server_error',
                path: [],
            },
        ],
    });
    next();
};
