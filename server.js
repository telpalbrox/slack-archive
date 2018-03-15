const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const Promise = require('bluebird');

const DB_FILE = path.join(__dirname, 'archive.db');
const db = new Datastore({
    filename: DB_FILE,
    autoload: true
});
db.ensureIndex({ fieldName: 'text' });
const app = express();

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

app.listen(process.env.PORT || 3000, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Listening on ${process.env.PORT || 3000}`)
});
