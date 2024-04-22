const { createLogger, format, transports } = require('winston');
const { uri } = require('./database');
require('winston-mongodb');

const options = {
    console: {
        level: "debug",
        handleExceptions: true,
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    },
    collection_system: {
        level: 'info',
        db: uri,
        options: {
            useUnifiedTopology: true
        },
        collection: 'systemLog',
        format: format.combine(
            format.timestamp(),
            format.json())
    },
    collection_user: {
        level: 'info',
        db: uri,
        options: {
            useUnifiedTopology: true
        },
        collection: 'userLog',
        format: format.combine(
            format.timestamp(),
            format.json())
    },
    collection_admin: {
        level: 'info',
        db: uri,
        options: {
            useUnifiedTopology: true
        },
        collection: 'adminLog',
        format: format.combine(
            format.timestamp(),
            format.json())
    }
};

const systemlogger = new createLogger({
    transports: [
        new transports.Console(options.console),
        new transports.MongoDB(options.collection_system),
    ],
    exitOnError: false,
});

const adminlogger = new createLogger({
    transports: [
        new transports.MongoDB(options.collection_admin),
    ],
    exitOnError: false,
});

const userlogger = new createLogger({
    transports: [
        new transports.MongoDB(options.collection_user),
    ],
    exitOnError: false,
});

systemlogger.stream = {
    write: function (message) {
        systemlogger.info(message);
    },
};

module.exports = {
    systemlogger,
    adminlogger,
    userlogger
};
