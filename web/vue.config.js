const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

let devEntries = [];
if (isDev) {
    const webpackHotDevServer = path.resolve(
        __dirname,
        './utils/webpack-hot-dev-server.js'
    );
    devEntries = [webpackHotDevServer];
}
const publicPath = isDev ? 'http://127.0.0.1:3000/dist-web' : '';

module.exports = defineConfig({
    transpileDependencies: true,
    filenameHashing: false,
    outputDir: path.resolve(__dirname, '../dist-web'),
    publicPath: publicPath,
    devServer: {
        host: '127.0.0.1',
        port: 3000,
        allowedHosts: 'all',
        // 允许任何域名访问
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        devMiddleware: {
            // webpack-dev-server输出文件到磁盘
            // writeToDisk: true,
            // serverSideRender: true,
            // index: true,
            stats: 'minimal',
        },
    },
    chainWebpack: (config) => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap((options) => {
                options.compilerOptions = {
                    ...options.compilerOptions,
                    isCustomElement: (tag) => tag.startsWith('vscode-'),
                };
                return options;
            });
    },
    configureWebpack: {
        entry: [...devEntries, './src/main.ts'],
        output: {
            path: path.resolve(__dirname, '../dist-web'),
            filename: '[name].js',
            chunkFilename: 'chunk-vendors.js',
        },
        resolve: {
            alias: {
                '@ext': path.resolve(__dirname, '..'),
            },
        },
        devtool: isDev ? 'nosources-source-map' : false,
    },
});
