/** 默认分隔符 */
export const DEFAULT_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
/** 常用中文分隔符 */
export const CN_SEPARATORS = '。，、；：“”‘’「」—…？！（）【】{}《》';
export const LINK_SEPARATORS = '.;/?:@&=+$,';
/** 自定义分隔符 */
export const CUSTOM_SEPARATORS = '-';

/** 拓展名称 */
export const EXTENSION_NAME = 'WordSeparator';
/** 拓展分组配置名 */
export const EXTENSION_GROUP = 'WordSeparator.group';
/** 配置禁用各种提示 */
export const EXTENSION_SILENT = 'WordSeparator.silent';
/** 配置是否开启hover管理命令 */
export const EXTENSION_HOVER = 'WordSeparator.hover';
export const HOVER = 'hover';
export const STATUSBAR_NAME = 'WordSeparator.statusbar';
export const EXTENSION_SEPARATOR_HIGHLIGHT = 'WordSeparator.highlight';
export const HIGHLIGHT = 'highlight';

/** 切换所选的分隔符的命令 */
export const COMMAND_TOGGLE_SEPARATOR = 'separatorsManage.toggleSeparator';
/** 切换所选范围的分隔符的命令 */
export const COMMAND_TOGGLE_RANGE_SEPARATOR =
    'separatorsManage.toggleRangeSeparator';
/** 还原分隔符设置 */
export const COMMAND_RESET_SEPARATOR = 'separatorsManage.resetSeparator';
// 切换是否开启hover管理命令
export const COMMAND_TOGGLE_HOVER = 'separatorsManage.toggleHover';
// TODO 后续自定义配置
// 限制最大处理文本长度
export const MAX_TEXT_LENGTH = 200;
