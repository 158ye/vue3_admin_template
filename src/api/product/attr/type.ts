export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface CategoryObj {
    id: number | string,
    name: string,
    category1Id?: number,
    cateegory2Id?: number
}

export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

//已有属性数据的ts类型
export interface AttrValue {
    attrId?: number
    id?: number
    valueName: string,
    flag:boolean
}
export type attrValueList = AttrValue[]

export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number|string,  //三级分类Id
    categoryLevel: number, //固定为3，代表三级分类
    attrValueList: attrValueList,
}
export type AttrList =Attr[] 
//返回接口数据
export interface AttrResponseData extends ResponseData{
    data:AttrList
}