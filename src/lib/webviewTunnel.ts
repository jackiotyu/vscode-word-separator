import * as vscode from 'vscode';
import { EventEmitter } from 'node:events';
import { ExtPayload, MsgType, LocaleType } from './tunnelEvents';
import { getSetting } from './settingUtils';
import { genID } from './utils';
import { EXTENSION_GROUP } from './constants';

export default class WebviewTunnel extends EventEmitter {
    private _disposables: vscode.Disposable[] = [];
    webview: vscode.WebviewView;
    emitReloadWebview: () => void = () => {};
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
                this.removeAllListeners();
            },
        });
        this._disposables.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (
                    event.affectsConfiguration('editor.wordSeparators') ||
                    event.affectsConfiguration(EXTENSION_GROUP)
                ) {
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
    toggleExpandAll(expand = false) {
        this.send({ id: genID(), type: MsgType.TOGGLE_EXPAND, value: expand });
    }
}
