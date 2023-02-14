import * as vscode from 'vscode';
import { extConfig } from './settingUtils';
import {
    COMMAND_TOGGLE_HOVER,
    EXTENSION_HOVER,
    HOVER,
    STATUSBAR_NAME,
} from './constants';
// import localize from './localize';

export class StatusBar {
    statusBar: vscode.StatusBarItem;
    constructor(context: vscode.ExtensionContext) {
        let statusBar = vscode.window.createStatusBarItem(
            STATUSBAR_NAME,
            vscode.StatusBarAlignment.Right,
            200
        );
        statusBar.command = COMMAND_TOGGLE_HOVER;
        statusBar.tooltip = '启用/取消 Separator hover';
        this.statusBar = statusBar;
        context.subscriptions.push(statusBar);
        this.checkActive();
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration(EXTENSION_HOVER)) {
                    this.checkActive();
                }
            })
        );
        this.statusBar.show();
        context.subscriptions.push(
            vscode.commands.registerCommand(COMMAND_TOGGLE_HOVER, () =>
                extConfig.update(HOVER, !this.updatedHover)
            )
        );
    }

    get updatedHover() {
        return extConfig.get(HOVER);
    }

    checkActive(): void {
        if (this.updatedHover) {
            this.statusBar.text = '$(check) Separator';
        } else {
            this.statusBar.text = '$(close) Separator';
        }
    }
}
