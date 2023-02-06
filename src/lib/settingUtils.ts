import { extConfig, separatorConfig } from './settingAdaptor';
import { DEFAULT_SEPARATORS, CN_SEPARATORS, LINK_SEPARATORS } from './constants';
import { GroupCloseItem, GroupListType } from '../types';
import localize from './localize';


// 默认分组
export const DEFAULT_GROUP_SETTING = [
    {
        name: localize('ext.config.defaults.WordSeparator.group.default'),
        separators: DEFAULT_SEPARATORS,
        isDefault: true,
    },
    {
        name: localize('ext.config.defaults.WordSeparator.group.cnSeparators'),
        separators: CN_SEPARATORS,
    },
    {
        name: localize('ext.config.defaults.WordSeparator.group.linkSeparators'),
        separators: LINK_SEPARATORS,
    },
];


export function getCloseGroup(): GroupCloseItem[] {
    let list = extConfig.get('group') || DEFAULT_GROUP_SETTING;
    let defaultItem = {
        name: 'default',
        isDefault: true,
        separators: DEFAULT_SEPARATORS,
    };
    if (list.length === 0) list = [defaultItem];
    list.forEach((item, index) => (item.id = index));
    if (!list.some((i) => i.isDefault)) list.unshift(defaultItem);
    return list;
}

export function getGroup(): GroupListType {
    let group = getCloseGroup();
    return group.map((i) => ({ ...i, separators: i.separators.split('') }));
}

export function getActiveRuleSet(): Set<string> {
    return new Set([...getActiveRule()]);
}

export function getActiveRule(): string {
    return separatorConfig.get() || '';
}

export function getSetting() {
    let group = getGroup();
    let rule = getActiveRule();
    return { group, rule };
}

export function toBaseItem(item: GroupCloseItem) {
    let cloneItem = { ...item };
    if (!item.isDefault) cloneItem.isDefault = undefined;
    cloneItem.id = undefined;
    return cloneItem;
}

export { extConfig, separatorConfig };
