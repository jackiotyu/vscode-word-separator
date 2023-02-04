import * as vscode from 'vscode';
import {
    WebviewPayload,
    MsgType,
    WebviewSettingMsg,
    WebviewSaveRuleMsg,
    WebviewCopySettingMsg,
    WebviewToggleItemCheckedMsg,
    WebviewEditItemMsg,
    WebviewDeleteItemMsg,
    WebviewAddItemMsg,
    WebviewCopySeparatorsMsg,
    WebviewLocaleMsg,
    LocaleType,
} from './tunnelEvents';
import {
    separatorConfig,
    extConfig,
    getSetting,
    getCloseGroup,
    toBaseItem,
} from './settingUtils';
import WebviewTunnel from './webviewTunnel';
import { GroupCloseItem } from '../types';
import localize from './localize';

export default function tunnelEventHandler(
    tunnel: WebviewTunnel,
    msg: WebviewPayload
) {
    switch (msg.type) {
        case MsgType.SETTING:
            return handleSetting(tunnel, msg);
        case MsgType.SAVE_RULE:
            return handleSaveRule(tunnel, msg);
        case MsgType.COPY_SETTING:
            return handleCopySetting(tunnel, msg);
        case MsgType.COPY_SEPARATORS:
            return handleCopySeparators(tunnel, msg);
        case MsgType.TOGGLE_ITEM_CHECKED:
            return handleToggleItemChecked(tunnel, msg);
        case MsgType.EDIT_ITEM:
            return handleEditItem(tunnel, msg);
        case MsgType.DELETE_ITEM:
            return handleDeleteItem(tunnel, msg);
        case MsgType.ADD_ITEM:
            return handleAddItem(tunnel, msg);
        case MsgType.LOCALE:
            return handleLocale(tunnel, msg);
        default:
            break;
    }
}

function handleSetting(tunnel: WebviewTunnel, msg: WebviewSettingMsg) {
    let setting = getSetting();
    tunnel.send({ ...msg, value: setting });
}

async function handleSaveRule(tunnel: WebviewTunnel, msg: WebviewSaveRuleMsg) {
    let success = true;
    try {
        await separatorConfig.update(msg.value);
    } catch (error) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleCopySeparators(
    tunnel: WebviewTunnel,
    msg: WebviewCopySeparatorsMsg
) {
    let success = true;
    try {
        await vscode.env.clipboard.writeText(separatorConfig.get());
        vscode.window.showInformationMessage(
            localize('event.action.copy.success')
        );
    } catch (error: any) {
        vscode.window.showErrorMessage(
            localize('event.action.copy.fail'),
            error.message as string
        );
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleCopySetting(
    tunnel: WebviewTunnel,
    msg: WebviewCopySettingMsg
) {
    let success = true;
    try {
        await vscode.env.clipboard.writeText(
            `"editor.wordSeparators": ${JSON.stringify(separatorConfig.get())},`
        );
        vscode.window.showInformationMessage(
            localize('event.action.copy.success')
        );
    } catch (error: any) {
        vscode.window.showErrorMessage(
            localize('event.action.copy.fail'),
            error.message as string
        );
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleToggleItemChecked(
    tunnel: WebviewTunnel,
    msg: WebviewToggleItemCheckedMsg
) {
    let success = true;
    try {
        let checked: boolean = msg.value.checked;
        let separators = separatorConfig.get();
        let groupSeparatorSet = new Set([...msg.value.separators]);
        let list = [];
        if (checked) {
            list = [...separators, ...groupSeparatorSet];
        } else {
            list = [...separators].filter((s) => {
                return !groupSeparatorSet.has(s);
            });
        }
        await separatorConfig.update([...new Set(list)].join(''));
    } catch (error: any) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleEditItem(tunnel: WebviewTunnel, msg: WebviewEditItemMsg) {
    let success = true;
    try {
        let { name, separators, id } = msg.value;
        let group = getCloseGroup();
        let item = group.find((item) => item.id === id);
        if (item) {
            item.name = name;
            item.separators = separators;
            await extConfig.updateGroup(group.map(toBaseItem));
        }
    } catch (error) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleAddItem(tunnel: WebviewTunnel, msg: WebviewAddItemMsg) {
    let success = true;
    try {
        let { name, separators, isDefault } = msg.value;
        let group = getCloseGroup();
        group.push({ name, separators, isDefault });
        await extConfig.updateGroup(group.map(toBaseItem));
    } catch (error) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleDeleteItem(
    tunnel: WebviewTunnel,
    msg: WebviewDeleteItemMsg
) {
    let success = true;
    try {
        let { id, name } = msg.value;
        let group = getCloseGroup();
        let filteredGroup: GroupCloseItem[] = group;

        // 需要手动确认
        // 确认替换
        let confirmText = localize('common.action.confirm');
        let confirm = await vscode.window.showInformationMessage(
            localize('event.action.deleteItem.confirm'),
            { modal: true },
            confirmText
        );
        if (confirm === confirmText) {
            if (id !== undefined) {
                let index = group.findIndex((i) => i.id === id);
                filteredGroup.splice(index, 1);
            } else {
                filteredGroup = group.filter((g) => g.name !== name);
            }
            await extConfig.updateGroup(filteredGroup.map(toBaseItem));
        } else {
            success = false;
        }
    } catch (error) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

function handleLocale(tunnel: WebviewTunnel, msg: WebviewLocaleMsg) {
    tunnel.send({ ...msg, value: vscode.env.language as LocaleType });
}
