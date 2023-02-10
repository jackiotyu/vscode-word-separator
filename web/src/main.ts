import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import GlobalSetting from '@/utils/common';
import tunnel, { MsgType, sendMsg } from '@/utils/tunnel';
import { useGlobalStore } from '@/store/index';
import I18n from '@/i18n/index';

const pinia = createPinia();

createApp(App)
    .use(GlobalSetting)
    .use(pinia)
    .use(router)
    .use(I18n)
    .mount('#app');

const store = useGlobalStore();

sendMsg({ type: MsgType.LOCALE });

tunnel.on('extMsg', (msg) => {
    if (msg.type === MsgType.LOCALE) {
        store.$patch({ locale: msg.value });
    } else if (msg.type === MsgType.SETTING) {
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
