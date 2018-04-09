const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const Datastore = require('nedb');
const Promise = require('bluebird');
const next = require('next');
const databases = require('./database');
const config = require('./config');

const dev = process.env.NODE_ENV !== 'production';
const db = databases.messagesDb;
const channelsDb = databases.channelsDb;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    app.use(morgan('combined'));
    if (process.env.HTTP_USER && process.env.HTTP_PASSWORD) {
        app.use((req, res, next) => {
            const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
            if (ip === '127.0.0.1' || ip === '::ffff:127.0.0.1' || ip === '::1') {
                return next();
            }
            basicAuth({
                users: { [process.env.HTTP_USER]: process.env.HTTP_PASSWORD },
                challenge: true
            })(req, res, next);
        });
    }

    app.use(bodyParser.json());

    app.get('/service-worker.js', (req, res) => {
        const filePath = path.join(__dirname, '.next', '/service-worker.js');
        nextApp.serveStatic(req, res, filePath);
    });

    const nedbOperator = [['$gt', '$gte'], ['$lt', '$lte']];

    app.get('/api/channel/:channel', (req, res) => {
        const findOptions = {
            channel: req.params.channel
        };
        if (req.query.ts !== undefined) {
            const reverse = req.query.reverse === 'true' ? 1 : 0;
            const includeMessage = req.query.includeMessage === 'true' ? 1 : 0;
            findOptions.ts = {
                [nedbOperator[reverse][includeMessage]]: req.query.ts
            };
        }
        db
            .find(findOptions)
            .sort({ ts: req.query.reverse === 'true' ? -1 : 1 })
            .limit(100)
            .exec((err, messages) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                    return;
                }
                res.json(req.query.reverse === 'true' ? messages.reverse() : messages);
            });
    });

    app.get('/api/search', (req, res) => {
        const findOptions = {
            text: { $regex: searchRegex(req.query.query) }
        };
        if (req.query.ts !== undefined) {
            findOptions.ts = {
                $gt: req.query.ts
            };
        }
        db
            .find(findOptions)
            .sort({ ts: 1 })
            .limit(100)
            .exec((err, messages) => {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                    return;
                }
                res.json(messages);
            });
    });

    app.get('/api/channels', (req, res) => {
        channelsDb.find({}, (err, channels) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
                return;
            }
            res.json(channels);
        });
    });

    app.get('/channel/:channel', (req, res) => {
        nextApp.render(req, res, '/channel', { channel: req.params.channel, ts: req.query.ts });
    });

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    app.listen(config.PORT, err => {
        if (err) {
            throw err;
        }
        console.log(`Listening on ${config.PORT}`);
    });
});

function searchRegex(term) {
    // Build Regex String
    let matchTerm = '.*';

    // Split all the search terms
    const terms = term.split(' ');

    for (let i = 0; i < terms.length; i++) {
        matchTerm += '(?=.*' + terms[i] + '.*)';
    }

    matchTerm += '.*';

    // Convert to Regex
    // => /.*(?=.*TERM1.*)(?=.*TERM2.*).*/
    return new RegExp(matchTerm, 'gi');
}
