"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rx_http_request_1 = require("@akanass/rx-http-request");
const moment = require("moment");
const response_parser_1 = require("./response-parser");
class QuotesFetcher {
    constructor() {
        this.BASE_URL = 'https://www.bps-sberbank.by/Portal/public/precious/getPreciousOms/';
        this.responseParser = new response_parser_1.ResponseParser();
    }
    *urlsGenerator(startDate) {
        const date = moment(startDate);
        const now = Date.now();
        while (date.diff(now) < 0) {
            yield this.getDateUrl(date);
            date.add(1, 'day');
        }
    }
    getDateUrl(date) {
        const m = moment(date);
        return {
            date: m.toDate(),
            url: `${this.BASE_URL}${m.format('DD-MM-YYYY')}`
        };
    }
    getUrlsStreamFrom(startDate) {
        return rxjs_1.from(this.urlsGenerator(startDate));
    }
    mapUrlsToRequests(urlsStream, concurrent, chunkDelay) {
        return urlsStream.pipe(operators_1.mergeMap((dateUrl) => rx_http_request_1.RxHR.get(dateUrl.url).pipe(operators_1.delay(chunkDelay), operators_1.map(res => (Object.assign({}, dateUrl, { response: res })))), concurrent));
    }
    fetch(urlsStream, concurrent, chunkDelay) {
        return this.mapUrlsToRequests(urlsStream, concurrent, chunkDelay).pipe(operators_1.mergeMap((item) => {
            return this.responseParser.normalizeResponse(item.date, item.response);
        }));
    }
    fetchFromDate(startDate, concurrent = 10, chunkDelay = 1000) {
        return this.fetch(this.getUrlsStreamFrom(startDate), concurrent, chunkDelay);
    }
    fetchForDate(date) {
        return this.fetch(rxjs_1.from([this.getDateUrl(date)]), 1, 0);
    }
}
exports.QuotesFetcher = QuotesFetcher;
