'use strict';
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const config = require('./config');
const databases = require('./database');
const db = databases.messagesDb;
const channelsDb = databases.channelsDb;

Promise.promisifyAll(fs);

const loadUsers = usersJSONPath => {
    const usersJSON = require(usersJSONPath);
    const users = {};
    usersJSON.forEach(user => {
        users[user.id] = user;
    });
    return users;
};

const insertDayMessages = (channel, messages, users) => {
    const messageWithUser = messages.map(message => {
        message.channel = channel;
        message.user = users[message.user] ? users[message.user].real_name : message.user;
        return message;
    });
    db.insert(messageWithUser);
};

const readChannelDirectory = async (channel, directoryPath, users) => {
    const files = await fs.readdirAsync(directoryPath);
    for (let fileName of files) {
        const filePath = path.join(directoryPath, fileName);
        const dayMessages = require(filePath);
        insertDayMessages(channel, dayMessages, users);
    }
};

const importArchive = async (dataPath = path.join(__dirname, 'data')) => {
    console.time('Import time');
    const usersJSONPath = path.join(dataPath, 'users.json');
    const channelsJSONPath = path.join(dataPath, 'channels.json');
    const users = loadUsers(usersJSONPath);
    try {
        await fs.unlinkAsync(config.DB_FILE_PATH);
        await fs.unlinkAsync(config.CHANNELS_DB_FILE_PATH);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    const channelsJSON = require(channelsJSONPath);
    channelsDb.insert(channelsJSON);
    const files = await fs.readdirAsync(dataPath);
    for (let fileName of files) {
        const filePath = path.join(dataPath, fileName);
        const stats = await fs.statAsync(filePath);
        if (stats.isDirectory()) {
            console.log('Reading channel:', fileName);
            readChannelDirectory(fileName, filePath, users);
        }
    }
    console.log('Finished!');
    console.timeEnd('Import time');
};

exports.importArchive = importArchive;

if (process.argv[2] && process.argv[2] === 'filesystem') {
    importArchive();
}
