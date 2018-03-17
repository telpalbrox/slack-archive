const path = require('path');

const DATA_PATH = path.join(__dirname, 'data');
const DB_FILE = path.join(__dirname, 'archive.db');
const CHANNELS_DB_FILE = path.join(__dirname, 'channels.db');
const USERS_JSON = path.join(DATA_PATH, 'users.json');
const CHANNELS_JSON = path.join(DATA_PATH, 'channels.json');

module.exports = {
    DATA_PATH,
    DB_FILE,
    CHANNELS_DB_FILE,
    USERS_JSON,
    CHANNELS_JSON
};
