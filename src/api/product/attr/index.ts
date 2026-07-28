import request from "@/utils/request";
import type {CategoryResponseData,AttrResponseData,Attr} from './type'

enum API {
    //一级分类接口
    C1_URL = '/admin/product/getCategory1',
    //二级分类接口
    C2_URL = '/admin/product/getCategory2/',
    //三级分类接口
    C3_URL = '/admin/product/getCategory3/',
    //展示已有属性接口
    ATTR_URL='/admin/product/attrInfoList/',
    //新增或修改属性
    ADDORUPDATE_URL='/admin/product/saveAttrInfo',
    //删除
    DELETE_URL='/admin/product/deleteAttr/'
}

//获取一级分类数据
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
//获取二级分类数据
export const reqC2 = (category1Id: number|string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
//获取三级分类数据
export const reqC3 = (category2Id: number|string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
//获取已有属性数据
export const reqAttr=(category1Id: number|string,category2Id: number|string,category3Id: number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
//添加或修改属性
export const reqAddOrUpdateAttr=(data:Attr)=>request.post<any,any>(API.ADDORUPDATE_URL,data)
//删除
export const reqDeleteAttr=(attrId:number)=>request.delete<any,any>(API.DELETE_URL+attrId)