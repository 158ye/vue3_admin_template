//路由鉴权，某一路由什么情况下可以访问
import router from "./router";
import nprogress from 'nprogress';
import "nprogress/nprogress.css";
nprogress.configure({showSpinner:false})

import setting from "./setting";
//引入仓库组件
import useUserStore from "./store/modules/user";
import pinia from "./store";    //必须要带pinia


let userStore = useUserStore(pinia)
//全局守卫，任意路由切换时都会触发
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    // console.log(to)
    document.title=`${setting.title} - ${to.meta.title}` 
    //to:将要访问哪个路由
    //from:从哪个路由来
    // next:路由的放行函数

    //进入条业务
    nprogress.start()

    //路由权限,如果登陆，不能再跳转至登陆页，如果未登录不能跳转至其他需登陆页面
    //全部路由组件——>登陆/404/任意路由/首页/数据大屏/权限管理(三个子路由)/商品管理(四个子路由)
    //登陆和未登录判断是否有token
    if (userStore.token) {
        //登陆成功访问login,不能访问，指向首页
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            //登陆情况下判断是否有用户信息
            if (userStore.username) {
                next()
            } else {
                //获取用户信息
                try {
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    //token过期或被手动修改
                    await userStore.userlogout()
                    next({path:'/login',query:{redirect: to.path}})
                }

            }
        }
    } else {
        //判断未登录情况
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }

    }

})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})