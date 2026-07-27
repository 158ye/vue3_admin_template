export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface TradeMark {
    id?: number,
    tmName: string,
    logoUrl: string
}

export type Recodrs = TradeMark[]

export interface TradeMarkResponseData extends ResponseData {
    data: {
        records: Recodrs,
        current: number,    //当前页数
        pages: number,  //一共多少页
        searchCount: boolean,
        size: number,   //每页多少条数据
        total: number   //总条数
    }
}