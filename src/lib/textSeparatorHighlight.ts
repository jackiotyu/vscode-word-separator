import * as vscode from 'vscode';
import { getActiveRuleSet, extConfig } from './settingUtils';
import { getSafeRangeAndText } from './textUtil';
import {
    EXTENSION_HOVER,
    EXTENSION_SEPARATOR_HIGHLIGHT,
    HOVER,
    HIGHLIGHT,
} from './constants';

export class TextSeparatorHighlight {
    private _decoration?: vscode.TextEditorDecorationType;
    private _isEnable: boolean = true;
    private _disposables: vscode.Disposable[] = [];
    private _text?: string;
    private _range?: vscode.Range;
    private _textDecorationOptions: vscode.DecorationRenderOptions = {
        border: '1px solid #bbbbbb80',
        backgroundColor: '#bbbbbb10',
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    };
    // 自定义配置
    private _extendDecorationOptions: vscode.DecorationRenderOptions = {};
    constructor(context: vscode.ExtensionContext) {
        this.checkActive();
        this.setDecorationOptions();
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration(EXTENSION_HOVER)) {
                    this.checkActive();
                }
                if (event.affectsConfiguration('editor.wordSeparators')) {
                    this.setTextDecoration();
                }
                if (event.affectsConfiguration(EXTENSION_SEPARATOR_HIGHLIGHT)) {
                    this.setDecorationOptions();
                }
            })
        );
        context.subscriptions.push({
            dispose: this.dispose.bind(this),
        });
    }

    initChangeTrigger() {
        this._disposables.push(
            vscode.window.onDidChangeTextEditorSelection(
                this.textPositionChange.bind(this)
            )
        );
    }

    get updatedHover() {
        let enabled = extConfig.get(HOVER);
        this._isEnable = enabled;
        return enabled;
    }

    clearDecoration() {
        this._decoration?.dispose();
        this._text = undefined;
        this._range = undefined;
    }

    dispose() {
        this._disposables.forEach((disposable) => disposable.dispose());
        this._disposables = [];
        this.clearDecoration();
    }

    checkActive() {
        if (!this.updatedHover) {
            this.dispose();
        } else {
            this.initChangeTrigger();
        }
    }

    setDecorationOptions() {
        this._extendDecorationOptions = extConfig.get(HIGHLIGHT) || {};
        this.setTextDecoration();
    }

    getSeparatorRanges(range: vscode.Range, wholeWord: string) {
        let ruleSet = getActiveRuleSet();
        let offsetList = [...wholeWord]
            .map((text, index) => ({ text, index }))
            .filter(({ text }) => {
                return ruleSet.has(text);
            });
        let startPosition = range.start;
        let line = startPosition.line;
        let character = startPosition.character;
        let rangeList = offsetList.map((item) => {
            let start = startPosition.with(line, character + item.index);
            let end = start.with(line, start.character + item.text.length);
            return new vscode.Range(start, end);
        });
        return rangeList;
    }

    setTextDecoration() {
        if (!this._range || !this._text) return;
        this._decoration?.dispose();
        let rangeList = this.getSeparatorRanges(this._range, this._text);
        if (!rangeList.length) return;
        this._decoration = vscode.window.createTextEditorDecorationType({
            ...this._textDecorationOptions,
            ...this._extendDecorationOptions,
        });
        vscode.window.activeTextEditor?.setDecorations(
            this._decoration,
            rangeList
        );
    }

    textPositionChange(event: vscode.TextEditorSelectionChangeEvent) {
        if (!this._isEnable) return;
        this.clearDecoration();
        let position = event.textEditor.selection.active;
        let document = event.textEditor.document;
        let textStatus = getSafeRangeAndText(document, position);
        if (!textStatus) return;
        let { text, range } = textStatus;
        this._range = range;
        this._text = text;
        this.setTextDecoration();
    }
}
