import * as vscode from 'vscode';

class SeparatorConfig {
    get() {
        return vscode.workspace.getConfiguration('editor').get('wordSeparators');
    }
    update(separator: string) {
        return vscode.workspace.getConfiguration('editor').update('wordSeparators', separator);
    }
}

class ExtConfig {
    get(key: string) {
        return vscode.workspace.getConfiguration('WordSeparator').get(key);
    }
    update(key: string, value: any) {
        return vscode.workspace.getConfiguration('WordSeparator').update(key, value);
    }
}

export const separatorConfig = new SeparatorConfig();
export const extConfig = new ExtConfig();
