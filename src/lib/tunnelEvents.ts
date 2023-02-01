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

export type WebviewPayload =
    | WebviewReloadMsg
    | WebviewSettingMsg
    | WebviewSaveRuleMsg
    | WebviewSaveGroupMsg
    | WebviewCopySettingMsg;
export type ExtPayload = ExtSettingMsg | ExtSaveRuleMsg | ExtSaveSaveGroupMsg | ExtCopySettingMsg;
