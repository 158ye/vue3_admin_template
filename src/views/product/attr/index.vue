<template>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0;">
        <div v-show="scene == 0">
            <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                @click="addAttr">添加属性</el-button>
            <el-table style="margin: 10px 0;" border :data="attrArr">
                <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="属性名称" width="180px" prop="attrName"></el-table-column>
                <el-table-column label="属性值名称">
                    <template #="{ row, index }">
                        <el-tag v-for="(item, index) in row.attrValueList" :key="item.id" type="primary"
                            style="margin: 5px;">{{ item.valueName }}</el-tag>
                    </template>
                </el-table-column>index
                <el-table-column label="操作" width="180px">
                    <template #="{ row, $index }">
                        <el-button type="primary" icon="Edit" size="small" @click="updateAttr(row)" />
                        <el-popconfirm :title="`你确定要删除${row.attrName}吗?`" @confirm="DeleteAttr(row.id)" width="200px">
                            <template #reference>
                                <el-button type="danger" icon="Delete" size="small" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-show="scene==1">
            <el-form :inline="true">
                <el-form-item label="属性名称">
                    <el-input v-model="attrParams.attrName" placeholder="请输入属性名称"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
                icon="Plus">添加属性值</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
            <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                <el-table-column label="属性值">
                    <template #="{ row, $index }">
                        <el-input :ref="(vc: any) => inputArr[$index] = vc" @blur="toLook(row, $index)" v-if="row.flag"
                            placeholder="请输入属性值" v-model="row.valueName"></el-input>
                        <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #="{ row, $index }">
                        <el-button type="danger" icon="Delete" @click="attrParams.attrValueList.splice($index, 1)" />
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="save"
                :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </div>
    </el-card>
</template>
<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
import type { AttrResponseData, AttrList, Attr, AttrValue } from '@/api/product/attr/type'
import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()
let attrArr = ref<AttrList>([])
const scene = ref<number>(0)
//新增属性的参数
let attrParams = reactive<Attr>({
    attrName: "",
    categoryId: '', //三级分类Id
    categoryLevel: 3, //固定为3，代表三级分类
    attrValueList: [],
})
let inputArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()
})
onBeforeUnmount(() => {
    //清空属性管理的仓库数据
    categoryStore.$reset()
})
//获取已有属性数据
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    // console.log("已有属性数据", result)
    if (result.code == 200) {
        attrArr.value = result.data
    }
}

//添加属性
const addAttr = () => {
    Object.assign(attrParams, {
        attrName: "",
        categoryId: categoryStore.c3Id, //三级分类Id
        categoryLevel: 3, //固定为3，代表三级分类
        attrValueList: []
    })
    scene.value = 1
    // console.log(attrParams.categoryId)
}
//修改属性
const updateAttr = (row: Attr) => {
    scene.value = 1
    // console.log(row)
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//删除
const DeleteAttr = async (id: number) => {
    let result: any = await reqDeleteAttr(id)
    // console.log(result)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
//添加属性值
const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '',
        flag: true  //控制是否是输入框
    })
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}
//保存
const save = async () => {
    let result: any = await reqAddOrUpdateAttr(attrParams)
    // console.log(result)
    if (result.code == 200) {
        scene.value = 0
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改属性成功' : '添加属性成功'
        })
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改属性失败' : '添加属性失败'
        })
    }
}
//取消
const cancel = () => {
    scene.value = 0
}
//输入框失去焦点
const toLook = (row: AttrValue, $index: number) => {
    //1.非法情况——>如果输入框没有输入或是空格
    if (row.valueName.trim() == '') {
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '请输入属性值'
        })
    }
    //2.非法情况——>如果重复出现相同属性值
    let repeat = attrParams.attrValueList.find((item) => {
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        attrParams.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能重复'
        })
        return
    }

    row.flag = false
}
//输入框重新获取焦点
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}
</script>
<script lang="ts">
export default {
    name: 'Attr'
}
</script>

<style scoped lang="scss"></style>