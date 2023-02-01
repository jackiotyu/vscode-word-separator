<template>
    <main class="main-box">
        <div
            class="rule-group-item"
            v-for="groupItem in groupList"
            :key="groupItem.name"
        >
            <div class="group-name-tab">
                <vscode-tag class="group-name">{{ groupItem.name }}</vscode-tag>
                <div class="btn-wrap">
                    <vscode-checkbox></vscode-checkbox>
                    <span class="codicon codicon-add"></span>
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

        <vscode-button class="action-btn" @click="handleCopy"
            >复制<span slot="start" class="codicon codicon-copy"></span
        ></vscode-button>
        <vscode-button class="action-btn" @click="handleRefresh"
            >刷新<span slot="start" class="codicon codicon-refresh"></span
        ></vscode-button>
    </main>
</template>

<script lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { GroupListType } from '@ext/src/types';
import { MsgType, ExtPayload } from '@ext/src/lib/tunnelEvents';
import tunnel, { sendMsg } from '@/utils/tunnel';
import { throttle } from 'lodash';

export default {
    name: 'HomeView',
    setup() {
        let groupList = ref<GroupListType>([]);
        let wordSeparators = ref<string>('');

        let selectedSet = computed(() => new Set([...wordSeparators.value]));

        const extMsgHandler = (msg: ExtPayload) => {
            if (msg.type === 'setting') {
                let { rule, group } = msg.value;
                groupList.value = group;
                wordSeparators.value = rule;
            }
        };
        const handleRefresh = () => {
            sendMsg({ type: MsgType.SETTING });
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
                (res) => res.value && handleRefresh()
            );
        }, 17);

        onMounted(() => {
            handleRefresh();
            tunnel.on('extMsg', extMsgHandler);
        });

        onUnmounted(() => {
            tunnel.off('extMsg', extMsgHandler);
        });

        return {
            groupList,
            selectedSet,
            handleRefresh,
            handleCopy,
            toggleSelected,
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
    .btn-wrap {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
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
