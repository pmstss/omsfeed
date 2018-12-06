import { Asset } from '../../types/asset-quote';
export declare class QuotesRequest {
    private asset;
    private startDate;
    private endDate;
    getAsset(): Asset;
    setAsset(asset: Asset): void;
    getStartDate(): Date;
    setStartDate(startDate: Date): void;
    getEndDate(): Date;
    setEndDate(endDate: Date): void;
    isSingleDate(): boolean;
}
