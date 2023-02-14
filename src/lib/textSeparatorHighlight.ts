import * as vscode from 'vscode';

export class TextSeparatorHighlight {
    private _decoration?: vscode.TextEditorDecorationType;
    constructor(context: vscode.ExtensionContext) {
        // console.log('🚀 1 >>', 1);
        context.subscriptions.push(
            vscode.window.onDidChangeTextEditorSelection((event) =>
                this.textPositionChange(event)
            )
        );
    }

    textPositionChange(event: vscode.TextEditorSelectionChangeEvent) {
        this._decoration?.dispose();
        // console.log('🚀 event 1 >>', event);
        let position = event.textEditor.selection.active;
        let document = event.textEditor.document;
        const range = document.getWordRangeAtPosition(position, /\S+/g);

        if (!range) {
            return;
        }

        this._decoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'green',
            border: '2px solid white',
        });
        event.textEditor.setDecorations(this._decoration, [range]);
    }
}
