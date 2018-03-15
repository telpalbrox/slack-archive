'use strict'
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const Datastore = require('nedb');

const DATA_PATH = path.join(__dirname, 'data');
const userJSON = require(path.join(DATA_PATH, 'users.json'));
const DB_FILE = path.join(__dirname, 'archive.db');
const db = new Datastore({
    filename: DB_FILE,
    autoload: true
});
const users = {};

Promise.promisifyAll(fs);

const loadUsers = () => {
    userJSON.forEach((user) => {
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
    const files = await fs.readdirAsync(DATA_PATH);
    for (let fileName of files) {
        const filePath = path.join(DATA_PATH, fileName);
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
