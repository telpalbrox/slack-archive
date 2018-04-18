const path = require('path');

const DB_FILE_PATH = path.join(__dirname, 'archive.db');
const CHANNELS_DB_FILE_PATH = path.join(__dirname, 'channels.db');
const PORT = process.env.PORT || 3000;

module.exports = {
    DB_FILE_PATH,
    CHANNELS_DB_FILE_PATH,
    PORT
};
