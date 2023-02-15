import * as vscode from 'vscode';
import { MAX_TEXT_LENGTH } from './constants';

export function getSafeRangeAndText(
    document: vscode.TextDocument,
    position: vscode.Position
) {
    const range = document.getWordRangeAtPosition(position, /\S+/g);
    if (!range) return;
    let len = range.end.character - range.start.character;
    if (len > MAX_TEXT_LENGTH) return;
    const text = document.getText(range);
    if (!text) return;
    if (text.length > MAX_TEXT_LENGTH) return;
    return { range, text };
}
