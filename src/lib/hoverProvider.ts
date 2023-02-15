import * as vscode from 'vscode';
import { getAllConfigSeparatorSet } from './settingUtils';
import { safeReg } from './utils';
import { getSafeRangeAndText } from './textUtil';
import { MarkdownStringBuilder } from './MarkdownStringBuilder';

export class HoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        let textStatus = getSafeRangeAndText(document, position);
        if (!textStatus) return;
        let { text, range } = textStatus;
        let activeSeparators = [...getAllConfigSeparatorSet()];
        let includeSeparators: string[] = [];
        includeSeparators = activeSeparators.filter((i) => {
            return safeReg(i).test(text);
        });
        if (!includeSeparators.length) return;
        let markdownString =
            MarkdownStringBuilder.buildMarkdownString(includeSeparators);
        return new vscode.Hover(markdownString, range);
    }
}
