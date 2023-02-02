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
                <div class="group-name-tab">
                    <vscode-tag class="group-name">{{
                        groupItem.name
                    }}</vscode-tag>
                    <div class="operation-wrap">
                        <vscode-checkbox
                            class="operation"
                            title="启用/禁用全部"
                            :checked="groupItem.checked"
                            :indeterminate="groupItem.indeterminate"
                            @click="toggleSelectAll(groupItem)"
                        ></vscode-checkbox>
                        <span
                            class="codicon codicon-edit operation"
                            title="修改配置"
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
                        >{{ separator }}</vscode-option
                    >
                </div>
                <vscode-divider></vscode-divider>
            </div>
        </template>

        <vscode-button
            class="action-btn"
            :disabled="loading"
            @click="handleCopy"
            >复制配置<span slot="start" class="codicon codicon-copy"></span
        ></vscode-button>
        <vscode-button
            class="action-btn"
            :disabled="loading"
            @click="handleRefresh"
            >添加配置<span slot="start" class="codicon codicon-refresh"></span
        ></vscode-button>
    </main>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { GroupItem } from '@ext/src/types';
import { MsgType, ExtPayload } from '@ext/src/lib/tunnelEvents';
import tunnel, { sendMsg } from '@/utils/tunnel';
import { throttle } from 'lodash';

interface RuleGroupItem extends GroupItem {
    checked: boolean;
    indeterminate: boolean;
}

type RuleGroupList = RuleGroupItem[];

export default {
    name: 'HomeView',
    setup() {
        let groupList = ref<RuleGroupList>([]);
        let wordSeparators = ref<string>('');
        let loading = ref<boolean>(true);

        let selectedSet = computed(() => new Set([...wordSeparators.value]));

        const extMsgHandler = (msg: ExtPayload) => {
            if (msg.type === 'setting') {
                let { rule, group } = msg.value;
                wordSeparators.value = rule;
                groupList.value = group.map((i) => {
                    let checkedLength = i.separators.filter((separator) =>
                        selectedSet.value.has(separator)
                    ).length;
                    let checked = checkedLength === i.separators.length;
                    let indeterminate = !checked && !!checkedLength;
                    return { ...i, checked, indeterminate };
                });
            }
        };
        const handleRefresh = () => {
            return sendMsg({ type: MsgType.SETTING });
        };
        const handleCopy = () => {
            sendMsg({ type: MsgType.COPY_SETTING });
        };
        const toggleSelected = throttle((separator: string) => {
            let isInclude = selectedSet.value.has(separator);
            let set = new Set(selectedSet.value);
            if (isInclude) {
                set.delete(separator);
            } else {
                set.add(separator);
            }
            sendMsg({ type: MsgType.SAVE_RULE, value: [...set].join('') }).then(
                (res) => {
                    res.value && handleRefresh();
                }
            );
        }, 17);
        const toggleSelectAll = throttle((groupItem: RuleGroupItem) => {
            let checked = groupItem.checked || groupItem.indeterminate;
            sendMsg({
                type: MsgType.TOGGLE_ITEM_CHECKED,
                value: {
                    checked: !checked,
                    separators: groupItem.separators.join(''),
                },
            }).then((res) => {
                if (res.value) handleRefresh();
            });
        });

        onMounted(() => {
            handleRefresh().then(() => {
                loading.value = false;
            });
            tunnel.on('extMsg', extMsgHandler);
        });

        onUnmounted(() => {
            tunnel.off('extMsg', extMsgHandler);
        });

        return {
            groupList,
            selectedSet,
            loading,
            handleRefresh,
            handleCopy,
            toggleSelected,
            toggleSelectAll,
        };
    },
};
</script>
<style lang="scss">
.main-box {
    width: 100%;
    height: 100%;
    max-width: 500px;
    min-width: 200px;
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
    }
    .operation-wrap {
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
        flex-shrink: 0;
    }
    .option-wrap {
        display: flex;
        flex-wrap: wrap;
        margin-right: -8px;
    }
    .option-item {
        margin-right: 8px;
        margin-bottom: 4px;
        min-width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--type-ramp-plus1-font-size);
        border-radius: 2px;
        &.selected {
            background: var(--button-primary-background);
        }
    }
    .action-btn {
        margin-bottom: 10px;
    }
}
</style>
