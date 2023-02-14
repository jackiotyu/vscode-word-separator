import * as vscode from 'vscode';
import { getAllConfigSeparatorSet } from './settingUtils';
import { safeReg } from './utils';
import { MarkdownStringBuilder } from './MarkdownStringBuilder';

export class HoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, /\S+/g);
        if (!range) return;
        const hoveredWord = document.getText(range);
        if (!hoveredWord) return;
        let activeSeparators = [...getAllConfigSeparatorSet()];
        let includeSeparators: string[] = [];
        includeSeparators = activeSeparators.filter((i) => {
            return safeReg(i).test(hoveredWord);
        });
        if (!includeSeparators.length) return;
        let markdownString =
            MarkdownStringBuilder.buildMarkdownString(includeSeparators);
        return new vscode.Hover(markdownString, range);
    }
}
