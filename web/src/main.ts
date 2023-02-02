import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
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
} from '@vscode/webview-ui-toolkit';
import GlobalSetting from '@/utils/common';

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
    vsCodeProgressRing()
);

createApp(App).use(GlobalSetting).use(store).use(router).mount('#app');
