<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider">
            <Logo></Logo>
            <!-- 展示菜单内容 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <el-menu background-color="#001529" text-color="white" :default-active="$route.path" :collapse="LayoutSettingStore.fold ? true : false">
                    <Menu :menuList="useStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航栏 -->
        <div class="layout_tabbar" :class="{fold:LayoutSettingStore.fold ? true : false}">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容区域 -->
        <div class="layout_main" :class="{fold:LayoutSettingStore.fold ? true : false}">
            <Main></Main>
        </div>
    </div>
</template>
<script setup lang="ts">
//引入左侧菜单logo子组件
import Logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//引入顶部tabbar组件
import Tabbar from './tabbar/index.vue'
//获取用户相关仓库
import useUserStore from '@/store/modules/user.ts';
//引入右侧内容展示区域
import Main from './main/index.vue'
//获取路由对象
import { useRoute } from 'vue-router';
import useLayoutSettingStore from '@/store/modules/setting.ts';

let LayoutSettingStore=useLayoutSettingStore()
let useStore = useUserStore()
let $route = useRoute()
// console.log($route.path)
</script>
<script lang="ts">
export default{
    name:'Layout'
}
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        color: $base-menu-color;
        background: $base-menu-background;
        transition: all .3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height);

            .el-menu {
                border-right: none;
            }
        }
    }

    .layout_tabbar {
        position: fixed;
        left: $base-menu-width;
        top: 0;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        background: skyblue;
        transition: all .3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        left: $base-menu-width;
        top: $base-tabbar-height;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        padding: 20px;
        overflow: auto;
        background: green;
        transition: all .3s;
        &.fold{
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>