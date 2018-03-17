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
        app.use(basicAuth({
            users: { [process.env.HTTP_USER]: process.env.HTTP_PASSWORD },
            challenge: true
        }));
    }

    app.use(bodyParser.json());

    app.get('/channel/:channel', (req, res) => {
        db.find({channel: req.params.channel}).sort({ts: 1}).exec((err, messages) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
                return;
            }
            res.json(messages);
        });
    });

    app.get('/search', (req, res) => {
        db.find({ text: {$regex: searchRegex(req.query.query)} }).sort({ts: 1}).exec((err, messages) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
                return;
            }
            res.json(messages);
        });
    });

    app.get('/channels', (req, res) => {
        channelsDb.find({}, (err, channels) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
                return;
            }
            res.json(channels);
        });
    });

    app.get('*', (req, res) => {
        return handle(req, res)
    })

    app.listen(config.PORT, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Listening on ${config.PORT}`)
    });
});

function searchRegex(term) {
    // Build Regex String 
    let matchTerm = '.*';

    // Split all the search terms
    const terms = term.split(" ");

    for(let i = 0; i < terms.length; i++) {
        matchTerm += '(?=.*' + terms[i] + '.*)';
    };

    matchTerm += '.*';

    // Convert to Regex
    // => /.*(?=.*TERM1.*)(?=.*TERM2.*).*/
    return new RegExp(matchTerm, 'gi');
}
