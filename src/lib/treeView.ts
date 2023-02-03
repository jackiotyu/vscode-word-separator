import * as vscode from 'vscode';
import { WebViewPanelProvider } from './webAppPanel';
export class SeparatorsTab {
    constructor(context: vscode.ExtensionContext) {
        let webviewProvider = new WebViewPanelProvider(
            context,
            context.extensionUri
        );
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                WebViewPanelProvider.viewType,
                webviewProvider
            )
        );
    }
}
