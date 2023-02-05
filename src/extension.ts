import * as vscode from 'vscode';
import { SeparatorsTab } from './lib/treeView';

export function activate(context: vscode.ExtensionContext) {
    new SeparatorsTab(context);
}

export function deactivate() {}
