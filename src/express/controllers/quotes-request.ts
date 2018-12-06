import { Asset } from '../../types/asset-quote';

export class QuotesRequest {
    private asset: Asset;
    private startDate: Date;
    private endDate: Date;

    getAsset(): Asset {
        return this.asset;
    }

    setAsset(asset: Asset): void {
        this.asset = asset;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }

    isSingleDate(): boolean {
        return this.startDate === this.endDate;
    }
}
