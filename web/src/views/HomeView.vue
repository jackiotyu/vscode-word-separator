<template>
    <main class="main-box">
        <div class="loading-wrap" v-if="loading">
            <vscode-progress-ring></vscode-progress-ring>
        </div>
        <template v-else>
            <div
                class="rule-group-item"
                v-for="groupItem in groupList"
                :key="groupItem.name"
            >
                <vscode-divider></vscode-divider>
                <div class="group-name-tab">
                    <vscode-tag
                        class="group-name"
                        :title="groupItem.name"
                        :class="{ active: groupItem.checked }"
                        >{{ groupItem.name }}</vscode-tag
                    >
                    <div class="operation-wrap">
                        <span
                            class="codicon codicon-check operation"
                            title="启用全部"
                            @click="handleEnableItem(groupItem)"
                        ></span>
                        <span
                            class="codicon codicon-circle-slash operation"
                            title="取消全部"
                            @click="handleDisableItem(groupItem)"
                        ></span>
                        <span
                            v-if="!groupItem.isDefault"
                            class="codicon codicon-edit operation"
                            title="修改配置"
                            @click="handleEditItem(groupItem)"
                        ></span>
                        <span
                            v-if="!groupItem.isDefault"
                            class="codicon codicon-remove operation"
                            title="删除配置"
                            @click="handleDeleteItem(groupItem)"
                        ></span>
                    </div>
                </div>
                <div class="option-wrap">
                    <vscode-option
                        class="option-item"
                        @click="toggleSelected(separator)"
                        :selected="selectedSet.has(separator)"
                        v-for="separator in groupItem.separators"
                        :key="separator"
                        :title="separator"
                        >{{ separator }}</vscode-option
                    >
                </div>
            </div>
        </template>
        <div class="rule-preview-wrap">
            <vscode-text-area
                v-model="settingText"
                resize="vertical"
                class="input-rule"
                readonly
                :rows="4"
                :cols="100"
                >当前规则</vscode-text-area
            >
        </div>
        <div class="action-wrap">
            <div class="action-line">
                <vscode-button
                    class="action-btn"
                    :disabled="loading"
                    @click="handleCopy"
                    title="复制当前分隔符配置"
                    >复制配置<span
                        slot="start"
                        class="codicon codicon-copy"
                    ></span
                ></vscode-button>
                <vscode-button
                    class="action-btn"
                    :disabled="loading"
                    @click="handleCopySeparators"
                    title="复制当前激活的分隔符"
                    >复制分隔符<span
                        slot="start"
                        class="codicon codicon-copy"
                    ></span
                ></vscode-button>
            </div>
            <vscode-button
                class="action-btn"
                :disabled="loading"
                @click="handleAddItem"
                >添加配置<span slot="start" class="codicon codicon-add"></span
            ></vscode-button>
        </div>
    </main>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MsgType } from '@ext/src/lib/tunnelEvents';
import { sendMsg } from '@/utils/tunnel';
import { throttle } from 'lodash';
import { storeToRefs } from 'pinia';
import { RuleGroupItem, useGlobalStore } from '@/store/index';

export default {
    name: 'HomeView',
    setup() {
        let globalStore = useGlobalStore();
        const router = useRouter();
        let { selectedSet, wordSeparators, groupList, settingText } =
            storeToRefs(globalStore);
        let loading = ref<boolean>(true);

        const handleRefresh = () => {
            return globalStore.refresh();
        };
        const handleCopy = () => {
            sendMsg({ type: MsgType.COPY_SETTING });
        };
        const handleCopySeparators = () => {
            sendMsg({ type: MsgType.COPY_SEPARATORS });
        };
        const toggleSelected = throttle((separator: string) => {
            let isInclude = selectedSet.value.has(separator);
            let set = new Set(selectedSet.value);
            isInclude ? set.delete(separator) : set.add(separator);
            sendMsg({
                type: MsgType.SAVE_RULE,
                value: [...set].join(''),
            });
        }, 17);
        const toggleEnableItem = throttle(
            (checked: boolean, groupItem: RuleGroupItem) => {
                sendMsg({
                    type: MsgType.TOGGLE_ITEM_CHECKED,
                    value: {
                        checked,
                        separators: groupItem.separators.join(''),
                    },
                });
            },
            17
        );
        const handleEditItem = (groupItem: RuleGroupItem) => {
            router.push({
                name: 'EditItem',
                query: {
                    name: groupItem.name,
                    separators: groupItem.separators.join(''),
                    isDefault: groupItem.isDefault ? 1 : 0,
                    id: groupItem.id,
                },
            });
        };
        const handleEnableItem = (groupItem: RuleGroupItem) => {
            !groupItem.checked && toggleEnableItem(true, groupItem);
        };
        const handleDisableItem = (groupItem: RuleGroupItem) => {
            (groupItem.checked || groupItem.indeterminate) &&
                toggleEnableItem(false, groupItem);
        };
        const handleAddItem = () => {
            router.push({ name: 'EditItem' });
        };
        const handleDeleteItem = (groupItem: RuleGroupItem) => {
            let { id, name } = groupItem;
            sendMsg({ type: MsgType.DELETE_ITEM, value: { id, name } });
        };
        onMounted(() => {
            handleRefresh().then(() => (loading.value = false));
        });

        return {
            groupList,
            loading,
            handleEnableItem,
            handleDisableItem,
            handleRefresh,
            handleCopy,
            handleEditItem,
            handleAddItem,
            handleDeleteItem,
            handleCopySeparators,
            toggleSelected,
            wordSeparators,
            selectedSet,
            settingText,
        };
    },
};
</script>
<style lang="scss" scoped>
.main-box {
    width: 100%;
    height: 100%;
    max-width: 500px;
    min-width: 100px;
    margin: 0px auto;
    position: relative;
    display: flex;
    flex-direction: column;
    .loading-wrap {
        max-height: 350px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .rule-group-item {
        display: flex;
        flex-direction: column;
    }
    .group-name-tab {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden;
    }
    .operation-wrap {
        flex-shrink: 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .operation {
            cursor: pointer;
            &:not(:last-child) {
                margin-right: 6px;
            }
        }
    }
    .group-name {
        flex: 2;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        &.active {
            color: var(--list-active-selection-foreground);
        }
    }
    .option-wrap {
        display: grid;
        grid-auto-flow: row dense;
        grid-gap: 4px 6px;
        justify-content: space-between;
        grid-template-columns: repeat(auto-fill, 24px);
        width: 100%;
    }
    .option-item {
        min-width: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--type-ramp-plus1-font-size);
        border-radius: 2px;
        &.selected {
            background: var(--button-primary-background);
        }
    }
    .rule-preview-wrap {
        margin-top: 10px;
    }
    .action-btn {
        margin-bottom: 16px;
    }
    .action-wrap {
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    }
    .action-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-right: -8px;
        .action-btn {
            flex: 1;
            min-width: 114px;
            margin-right: 8px;
        }
    }
}
</style>
