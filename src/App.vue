<template>
    <!-- <div class="box"> -->
        <!-- <h1>我是App</h1>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="danger" :icon="Delete">删除按钮</el-button>
        <hr>
        <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]" :size="size" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />

        <hr> -->
        <!--svg测试-->
        <!-- <svg>
            <use xlink:href="#icon-copyright" fill="red"></use>
        </svg> -->
        <!-- <SvgIcon name="home" color="red" width="50px" height="50px"></SvgIcon> -->

        <!--scss-->
        <!-- <h2>测试代码</h2> -->
    <!-- </div> -->
     <div>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import request from './utils/request'
import {reqLogin} from './api/user'

const currentPage4 = ref(4)
const pageSize4 = ref(100)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
// console.log(import.meta.env)
onMounted(() => {
    // request({
    //     url: '/user/login',
    //     method: 'post',
    //     data: {
    //         username: 'admin',
    //         password: '111111'
    //     }
    // }).then((res) => {
    //     console.log(res)
    // })

    reqLogin({
        username: 'admin',
        password: '111111'
    }).then((res) => {
        console.log(res)
    })
})
</script>

<style scoped lang="scss">
.box {
    width: 100vm;
    height: 400px;
    background-color: #56d0e9;

    h1 {
        color: white;
    }
}

div {
    h2 {
        color: $color;
        font-size: $size;
    }
}
</style>