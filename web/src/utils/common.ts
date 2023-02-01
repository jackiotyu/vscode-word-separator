import { App } from 'vue';

export const vscode =
    window.__vscode__ ?? (window.__vscode__ = window.acquireVsCodeApi?.());

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
