const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const withTM = require('next-transpile-modules');
const withOffline = require('next-offline');

module.exports = withOffline(withCSS(withImages(withTM({
    // cool modules that use an ES standard that is not supported by IE11
    transpileModules: ['d3-array', 'd3-cloud', 'd3-color', 'd3-dispatch', 'd3-ease', 'd3-format', 'd3-interpolate',
        'd3-scale', 'd3-scale-chromatic', 'd3-selection', 'd3-time', 'd3-time-format', 'd3-timer', 'd3-transition',
        'react-wordcloud', 'react-countup'],
    distDir: 'build',
    serverRuntimeConfig: {
        // Will only be available on the server side
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
    },
    poweredByHeader: false
}))));
