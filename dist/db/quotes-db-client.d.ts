import { Cursor, DeleteWriteOpResultObject, FilterQuery, InsertOneWriteOpResult, InsertWriteOpResult } from 'mongodb';
import { AssetQuote } from '../types/asset-quote';
export declare type DbOptions = {
    uri: string;
    dbName?: string;
    collName?: string;
};
export declare class QuotesDbClient {
    private dbOptions;
    private static instance;
    private client;
    private collection;
    private constructor();
    static getInstance(dbOptions?: DbOptions): Promise<QuotesDbClient>;
    connect(): Promise<void>;
    disconnect(): Promise<any>;
    countDocuments(): Promise<number>;
    remove(query: FilterQuery<AssetQuote>): Promise<DeleteWriteOpResultObject>;
    insert(assetQuote: AssetQuote): Promise<InsertOneWriteOpResult>;
    insertMany(assetQuotes: AssetQuote[]): Promise<InsertWriteOpResult>;
    find(query: FilterQuery<AssetQuote>): Cursor<AssetQuote>;
}
