<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="用户名">
                <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="keyword ? false : true" @click="getUserList()">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card>
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button type="primary" @click="deleteSelectUser"
            :disabled="selectIdArr.length ? false : true">批量删除</el-button>
        <el-table style="margin: 10px 0;" border :data="userArr" @selection-change="selectChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="用户名字" prop="username"></el-table-column>
            <el-table-column label="用户昵称" prop="name"></el-table-column>
            <el-table-column label="用户角色" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="320px">
                <template #="{ row, $index }">
                    <el-button type="primary" icon=User @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}?`" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @size-change="handler"
            @current-change="getUserList" />
    </el-card>

    <!-- 添加或编辑 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
        </template>
        <template #default>
            <el-form label-width="80px" ref="formRef" :model="userParams" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input placeholder="请输入用户名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请输入密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>

    <!-- 分配角色 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input placeholder="请输入用户姓名" v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqRemoveUser, reqSelectUser, reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';

//默认页码
let pageNo = ref<number>(1)
//默认每页条数
let pageSize = ref<number>(5)
//总条数
let total = ref<number>(0)
//存储用户列表
let userArr = ref<Records>([])
//控制添加或编辑显示隐藏
let drawer = ref<boolean>(false)
//控制分配角色的显示隐藏
let drawer1 = ref<boolean>(false)
//存储全部职位的数据
let allRole = ref<AllRole>([]);
//当前用户已有的职位
let userRole = ref<AllRole>([]);
//添加时获取数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
let formRef = ref()
//批量删除数据
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([]);
//存放搜索的内容
let keyword = ref<string>('')
onMounted(() => {
    getUserList()
})
//获取用户列表
const getUserList = async (pager = 1) => {
    pageNo.value = pager
    const res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
    // console.log(res)
    if (res.code == 200) {
        userArr.value = res.data.records
        total.value = res.data.total
    }
}
//页码改变
const handler = () => {
    // console.log(val)
    // pageSize.value = val
    getUserList()
}

//添加用户
const addUser = () => {
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
//编辑用户
const updateUser = (row: any) => {
    // console.log(row)
    drawer.value = true
    Object.assign(userParams, row);
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })
}

//保存
const save = async () => {
    await formRef.value.validate()
    let result: any = await reqAddOrUpdateUser(userParams)
    if (result.code == 200) {
        drawer.value = false
        ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' });
        // getUserList(userParams.id ? pageNo.value : 1)
        //浏览器自动刷新一次
        window.location.reload();
    } else {
        drawer.value = false;
        ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' });
    }
}
//取消按钮的回调
const cancel = () => {
    //关闭抽屉
    drawer.value = false;
}
//校验
const validatorUsername = (rule: any, value: any, callback: any) => {
    if (value.trim().length < 5) {
        callback(new Error('用户名长度不能小于5位'))
    } else {
        callback()
    }
}
const validatorName = (rule: any, value: any, callback: any) => {
    if (value.trim().length < 2) {
        callback(new Error('用户昵称长度不能小于2位'))
    } else {
        callback()
    }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
    if (value.trim().length < 6) {
        callback(new Error('密码长度不能小于6位'))
    } else {
        callback()
    }
}
//规则校验
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

//分配角色
const setRole = async (row: any) => {
    //获取数据信息
    Object.assign(userParams, row)
    let result = await reqAllRole((userParams.id as number))
    // console.log(result)
    if (result.code == 200) {
        allRole.value = result.data.allRolesList
        userRole.value = result.data.assignRoles
        drawer1.value = true
    }


}
const checkAll = ref(false)
const isIndeterminate = ref(true)
//全选
const handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}
//单选
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
//取消
const cancelClick = () => {
    drawer1.value = false
}
//确定
const confirmClick = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: userParams.id as number,
        roleIdList: userRole.value.map((item: any) => item.id)
    }
    //调用接口分配权限
    let result: any = await reqSetUserRole(data)
    // console.log(result)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '分配角色成功' })
        drawer1.value = false
        getUserList(pageNo.value)
    } else {
        ElMessage({ type: 'error', message: '分配角色失败' })
    }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
    let result: any = await reqRemoveUser(userId)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getUserList(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({ type: 'error', message: '删除失败' })
    }
}
//table组件下复选框发生改变时
const selectChange = (value: any) => {
    selectIdArr.value = value
}
//批量删除
const deleteSelectUser = async () => {
    let idList: any = selectIdArr.value.map(item => {
        return item.id
    })
    let result: any = await reqSelectUser(idList)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '批量删除成功' })
        getUserList(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({ type: 'error', message: '批量删除失败' })
    }
}

//搜索
// const search=()=>{
//     getUserList()
// }
//重置
const reset=()=>{
    keyword.value=''
    getUserList()
}
</script>
<script lang="ts">
export default {
    name: 'User'
}
</script>

<style scoped lang="scss">
.form {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>