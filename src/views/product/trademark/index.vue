<template>
    <el-card>
        <!-- 按钮 -->
        <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
        <!-- 表格 -->
        <el-table border :data="trademarkArr">
            <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称">
                <template #="{ row, $index }">
                    <span>{{ row.tmName }}</span>
                    <!-- <span>{{ $index }}</span> -->
                </template>
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template #="{ row, $index }">
                    <img :src="row.logoUrl" />
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="Edit" @click="updateTrademark(row)" />
                    <el-popconfirm :title="`确定要删除${row.tmName}吗?`" icon="Delete" width="200px"
                        @confirm="deleteTrademark(row.id)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" />
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" background
            layout="prev, pager, next, jumper,->,total, sizes," :total="total" @current-change="getHasTrademark" ,
            @size-change="sizeChange" />
    </el-card>

    <!-- 对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
        <el-form style="width: 80%;" :rules="rules" :model="trademarkParams" ref="formRef">
            <el-form-item label="品牌名称" label-width="90px" prop="tmName">
                <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="90px" prop="logoUrl">
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="cancel">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { TradeMarkResponseData, Recodrs, TradeMark } from '@/api/product/trademark/type'

//当前页码
let pageNo = ref<number>(1)
//每页多少条数据
let limit = ref<number>(3)
//总条数
let total = ref<number>(0)
//品牌数据
let trademarkArr = ref<Recodrs>([])
//对话框的显示隐藏
const dialogFormVisible = ref(false)
//收集添加新的品牌数据
let trademarkParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: '',
})
//获取el-form组件实例
let formRef = ref()
//获取品牌管理数据
const getHasTrademark = async (pager = 1) => {
    pageNo.value = pager
    let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
    // console.log("获取品牌管理数据",result)
    if (result.code == 200) {
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }
}
onMounted(() => {
    getHasTrademark()
})

//改变每页条数时触发
const sizeChange = () => {
    // pageNo.value=1
    getHasTrademark()
}
//添加品牌
const addTrademark = () => {
    dialogFormVisible.value = true
    trademarkParams.id = 0
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''

    //第一种写法
    // formRef.value?.clearValidate('tmName')
    // formRef.value?.clearValidate('logoUrl')
    nextTick(() => {
        formRef.value?.clearValidate('tmName')
        formRef.value?.clearValidate('logoUrl')
    })
}
//编辑
const updateTrademark = (row: TradeMark) => {
    nextTick(() => {
        formRef.value?.clearValidate('tmName')
        formRef.value?.clearValidate('logoUrl')
    })
    dialogFormVisible.value = true
    // console.log(row)
    // trademarkParams.id = row.id
    // trademarkParams.tmName = row.tmName
    // trademarkParams.logoUrl =row.logoUrl
    Object.assign(trademarkParams, row)
}
//取消
const cancel = () => {
    dialogFormVisible.value = false
}
//确定
const confirm = async () => {
    await formRef.value.validate();
    let result: any = await reqAddOrUpdateTrademark(trademarkParams)
    // console.log("添加或修改品牌数据", result)
    if (result.code == 200) {
        dialogFormVisible.value = false
        ElMessage({
            type: 'success',
            message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        })
        getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    } else {
        ElMessage({
            type: 'error',
            message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        })
        getHasTrademark()
    }
}

//图片上传成功之前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage.error({
                type: 'error',
                message: '上传文件大小小于4'
            })
        }
    } else {
        ElMessage.error({
            type: 'error',
            message: '上传文件格式务必JPG|PNG|GIF'
        })
        return false
    }
}
//	文件上传成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    //    console.log(response)
    trademarkParams.logoUrl = response.data
    formRef.value.clearValidate('logoUrl')
}

//自定义校验规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('品牌名称位数大于等于两位'))
    }
}
const validatorlogoUrl = (rule: any, value: any, callBack: any) => {
    if (value) {
        callBack()
    } else {
        callBack(new Error('LOGO图片务必上传'))
    }
}
//表单校验规则
const rules = {
    //required——>必须校验
    //trigger校验触发时机——>blur，change
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorlogoUrl }
    ]
}
//删除
const deleteTrademark = async (id: number) => {
    let result = await reqDeleteTrademark(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value-1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}
</script>
<script lang="ts">
export default {
    name: 'trademark'
}
</script>
<style scoped lang="scss">
.el-table {
    margin: 10px 0;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>