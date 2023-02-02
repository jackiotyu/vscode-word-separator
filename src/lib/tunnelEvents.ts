// webview与插件进程的事件type，统一管理
import { GroupListType } from '../types';
export enum MsgType {
    /** 重载页面 */
    RELOAD = 'reload',
    /** 注册的命令 */
    SETTING = 'setting',
    /** 保存规则 */
    SAVE_RULE = 'saveRule',
    /** 保存分组 */
    SAVE_GROUP = 'saveGroup',
    /** 复制配置 */
    COPY_SETTING = 'copySetting',
    /** 切换选中配置 */
    TOGGLE_ITEM_CHECKED = 'toggleItemChecked',
    /** 编辑配置 */
    EDIT_ITEM = 'editItem',
}

// webview进程的type
export type MsgKey = `${MsgType}`;

export type MessageKey = MsgKey;

// 生成插件进程和webview进程的payload
export type GenPayload<T extends MsgKey, K> = {
    id: string;
    type: T;
    value: K;
};

export type WebviewReloadMsg = GenPayload<MsgType.RELOAD, undefined>;
export type WebviewSettingMsg = GenPayload<MsgType.SETTING, undefined>;
export type WebviewSaveRuleMsg = GenPayload<MsgType.SAVE_RULE, string>;
export type WebviewSaveGroupMsg = GenPayload<MsgType.SAVE_GROUP, GroupListType>;
export type WebviewCopySettingMsg = GenPayload<MsgType.COPY_SETTING, undefined>;
export type WebviewEditItemMsg = GenPayload<MsgType.EDIT_ITEM, string>;
export type WebviewToggleItemCheckedMsg = GenPayload<
    MsgType.TOGGLE_ITEM_CHECKED,
    {
        separators: string;
        checked: boolean;
    }
>;

export type ExtSettingMsg = GenPayload<
    MsgType.SETTING,
    {
        group: GroupListType;
        rule: string;
    }
>;
export type ExtSaveRuleMsg = GenPayload<MsgType.SAVE_RULE, boolean>;
export type ExtSaveSaveGroupMsg = GenPayload<MsgType.SAVE_GROUP, boolean>;
export type ExtCopySettingMsg = GenPayload<MsgType.COPY_SETTING, boolean>;
export type ExtToggleItemCheckedMsg = GenPayload<MsgType.TOGGLE_ITEM_CHECKED, boolean>;
export type ExtEditItemMsg = GenPayload<MsgType.EDIT_ITEM, void>;

export type WebviewPayload =
    | WebviewReloadMsg
    | WebviewSettingMsg
    | WebviewSaveRuleMsg
    | WebviewSaveGroupMsg
    | WebviewCopySettingMsg
    | WebviewToggleItemCheckedMsg
    | WebviewEditItemMsg;
export type ExtPayload =
    | ExtSettingMsg
    | ExtSaveRuleMsg
    | ExtSaveSaveGroupMsg
    | ExtCopySettingMsg
    | ExtToggleItemCheckedMsg
    | ExtEditItemMsg;
