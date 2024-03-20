import { NextFunction, Request, Response } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', '*');
    next();
};
