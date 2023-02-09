<template>
    <router-view v-slot="{ Component, route }">
        <transition
            class="router-container"
            :name="route.meta.transition"
            :mode="route.meta.mode"
        >
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/store/index';
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

let store = useGlobalStore();
let i18n = useI18n();

watch(
    () => store.locale,
    (value) => {
        console.log('locale change', value);
        i18n.locale.value = value;
    },
    { immediate: true }
);
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    height: 100%;
    overflow: hidden;
}
html {
    height: 100%;
    padding: 0;
    margin: 0;
}
body {
    height: 98%;
    background-color: var(--vscode-editor-background);
    padding: 0;
    margin: 0;
}
nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
:root {
    --design-unit: 3 !important;
}

.router-container {
    overflow: hidden;
}

.slide-left,
.slide-right {
    &-enter-active,
    &-leave-active {
        position: fixed;
        width: 100%;
        min-height: 100vh;
        top: 0;
    }
}
$duration: 0.3s;

// router view
.slide-right-enter-active {
    transition: transform $duration ease-in-out;
    z-index: 2;
    transform: translateX(100%);
}
.slide-right-enter-to {
    z-index: 2;
    transform: translateX(0%);
}
.slide-right-leave-active {
    z-index: -1;
}
.slide-right-leave-to {
    z-index: -1;
}
// router view back

.slide-left-leave-active {
    transition: transform $duration ease-in-out;
    z-index: 2;
    transform: translateX(0%);
}
.slide-left-leave-to {
    z-index: 2;
    transform: translateX(100%);
}
</style>
