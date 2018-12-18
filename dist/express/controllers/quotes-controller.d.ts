import { Request, Response } from 'express';
import { AssetQuote } from '../../types/asset-quote';
export declare class QuotesController {
    private dbClient;
    private quotesFetcher;
    private fetchMissingQuotes;
    detectMissingDates(quotes: AssetQuote[], startDate: Date, endDate: Date): Date[];
    handle(req: Request, res: Response, fetchMissing?: boolean): Promise<void>;
}
