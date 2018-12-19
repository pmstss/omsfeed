import { Request, Response } from 'express';
import { from, Observable } from 'rxjs';
import { flatMap, map, tap, toArray } from 'rxjs/operators';
import { QuotesDbClient } from '../../db/quotes-db-client';
import { QuotesRequest } from './quotes-request';
import { ParametersParser } from './params-parser';
import { AssetQuote } from '../../types/asset-quote';
import { QuotesFetcher } from '../../fetcher/quotes-fetcher';

export class QuotesController {
    private dbClient: QuotesDbClient = null;
    private quotesFetcher = new QuotesFetcher();

    private fetchMissingQuotes(dates: Date[]): Promise<AssetQuote[]> {
        return this.quotesFetcher.fetchForDates(dates).pipe(
            toArray(),
            flatMap((quotes: AssetQuote[]) => from(quotes.length > 0 ?
                    this.dbClient.upsertMany(quotes).then(() => quotes) : []))
        ).toPromise();
    }

    detectMissingDates(quotes: AssetQuote[], startDate: Date, endDate: Date): Date[] {
        const quotesSet = new Set(quotes.map(q => q.date.getTime()));
        return QuotesFetcher.dateRangeToArray(startDate, endDate)
            .filter(d => !quotesSet.has(d.getTime()));
    }

    async handle(req: Request, res: Response, next: any, fetchMissing = true): Promise<void> {
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

        const missingDates = this.detectMissingDates(
            quotes, quotesRequest.getStartDate(), quotesRequest.getEndDate());
        if (missingDates.length) {
            console.log('quotes are missing for dates: ', missingDates
                    .map(d => d.toISOString().substr(0, 10)).join(', '));
        }

        if (missingDates.length > 0 && fetchMissing) {
            try {
                const quotes = await this.fetchMissingQuotes(missingDates);
                this.handle(req, res, next, false);
            } catch (e) {
                res.status(500).send(`Error fetching missing quotes: ${e.message}`);
            }
        } else {
            res.header('Content-Type', 'application/json');
            res.send(quotes);
        }
    }
}
