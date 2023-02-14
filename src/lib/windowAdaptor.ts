import * as vscode from 'vscode';
import { extConfig } from './settingUtils';
import { EXTENSION_SILENT } from './constants';
import { SilentType, Silent } from '../types';

class WindowAdaptor {
    private _silents: SilentType[] = [];
    private readonly SILENT_KEY = 'silent';
    private _disposables: vscode.Disposable[] = [];
    constructor() {
        this._silents = this.updatedSilents;
        this._disposables.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration(EXTENSION_SILENT)) {
                    this._silents = this.updatedSilents;
                }
            })
        );
    }

    get disposables() {
        return this._disposables;
    }
    get updatedSilents() {
        return extConfig.get(this.SILENT_KEY);
    }
    get silentPanel() {
        return this._silents.includes(Silent.PANEL);
    }
    get silentHover() {
        return this._silents.includes(Silent.HOVER);
    }

    /** 展示管理面板的消息 */
    showPanelInfo(message: string, ...args: string[]) {
        // 根据配置项，做一下拦截
        if (this.silentPanel) return;
        return this.showInfo(message, ...args);
    }

    /** 展示管理面板的错误消息 */
    showPanelError(message: string, ...args: string[]) {
        // 根据配置项，做一下拦截
        if (this.silentPanel) return;
        return this.showError(message, ...args);
    }

    /** 展示hover的消息 */
    showHoverInfo(message: string, ...args: string[]) {
        // 根据配置项，做一下拦截
        if (this.silentHover) return;
        return this.showInfo(message, ...args);
    }

    showInfo(message: string, ...args: string[]) {
        return vscode.window.showInformationMessage(message, ...args);
    }

    showError(message: string, ...args: string[]) {
        return vscode.window.showErrorMessage(message, ...args);
    }
}

export default new WindowAdaptor();
