<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input placeholder="请输入职位" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
        <el-table border style="margin: 10px 0;" :data="allRole">
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id" width="80px"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
                <template #="{ row, $index }">
                    <el-button type="primary" @click="setPermisstion(row)">分配权限</el-button>
                    <el-button type="primary" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9]"
            :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total"
            @size-change="handleSizeChange" @current-change="getHasRole" />
    </el-card>
    <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'" width="500">
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input v-model="RoleParams.roleName" placeholder="请输入职位名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确认</el-button>
            </div>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配菜单与按钮的权限</h4>
        </template>
        <template #default>
            <!-- 树形控件 -->
            <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>

</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/api/acl/role'
import type { Records, RoleData, MenuResponseData } from '@/api/acl/role/type'

//页码
let pageNo = ref<number>(1)
//每页多少条数据
let pageSize = ref<number>(5)
//搜索职位关键字
let keyword = ref<string>('');
//存储全部已有的职位
let allRole = ref<Records>([]);
//总条数
let total = ref<number>(0)
//控制对话框显示隐藏
const dialogVisible = ref(false)
//获取form组件实例
let form = ref<any>();
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: ''
})
//分配角色
let drawer = ref(false)
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([]);
//定义数组存储用户权限的数据
let menuArr = ref<any>([]);
//获取tree组件实例
let tree = ref<any>();
onMounted(() => {
    getHasRole()
})
//获取页面数据
const getHasRole = async (pager = 1) => {
    pageNo.value = pager
    let result = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    // console.log(result)
    if (result.code == 200) {
        allRole.value = result.data.records
        total.value = result.data.total
    }
}
//每页多少条数据
const handleSizeChange = () => {
    getHasRole()
}
//点击添加
const addRole = () => {
    dialogVisible.value = true
    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    })
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
//编辑
const updateRole = (row: any) => {
    dialogVisible.value = true
    Object.assign(RoleParams, row)
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

//自定义回调校验
const validatorRoleName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('职位名称至少两位'))
    }
}
//校验
const rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }]
}
//点击确认
const save = async () => {
    await form.value.validate()
    let result: any = await reqAddOrUpdateRole(RoleParams)
    console.log(result)
    if (result.code == 200) {
        //提示文字
        ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' });
        //对话框显示
        dialogVisible.value = false;
        //再次获取全部的已有的职位
        getHasRole(RoleParams.id ? pageNo.value : 1);
    }
}
//搜索
const search = () => {
    getHasRole()
}
//重置
const reset = () => {
    keyword.value = ''
    getHasRole()
}
//分配角色,已有的职位的数据
const setPermisstion = async (row: RoleData) => {
    drawer.value = true
    //收集当前要分类权限的职位的数据
    Object.assign(RoleParams, row);
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number));
    if (result.code == 200) {
        menuArr.value = result.data;
        selectArr.value = filterSelectArr(menuArr.value, []);
    }
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 3) {
            initArr.push(item.id);
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr);
        }
    });
    return initArr
}

//分配角色确定
const confirmClick = async () => {
    //职位的ID
    const roleId = (RoleParams.id as number);
    //选中节点的ID
    let arr = tree.value.getCheckedKeys();
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys();
    //合并选中的节点ID和半选ID
    let permissionId = arr.concat(arr1);
    //下发权限
    let result: any = await reqSetPermisstion(roleId, permissionId);
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false;
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' });
        //页面刷新
        window.location.reload();
    }
}
//树形控件的测试数据
const defaultProps = {
    children: 'children',
    label: 'name',
}
//删除
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' });
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}
</script>
<script lang="ts">
export default {
    name: 'Role'
}
</script>
<style scoped lang="scss">
.form {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>