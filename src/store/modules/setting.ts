import {defineStore} from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore',{
    state:()=>{
        return{
            fold:false, //用于控制顶部导航折叠
            refsh:false, //用于控制刷新
        }
    }
})

export default useLayoutSettingStore