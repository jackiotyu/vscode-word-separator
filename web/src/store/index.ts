import { defineStore } from 'pinia';
import { GroupItem } from '@ext/src/types';
import { MsgType } from '@ext/src/lib/tunnelEvents';
import { sendMsg } from '@/utils/tunnel';

export interface RuleGroupItem extends GroupItem {
    checked: boolean;
    indeterminate: boolean;
}

export type RuleGroupList = RuleGroupItem[];

interface GlobalState {
    groupList: RuleGroupList;
    wordSeparators: string;
}

export const useGlobalStore = defineStore('global', {
    state: (): GlobalState => {
        return {
            groupList: [],
            wordSeparators: '',
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
