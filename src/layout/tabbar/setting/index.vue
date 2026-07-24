<template>
    <!-- 顶部右侧 -->
    <el-button icon="Refresh" circle @click="updaterefsh" />
    <el-button icon="FullScreen" circle @click="fullScreen" />
    <el-button icon="Setting" circle />
    <img :src="userStore.avatar" alt="" style="width: 24px; height: 24px; margin: 0 10px;border-radius: 50%;" />
    <el-dropdown>
        <span class="el-dropdown-link">
            {{userStore.username}}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user';
import { useRouter,useRoute } from 'vue-router';

let $router=useRouter()
let $route=useRoute()
let userStore= useUserStore()
let LayoutSettingStore = useLayoutSettingStore()

//刷新
const updaterefsh = () => {
    LayoutSettingStore.refsh = !LayoutSettingStore.refsh
}
//全屏
const fullScreen = () => {
    let full = document.fullscreenElement
    if (!full) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}
//退出登陆
const logout=()=>{
    userStore.userlogout()
    $router.push({path:'/login',query:{redirect: $route.path}})
}
</script>
<script lang="ts">
export default {
    name: 'Setting'
}
</script>

<style scoped lang="scss">
.el-button {
    background: white;
}
</style>