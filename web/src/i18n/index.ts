import * as VueI18n from 'vue-i18n';

export default VueI18n.createI18n({
    fallbackLocale: 'en',
    locale: 'zh-cn',
    legacy: false,
    messages: {
        en: require('./locale/en.json'),
        'zh-cn': require('./locale/zh-cn.json'),
    },
    globalInjection: true,
});
