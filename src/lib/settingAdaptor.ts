import * as vscode from 'vscode';
import { GroupCloseItem } from '../types';

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
    get(key: string) {
        return vscode.workspace
            .getConfiguration('WordSeparator')
            .get(key) as GroupCloseItem[];
    }
    update(key: string, value: any) {
        return vscode.workspace
            .getConfiguration('WordSeparator')
            .update(key, value);
    }
    updateGroup(group: GroupCloseItem[]) {
        return this.update('group', group);
    }
}

export const separatorConfig = new SeparatorConfig();
export const extConfig = new ExtConfig();
