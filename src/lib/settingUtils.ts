import { extConfig, separatorConfig } from './settingAdaptor';
import { DEFAULT_GROUP_SETTING, DEFAULT_SEPARATORS } from './constants';
import { GroupCloseItem, GroupListType } from '../types';

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
