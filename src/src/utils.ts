import { extConfig } from './settingAdaptor';
import { DEFAULT_GROUP_SETTING } from './constants';

type GroupType = Record<string, string>;

export function getGroup(): GroupType {
    return (extConfig.get('group') as GroupType) || DEFAULT_GROUP_SETTING;
}
