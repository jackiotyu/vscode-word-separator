/* globals __webpack_hash__ */
if (module.hot) {
    window.__vscode__ ??= window.acquireVsCodeApi?.();
    window.__reload__ ??= function () {
        console.log('post message to vscode to reload!');
        window.__vscode__.postMessage({
            type: 'reload',
            text: 'from web view',
        });
    };
    var lastHash;
    var upToDate = function upToDate() {
        return lastHash.indexOf(__webpack_hash__) >= 0;
    };
    var log = require('webpack/hot/log');
    var check = function check() {
        module.hot
            .check(true)
            .then(function (updatedModules) {
                if (!updatedModules) {
                    log(
                        'warning',
                        '[HMR] Cannot find update. Need to do a full reload!'
                    );
                    log(
                        'warning',
                        '[HMR] (Probably because of restarting the webpack-dev-server)'
                    );
                    window.__reload__();
                    return;
                }

                if (!upToDate()) {
                    check();
                }

                require('webpack/hot/log-apply-result')(
                    updatedModules,
                    updatedModules
                );

                if (upToDate()) {
                    log('info', '[HMR] App is up to date.');
                }
            })
            .catch(function (err) {
                var status = module.hot.status();
                if (['abort', 'fail'].indexOf(status) >= 0) {
                    log(
                        'warning',
                        '[HMR] Cannot apply update. Need to do a full reload!'
                    );
                    log('warning', '[HMR] ' + log.formatError(err));
                    window.__reload__();
                } else {
                    log(
                        'warning',
                        '[HMR] Update failed: ' + log.formatError(err)
                    );
                }
            });
    };
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.on('webpackHotUpdate', function (currentHash) {
        lastHash = currentHash;
        console.log('🚀 webpackHotUpdate >>', upToDate(), module.hot.status());
        if (!upToDate()) {
            if (module.hot.status() === 'idle') {
                log('info', '[HMR] Checking for updates on the server...');
                check();
            } else {
                window.__reload__();
            }
        }
    });
} else {
    console.warn('[HMR] Hot Module Replacement is disabled.');
}
