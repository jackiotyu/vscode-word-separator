import * as vscode from 'vscode';
import {
    WebviewPayload,
    MsgType,
    WebviewSettingMsg,
    WebviewSaveRuleMsg,
    WebviewCopySettingMsg,
    WebviewToggleItemCheckedMsg,
    WebviewEditItemMsg,
} from './tunnelEvents';
import { separatorConfig, getSetting, getActiveSeparators } from './settingUtils';
import WebviewTunnel from './webviewTunnel';

export default function tunnelEventHandler(tunnel: WebviewTunnel, msg: WebviewPayload) {
    switch (msg.type) {
        case MsgType.SETTING:
            return handleSetting(tunnel, msg);
        case MsgType.SAVE_RULE:
            return handleSaveRule(tunnel, msg);
        case MsgType.COPY_SETTING:
            return handleCopySetting(tunnel, msg);
        case MsgType.TOGGLE_ITEM_CHECKED:
            return handleToggleItemChecked(tunnel, msg);
        case MsgType.EDIT_ITEM:
            return handleEditItem(tunnel, msg);
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
        console.log('save rule error >>', error);
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleCopySetting(tunnel: WebviewTunnel, msg: WebviewCopySettingMsg) {
    let success = true;
    try {
        await vscode.env.clipboard.writeText(`"editor.wordSeparators": ${JSON.stringify(separatorConfig.get())},`);
        vscode.window.showInformationMessage('复制成功');
    } catch (error: any) {
        console.log('CopySettingMsg error >>', error);
        vscode.window.showErrorMessage('复制失败', error.message as string);
        success = false;
    }
    tunnel.send({ ...msg, value: success });
}

async function handleToggleItemChecked(tunnel: WebviewTunnel, msg: WebviewToggleItemCheckedMsg) {
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
    // TODO 编辑配置
}
