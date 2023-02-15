import * as vscode from 'vscode';
import { SeparatorsTab } from './lib/treeView';
import { SeparatorsHover } from './lib/hover';
import windowAdaptor from './lib/windowAdaptor';
import { StatusBar } from './lib/statusBar';
import { TextSeparatorHighlight } from './lib/textSeparatorHighlight';

export function activate(context: vscode.ExtensionContext) {
    new SeparatorsTab(context);
    new SeparatorsHover(context);
    new StatusBar(context);
    new TextSeparatorHighlight(context);
    context.subscriptions.push(...windowAdaptor.disposables);
}

export function deactivate() {}
