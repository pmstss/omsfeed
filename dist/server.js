"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const compression = require("compression");
const logger = require("morgan");
const cors = require("cors");
const morgan_mongo_1 = require("morgan-mongo");
const callbacks_1 = require("./express/callbacks");
const quotes_router_1 = require("./express/quotes-router");
exports.app = express();
exports.app.set('port', process.env.PORT || 3000);
exports.app.set('json spaces', 4);
exports.app.use(cors());
exports.app.use(logger('dev'));
exports.app.use(morgan_mongo_1.morganMongoMiddleware({
    connectionString: process.env.MONGO_OMS_URI || 'mongodb://localhost:27017',
}, {
    dbName: process.env.MONGO_OMS_DB || 'oms'
}, {
    capped: {
        size: 10 * 1024 * 1024,
        max: 50 * 1024
    },
    collection: process.env.MONGO_OMS_COLLECTION_LOGS || 'request-logs'
}));
exports.app.use(compression());
exports.app.use('/quotes', quotes_router_1.default);
exports.app.use((req, res) => res.status(404).send('Not Found!'));
exports.app.use(((err, req, res) => {
    res.status(err.status || 500).send(`Error: ${err.name}, message: ${err.message}`);
}));
const server = exports.app.listen(exports.app.get('port'), callbacks_1.onListening);
server.on('error', callbacks_1.onError);
exports.default = server;
