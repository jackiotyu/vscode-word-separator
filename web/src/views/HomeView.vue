<template>
    <main class="main-box">
        <div class="loading-wrap" v-if="loading">
            <vscode-progress-ring></vscode-progress-ring>
        </div>
        <div class="rule-list-wrap" v-else>
            <div
                class="rule-group-item"
                v-for="(groupItem, index) of groupList"
                :key="groupItem.name"
            >
                <vscode-divider></vscode-divider>
                <div class="group-name-tab">
                    <span
                        class="codicon"
                        :class="[
                            openList[index]
                                ? 'codicon-chevron-down'
                                : 'codicon-chevron-right',
                        ]"
                        @click="changeOpen(index)"
                    ></span>
                    <vscode-tag
                        class="group-name"
                        :title="groupItem.name"
                        :class="{ active: groupItem.checked }"
                        >{{ groupItem.name }}</vscode-tag
                    >
                    <div class="operation-wrap">
                        <span
                            class="codicon codicon-check operation"
                            :title="$t('action.enableAll')"
                            @click="handleEnableItem(groupItem)"
                        ></span>
                        <span
                            class="codicon codicon-circle-slash operation"
                            :title="$t('action.cancelAll')"
                            @click="handleDisableItem(groupItem)"
                        ></span>
                        <span
                            v-if="!groupItem.isDefault"
                            class="codicon codicon-edit operation"
                            :title="$t('action.editItem')"
                            @click="handleEditItem(groupItem)"
                        ></span>
                        <span
                            v-if="!groupItem.isDefault"
                            class="codicon codicon-remove operation"
                            :title="$t('action.deleteItem')"
                            @click="handleDeleteItem(groupItem, index)"
                        ></span>
                    </div>
                </div>
                <div
                    class="option-wrap"
                    :class="{
                        open: openList[index],
                    }"
                >
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
        </div>
        <div class="rule-preview-wrap">
            <vscode-text-area
                v-model="settingText"
                resize="vertical"
                class="input-rule"
                readonly
                :rows="4"
                :cols="100"
                >{{ $t('preview.rule') }}</vscode-text-area
            >
        </div>
        <div class="action-wrap">
            <div class="action-line">
                <vscode-button
                    class="action-btn"
                    :disabled="loading"
                    @click="handleCopy"
                    :title="$t('explain.copyConfig')"
                    >{{ $t('action.copyConfig')
                    }}<span slot="start" class="codicon codicon-copy"></span
                ></vscode-button>
                <vscode-button
                    class="action-btn"
                    :disabled="loading"
                    @click="handleCopySeparators"
                    :title="$t('explain.copySeparators')"
                    >{{ $t('action.copySeparators')
                    }}<span slot="start" class="codicon codicon-copy"></span
                ></vscode-button>
            </div>
            <vscode-button
                class="action-btn"
                :disabled="loading"
                @click="handleAddItem"
                >{{ $t('action.addItem')
                }}<span slot="start" class="codicon codicon-add"></span
            ></vscode-button>
        </div>
    </main>
</template>

<script lang="ts">
import { reactive, ref, onMounted } from 'vue';
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
        //
        let openList = reactive(Array(groupList.value.length).fill(true));
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
        const changeOpen = (index: number) => {
            let value = openList[index];
            openList[index] = !value;
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
        const handleDeleteItem = (groupItem: RuleGroupItem, index: number) => {
            let { id, name } = groupItem;
            sendMsg({ type: MsgType.DELETE_ITEM, value: { id, name } }).then(
                (res) => {
                    if (res.value) openList.splice(index, 1);
                }
            );
        };
        onMounted(() => {
            handleRefresh().then(() => (loading.value = false));
        });

        return {
            groupList,
            loading,
            openList,
            changeOpen,
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
    overflow: hidden;
    .loading-wrap {
        max-height: 350px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .rule-list-wrap {
        height: unset;
        flex-shrink: 1;
        flex-grow: 0;
        overflow-y: auto;
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
        margin-left: 5px;
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
        height: 0px;
        transition: all 0.6s ease;
        overflow: hidden;
        &.open {
            height: auto;
        }
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
            color: var(--button-primary-foreground);
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
        display: grid;
        grid-column-gap: 4px;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        .action-btn {
            white-space: nowrap;
        }
    }
}
</style>
