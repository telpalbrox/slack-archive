'use strict'
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const paths = require('./paths');
const databases = require('./database');
const db = databases.messagesDb;
const channelsDb = databases.channelsDb;

const channelsJSON = require(paths.CHANNELS_JSON);
const usersJSON = require(paths.USERS_JSON);
const users = {};

Promise.promisifyAll(fs);

const loadUsers = () => {
    usersJSON.forEach((user) => {
        users[user.id] = user;
    });
};

const insertDayMessages = (channel, messages) => {
    const messageWithUser = messages.map((message) => {
        message.channel = channel;
        message.user = users[message.user] ? users[message.user].real_name : message.user;
        return message;
    });
    db.insert(messageWithUser);
};

const readChannelDirectory = async (channel, directoryPath) => {
    const files = await fs.readdirAsync(directoryPath);
    for (let fileName of files) {
        const filePath = path.join(directoryPath, fileName);
        const dayMessages = require(filePath);
        insertDayMessages(channel, dayMessages);
    }
};

const importArchive = async () => {
    console.time('Import time');
    loadUsers();
    try {
        await fs.unlinkAsync(paths.DB_FILE);
        await fs.unlinkAsync(paths.CHANNELS_DB_FILE);
    } catch(err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    channelsDb.insert(channelsJSON);
    const files = await fs.readdirAsync(paths.DATA_PATH);
    for (let fileName of files) {
        const filePath = path.join(paths.DATA_PATH, fileName);
        const stats = await fs.statAsync(filePath);
        if (stats.isDirectory()) {
            console.log('Reading channel:', fileName);
            readChannelDirectory(fileName, filePath);
        }
    }
    console.log('Finished!');
    console.timeEnd('Import time');
};

importArchive();
