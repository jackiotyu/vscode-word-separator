<template>
    <router-view v-slot="{ Component, route }" v-if="canShow">
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
import { watch, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/store/index';
import { useRouter } from 'vue-router';
import { updateState, getState } from '@/utils/common';
import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    vsCodeOption,
    vsCodeTextArea,
    vsCodeDivider,
    vsCodeProgressRing,
    vsCodeTextField,
} from '@vscode/webview-ui-toolkit';

// 注册组件
provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeOption(),
    vsCodeTextArea(),
    vsCodeDivider(),
    vsCodeProgressRing(),
    vsCodeTextField()
);

let store = useGlobalStore();
let i18n = useI18n();
let canShow = ref(false);

onMounted(() => {
    setTimeout(() => {
        canShow.value = true;
    }, 17);
});

watch(
    () => store.locale,
    (value) => {
        i18n.locale.value = value;
    },
    { immediate: true }
);

const router = useRouter();
router.afterEach((to) => {
    let { name, query } = to;
    updateState({ route: { name, query } });
});

let { route: { name, query = {} } = {} } = getState();
if (name) router.replace({ name, query });
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
    position: fixed !important;
    top: 0;
    left: 0;
    background: var(--vscode-editor-background);
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
    transition: transform $duration ease;
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
    transition: transform $duration ease;
    z-index: 2;
    transform: translateX(0%);
}
.slide-left-leave-to {
    z-index: 2;
    transform: translateX(100%);
}
</style>
