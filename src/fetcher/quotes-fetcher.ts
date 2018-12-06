import { Observable, from } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { RxHR, RxHttpRequestResponse } from '@akanass/rx-http-request';
import * as moment from 'moment';
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

    private* urlsGenerator(startDate: Date): IterableIterator<DateUrl> {
        const date = moment(startDate);
        const now = Date.now();
        while (date.diff(now) < 0) {
            yield  this.getDateUrl(date);
            date.add(1, 'day');
        }
    }

    public getDateUrl(date: moment.Moment | Date): DateUrl {
        const m = moment(date);
        return {
            date: m.toDate(),
            url: `${this.BASE_URL}${m.format('DD-MM-YYYY')}`
        };
    }

    public getUrlsStreamFrom(startDate: Date): Observable<DateUrl> {
        return from(this.urlsGenerator(startDate));
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
                  concurrent: number,
                  chunkDelay: number): Observable<AssetQuote> {
        return this.mapUrlsToRequests(urlsStream, concurrent, chunkDelay).pipe(
            mergeMap((item) => {
                return this.responseParser.normalizeResponse(item.date, item.response);
            })
        );
    }

    public fetchFromDate(startDate: Date, concurrent: number = 10,
                         chunkDelay: number = 1000): Observable<AssetQuote> {
        return this.fetch(this.getUrlsStreamFrom(startDate), concurrent, chunkDelay);
    }

    public fetchForDate(date: Date): Observable<AssetQuote> {
        return this.fetch(from([this.getDateUrl(date)]), 1, 0);
    }
}
