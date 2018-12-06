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
const fs = require("fs");
const program = require("commander");
const quotes_db_client_1 = require("../db/quotes-db-client");
function loadJsonToDb(filename, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetQuotes = JSON.parse(fs.readFileSync(filename, 'utf-8'))
            .map((entry) => (Object.assign({}, entry, { date: new Date(entry.date) })));
        console.log('%o entries read from json', assetQuotes.length);
        const dbClient = yield quotes_db_client_1.QuotesDbClient.getInstance(!options.uri ? undefined : {
            uri: options.uri,
            dbName: options.dbName,
            collName: options.collection
        });
        if (options.emptify) {
            console.log('docs in db before cleanup: %o', yield dbClient.countDocuments());
            yield dbClient.remove({});
        }
        yield dbClient.insertMany(assetQuotes);
        return dbClient.countDocuments().then(res => dbClient.disconnect().then(() => res));
    });
}
const options = program
    .version('1.0.0')
    .description('Loads quotes data from json file to MongoDB')
    .usage('[options] <data.json>')
    .option('-e, --emptify', 'emptify collection before load', false)
    .option('-u, --uri <uri>', 'mongo connection string', false)
    .option('-d, --db-name <dbName>', 'database name', false)
    .option('-c, --collection <collName>', 'collection name', false)
    .parse(process.argv);
if (!program.args.length) {
    program.help();
    process.exit(1);
}
loadJsonToDb(program.args[0], options).then((docsCount) => {
    console.log('Data has been imported; now there are %o docs in db', docsCount);
}, (e) => {
    console.error('Error: ', e.message);
    process.exit(1);
});
