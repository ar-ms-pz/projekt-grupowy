import { NextFunction, Request, Response } from 'express';
import { ACCESS_CONTROL_ALLOW_ORIGIN } from '../config';

interface CorsOptions {
    origin?: string;
}

export const cors = ({ origin }: CorsOptions) => (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', origin);
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', ['content-type']);
    next();
};
