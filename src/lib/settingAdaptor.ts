import * as vscode from 'vscode';
import { GroupCloseItem, SilentType } from '../types';

class SeparatorConfig {
    get(): string {
        return (
            vscode.workspace.getConfiguration('editor').get('wordSeparators') ||
            ''
        );
    }
    update(separator: string) {
        return vscode.workspace
            .getConfiguration('editor')
            .update('wordSeparators', separator);
    }
}

class ExtConfig {
    get(key: 'hover'): boolean;
    get(key: 'group'): GroupCloseItem[];
    get(key: 'silent'): SilentType[];
    get(key: 'highlight'): vscode.DecorationRenderOptions;
    get(key: string) {
        return vscode.workspace.getConfiguration('WordSeparator').get(key);
    }
    update(key: string, value: any) {
        return vscode.workspace
            .getConfiguration('WordSeparator')
            .update(key, value, vscode.ConfigurationTarget.Global);
    }
    updateGroup(group: GroupCloseItem[]) {
        return this.update('group', group);
    }
}

export const separatorConfig = new SeparatorConfig();
export const extConfig = new ExtConfig();
