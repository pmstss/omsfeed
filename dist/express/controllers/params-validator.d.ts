import { NextFunction, Request, Response } from 'express';
export declare class ParametersValidator {
    static validateDate(dateStr: string): boolean;
    static validate(req: Request, res: Response, next: NextFunction): void;
}
