"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rx_http_request_1 = require("@akanass/rx-http-request");
const response_parser_1 = require("./response-parser");
class QuotesFetcher {
    constructor() {
        this.BASE_URL = 'https://www.bps-sberbank.by/Portal/public/precious/getPreciousOms/';
        this.responseParser = new response_parser_1.ResponseParser();
    }
    static *dateRangeGenerator(startDate, endDate) {
        for (const d = new Date(startDate); d.getTime() <= endDate.getTime(); d.setDate(d.getDate() + 1)) {
            yield new Date(d);
        }
    }
    static formatDate(d) {
        return d.toISOString().substr(0, 10).split('-').reverse().join('-');
    }
    getDateUrl(date) {
        return {
            date,
            url: `${this.BASE_URL}${QuotesFetcher.formatDate(date)}`
        };
    }
    static dateRangeToArray(startDate, endDate) {
        return Array.from(QuotesFetcher.dateRangeGenerator(startDate, endDate));
    }
    mapUrlsToRequests(urlsStream, concurrent, chunkDelay) {
        return urlsStream.pipe(operators_1.mergeMap((dateUrl) => rx_http_request_1.RxHR.get(dateUrl.url).pipe(operators_1.delay(chunkDelay), operators_1.map(res => (Object.assign({}, dateUrl, { response: res })))), concurrent));
    }
    fetch(urlsStream, concurrent, chunkDelay) {
        return this.mapUrlsToRequests(urlsStream, concurrent, chunkDelay).pipe(operators_1.mergeMap((item) => {
            return this.responseParser.normalizeResponse(item.date, item.response);
        }));
    }
    fetchForDates(dates, concurrent = 10, chunkDelay = 1000) {
        return this.fetch(rxjs_1.from(dates.map(d => this.getDateUrl(d))), concurrent, chunkDelay);
    }
    fetchForDateRange(startDate, endDate, concurrent = 10, chunkDelay = 1000) {
        return this.fetchForDates(QuotesFetcher.dateRangeToArray(startDate, endDate), concurrent, chunkDelay);
    }
    fetchFromDate(startDate, concurrent = 10, chunkDelay = 1000) {
        return this.fetchForDateRange(startDate, new Date(), concurrent, chunkDelay);
    }
    fetchForDate(date) {
        return this.fetchForDates([date], 1, 0);
    }
}
exports.QuotesFetcher = QuotesFetcher;
