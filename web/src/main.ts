import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    vsCodeCheckbox,
    vsCodeDropdown,
    vsCodeOption,
    vsCodeTextArea,
    vsCodeRadioGroup,
    vsCodeRadio,
    vsCodeDivider,
    vsCodeProgressRing,
    vsCodeTextField,
} from '@vscode/webview-ui-toolkit';
import GlobalSetting from '@/utils/common';
import tunnel from '@/utils/tunnel';
import { useGlobalStore } from '@/store/index';

// 注册组件
provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeCheckbox(),
    vsCodeDropdown(),
    vsCodeOption(),
    vsCodeTextArea(),
    vsCodeRadioGroup(),
    vsCodeRadio(),
    vsCodeDivider(),
    vsCodeProgressRing(),
    vsCodeTextField()
);

const pinia = createPinia();

createApp(App).use(GlobalSetting).use(pinia).use(router).mount('#app');

const store = useGlobalStore();
tunnel.on('extMsg', (msg) => {
    if (msg.type === 'setting') {
        const { rule: wordSeparators, group } = msg.value;
        store.wordSeparators = wordSeparators;
        const groupList = group.map((i) => {
            const checkedLength = i.separators.filter((s) =>
                store.selectedSet.has(s)
            ).length;
            const checked = checkedLength === i.separators.length;
            const indeterminate = !checked && !!checkedLength;
            return { ...i, checked, indeterminate };
        });
        store.$patch({ groupList });
    }
});
