"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseParser {
    constructor() {
        this.rusNames = ['ЗОЛОТО', 'СЕРЕБРО', 'ПЛАТИНА', 'ПАЛЛАДИЙ'];
        this.engNames = ['au', 'ag', 'pt', 'pd'];
    }
    formatName(name) {
        return this.engNames[this.rusNames.indexOf(name)];
    }
    static formatPrice(price) {
        return price.replace(',', '.');
    }
    normalizeResponse(date, response) {
        try {
            return JSON.parse(response.body).map((r) => {
                return {
                    date,
                    code: +r.code,
                    asset: this.formatName(r.name),
                    sellByn: +ResponseParser.formatPrice(r.sellByn),
                    buyByn: +ResponseParser.formatPrice(r.buyByn),
                    sellUsd: +ResponseParser.formatPrice(r.sellUsd),
                    buyUsd: +ResponseParser.formatPrice(r.buyUsd)
                };
            });
        }
        catch (e) {
            console.error(date, response.body);
            return [];
        }
    }
}
exports.ResponseParser = ResponseParser;
