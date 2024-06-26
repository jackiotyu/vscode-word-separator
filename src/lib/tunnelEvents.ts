// webview与插件进程的事件type，统一管理
import { GroupCloseItem, GroupListType } from '../types';
import {} from 'vscode';

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
    /** 重置默认配置 */
    RESET_SETTING = 'resetSetting',
    /** 复制分隔符 */
    COPY_SEPARATORS = 'copySeparators',
    /** 切换选中配置 */
    TOGGLE_ITEM_CHECKED = 'toggleItemChecked',
    /** 编辑配置 */
    EDIT_ITEM = 'editItem',
    /** 删除配置 */
    DELETE_ITEM = 'deleteItem',
    /** 添加配置 */
    ADD_ITEM = 'addItem',
    /** 语言环境 */
    LOCALE = 'locale',
    TOGGLE_EXPAND = 'toggleExpand',
}

// webview进程的type
export type MsgKey = `${MsgType}`;

// 生成插件进程和webview进程的payload
export type GenPayload<T extends MsgKey, K> = {
    id: string;
    type: T;
    value: K;
};

export type LocaleType = 'en' | 'zh-cn';

export type WebviewReloadMsg = GenPayload<MsgType.RELOAD, undefined>;
export type WebviewSettingMsg = GenPayload<MsgType.SETTING, undefined>;
export type WebviewResetSettingMsg = GenPayload<MsgType.RESET_SETTING, undefined>;
export type WebviewSaveRuleMsg = GenPayload<MsgType.SAVE_RULE, string>;
export type WebviewSaveGroupMsg = GenPayload<MsgType.SAVE_GROUP, GroupListType>;
export type WebviewCopySettingMsg = GenPayload<MsgType.COPY_SETTING, undefined>;
export type WebviewCopySeparatorsMsg = GenPayload<
    MsgType.COPY_SEPARATORS,
    undefined
>;
export type WebviewEditItemMsg = GenPayload<MsgType.EDIT_ITEM, GroupCloseItem>;
export type WebviewAddItemMsg = GenPayload<MsgType.ADD_ITEM, GroupCloseItem>;
export type WebviewToggleItemCheckedMsg = GenPayload<
    MsgType.TOGGLE_ITEM_CHECKED,
    {
        separators: string;
        checked: boolean;
    }
>;
export type WebviewDeleteItemMsg = GenPayload<
    MsgType.DELETE_ITEM,
    { name: string; id?: number }
>;
export type WebviewLocaleMsg = GenPayload<MsgType.LOCALE, undefined>;

export type ExtSettingMsg = GenPayload<
    MsgType.SETTING,
    {
        group: GroupListType;
        rule: string;
    }
>;
export type ExtSaveRuleMsg = GenPayload<MsgType.SAVE_RULE, boolean>;
export type ExtSaveGroupMsg = GenPayload<MsgType.SAVE_GROUP, boolean>;
export type ExtCopySettingMsg = GenPayload<MsgType.COPY_SETTING, boolean>;
export type ExtResetSettingMsg = GenPayload<MsgType.RESET_SETTING, boolean>;
export type ExtCopySeparatorsMsg = GenPayload<MsgType.COPY_SEPARATORS, boolean>;
export type ExtToggleItemCheckedMsg = GenPayload<
    MsgType.TOGGLE_ITEM_CHECKED,
    boolean
>;
export type ExtEditItemMsg = GenPayload<MsgType.EDIT_ITEM, boolean>;
export type ExtDeleteItemMsg = GenPayload<MsgType.DELETE_ITEM, boolean>;
export type ExtAddItemMsg = GenPayload<MsgType.ADD_ITEM, boolean>;
export type ExtLocaleMsg = GenPayload<MsgType.LOCALE, LocaleType>;
export type TOGGLE_EXPAND = GenPayload<MsgType.TOGGLE_EXPAND, boolean>;

export type WebviewPayload =
    | WebviewReloadMsg
    | WebviewSettingMsg
    | WebviewResetSettingMsg
    | WebviewSaveRuleMsg
    | WebviewSaveGroupMsg
    | WebviewCopySettingMsg
    | WebviewToggleItemCheckedMsg
    | WebviewEditItemMsg
    | WebviewDeleteItemMsg
    | WebviewAddItemMsg
    | WebviewCopySeparatorsMsg
    | WebviewLocaleMsg;
export type ExtPayload =
    | ExtSettingMsg
    | ExtResetSettingMsg
    | ExtSaveRuleMsg
    | ExtSaveGroupMsg
    | ExtCopySettingMsg
    | ExtToggleItemCheckedMsg
    | ExtEditItemMsg
    | ExtDeleteItemMsg
    | ExtAddItemMsg
    | ExtCopySeparatorsMsg
    | ExtLocaleMsg
    | TOGGLE_EXPAND;
