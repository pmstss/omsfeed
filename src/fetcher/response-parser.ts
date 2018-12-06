import { RxHttpRequestResponse } from '@akanass/rx-http-request';
import { Asset, AssetQuote } from '../types/asset-quote';

export class ResponseParser {
    private rusNames = ['ЗОЛОТО', 'СЕРЕБРО', 'ПЛАТИНА', 'ПАЛЛАДИЙ'];
    private engNames = ['au', 'ag', 'pt', 'pd'];

    private formatName(name: string): string {
        return this.engNames[this.rusNames.indexOf(name)];
    }

    private static formatPrice(price: string): string {
        return price.replace(',', '.');
    }

    normalizeResponse(date: Date, response: RxHttpRequestResponse): AssetQuote[] {
        try {
            return JSON.parse(response.body).map((r: any): AssetQuote => {
                return {
                    date,
                    code: +r.code,
                    asset: <Asset>this.formatName(r.name),
                    sellByn: +ResponseParser.formatPrice(r.sellByn),
                    buyByn: +ResponseParser.formatPrice(r.buyByn),
                    sellUsd: +ResponseParser.formatPrice(r.sellUsd),
                    buyUsd: +ResponseParser.formatPrice(r.buyUsd)
                };
            });
        } catch (e) {
            console.error(date, response.body);
            return [];
        }
    }
}
