import * as vscode from 'vscode';
import { CN_SEPARATORS } from './src/constants';
import { separatorConfig, extConfig } from './src/settingAdaptor';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('WordSeparator.updateSeparators', () => {
        const wordSeparators = separatorConfig.get();
        separatorConfig.update([...new Set((wordSeparators + CN_SEPARATORS).split(''))].join(''));
        vscode.window.showInformationMessage('Hello World from word-separator!');
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}
