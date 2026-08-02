<template>
    <el-form label-width="120px">
        <el-form-item label="spu名称">
            <el-input placeholder="请输入spu名称" v-model="spuList.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="选择品牌" style="width: 200px;" v-model="spuList.tmId">
                <el-option v-for="(item, index) in brandData" :key="item.id" :label="item.tmName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" v-model="spuList.description" />
        </el-form-item>
        <el-form-item label="SPU照片墙">
            <el-upload v-model:file-list="image" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select v-model="unsaleAttrValue"
                :placeholder="unsaleAttrList.length ? `还有未选择${unsaleAttrList.length}个` : '无'" style="width: 200px;">
                <el-option :label="item.name" v-for="item in unsaleAttrList" :key="item.id"
                    :value="`${item.id}:${item.name}`" />
            </el-select>
            <el-button :disabled="unsaleAttrValue ? false : true" type="primary" icon="Plus" style="margin: 0 10px;"
                @click="addSaleAttr">添加销售属性</el-button>
            <el-table border style="margin: 10px 0;" :data="saleAttrList">
                <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                <el-table-column label="销售属性名字" prop="saleAttrName" width="120px"></el-table-column>
                <el-table-column label="销售属性值" prop="saleAttrValueName">
                    <template #="{ row, index }">
                        <el-tag @close="row.spuSaleAttrValueList.splice(tagindex, 1)" style="margin: 0 5px;"
                            type="primary" v-for="(item, tagindex) in row.spuSaleAttrValueList" :key="item.id"
                            closable>{{ item.saleAttrValueName }}</el-tag>
                        <el-input v-model="row.saleAttrValue" @blur="toLook(row, index)" v-if="row.flag" size="small"
                            style="width: 100px;"></el-input>
                        <el-button v-else @click="toEdit(row)" type="primary" icon="Plus" size="small"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template #="{ row, index }">
                        <el-button type="danger" icon="Delete" size="small" @click="saleAttrList.splice(index, 1)" />
                    </template>
                </el-table-column>
            </el-table>
            <el-button :disabled="saleAttrList.length > 0 ? false : true" type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts" setup>
import { reqHasTrademark, reqImage, reqSaleAttrList, reqBaseSaleAttrList, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { spuSaleAttrValueListValue, saleAttrListValue, recordsValue, brandResponseData, branddata, imageResponseData, image, saleAttrListResponseData, saleAttrList, baseSaleAttrListResponseData, baseSaleAttrList } from '@/api/product/spu/type'
import { computed, ref } from 'vue';
import { ElMessage, type UploadProps } from 'element-plus'

let $emit = defineEmits(['changeScene'])
//存储基本数据
let spuList = ref<recordsValue>({
    tmId: '',//品牌Id
    category3Id: '',//三级Id
    spuName: '', //spu名称 
    description: '', //spu描述
    spuImageList: [],
    spuSaleAttrList: []
})
//存储所有品牌数据
let brandData = ref<branddata>([])
//存储已有照片墙数据
let image = ref<image>([])
//获取已有销售属性数据
let saleAttrList = ref<saleAttrList>([])
//获取全部销售属性
let basesaleAttrList = ref<baseSaleAttrList[]>([])
//还未中的销售属性
let unsaleAttrValue = ref<string>('')
//保存
const save = async () => {
    spuList.value.spuImageList = image.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    spuList.value.spuSaleAttrList = saleAttrList.value
    let result = await reqAddOrUpdateSpu(spuList.value)
    console.log(result)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: spuList.value.id ? '更新成功' : '添加成功'
        })
        $emit('changeScene', { flag: 0, params: spuList.value.id ? 'update' : 'add' })
    } else {
        ElMessage({
            type: 'error',
            message: spuList.value.id ? '更新失败' : '添加失败'
        })
    }
}
//取消
const cancel = () => {
    $emit('changeScene', { flag: 0, params: spuList.value.id ? 'update' : 'add' })
}

const initHasSpuData = async (spu: recordsValue) => {
    spuList.value = spu
    // console.log(spuList.value)
    //获取所以品牌数据
    let result1: brandResponseData = await reqHasTrademark()
    // console.log(result1)
    brandData.value = result1.data
    //获取照片墙所有数据
    let result2: imageResponseData = await reqImage(spu.id as number)
    // console.log(result2)
    image.value = result2.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //获取已有销售属性数据
    let result3: saleAttrListResponseData = await reqSaleAttrList(spu.id as number)
    // console.log(result3)
    saleAttrList.value = result3.data
    //获取全部销售属性数据
    let result4: baseSaleAttrListResponseData = await reqBaseSaleAttrList()
    // console.log(result4)
    basesaleAttrList.value = result4.data
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
//删除照片墙图片
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}
//放大照片墙图片
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
//过滤出还未选择的销售属性
let unsaleAttrList = computed(() => {
    let unsaleAttr = basesaleAttrList.value.filter(item => {
        return saleAttrList.value.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unsaleAttr
})

//添加销售属性
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = unsaleAttrValue.value.split(':')
    // console.log(baseSaleAttrId,saleAttrName)
    let newsaleAttr: saleAttrListValue = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //增加销售属性
    saleAttrList.value.push(newsaleAttr)
    //清空添加的销售属性
    unsaleAttrValue.value = ''
}

const toLook = (row: saleAttrListValue, $index: number) => {
    const { baseSaleAttrId, saleAttrValue } = row
    let newsaleAttrValue: spuSaleAttrValueListValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }

    //判断非法情况
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        row.flag = false
        return
    }
    let repeat = row.spuSaleAttrValueList?.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        row.flag = false
        return
    }
    row.spuSaleAttrValueList?.push(newsaleAttrValue)
    row.flag = false
}
const toEdit = (row: saleAttrListValue) => {
    // console.log(row)
    row.saleAttrValue = ''
    row.flag = true
}
const initAddSpu = async (c3Id: number | string) => {
    // Object.assign(spuList.value, {
    //     tmId: '',//品牌Id
    //     category3Id: '',//三级Id
    //     spuName: '', //spu名称 
    //     description: '', //spu描述
    //     spuImageList: [],
    //     spuSaleAttrList: []
    // })
    spuList.value = {
        tmId: '',//品牌Id
        category3Id: '',//三级Id
        spuName: '', //spu名称 
        description: '', //spu描述
        spuImageList: [],
        spuSaleAttrList: []
    }
    image.value = []
    saleAttrList.value = []
    spuList.value.category3Id = c3Id
    unsaleAttrValue.value = ''

    let result1: brandResponseData = await reqHasTrademark()
    brandData.value = result1.data
    //获取已有销售属性数据
    let result4: baseSaleAttrListResponseData = await reqBaseSaleAttrList()
    basesaleAttrList.value = result4.data
}
defineExpose({ initHasSpuData, initAddSpu })
</script>
<script lang="ts">
export default {
    name: 'spuForm'
}
</script>
<style scoped></style>