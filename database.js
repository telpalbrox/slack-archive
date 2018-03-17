const Datastore = require('nedb');
const paths = require('./paths');

const messagesDb = new Datastore({
    filename: paths.DB_FILE,
    autoload: true
});
messagesDb.ensureIndex({ fieldName: 'text' });
const channelsDb = new Datastore({
    filename: paths.CHANNELS_DB_FILE,
    autoload: true
});

module.exports = {
    messagesDb,
    channelsDb
};
