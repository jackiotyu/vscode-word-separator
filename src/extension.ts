import * as vscode from 'vscode';
import { SeparatorsTab } from './lib/treeView';
import { SeparatorsHover } from './lib/hover';

export function activate(context: vscode.ExtensionContext) {
    new SeparatorsTab(context);
    new SeparatorsHover(context);
}

export function deactivate() {}
