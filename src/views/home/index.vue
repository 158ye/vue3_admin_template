<template>
    <div>
        <h1>展示登陆成功</h1>
        <img :src="userStore.avatar" alt="">
        <h2>{{ userStore.username }}</h2>
    </div>
</template>
<script setup lang="ts">
    import { onMounted } from 'vue';
    import useUserStore from '@/store/modules/user';

    let userStore = useUserStore()
    onMounted(()=>{
        userStore.userInfo()
    })
</script>
<script lang="ts">
export default{
    name:'Home'
}
</script>

<style scoped lang="scss">
</style>
