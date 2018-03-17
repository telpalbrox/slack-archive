const path = require('path');

const DATA_PATH = path.join(__dirname, 'data');
const DB_FILE_PATH = path.join(__dirname, 'archive.db');
const CHANNELS_DB_FILE_PATH = path.join(__dirname, 'channels.db');
const USERS_JSON_PATH = path.join(DATA_PATH, 'users.json');
const CHANNELS_JSON_PATH = path.join(DATA_PATH, 'channels.json');
const PORT = process.env.PORT || 3000;

module.exports = {
    DATA_PATH,
    DB_FILE_PATH,
    CHANNELS_DB_FILE_PATH,
    USERS_JSON_PATH,
    CHANNELS_JSON_PATH,
    PORT
};
