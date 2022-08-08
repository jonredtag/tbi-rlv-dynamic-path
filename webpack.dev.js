const webpack = require('webpack');
const path = require('path');
const glob = require('glob-all');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = (env) => ({
    devtool: 'source-map',
    entry: {
        app: [`./resources/sass/${env.site}.scss`, './resources/js/app.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./public/js'),
        publicPath: '/js/',
        chunkFilename: '[name].bundle.js',
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-ca|fr-ca/),
        new MiniCssExtractPlugin({
            filename: '../css/styles.css',
            chunkFilename: '[id].css',
        }),
        new PurgecssPlugin({
            paths: () =>
                glob.sync(
                    [
                        path.resolve('./resources/js/**/*.js'),
                        path.resolve('./resources/views/**/*.blade.php'),
                        path.resolve('./node_modules/react-dates/**/*.js'),
                        path.resolve('./node_modules/reactstrap/lib/TabContent.js'),
                        path.resolve('./node_modules/reactstrap/lib/TabPane.js'),
                        path.resolve('./node_modules/reactstrap/lib/Collapse.js'),
                        path.resolve('./node_modules/reactstrap/lib/Tooltip.js'),
                        path.resolve('./node_modules/reactstrap/lib/Modal.js'),
                        path.resolve('./node_modules/reactstrap/lib/ModalBody.js'),
                        path.resolve('./node_modules/reactstrap/lib/ModalHeader.js'),
                        path.resolve('./node_modules/reactstrap/lib/ModalFooter.js'),
                        path.resolve('./node_modules/reactstrap/lib/UncontrolledPopover.js'),
                        path.resolve('./node_modules/reactstrap/lib/PopoverBody.js'),
                        path.resolve('./node_modules/rheostat/**/*.js'),
                        path.resolve('./node_modules/react-image-lightbox/dist/*.js'),
                    ],
                    { nodir: true }
                ),
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
        ],
    },
    resolve: {
        modules: [path.resolve('./resources/js'), 'node_modules'],
    },
});
