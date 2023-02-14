import * as vscode from 'vscode';
import { HoverProvider } from './hoverProvider';
import { separatorConfig, getActiveRuleSet } from './settingUtils';
import {
    COMMAND_TOGGLE_SEPARATOR,
    COMMAND_TOGGLE_RANGE_SEPARATOR,
} from './constants';
import localize from './localize';

export class SeparatorsHover {
    constructor(context: vscode.ExtensionContext) {
        // TODO 监听配置，动态切换是否展示分隔符面板
        context.subscriptions.push(
            vscode.languages.registerHoverProvider('*', new HoverProvider())
        );

        // TODO 后续统一command管理, 添加错误提示
        context.subscriptions.push(
            vscode.commands.registerCommand(
                COMMAND_TOGGLE_SEPARATOR,
                (separator: string) => {
                    if (!separator) return;
                    let activeRuleSet = getActiveRuleSet();
                    let shouldActive = !activeRuleSet.has(separator);
                    if (shouldActive) {
                        activeRuleSet.add(separator);
                    } else {
                        activeRuleSet.delete(separator);
                    }
                    separatorConfig.update([...activeRuleSet].join(''));
                    let tips = shouldActive
                        ? localize(
                              'hover.command.toggleSeparator.enable',
                              separator
                          )
                        : localize(
                              'hover.command.toggleSeparator.cancel',
                              separator
                          );
                    vscode.window.showInformationMessage(tips);
                }
            )
        );

        context.subscriptions.push(
            vscode.commands.registerCommand(
                COMMAND_TOGGLE_RANGE_SEPARATOR,
                ({ active, rangeSeparators } = {}) => {
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
                    let tips = active
                        ? localize(
                              'hover.command.toggleRangeSeparator.enable',
                              `${[...rangeSeparators].join(' ')}`
                          )
                        : localize(
                              'hover.command.toggleRangeSeparator.cancel',
                              `${[...rangeSeparators].join(' ')}`
                          );
                    vscode.window.showInformationMessage(tips);
                }
            )
        );
    }
}
