import request from "@/utils/request";

enum API {
    //获取sku数据接口
    SKU_URL = '/admin/product/list/',
    //上架
    SALE_URL = '/admin/product/onSale/',
    //下架的接口
    CANCELSALE_URL = '/admin/product/cancelSale/',
    //删除
    DELETESKU_URL = '/admin/product/deleteSku/'
}

//获取sku数据
export const reqSkuList = (page: number, limit: number) => request.get<any, any>(API.SKU_URL + `${page}/${limit}`)
//上架
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
//下架
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
//删除
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)