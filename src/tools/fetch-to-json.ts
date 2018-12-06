import * as fs from 'fs';
import * as program from 'commander';
import { tap, toArray } from 'rxjs/operators';
import { QuotesFetcher } from '../fetcher/quotes-fetcher';
import { AssetQuote } from '../types/asset-quote';

let counter = 0;
const quotesFetcher = new QuotesFetcher();

const options = program
    .version('1.0.0')
    .description('Fetches quotes from predefined remote feed to local json file')
    .usage('[options] <output.json>')
    // tslint:disable-next-line:max-line-length
    .option('-s, --start-date [startDate]', 'date to start from (YYYY-MM-DD)', Date.parse, Date.parse('2018-06-01'))
    .option('-p, --parallel [n]', 'number of parallel requests', parseInt, 10)
    .option('-d, --delay [ms]', 'delay (ms) after each request', parseInt, 1000)
    .option('-b, --beautify', 'beautify output json', false)
    .parse(process.argv);

if (!program.args.length) {
    program.help();
    process.exit(1);
}

quotesFetcher.fetchFromDate(options.startDate, options.parallel, options.delay).pipe(
    tap((item) => {
        console.log(`${new Date()} finished with item for date ${item.date}, items: ${++counter}`);
    }),
    toArray()
).subscribe(
    (res: AssetQuote[]) => {
        fs.writeFileSync(program.args[0], JSON.stringify(res, null, options.beautify ? 4 : 0));
    },
    (e: any) => {
        console.error(e);
    }
);
