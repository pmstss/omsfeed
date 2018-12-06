import { Request, Response } from 'express';
import { flatMap, map, tap, toArray } from 'rxjs/operators';
import { QuotesDbClient } from '../../db/quotes-db-client';
import { QuotesRequest } from './quotes-request';
import { ParametersParser } from './params-parser';
import { AssetQuote } from '../../types/asset-quote';
import { QuotesFetcher } from '../../fetcher/quotes-fetcher';
import { InsertWriteOpResult } from 'mongodb';

export class QuotesController {
    private dbClient: QuotesDbClient = null;

    private fetchMissingQuotes(quotesRequest: QuotesRequest): Promise<InsertWriteOpResult> {
        const quotesFetcher = new QuotesFetcher();
        const date = quotesRequest.getStartDate();
        return quotesFetcher.fetchForDate(date).pipe(
            toArray(),
            tap((quotes: AssetQuote[]) => {
                if (quotes.length === 0) {
                    throw new Error(`No quotes available for date ${date}`);
                }
            }),
            flatMap((quotes: AssetQuote[]) => this.dbClient.insertMany(quotes))
        ).toPromise();
    }

    async handle(req: Request, res: Response): Promise<void> {
        if (!this.dbClient) {
            this.dbClient = await QuotesDbClient.getInstance();
        }

        const quotesRequest: QuotesRequest = ParametersParser.parse(req);
        const quotes: AssetQuote[] = await this.dbClient.find({
            date: {
                $gte: quotesRequest.getStartDate(),
                $lte: quotesRequest.getEndDate()
            },
            asset: quotesRequest.getAsset() || { $exists: true }
        }).toArray();

        if (quotes.length === 0) {
            if (quotesRequest.isSingleDate()) {
                try {
                    await this.fetchMissingQuotes(quotesRequest);
                    return this.handle(req, res);
                } catch (e) {
                    res.status(500).send(`Error fetching missing quotes: ${e.message}`);
                }
            } else {
                res.status(500).send('Some quotes are missing in requested range');
            }
        } else {
            res.header('Content-Type', 'application/json');
            res.send(quotes);
        }
    }
}
