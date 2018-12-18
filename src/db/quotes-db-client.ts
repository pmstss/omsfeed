import {
    Collection, Cursor,
    DeleteWriteOpResultObject,
    FilterQuery,
    InsertOneWriteOpResult,
    InsertWriteOpResult,
    WriteOpResult,
    MongoClient
} from 'mongodb';
import { AssetQuote } from '../types/asset-quote';

export type DbOptions = {
    uri: string;
    dbName?: string;
    collName?: string;
};

export class QuotesDbClient {
    private dbOptions: DbOptions = {
        uri: process.env.MONGO_OMS_URI || 'mongodb://localhost:27017',
        dbName: process.env.MONGO_OMS_DB || 'oms',
        collName: process.env.MONGO_OMS_COLLECTION || 'asset-quotes'
    };

    private static instance: QuotesDbClient = null;
    private client: MongoClient = null;
    private collection: Collection<AssetQuote>;

    private constructor(dbOptions?: DbOptions) {
        if (dbOptions) {
            this.dbOptions = dbOptions;
        }
    }

    public static async getInstance(dbOptions?: DbOptions) {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new QuotesDbClient(dbOptions);
        await this.instance.connect();
        return this.instance;
    }

    public async connect() {
        this.client = await MongoClient.connect(this.dbOptions.uri, { useNewUrlParser: true });
        this.collection = this.client
            .db(this.dbOptions.dbName).collection(this.dbOptions.collName);
    }

    public disconnect() {
        return this.client.close().then(() => this.client = null);
    }

    public countDocuments(): Promise<number> {
        return  this.collection.countDocuments();
    }

    public remove(query: FilterQuery<AssetQuote>): Promise<DeleteWriteOpResultObject> {
        return this.collection.deleteMany(query);
    }

    public insert(assetQuote: AssetQuote): Promise<InsertOneWriteOpResult> {
        return this.collection.insertOne(assetQuote);
    }

    public insertMany(assetQuotes: AssetQuote[]): Promise<InsertWriteOpResult> {
        return this.collection.insertMany(assetQuotes);
    }

    public upsert(assetQuote: AssetQuote): Promise<WriteOpResult> {
        return this.collection.update(
            { 
                date: assetQuote.date, 
                asset: assetQuote.asset 
            }, assetQuote, {
                upsert:true
            }
        );
    }
    
    public upsertMany(assetQuotes: AssetQuote[]): Promise<WriteOpResult[]> {
        return Promise.all(assetQuotes.map(q => this.upsert(q)));
    }

    public find(query: FilterQuery<AssetQuote>): Cursor<AssetQuote> {
        return this.collection.find(query).project({ _id: 0 }); // projection to suppress _id
    }
}
