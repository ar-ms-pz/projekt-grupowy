import { NextFunction, Request, Response } from 'express';

export const errorCatcher = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            console.error(error);
            next(error);
        });
    };
};
