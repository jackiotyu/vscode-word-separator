import * as vscode from 'vscode';
import { getGroup } from './utils';
import { EXTENSION_GROUP } from './constants';

export class SeparatorsTab {
    treeView: vscode.TreeView<Separator>;
    constructor(context: vscode.ExtensionContext) {
        this.treeView = vscode.window.createTreeView('separatorsManage', {
            treeDataProvider: new SeparatorsProvider(),
            canSelectMany: true,
        });
        const checkBoxListener = this.treeView.onDidChangeCheckboxState(async event => {
            console.log('🚀 event >>', event);
        });
        context.subscriptions.push(checkBoxListener);
    }
}

export class SeparatorsProvider implements vscode.TreeDataProvider<Separator> {
    private _onDidChangeTreeData: vscode.EventEmitter<Separator | undefined | void> = new vscode.EventEmitter<
        Separator | undefined | void
    >();
    readonly onDidChangeTreeData: vscode.Event<Separator | undefined | void> = this._onDidChangeTreeData.event;
    private groupSetting: GroupType = {};
    constructor() {
        this.updateGroup();
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(EXTENSION_GROUP)) {
                this.updateGroup();
            }
        });
    }
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Separator): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Separator): Thenable<Separator[]> {
        if (element) {
            return Promise.resolve(
                this.getGroupItems(element.label).map((separator) => {
                    return new Separator(
                        separator,
                        vscode.TreeItemCollapsibleState.None,
                        vscode.TreeItemCheckboxState.Checked,
                    );
                }),
            );
        } else {
            return Promise.resolve(
                Object.keys(this.groupSetting).map((groupName) => {
                    return new Separator(
                        groupName,
                        vscode.TreeItemCollapsibleState.Expanded,
                        vscode.TreeItemCheckboxState.Checked,
                    );
                }),
            );
        }
    }

    updateGroup() {
        this.groupSetting = getGroup();
        this.refresh();
    }

    getGroupItems(groupName: string) {
        let separators = this.groupSetting[groupName] || '';
        return separators.split('') || [];
    }
}

export class Separator extends vscode.TreeItem2 {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly isChecked: vscode.TreeItemCheckboxState,
        public readonly command?: vscode.Command,
    ) {
        super(label, collapsibleState);
        this.tooltip = `***${this.label}***`;
        this.checkboxState = isChecked;
        this.iconPath = new vscode.ThemeIcon("arrow-small-right", new vscode.ThemeColor("tab.unfocusedActiveBackground"));
    }
    contextValue = 'dependency';
}
