import * as vscode from 'vscode';
import {
    WebviewSettingMsg,
    WebviewResetSettingMsg,
    WebviewSaveRuleMsg,
    WebviewCopySettingMsg,
    WebviewToggleItemCheckedMsg,
    WebviewEditItemMsg,
    WebviewDeleteItemMsg,
    WebviewAddItemMsg,
    WebviewCopySeparatorsMsg,
    WebviewLocaleMsg,
    WebviewReloadMsg,
    LocaleType
} from './tunnelEvents';
import {
    separatorConfig,
    extConfig,
    getSetting,
    getCloseGroup,
    toBaseItem
} from './settingUtils';
import { COMMAND_RESET_SEPARATOR } from './constants';
import WebviewTunnel from './webviewTunnel';
import windowAdaptor from './windowAdaptor';
import { GroupCloseItem } from '../types';
import localize from './localize';

export function handleReload(tunnel: WebviewTunnel) {
    tunnel.emitReloadWebview();
}

export function handleSetting(tunnel: WebviewTunnel, msg: WebviewSettingMsg) {
    let setting = getSetting();
    tunnel.send({ ...msg, value: setting });
}
export function handleResetSetting(tunnel: WebviewTunnel, msg: WebviewResetSettingMsg) {
    vscode.commands.executeCommand(COMMAND_RESET_SEPARATOR, false).then(() => {
        tunnel.send({ ...msg, value: true });
    });
}
export async function handleSaveRule(tunnel: WebviewTunnel, msg: WebviewSaveRuleMsg) {
    let success = true;
    try {
        await separatorConfig.update(msg.value);
    } catch (error) {
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}
export async function handleCopySeparators(
    tunnel: WebviewTunnel,
    msg: WebviewCopySeparatorsMsg) {
    let success = true;
    try {
        await vscode.env.clipboard.writeText(separatorConfig.get());
        windowAdaptor.showPanelInfo(
            localize('event.action.copy.success')
        );
    } catch (error: any) {
        windowAdaptor.showPanelError(
            localize('event.action.copy.fail'),
            error.message as string
        );
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}
export async function handleCopySetting(
    tunnel: WebviewTunnel,
    msg: WebviewCopySettingMsg) {
    let success = true;
    try {
        await vscode.env.clipboard.writeText(
            `"editor.wordSeparators": ${JSON.stringify(separatorConfig.get())},`
        );
        windowAdaptor.showPanelInfo(
            localize('event.action.copy.success')
        );
    } catch (error: any) {
        windowAdaptor.showPanelError(
            localize('event.action.copy.fail'),
            error.message as string
        );
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}
export async function handleToggleItemChecked(
    tunnel: WebviewTunnel,
    msg: WebviewToggleItemCheckedMsg) {
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
export async function handleEditItem(tunnel: WebviewTunnel, msg: WebviewEditItemMsg) {
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
export async function handleAddItem(tunnel: WebviewTunnel, msg: WebviewAddItemMsg) {
    let success = true;
    try {
        let { name, separators, isDefault } = msg.value;
        let group = getCloseGroup();
        group.push({ name, separators, isDefault });
        await extConfig.updateGroup(group.map(toBaseItem));
    } catch (error) {
        console.log(error, 'error');
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}
export async function handleDeleteItem(
    tunnel: WebviewTunnel,
    msg: WebviewDeleteItemMsg) {
    let success = true;
    try {
        let { id, name } = msg.value;
        let group = getCloseGroup();
        let filteredGroup: GroupCloseItem[] = group;

        // 需要手动确认
        // 确认替换
        let confirmText = localize('common.action.confirm');
        let confirm = await windowAdaptor.showPanelInfo(
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
export function handleLocale(tunnel: WebviewTunnel, msg: WebviewLocaleMsg) {
    tunnel.send({ ...msg, value: vscode.env.language as LocaleType });
}
