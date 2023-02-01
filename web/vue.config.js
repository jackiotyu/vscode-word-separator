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
        config.plugin('copy').tap(([pathConfigs]) => {
            const to = pathConfigs.patterns[0].to;
            // so the original `/public` folder keeps priority
            pathConfigs.patterns[0].force = true;

            // 传输img文件夹到dis-web/img
            pathConfigs.patterns.unshift({
                from: 'img',
                to: `${to}/img`,
            });
            return [pathConfigs];
        });
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
    },
});
