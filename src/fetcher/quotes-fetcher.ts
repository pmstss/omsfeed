import { Observable, from } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { RxHR, RxHttpRequestResponse } from '@akanass/rx-http-request';
import { ResponseParser } from './response-parser';
import { AssetQuote } from '../types/asset-quote';

type DateUrl = {
    date: Date,
    url: string
};

type DateUrlResult = DateUrl & {
    response: RxHttpRequestResponse
};

export class QuotesFetcher {
    private BASE_URL = 'https://www.bps-sberbank.by/Portal/public/precious/getPreciousOms/';
    private responseParser: ResponseParser = new ResponseParser();

    private static* dateRangeGenerator(startDate: Date, endDate: Date): IterableIterator<Date> {
        for (const d = new Date(startDate); d.getTime() <= endDate.getTime();
                d.setDate(d.getDate() + 1)) {
            yield  new Date(d);
        }
    }

    private static formatDate(d: Date) {
        return d.toISOString().substr(0, 10).split('-').reverse().join('-');
    }

    public getDateUrl(date: Date): DateUrl {
        return {
            date,
            url: `${this.BASE_URL}${QuotesFetcher.formatDate(date)}`
        };
    }

    public static dateRangeToArray(startDate: Date, endDate: Date): Date[] {
        return Array.from(QuotesFetcher.dateRangeGenerator(startDate, endDate));
    }

    private mapUrlsToRequests(urlsStream: Observable<DateUrl>,
                              concurrent: number,
                              chunkDelay: number): Observable<DateUrlResult> {
        return urlsStream.pipe(
            mergeMap(
                (dateUrl: DateUrl) => RxHR.get(dateUrl.url).pipe(
                    delay(chunkDelay),
                    map(res => ({
                        ...dateUrl,
                        response: res
                    }))
                ),
                concurrent
            )
        );
    }

    private fetch(urlsStream: Observable<DateUrl>,
                  concurrent: number, chunkDelay: number): Observable<AssetQuote> {
        return this.mapUrlsToRequests(urlsStream, concurrent, chunkDelay).pipe(
            mergeMap((item) => {
                return this.responseParser.normalizeResponse(item.date, item.response);
            })
        );
    }

    public fetchForDates(dates: Date[], concurrent: number = 10,
                         chunkDelay: number = 1000): Observable<AssetQuote> {
        return this.fetch(from(dates.map(d => this.getDateUrl(d))), concurrent, chunkDelay);
    }

    public fetchForDateRange(startDate: Date, endDate: Date, concurrent: number = 10,
                             chunkDelay: number = 1000): Observable<AssetQuote> {
        return this.fetchForDates(
            QuotesFetcher.dateRangeToArray(startDate, endDate),
            concurrent,
            chunkDelay
        );
    }

    public fetchFromDate(startDate: Date, concurrent: number = 10,
                         chunkDelay: number = 1000): Observable<AssetQuote> {
        return this.fetchForDateRange(startDate, new Date(), concurrent, chunkDelay);
    }

    public fetchForDate(date: Date): Observable<AssetQuote> {
        return this.fetchForDates([date], 1, 0);
    }
}
