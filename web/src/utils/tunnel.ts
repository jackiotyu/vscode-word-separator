import mitt from 'mitt';
import { vscode } from './common';

import {
    WebviewPayload,
    ExtPayload,
    MsgType,
    WebviewSettingMsg,
    WebviewSaveRuleMsg,
    WebviewCopySettingMsg,
    ExtSettingMsg,
    ExtSaveRuleMsg,
    ExtCopySettingMsg,
} from '@ext/src/lib/tunnelEvents';
import { genID } from '@ext/src/lib/utils';

// 规定信息格式
type Events = {
    sendExt: WebviewPayload;
    extMsg: ExtPayload;
};

const tunnel = mitt<Events>();

// 从插件进程发过来的消息
// 监听方式：tunnel.on('extMsg', e)
window.onmessage = (e) => {
    const data = e.data;
    if (data && 'id' in data && 'type' in data) {
        tunnel.emit('extMsg', e.data);
    }
};

// 传递事件给插件进程
// 使用方式：tunnel.emit('sendExt', message)
tunnel.on('sendExt', (event) => {
    vscode.postMessage(event);
});

type WebviewPayloadLike = Pick<WebviewPayload, 'type' | 'value'>;

/**
 * 发送消息给插件进程
 * @param message 消息内容
 * @returns
 */
export function sendMsg(
    message: Pick<WebviewSettingMsg, 'type'>
): Promise<ExtSettingMsg>;
export function sendMsg(
    message: Pick<WebviewSaveRuleMsg, 'type' | 'value'>
): Promise<ExtSaveRuleMsg>;
export function sendMsg(
    message: Pick<WebviewCopySettingMsg, 'type'>
): Promise<ExtCopySettingMsg>;
export function sendMsg<U extends WebviewPayloadLike, T extends ExtPayload>(
    message: U
) {
    return new Promise<T | void>((resolve) => {
        const packMsg = { ...message, id: genID() };
        tunnel.emit('sendExt', packMsg as WebviewPayload);
        // 刷新操作不需要监听返回值
        if (packMsg.type === MsgType.RELOAD) {
            return resolve();
        }
        const cb = (data: any) => {
            console.log('e', data, packMsg.id, message.type);
            if ('id' in data && data.id === packMsg.id) {
                resolve(data);
                tunnel.off('extMsg', cb);
            }
        };
        tunnel.on('extMsg', cb);
    });
}

export default tunnel;
