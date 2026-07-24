<template>
    <!-- 顶部左侧 -->
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
        <!-- <Expand></Expand> -->
    </el-icon>
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包屑路由展示图标和标题 -->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <!-- 展示图标 -->
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <!-- 面包屑展示路由标题 -->
            <span style="margin: 0 5px;">{{ item.meta.title }}</span>

        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router';

let $route = useRoute()
// console.log($route)
let LayoutSettingStore = useLayoutSettingStore()

const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold
}
</script>
<script lang="ts">
export default {
    name: 'Breadcrumb'
}
</script>

<style scoped lang="scss"></style>