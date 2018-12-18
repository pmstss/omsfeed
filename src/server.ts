import * as express from 'express';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as apicache from 'apicache';
import { morganMongoMiddleware } from 'morgan-mongo';
import { onError, onListening } from './express/callbacks';
import quotesRouter from './express/quotes-router';

export const app = express();
app.set('port', process.env.PORT || 3000);

app.set('json spaces', 4);

app.use(cors());
app.use(logger('dev'));

app.use(morganMongoMiddleware(
    {
        connectionString: process.env.MONGO_OMS_URI || 'mongodb://localhost:27017',
    },
    {
        dbName: process.env.MONGO_OMS_DB || 'oms'
    },
    {
        capped: {
            size: 10 * 1024 * 1024,
            max: 50 * 1024
        },
        collection: process.env.MONGO_OMS_COLLECTION_LOGS || 'request-logs'
    }
));

app.use(compression());

// route to display cache index
app.get('/quotes/cache', (req, res) => {
    res.json(apicache.getIndex());
});

app.use('/quotes', apicache.middleware('10 minutes'), quotesRouter);

app.use((req, res) => res.status(404).send('Not Found!'));
app.use(<express.ErrorRequestHandler>((err, req, res) => {
    res.status(err.status || 500).send(`Error: ${err.name}, message: ${err.message}`);
}));

const server = app.listen(app.get('port'), onListening);
server.on('error', onError);

export default server;
