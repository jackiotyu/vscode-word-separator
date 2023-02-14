/**
 * 生成id
 * @returns id
 */
export function genID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// \   backslash
// `   backtick
// *   asterisk
// _   underscore
// {}  curly braces
// []  square brackets
// ()  parentheses
// #   hash mark
// +   plus sign
// -   minus sign (hyphen)
// .   dot
// !   exclamation mark
const MARKDOWN_SYMBOL_REG = /[\'\"\*\\`\(\)\{\}\[\]\#\+\-\.\!\;]/g;
/** 转义markdown中的特殊字符 */
export function encodeMarkdown(s: string) {
    return s.replace(MARKDOWN_SYMBOL_REG, '\\$&');
}

const REG_SYMBOL_REG = /[/\-\\^$*+?.()|[\]{}]/g;
/** 转义正则符号 */
export function safeReg(str: string) {
    return RegExp(str.replace(REG_SYMBOL_REG, '\\$&'));
}

/**
 * 格式化为vscode支持的markdown命令格式
 * @param command 注册的命令
 * @param query
 */
export function encodeMarkdownCommand(
    command: string,
    query?: Record<string, any> | string
) {
    return `command:${command}?${encodeURIComponent(
        JSON.stringify(query)
    ).replace(/[\(\)]/g, '\\$&')}`;
}
