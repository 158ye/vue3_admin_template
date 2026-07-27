//用户登陆传递的数据类型
export interface loginFormData {
    username: string,
    password: string
}
//登陆后返回的都有的ts数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//登陆之后返回的数组
export interface loginResponseData extends ResponseData {
    data: string
}

//获取用户信息返回接口
export interface userInfoReponseData extends ResponseData {
    data: {
        avatar: string,
        name: string,
        buttons: string[],
        roles: string[],
        routes: string[]
    }
}