import * as vscode from 'vscode';
import { HoverProvider } from './hoverProvider';
import { separatorConfig, getActiveRuleSet } from './settingUtils';
import {
    COMMAND_TOGGLE_SEPARATOR,
    COMMAND_TOGGLE_RANGE_SEPARATOR,
} from './constants';

export class SeparatorsHover {
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.languages.registerHoverProvider('*', new HoverProvider())
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                COMMAND_TOGGLE_SEPARATOR,
                (separator: string) => {
                    if (!separator) return;
                    let activeRuleSet = getActiveRuleSet();
                    let hasSeparators = activeRuleSet.has(separator);
                    if (hasSeparators) {
                        activeRuleSet.delete(separator);
                    } else {
                        activeRuleSet.add(separator);
                    }
                    separatorConfig.update([...activeRuleSet].join(''));
                    let tips = hasSeparators
                        ? '取消分隔符成功'
                        : '启用分隔符成功';
                    vscode.window.showInformationMessage(tips);
                }
            )
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                COMMAND_TOGGLE_RANGE_SEPARATOR,
                ({ active, rangeSeparators } = {}) => {
                    console.log('🚀 toggle >>', rangeSeparators, active);
                    if (!rangeSeparators) return;
                    let separators = separatorConfig.get();
                    let groupSeparatorSet = new Set([...rangeSeparators]);
                    let list = [];
                    if (active) {
                        list = [...separators, ...groupSeparatorSet];
                    } else {
                        list = [...separators].filter((s) => {
                            return !groupSeparatorSet.has(s);
                        });
                    }
                    separatorConfig.update([...new Set(list)].join(''));
                    let tips = active ? '启用分隔符成功' : '取消分隔符成功';
                    vscode.window.showInformationMessage(tips);
                }
            )
        );
    }
}
