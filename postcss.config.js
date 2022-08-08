var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var autoprefixerPlugin = autoprefixer();

module.exports = {
    plugins: [
        autoprefixerPlugin,
        cssnano,
    ],
};
