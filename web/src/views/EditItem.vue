<template>
    <main class="main-box">
        <div class="header-wrap">
            <span
                class="codicon codicon-arrow-left operation"
                @click="router.push({ path: '/' })"
                title="返回"
            >
            </span>
            <span
                class="codicon codicon-refresh operation"
                @click="handleReset"
                title="重置"
            >
            </span>

            <!-- <vscode-tag>编辑配置</vscode-tag> -->
        </div>

        <div class="form-wrap">
            <vscode-text-field
                class="form-item"
                size="50"
                maxLength="30"
                placeholder="输入配置名称"
                v-model="formName"
                >配置名称</vscode-text-field
            >
            <vscode-text-area
                class="form-item"
                placeholder="输入分隔符"
                resize="vertical"
                :rows="4"
                :cols="100"
                maxLength="200"
                v-model="formValue"
                >分隔符</vscode-text-area
            >
        </div>

        <div class="action-wrap">
            <vscode-button
                class="action-btn"
                :disabled="!changed"
                @click="handleSave"
                >保存配置<span slot="start" class="codicon codicon-save"></span
            ></vscode-button>
        </div>
    </main>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';

export default {
    setup() {
        let router = useRouter();
        let route = useRoute();
        let { name: ruleName = '', separators: ruleValue = '' } = route.params;
        let changed = ref<boolean>(false);
        let formName = ref(ruleName);
        let formValue = ref(ruleValue);

        watch(
            () => [formName.value, formValue.value],
            ([name, value]) => {
                changed.value =
                    !!(name && value) &&
                    (name !== ruleName || value !== ruleValue);
            }
        );

        const handleSave = () => {
            console.log('🚀 save >>');
        };
        const handleReset = () => {
            formName.value = ruleName;
            formValue.value = ruleValue;
        };
        return {
            router,
            changed,
            formName,
            formValue,
            handleSave,
            handleReset,
        };
    },
};
</script>

<style lang="scss" scoped>
.main-box {
    width: 100%;
    height: 100%;
    max-width: 500px;
    min-width: 200px;
    margin: 0px auto;
    position: relative;
    display: flex;
    flex-direction: column;
}

.header-wrap {
    display: flex;
    justify-content: space-between;
    .operation:not(:last-child) {
        margin-right: 8px;
    }
}

.operation {
    cursor: pointer;
}

.form-wrap,
.action-wrap {
    margin-top: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.form-item {
    &:not(:first-child) {
        margin-top: 10px;
    }
}
</style>
