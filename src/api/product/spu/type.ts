export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//获取已有spu所有数据
export interface recordsValue {
    id?: number//spuId
    tmId: number | string//品牌Id
    category3Id: number | string//三级Id
    spuName: string //spu名称 
    description: string //spu描述
    spuImageList?: null|image
    spuSaleAttrList?: null|saleAttrList
}
export type records = recordsValue[]

export interface SpuResponseData extends ResponseData {
    data: {
        records: records
        pages: number
        size: number
        total: number
    }
}

//获取品牌所有数据
export interface branddataValue {
    id: number,
    tmName: string,
    logoUrl: string,
}
export type branddata = branddataValue[]
export interface brandResponseData extends ResponseData {
    data: branddata
}

//获取已有照片墙数据
export interface imageValue {
    id?: number,
    imgName?: string,
    imgUrl?: string,
    spuId?: number,//这个商品的id
    name?: string,
    url?: string
}
export type image = imageValue[]
export interface imageResponseData extends ResponseData {
    data: image
}

//获取已有销售属性列表
export interface spuSaleAttrValueListValue {
    baseSaleAttrId: number | string,
    id?: number,
    saleAttrValueName: string,
    spuId?: number

}
export type spuSaleAttrValueList = spuSaleAttrValueListValue[]
export interface saleAttrListValue {
    id?: number,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList?: spuSaleAttrValueList
    flag?: boolean
    saleAttrValue?: string
}
export type saleAttrList = saleAttrListValue[]
export interface saleAttrListResponseData extends ResponseData {
    data: saleAttrList
}

//获取全部销售属性数据
export interface baseSaleAttrList {
    id: number,
    name: string,
}
export interface baseSaleAttrListResponseData extends ResponseData {
    data: baseSaleAttrList[]
}