import * as vscode from 'vscode';
import { EventEmitter } from 'node:events';
import { ExtPayload } from './tunnelEvents';

export default class WebviewTunnel extends EventEmitter {
    private _disposables: vscode.Disposable[] = [];
    webview: vscode.WebviewView;
    constructor(webview: vscode.WebviewView) {
        super();
        this.webview = webview;
        let receiveDisposable = webview.webview.onDidReceiveMessage((...args) => {
            this.emit('message', this, ...args);
        });
        this._disposables.push(receiveDisposable);
        this._disposables.push({
            dispose: () => {
                this.removeAllListeners('message');
            },
        });
    }
    get disposables(): vscode.Disposable[] {
        return this._disposables;
    }
    send(msg: ExtPayload) {
        return this.webview.webview.postMessage(msg);
    }
    onReceive(callback: (...args: any[]) => void) {
        this.on('message', callback);
    }
}
