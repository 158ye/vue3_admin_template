export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface User {
    id?: number,
    username: string,
    password?: string,
    name: string,
    roleName?: string,
    phone?: string,
    createTime?: string,
    updateTime?: string
}
export type Records=User[]
export interface UserResponseData extends ResponseData{
    data:{
        records:Records,
        total: number,
        size:number,
        pages:number,
        current:number
    }
}

//代表一个职位的ts类型
export interface RoleData {
    "id"?: number,
    "createTime"?: string,
    "updateTime"?: string,
    "roleName": string,
    "remark": null
}
//全部职位的列表
export type AllRole = RoleData[];
//获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
    data: {
        assignRoles: AllRole,
        allRolesList: AllRole
    }
}


//给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
    "roleIdList": number[],
    "userId": number
}