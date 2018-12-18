import { Observable } from 'rxjs';
import { AssetQuote } from '../types/asset-quote';
declare type DateUrl = {
    date: Date;
    url: string;
};
export declare class QuotesFetcher {
    private BASE_URL;
    private responseParser;
    private static dateRangeGenerator;
    private static formatDate;
    getDateUrl(date: Date): DateUrl;
    static dateRangeToArray(startDate: Date, endDate: Date): Date[];
    private mapUrlsToRequests;
    private fetch;
    fetchForDates(dates: Date[], concurrent?: number, chunkDelay?: number): Observable<AssetQuote>;
    fetchForDateRange(startDate: Date, endDate: Date, concurrent?: number, chunkDelay?: number): Observable<AssetQuote>;
    fetchFromDate(startDate: Date, concurrent?: number, chunkDelay?: number): Observable<AssetQuote>;
    fetchForDate(date: Date): Observable<AssetQuote>;
}
export {};
