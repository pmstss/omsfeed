# omsfeed
[![Build Status](https://travis-ci.com/pmstss/omsfeed.svg?branch=master)](https://travis-ci.com/pmstss/omsfeed) [![Known Vulnerabilities](https://snyk.io/test/github/pmstss/omsfeed/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pmstss/omsfeed?targetFile=package.json)

Server-side of pet project for private needs.

Express app to retrieve precious metals (au, ag, pt, pd) daily quotes (from [local bank](https://www.bps-sberbank.by/43257f17004e948d/dm_rates)), store them in MongoDB and provide API on top.


## Demo

[Output Live Demo](https://omsfeed.herokuapp.com/quotes/?startDate=2018-07-01)

<details><summary>JSON sample</summary>
    
```json
[
    {
        "date": "2018-12-03T00:00:00.000Z",
        "code": 959,
        "asset": "au",
        "sellByn": 86.9253,
        "buyByn": 81.8772,
        "sellUsd": 40.81,
        "buyUsd": 38.44
    },
    {
        "date": "2018-12-03T00:00:00.000Z",
        "code": 961,
        "asset": "ag",
        "sellByn": 1.0309,
        "buyByn": 0.9521,
        "sellUsd": 0.484,
        "buyUsd": 0.447
    },
    {
        "date": "2018-12-03T00:00:00.000Z",
        "code": 962,
        "asset": "pt",
        "sellByn": 57.6591,
        "buyByn": 53.2287,
        "sellUsd": 27.07,
        "buyUsd": 24.99
    },
    {
        "date": "2018-12-03T00:00:00.000Z",
        "code": 964,
        "asset": "pd",
        "sellByn": 86.4993,
        "buyByn": 78.2775,
        "sellUsd": 40.61,
        "buyUsd": 36.75
    }
]
```

</details>

### Building blocks, Credits

* [Typescript](https://github.com/Microsoft/TypeScript)
* [Express](https://github.com/expressjs/express)
* [MongoDB Node.JS Driver](https://github.com/mongodb/node-mongodb-native)
* [RxJS](https://github.com/ReactiveX/rxjs)
* [rx-http-request](https://github.com/njl07/rx-http-request)
* [TSLint](https://github.com/palantir/tslint)
* [commander.js](https://github.com/tj/commander.js)
* [Moment.js](https://github.com/moment/moment)
* [morgan-mongo](https://github.com/pmstss/morgan-mongo)

### API

Endpoints:
* `/quotes/<asset>?date=[YYYY-MM-DD]` - single date quotes, `asset` (`au`, `ag`, `pt`, `pd`) is optional
* `/quotes/<asset>?startDate=[YYYY-MM-DD]` -  date range quotes, `asset` and `endDate` are optional
* TODO: normalized buy/sell (spread is increased on non-working days and hours).

Examples: 
* [`/quotes/?date=2018-08-01`](https://omsfeed.herokuapp.com/quotes/?date=2018-08-01) all asset quotes for Aug, 1
* [`/quotes/au?date=2018-08-01`](https://omsfeed.herokuapp.com/quotes/au?date=2018-08-01) gold quotes for Aug, 1
* [`/quotes/?startDate=2018-08-01&endDate=2018-08-10`](https://omsfeed.herokuapp.com/quotes/?startDate=2018-08-01&endDate=2018-08-10) gold quotes from Aug, 1 to Aug, 10
* [`/quotes/?startDate=2018-12-01`](https://omsfeed.herokuapp.com/quotes/?startDate=2018-12-01) all asset quotes for Dec, 1 till now

### Tools

Available as npm scripts:
* [Fetch quotes from remote feed to JSON](src/tools/fetch-to-json.ts)  (`npm run @tools/fetch`)
* [Load quotes from JSON to MongoDB](src/tools/load-json-to-db.ts) (`npm run @tools/db-import`)

### Configuration

Default MongoDB connection options that could be overridden with environment variables:
* connection string: `mongodb://localhost:27017` (env `MONGO_OMS_URI`)
* database name: `oms` (env `MONGO_OMS_DB`)
* collection name: `asset-quotes` (env `MONGO_OMS_COLLECTION`)
* logs collection name: `request-logs` (env `MONGO_OMS_COLLECTION_LOGS`)

### Running locally

    git clone https://github.com/pmstss/omsfeed
    cd omsfeed
    npm install
    npm run build
    npm run start
or

    npm install omsfeed
    node node_modules/omsfeed/dist/server.js



### Contribution
Feel free to contribute by opening issues with any questions, ideas or feature requests.

### License
  [MIT](LICENSE)
