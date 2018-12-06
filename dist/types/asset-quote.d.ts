export declare type Asset = 'au' | 'pt' | 'ag' | 'pd';
export interface AssetQuote {
    date: Date;
    code: number;
    asset: Asset;
    sellByn: number;
    buyByn: number;
    sellUsd: number;
    buyUsd: number;
}
