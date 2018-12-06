import { Observable } from 'rxjs';
import * as moment from 'moment';
import { AssetQuote } from '../types/asset-quote';
declare type DateUrl = {
    date: Date;
    url: string;
};
export declare class QuotesFetcher {
    private BASE_URL;
    private responseParser;
    private urlsGenerator;
    getDateUrl(date: moment.Moment | Date): DateUrl;
    getUrlsStreamFrom(startDate: Date): Observable<DateUrl>;
    private mapUrlsToRequests;
    private fetch;
    fetchFromDate(startDate: Date, concurrent?: number, chunkDelay?: number): Observable<AssetQuote>;
    fetchForDate(date: Date): Observable<AssetQuote>;
}
export {};
