import { extConfig, separatorConfig } from './settingAdaptor';
import { DEFAULT_GROUP_SETTING } from './constants';
import { GroupType } from '../types';

export function getGroup(): GroupType {
    return (extConfig.get('group') as GroupType) || DEFAULT_GROUP_SETTING;
}

export function getActiveSeparators(): Set<string> {
    return new Set([...getActiveRule()]);
}

export function getActiveRule(): string {
    return separatorConfig.get() || '';
}

export function getSetting() {
    let groupMap = getGroup();
    let group = Object.keys(groupMap).map((key) => ({
        name: key,
        separators: groupMap[key].split(''),
    }));
    let rule = getActiveRule();
    return { group, rule };
}

export { extConfig, separatorConfig };
