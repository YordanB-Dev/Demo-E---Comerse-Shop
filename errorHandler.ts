import type { Request, Response, NextFunction } from "express";
import type { error } from "node:console";

interface errorWithStatus {
    status: number;
    message: string;
}

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);

    const error = err as errorWithStatus;
    const status = error.status ?? 500;
    const message = error.message ?? 'Internal server error';

    res.status(status).json({error: message});
};

export default errorHandler;