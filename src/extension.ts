import * as vscode from 'vscode';
import { SeparatorsTab } from './lib/treeView';
import { SeparatorsHover } from './lib/hover';
import windowAdaptor from './lib/windowAdaptor';
import { StatusBar } from './lib/statusBar';

export function activate(context: vscode.ExtensionContext) {
    new SeparatorsTab(context);
    new SeparatorsHover(context);
    new StatusBar(context);
    context.subscriptions.push(...windowAdaptor.disposables);
}

export function deactivate() {}
