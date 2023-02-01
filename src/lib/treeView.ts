import * as vscode from 'vscode';
import { WebViewPanelProvider } from './webAppPanel';
export class SeparatorsTab {
    constructor(context: vscode.ExtensionContext) {
        let webviewProvider = new WebViewPanelProvider(context, context.extensionUri);
        context.subscriptions.push(
            vscode.window.registerWebviewViewProvider(
                WebViewPanelProvider.viewType,
                webviewProvider,
                // {
                //     webviewOptions: {
                //         // FIXME 暂时直接用该选项恢复webview内容
                //         retainContextWhenHidden: true,
                //     },
                // }
            ),
        );
    }
}
