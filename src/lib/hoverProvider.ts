import * as vscode from 'vscode';
import { getActiveRule, getAllConfigSeparatorSet } from './settingUtils';
import {
    COMMAND_TOGGLE_SEPARATOR,
    COMMAND_TOGGLE_RANGE_SEPARATOR,
} from './constants';

export class HoverProvider implements vscode.HoverProvider {
    static readonly toggleCommandName = 'command:' + COMMAND_TOGGLE_SEPARATOR;
    static readonly toggleRangeCommandName =
        'command:' + COMMAND_TOGGLE_RANGE_SEPARATOR;

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, /\S+/g);
        if (!range) return;
        const hoveredWord = document.getText(range);
        if (!hoveredWord) return;
        let activeSeparators = [...getAllConfigSeparatorSet()];
        let includeSeparators: string[] = [];
        includeSeparators = activeSeparators.filter((i) => {
            return HoverProvider.getSeparatorReg(i).test(hoveredWord);
        });
        if (!includeSeparators.length) return;
        let markdownString =
            HoverProvider.buildMarkdownString(includeSeparators);
        return new vscode.Hover(markdownString, range);
    }

    static buildMarkdownString(separatorList: string[]): vscode.MarkdownString {
        let activeRule = getActiveRule();
        let splitStr = ' &nbsp;|&nbsp;';
        const optionsString = separatorList
            .map((s) => {
                let isActive = activeRule.includes(s);
                return HoverProvider.getCommandItemString(isActive, s);
            })
            .join('&nbsp;');
        const toggleOptionsString = [true, false]
            .map((active) =>
                HoverProvider.getToggleItemString(
                    active,
                    separatorList.join('')
                )
            )
            .join('&nbsp;&nbsp;');

        let markdownString = new vscode.MarkdownString(
            [
                `**$(whole-word)** 管理分隔符 ${splitStr}`,
                `${optionsString} ${splitStr}`,
                `${toggleOptionsString}`,
            ].join('&nbsp;&nbsp;'),
            true
        );
        markdownString.supportHtml = true;
        markdownString.isTrusted = true;
        return markdownString;
    }

    static getToggleItemString(active: boolean, rangeSeparators: string) {
        let tips = !active
            ? JSON.stringify(`取消当前位置的所有分隔符`)
            : JSON.stringify(`激活当前位置的所有分隔符`);
        let params = { active, rangeSeparators };
        let commandContent = `${
            HoverProvider.toggleRangeCommandName
        }?${JSON.stringify(params)}`;
        let icon = !active ? '$(close)' : '$(check)';
        return `[**${icon}**](${commandContent} ${tips})`;
    }

    static getCommandItemString(isActive: boolean, separator: string) {
        let tips = isActive
            ? JSON.stringify(`取消分隔符${separator}`)
            : JSON.stringify(`激活分隔符${separator}`);
        let commandContent = `${
            HoverProvider.toggleCommandName
        }?${JSON.stringify(separator)}`;
        return `[**${separator}**](${commandContent} ${tips})`;
    }

    static getSeparatorReg(separator: string) {
        // 转义正则符号
        return RegExp(separator.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'));
    }
}
