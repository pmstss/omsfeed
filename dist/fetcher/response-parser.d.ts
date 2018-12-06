import { RxHttpRequestResponse } from '@akanass/rx-http-request';
import { AssetQuote } from '../types/asset-quote';
export declare class ResponseParser {
    private rusNames;
    private engNames;
    private formatName;
    private static formatPrice;
    normalizeResponse(date: Date, response: RxHttpRequestResponse): AssetQuote[];
}
