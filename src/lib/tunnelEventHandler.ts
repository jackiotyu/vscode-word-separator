import { WebviewPayload, MsgType } from './tunnelEvents';
import WebviewTunnel from './webviewTunnel';
import {
    handleSetting,
    handleSaveRule,
    handleCopySetting,
    handleCopySeparators,
    handleToggleItemChecked,
    handleEditItem,
    handleDeleteItem,
    handleAddItem,
    handleLocale,
} from './processEvent';

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
