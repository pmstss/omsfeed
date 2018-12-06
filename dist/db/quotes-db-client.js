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
const mongodb_1 = require("mongodb");
class QuotesDbClient {
    constructor(dbOptions) {
        this.dbOptions = {
            uri: process.env.MONGO_OMS_URI || 'mongodb://localhost:27017',
            dbName: process.env.MONGO_OMS_DB || 'oms',
            collName: process.env.MONGO_OMS_COLLECTION || 'asset-quotes'
        };
        this.client = null;
        if (dbOptions) {
            this.dbOptions = dbOptions;
        }
    }
    static getInstance(dbOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new QuotesDbClient(dbOptions);
            yield this.instance.connect();
            return this.instance;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield mongodb_1.MongoClient.connect(this.dbOptions.uri, { useNewUrlParser: true });
            this.collection = this.client
                .db(this.dbOptions.dbName).collection(this.dbOptions.collName);
        });
    }
    disconnect() {
        return this.client.close().then(() => this.client = null);
    }
    countDocuments() {
        return this.collection.countDocuments();
    }
    remove(query) {
        return this.collection.deleteMany(query);
    }
    insert(assetQuote) {
        return this.collection.insertOne(assetQuote);
    }
    insertMany(assetQuotes) {
        return this.collection.insertMany(assetQuotes);
    }
    find(query) {
        return this.collection.find(query).project({ _id: 0 }); // projection to suppress _id
    }
}
QuotesDbClient.instance = null;
exports.QuotesDbClient = QuotesDbClient;
