import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './types/types'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/router'
import type {loginFormData,loginResponseData,userInfoReponseData} from '@/api/user/type'

const useUserStore = defineStore('user', {
    //存放数据
    state: (): UserState => {
        return {
            // token: localStorage.getItem('token') || '',
            token: GET_TOKEN(), //用户唯一标识token
            menuRoutes: constantRoute, //存储菜单需要数组
            username: '',
            avatar: '',
        }
    },

    //逻辑处理
    actions: {
        //用户登陆
        async userLogin(data: loginFormData) {
            let result: loginResponseData = await reqLogin(data)
            // console.log(result)
            if (result.code == 200) {
                this.token = (result.data as string)
                // localStorage.setItem('token', (result.data.token as string))
                SET_TOKEN((result.data as string))
            } else {
                return Promise.reject(new Error(result.message));
            }

        },
        //获取用户信息
        async userInfo() {
            let result: userInfoReponseData = await reqUserInfo()
            // console.log(result)
            if (result.code == 200) {
                this.username = result.data.name,
                    this.avatar = result.data.avatar
                // console.log("获取数据成功",result.code)
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //退出登陆
        async userlogout() {
            let result: any = await reqLogout()
            if (result.code == 200) {
                this.token = '',
                    this.username = '',
                    this.avatar = ''
                REMOVE_TOKEN()
            } else {
                return Promise.reject(new Error(result.message))
            }

        }
    },

    //计算属性
    getters: {

    }
})

export default useUserStore 