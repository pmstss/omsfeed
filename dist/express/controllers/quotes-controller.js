"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const quotes_db_client_1 = require("../../db/quotes-db-client");
const params_parser_1 = require("./params-parser");
const quotes_fetcher_1 = require("../../fetcher/quotes-fetcher");
class QuotesController {
    constructor() {
        this.dbClient = null;
        this.quotesFetcher = new quotes_fetcher_1.QuotesFetcher();
    }
    fetchMissingQuotes(dates) {
        return this.quotesFetcher.fetchForDates(dates).pipe(operators_1.toArray(), operators_1.flatMap((quotes) => rxjs_1.from(quotes.length > 0 ?
            this.dbClient.upsertMany(quotes).then(() => quotes) : [])));
    }
    detectMissingDates(quotes, startDate, endDate) {
        const quotesSet = new Set(quotes.map(q => q.date.getTime()));
        return quotes_fetcher_1.QuotesFetcher.dateRangeToArray(startDate, endDate)
            .filter(d => !quotesSet.has(d.getTime()));
    }
    handle(req, res, next, fetchMissing = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.dbClient) {
                this.dbClient = yield quotes_db_client_1.QuotesDbClient.getInstance();
            }
            const quotesRequest = params_parser_1.ParametersParser.parse(req);
            const quotes = yield this.dbClient.find({
                date: {
                    $gte: quotesRequest.getStartDate(),
                    $lte: quotesRequest.getEndDate()
                },
                asset: quotesRequest.getAsset() || { $exists: true }
            }).toArray();
            const missingDates = this.detectMissingDates(quotes, quotesRequest.getStartDate(), quotesRequest.getEndDate());
            if (missingDates.length) {
                console.log('quotes are missing for dates: ', ...missingDates);
            }
            if (missingDates.length > 0 && fetchMissing) {
                try {
                    const quotes = this.fetchMissingQuotes(missingDates).toPromise();
                    this.handle(req, res, next, false);
                }
                catch (e) {
                    res.status(500).send(`Error fetching missing quotes: ${e.message}`);
                }
            }
            else {
                res.header('Content-Type', 'application/json');
                res.send(quotes);
            }
        });
    }
}
exports.QuotesController = QuotesController;
