<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login-form" :model="form" :rules="rules" ref="ruleFormRef">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input v-model="form.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login-btn" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter,useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

const userStore = useUserStore()
const $router = useRouter()
let $route=useRoute()

let ruleFormRef = ref()
const loading = ref(false)
const form = reactive({
    username: 'admin',
    password: '111111'
})

const login = async () => {
    //保证表单校验通过后再发请求
    const isValid = await ruleFormRef.value.validate()
    if (!isValid) return
    // console.log('isValid', isValid)

    loading.value = true
    try {
        await userStore.userLogin(form)
        // console.log(result)
        let redirect:any = $route.query.redirect
        $router.push({path:redirect||'/'})
        //登陆成功提示信息
        ElNotification({
            title: `Hi,${getTime()}`,
            message: '欢迎回来',
            type: 'success',
        })
        loading.value = false
    } catch (error) {
        loading.value = false
        //登陆失败提示信息
        ElNotification({
            title: '登录失败',
            message: (error as Error).message,
            type: 'error',
        })
        // console.error(error)
    }
}

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 12, message: '长度在 3 ~ 12 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 ~ 20 个字符', trigger: 'blur' }
    ]
})
</script>
<script lang="ts">
export default{
    name:'Login'
}
</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login-form {
        position: relative;
        width: 80%;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 40px;

        h1 {
            font-size: 40px;
            color: #fff
        }

        h2 {
            font-size: 20px;
            color: #fff;
            margin: 20px 0;
        }

        .login-btn {
            width: 100%;
            background-color: #409eff;

        }
    }
}
</style>