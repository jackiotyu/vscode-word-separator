<template>
    <main class="main-box">
        <div class="header-wrap">
            <span
                class="codicon codicon-arrow-left operation"
                @click="router.push({ path: '/' })"
                :title="$t('action.back')"
            >
            </span>
            <span
                class="codicon codicon-refresh operation"
                @click="handleReset"
                :title="$t('action.reset')"
            >
            </span>
        </div>

        <div class="form-wrap">
            <vscode-text-field
                class="form-item"
                size="50"
                maxLength="30"
                :placeholder="$t('placeholder.itemName')"
                :value="formName"
                @input="onChange('formName', $event)"
                >{{ $t('form.itemName') }}</vscode-text-field
            >
            <vscode-text-area
                class="form-item"
                :placeholder="$t('placeholder.itemValue')"
                resize="vertical"
                :rows="4"
                :cols="100"
                maxLength="1000"
                :value="formValue"
                @input="onChange('formValue', $event)"
                >{{ $t('form.itemValue') }}</vscode-text-area
            >
        </div>

        <div class="action-wrap">
            <vscode-button
                class="action-btn"
                :disabled="!changed"
                @click="handleSave"
                >{{ $t('action.saveConfig')
                }}<span slot="start" class="codicon codicon-save"></span
            ></vscode-button>
        </div>
    </main>
</template>

<script lang="ts">
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { ref, watch } from 'vue';
import { sendMsg, MsgType } from '@/utils/tunnel';
import { updateState, getState } from '@/utils/common';

export default {
    name: 'EditItem',
    setup() {
        let router = useRouter();
        let route = useRoute();
        let ruleName = (route.query.name || '') as string;
        let ruleValue = (route.query.separators || '') as string;
        let isDefault = !!route.query.isDefault;
        let id = Number(route.query.id) || undefined;
        let changed = ref<boolean>(false);
        let formName = ref<string>((ruleName as string) || '');
        let formValue = ref<string>((ruleValue as string) || '');

        onBeforeRouteLeave((to, from, next) => {
            updateState({ editForm: undefined });
            next();
        });

        const isAdd = !ruleName;
        watch(
            () => [formName.value, formValue.value],
            ([name, value]) => {
                changed.value =
                    !!(name && value) &&
                    (name !== ruleName || value !== ruleValue);
                if (changed.value) {
                    updateState({ editForm: { name, value } });
                }
            }
        );

        const handleSave = () => {
            let saveValue = {
                name: formName.value,
                separators: formValue.value,
                isDefault,
                id,
            };

            let saveFunc = isAdd
                ? sendMsg({
                      type: MsgType.ADD_ITEM,
                      value: saveValue,
                  })
                : sendMsg({
                      type: MsgType.EDIT_ITEM,
                      value: saveValue,
                  });
            saveFunc.then((res) => {
                if (res.value) {
                    router.push({ path: '/' });
                }
            });
        };
        const handleReset = () => {
            formName.value = ruleName;
            formValue.value = ruleValue;
        };
        const onChange = (type: string, e: any) => {
            let value = e.target.value;
            switch (type) {
                case 'formName':
                    formName.value = value;
                    break;
                case 'formValue':
                    formValue.value = value;
                    break;
            }
        };
        let oldForm = getState().editForm;
        if (oldForm) {
            formName.value = oldForm.name;
            formValue.value = oldForm.value;
            updateState({ editForm: undefined });
        }
        return {
            router,
            changed,
            formName,
            formValue,
            handleSave,
            handleReset,
            onChange,
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
    padding: 0 8px;
    box-sizing: border-box;
    z-index: 2;
}

.header-wrap {
    display: flex;
    justify-content: space-between;
    color: var(--vscode-sideBarSectionHeader-foreground);
    background-color: var(--vscode-sideBarSectionHeader-background);
    border-top: 1px solid var(--vscode-sideBarSectionHeader-border);
    &:focus {
        outline-width: 1px;
        outline-style: solid;
        outline-offset: -1px;
        outline-color: var(--vscode-focusBorder);
        opacity: 1;
    }
    .operation:not(:last-child) {
        margin-right: 8px;
    }
    .operation {
        padding: 4px;
        border-radius: 4px;
        &:hover {
            outline: 1px dashed var(--vscode-toolbar-hoverOutline);
            outline-offset: -1px;
            background-color: var(--vscode-toolbar-hoverBackground);
        }
    }
}

.operation {
    cursor: pointer;
}

.form-wrap,
.action-wrap {
    margin-top: 10px;
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
