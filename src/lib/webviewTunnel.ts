import * as vscode from 'vscode';
import { EventEmitter } from 'node:events';
import { ExtPayload, MsgType } from './tunnelEvents';
import { getSetting } from './settingUtils';
import { genID } from './utils';

export default class WebviewTunnel extends EventEmitter {
    private _disposables: vscode.Disposable[] = [];
    webview: vscode.WebviewView;
    constructor(webview: vscode.WebviewView) {
        super();
        this.webview = webview;
        let receiveDisposable = webview.webview.onDidReceiveMessage(
            (...args) => {
                this.emit('message', this, ...args);
            }
        );
        this._disposables.push(receiveDisposable);
        this._disposables.push({
            dispose: () => {
                this.removeAllListeners('message');
            },
        });
        this._disposables.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration('editor.wordSeparators')) {
                    this.send({
                        id: genID(),
                        type: MsgType.SETTING,
                        value: getSetting(),
                    });
                }
            })
        );
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
