"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QuotesRequest {
    getAsset() {
        return this.asset;
    }
    setAsset(asset) {
        this.asset = asset;
    }
    getStartDate() {
        return this.startDate;
    }
    setStartDate(startDate) {
        this.startDate = startDate;
    }
    getEndDate() {
        return this.endDate;
    }
    setEndDate(endDate) {
        this.endDate = endDate;
    }
    isSingleDate() {
        return this.startDate === this.endDate;
    }
}
exports.QuotesRequest = QuotesRequest;
