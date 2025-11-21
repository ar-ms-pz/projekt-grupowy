import { NextFunction, Request, Response } from 'express';
import { ACCESS_CONTROL_ALLOW_ORIGIN } from '../config';

export const cors = (req: Request, res: Response, next: NextFunction) => {
    const origins = ACCESS_CONTROL_ALLOW_ORIGIN.split(',');

    if (origins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header( 
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Credentials', 'true'); 
    res.header('Access-Control-Allow-Headers', ['content-type']);
    next();
};
