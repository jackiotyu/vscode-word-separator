import * as vscode from 'vscode';
import { HoverProvider } from './hoverProvider';
import { separatorConfig, getActiveRuleSet, extConfig } from './settingUtils';
import windowAdaptor from './windowAdaptor';
import {
    COMMAND_TOGGLE_SEPARATOR,
    COMMAND_TOGGLE_RANGE_SEPARATOR,
    EXTENSION_HOVER,
    HOVER,
} from './constants';
import localize from './localize';

export class SeparatorsHover {
    private readonly HOVER_KEY = HOVER;
    private _disposeHover?: vscode.Disposable;
    constructor(context: vscode.ExtensionContext) {
        this.init();
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration(EXTENSION_HOVER)) {
                    this.checkHover();
                }
            })
        );
        // TODO 后续统一command管理, 添加错误提示
        // TODO 使用快捷键(ctrl)点击时，启用当前符号，并禁用范围内其余符号
        // TODO 使用快捷键(shift)点击时，取消当前符号, 并启用范围内其余符号
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
                    windowAdaptor.showHoverInfo(tips);
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
                    windowAdaptor.showHoverInfo(tips);
                }
            )
        );

        context.subscriptions.push({
            dispose: () => this._disposeHover?.dispose(),
        });
    }

    get updatedHover() {
        return extConfig.get(this.HOVER_KEY);
    }

    init() {
        this.checkHover();
    }
    checkHover() {
        this.updatedHover ? this.activeHover() : this.cancelHover();
    }
    cancelHover() {
        this._disposeHover?.dispose();
    }
    activeHover() {
        this.cancelHover();
        this._disposeHover = vscode.languages.registerHoverProvider(
            '*',
            new HoverProvider()
        );
    }
}
