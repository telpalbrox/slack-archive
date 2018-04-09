const config = require('./config');

const isNode =
    typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined';

exports.getServerUrl = () => {
    return isNode ? `http://localhost:${config.PORT}` : '';
};
