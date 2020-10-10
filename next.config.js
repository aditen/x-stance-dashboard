const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withTM = require('next-transpile-modules');
const withOffline = require('next-offline');

module.exports = withOffline(withCSS(withImages(withTM({
    transpileModules: ['react-wordcloud', 'd3-array', 'd3-cloud', 'd3-scale', 'd3-scale-chromatic', 'd3-selection', 'd3-transition'],
    distDir: 'build',
    serverRuntimeConfig: {
        // Will only be available on the server side
        backendUrl: process.env.SERVICE_SERVER_HOST
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: process.env.SERVICE_HOST,
        mainSkill: process.env.MAIN_SKILL
    },
    poweredByHeader: false,
    webpack: function (config) {
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]'
                }
            }
        });
        return config;
    }
}))));
