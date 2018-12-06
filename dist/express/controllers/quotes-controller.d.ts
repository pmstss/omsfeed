import { Request, Response } from 'express';
export declare class QuotesController {
    private dbClient;
    private fetchMissingQuotes;
    handle(req: Request, res: Response): Promise<void>;
}
