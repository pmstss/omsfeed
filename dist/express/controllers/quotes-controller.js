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
const operators_1 = require("rxjs/operators");
const quotes_db_client_1 = require("../../db/quotes-db-client");
const params_parser_1 = require("./params-parser");
const quotes_fetcher_1 = require("../../fetcher/quotes-fetcher");
class QuotesController {
    constructor() {
        this.dbClient = null;
    }
    fetchMissingQuotes(quotesRequest) {
        const quotesFetcher = new quotes_fetcher_1.QuotesFetcher();
        const date = quotesRequest.getStartDate();
        return quotesFetcher.fetchForDate(date).pipe(operators_1.toArray(), operators_1.tap((quotes) => {
            if (quotes.length === 0) {
                throw new Error(`No quotes available for date ${date}`);
            }
        }), operators_1.flatMap((quotes) => this.dbClient.insertMany(quotes))).toPromise();
    }
    handle(req, res) {
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
            if (quotes.length === 0) {
                if (quotesRequest.isSingleDate()) {
                    try {
                        yield this.fetchMissingQuotes(quotesRequest);
                        return this.handle(req, res);
                    }
                    catch (e) {
                        res.status(500).send(`Error fetching missing quotes: ${e.message}`);
                    }
                }
                else {
                    res.status(500).send('Some quotes are missing in requested range');
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
