import * as vscode from 'vscode';
// import { getActiveRule } from './settingUtils';
import { encodeMarkdown, encodeMarkdownCommand } from './utils';
import localize from './localize';
import {
    COMMAND_TOGGLE_SEPARATOR,
    COMMAND_TOGGLE_RANGE_SEPARATOR,
} from './constants';

export class MarkdownStringBuilder {
    static readonly toggleCommandName = COMMAND_TOGGLE_SEPARATOR;
    static readonly toggleRangeCommandName = COMMAND_TOGGLE_RANGE_SEPARATOR;

    static readonly toggleRangeSeparatorEnableTitle = localize(
        `hover.command.toggleRangeSeparator.enable.title`
    );
    static readonly toggleRangeSeparatorCancelTitle = localize(
        `hover.command.toggleRangeSeparator.cancel.title`
    );
    static readonly toggleSeparatorTitle = localize(
        'hover.command.toggleSeparator.toggle'
    );
    static readonly commandTitle = localize('hover.command.title');

    static buildMarkdownString(separatorList: string[]): vscode.MarkdownString {
        // let activeRule = getActiveRule();
        let splitStr = '&nbsp;&nbsp;|&nbsp;&nbsp;';
        const optionsString = separatorList
            .map((s) => {
                // let isActive = activeRule.includes(s);
                return MarkdownStringBuilder.getCommandItemString(s);
            })
            .join('&nbsp;');
        const toggleOptionsString = [true, false]
            .map((active) =>
                MarkdownStringBuilder.getToggleItemString(
                    active,
                    separatorList.join('')
                )
            )
            .join('&nbsp;&nbsp;');

        let markdownString = new vscode.MarkdownString(
            [
                `**$(whole-word)** *${MarkdownStringBuilder.commandTitle}*`,
                `${toggleOptionsString}`,
                `${optionsString}`,
            ].join(`${splitStr}`),
            true
        );
        markdownString.supportHtml = true;
        markdownString.isTrusted = true;
        return markdownString;
    }

    static getToggleItemString(active: boolean, rangeSeparators: string) {
        let tips = !active
            ? JSON.stringify(
                  MarkdownStringBuilder.toggleRangeSeparatorCancelTitle
              )
            : JSON.stringify(
                  MarkdownStringBuilder.toggleRangeSeparatorEnableTitle
              );
        let commandContent = encodeMarkdownCommand(
            MarkdownStringBuilder.toggleRangeCommandName,
            { active, rangeSeparators }
        );
        let icon = !active ? '$(close)' : '$(check)';
        return `**[${icon}](${commandContent} ${tips})**`;
    }

    // TODO 动态更新当前是否激活的状态 isActive: boolean
    static getCommandItemString(separator: string) {
        let tips = MarkdownStringBuilder.toggleSeparatorTitle;
        let commandContent = encodeMarkdownCommand(
            MarkdownStringBuilder.toggleCommandName,
            separator
        );

        return `<span style="background-color:#7c7c7c4d;"> **[&nbsp;&nbsp;${encodeMarkdown(
            separator
        )}&nbsp;&nbsp;](${commandContent} "${tips}")** </span>`;
    }
}
