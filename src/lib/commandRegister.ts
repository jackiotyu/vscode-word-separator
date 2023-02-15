import * as vscode from 'vscode';

export class CommandRegister {
    private _disposables: vscode.Disposable[] = [];
    private _context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }
}
