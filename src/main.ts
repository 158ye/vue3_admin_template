import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import gloablComponent from './components/index';

import './styles/index.scss'

//测试假接口
// import axios from 'axios'

// axios({
//   url:'/api/user/login',
//   method:'post',
//   data:{
//     username:'admin',
//     password:'111111'
//   }
// }).then(res=>{
//   console.log(res.data);
// })

const app = createApp(App)

// ElementPlus图标注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(gloablComponent);
app.use(router);

app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')
