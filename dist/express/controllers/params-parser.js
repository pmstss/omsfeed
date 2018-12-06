"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quotes_request_1 = require("./quotes-request");
class ParametersParser {
    static parse(req) {
        const quotesRequest = new quotes_request_1.QuotesRequest();
        if (req.params.asset) {
            quotesRequest.setAsset(req.params.asset);
        }
        if (req.query.date) {
            const date = new Date(req.query.date);
            quotesRequest.setStartDate(date);
            quotesRequest.setEndDate(date);
            return quotesRequest;
        }
        if (req.query.startDate && !req.query.endDate) {
            quotesRequest.setStartDate(new Date(req.query.startDate));
            quotesRequest.setEndDate(new Date());
            return quotesRequest;
        }
        if (!req.query.date && !req.query.startDate && !req.query.endDate) {
            quotesRequest.setStartDate(new Date());
            quotesRequest.setEndDate(new Date());
            return quotesRequest;
        }
        if (req.query.startDate && req.query.endDate) {
            quotesRequest.setStartDate(new Date(req.query.startDate));
            quotesRequest.setEndDate(new Date(req.query.endDate));
            return quotesRequest;
        }
        throw new Error('No matching route');
    }
}
exports.ParametersParser = ParametersParser;
