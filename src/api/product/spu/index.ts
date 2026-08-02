import request from "@/utils/request";
import type { recordsValue, SpuResponseData, brandResponseData, imageResponseData, saleAttrListResponseData, baseSaleAttrListResponseData } from './type'

enum API {
    HASSPU_URL = '/admin/product/',
    HASTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    HASIMAGE_URL = '/admin/product/spuImageList/',
    HASSPUSALEATTRLIST_URL = '/admin/product/spuSaleAttrList/',
    HASBASESALEATTRLIST_URL = '/admin/product/baseSaleAttrList',
    //追加一个新的SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //更新已有的SPU
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    //追加一个新增的SKU地址
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    //查看某一个已有的SPU下全部售卖的商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
    //删除已有的SPU
    REMOVESPU_URL = '/admin/product/deleteSpu/'
}
//获取spu已有数据
export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, SpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
//获取品牌所以数据
export const reqHasTrademark = () => request.get<any, brandResponseData>(API.HASTRADEMARK_URL)
//获取照片墙数据
export const reqImage = (spuId: number) => request.get<any, imageResponseData>(API.HASIMAGE_URL + spuId)
//获取销售属性列表接口
export const reqSaleAttrList = (spuId: number) => request.get<any, saleAttrListResponseData>(API.HASSPUSALEATTRLIST_URL + spuId)
//获取所有销售列表
export const reqBaseSaleAttrList = () => request.get<any, baseSaleAttrListResponseData>(API.HASBASESALEATTRLIST_URL)
//新增或修改SPU
export const reqAddOrUpdateSpu = (data: recordsValue) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}
//添加SKU的请求方法
export const reqAddSku = (data: any) => request.post<any, any>(API.ADDSKU_URL, data);
//获取SKU数据
export const reqSkuList = (spuId: number | string) => request.get<any, any>(API.SKUINFO_URL + spuId)
//删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)