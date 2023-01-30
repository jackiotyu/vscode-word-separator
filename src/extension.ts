import * as vscode from 'vscode';
import { CN_SEPARATORS } from './lib/constants';
import { separatorConfig } from './lib/settingAdaptor';
import { SeparatorsTab } from './lib/treeView';

export function activate(context: vscode.ExtensionContext) {
    let updateSeparatorsCmd = vscode.commands.registerCommand('WordSeparator.updateSeparators', () => {
        const wordSeparators = separatorConfig.get();
        separatorConfig.update([...new Set((wordSeparators + CN_SEPARATORS).split(''))].join(''));
        vscode.window.showInformationMessage('update separators success!');
    });
    let copySeparatorsCmd = vscode.commands.registerCommand('WordSeparator.copySeparators', () => {
        vscode.env.clipboard.writeText(separatorConfig.get());
        vscode.window.showInformationMessage('copy separators success!');
    });

    new SeparatorsTab(context);

    context.subscriptions.push(updateSeparatorsCmd);
    context.subscriptions.push(copySeparatorsCmd);
}

export function deactivate() {}
