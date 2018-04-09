const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');

module.exports = withOffline({
    ...withSass(),
    generateSw: false,
    workboxOpts: {
        swSrc: 'service-worker.js',
        globPatterns: ['dist/*.{js,png,html,css}']
    }
});
