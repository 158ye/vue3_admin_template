<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="flag" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import { nextTick, ref, watch } from 'vue';

let LayoutSettingStore = useLayoutSettingStore()

let flag = ref(true)
watch(() => LayoutSettingStore.refsh, () => {
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})
</script>
<script lang="ts">
export default {
    name: 'Main'
}
</script>

<style scoped lang="scss">
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transition: all 1s;
}

.fade-enter-to {
    opacity: 1;
    transform: rotate(360deg);
}
</style>