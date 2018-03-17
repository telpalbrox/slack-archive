'use strict'
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const config = require('./config');
const databases = require('./database');
const db = databases.messagesDb;
const channelsDb = databases.channelsDb;

const channelsJSON = require(config.CHANNELS_JSON_PATH);
const usersJSON = require(config.USERS_JSON_PATH);
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
        await fs.unlinkAsync(config.DB_FILE_PATH);
        await fs.unlinkAsync(config.CHANNELS_DB_FILE_PATH);
    } catch(err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    channelsDb.insert(channelsJSON);
    const files = await fs.readdirAsync(config.DATA_PATH);
    for (let fileName of files) {
        const filePath = path.join(config.DATA_PATH, fileName);
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
