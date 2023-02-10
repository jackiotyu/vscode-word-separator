import { App } from 'vue';
import { RouteRecordName, LocationQuery } from 'vue-router';
import { LocaleType } from '@ext/src/lib/tunnelEvents';

export type StateType = {
    route?: {
        name: RouteRecordName | null | undefined;
        query: LocationQuery;
    };
    editForm?: {
        name: string;
        value: string;
    };
    locale?: LocaleType;
};

export const vscode =
    window.__vscode__ ??
    (window.__vscode__ = window.acquireVsCodeApi<StateType | undefined>());

export function updateState(state: StateType) {
    const oldState = (vscode.getState() || {}) as StateType;
    vscode.setState({ ...oldState, ...state });
}

export function getState(): StateType {
    return (vscode.getState() || {}) as StateType;
}

let baseUri = '';
export function getBaseUri() {
    if (baseUri) return baseUri;
    const dataUri = document.querySelector('body[data-uri]');
    if (!dataUri) return;
    baseUri = decodeURIComponent(dataUri.getAttribute('data-uri') || '');

    return baseUri;
}

export default {
    install(app: App) {
        app.config.globalProperties.baseUri = getBaseUri();
    },
};
