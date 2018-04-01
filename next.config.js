const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');

module.exports = withOffline({
    ...withSass(),
    workboxOpts: {
        globPatterns: ['dist/*.{js,png,html,css}'],
        runtimeCaching: [{
            urlPattern: /.js$/,
            handler: 'cacheFirst'
        },
        {
            urlPattern: /.css$/,
            handler: 'cacheFirst'
        },
        {
            urlPattern: /.woff2$/,
            handler: 'cacheFirst'
        },
        {
            urlPattern: /api/,
            handler: 'networkFirst',
            options: {
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }]
    }
});
