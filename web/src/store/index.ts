import { defineStore } from 'pinia';
import { GroupItem } from '@ext/src/types';
import { MsgType, LocaleType } from '@ext/src/lib/tunnelEvents';
import { sendMsg } from '@/utils/tunnel';

export interface RuleGroupItem extends GroupItem {
    checked: boolean;
    indeterminate: boolean;
    isOpen?: boolean;
}

export type RuleGroupList = RuleGroupItem[];

interface GlobalState {
    groupList: RuleGroupList;
    wordSeparators: string;
    locale: LocaleType;
}

export const useGlobalStore = defineStore('global', {
    state: (): GlobalState => {
        return {
            groupList: [],
            wordSeparators: '',
            locale: 'zh-cn',
        };
    },
    actions: {
        refresh() {
            return sendMsg({ type: MsgType.SETTING });
        },
    },
    getters: {
        selectedSet(state) {
            return new Set([...state.wordSeparators]);
        },
        settingText(state) {
            return `"editor.wordSeparators": ${JSON.stringify(
                state.wordSeparators
            )},`;
        },
    },
});
