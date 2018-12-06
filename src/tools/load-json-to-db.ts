import * as fs from 'fs';
import * as program from 'commander';
import { AssetQuote } from '../types/asset-quote';
import { QuotesDbClient } from '../db/quotes-db-client';

async function loadJsonToDb(filename: string, options: any) {
    const assetQuotes: AssetQuote[] = JSON.parse(fs.readFileSync(filename, 'utf-8'))
        .map((entry: AssetQuote) => ({
            ...entry,
            date: new Date(entry.date)
        }));
    console.log('%o entries read from json', assetQuotes.length);

    const dbClient = await QuotesDbClient.getInstance(!options.uri ? undefined : {
        uri: options.uri,
        dbName: options.dbName,
        collName: options.collection
    });
    if (options.emptify) {
        console.log('docs in db before cleanup: %o', await dbClient.countDocuments());
        await dbClient.remove({});
    }

    await dbClient.insertMany(assetQuotes);
    return dbClient.countDocuments().then(res => dbClient.disconnect().then(() => res));
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

loadJsonToDb(program.args[0], options).then(
    (docsCount) => {
        console.log('Data has been imported; now there are %o docs in db', docsCount);
    },
    (e) => {
        console.error('Error: ', e.message);
        process.exit(1);
    }
);
