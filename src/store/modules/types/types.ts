import type { RouteRecordRaw } from "vue-router";
import type {CategoryObj} from '@/api/product/attr/type'
//定义仓库state的类型
export interface UserState{
    token:string | null;
    menuRoutes:RouteRecordRaw[],
    username:string,
    avatar:string,
}

export interface CategoryStata{
    c1Id:string|number,
    c1Arr:CategoryObj[],
    c2Id:string|number,
    c2Arr:CategoryObj[],
    c3Id:string|number,
    c3Arr:CategoryObj[],
}