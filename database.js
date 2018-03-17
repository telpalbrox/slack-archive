const Datastore = require('nedb');
const config = require('./config');

const messagesDb = new Datastore({
    filename: config.DB_FILE_PATH,
    autoload: true
});
messagesDb.ensureIndex({ fieldName: 'text' });
const channelsDb = new Datastore({
    filename: config.CHANNELS_DB_FILE_PATH,
    autoload: true
});

module.exports = {
    messagesDb,
    channelsDb
};
