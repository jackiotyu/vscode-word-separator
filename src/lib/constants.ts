// 默认分隔符
export const DEFAULT_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';
// 常用中文分隔符
export const CN_SEPARATORS = '。，、；：“”‘’「」——……？！';
export const LINK_SEPARATORS = ';/?:@&=+$,';
// 自定义分隔符
export const CUSTOM_SEPARATORS = '-';
// 默认分组
export const DEFAULT_GROUP_SETTING = {
    default: DEFAULT_SEPARATORS,
    cn: CN_SEPARATORS,
    link: LINK_SEPARATORS,
    custom: CUSTOM_SEPARATORS,
};
export const EXTENSION_NAME = 'WordSeparator';
export const EXTENSION_GROUP = 'WordSeparator.group';
