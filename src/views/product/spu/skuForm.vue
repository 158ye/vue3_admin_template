<template>
    <el-form label-width="120px">
        <el-form-item label="sku名称">
            <el-input v-model="skuParams.skuName" placeholder="sku名称"></el-input>
        </el-form-item>
        <el-form-item label="sku价格(元)">
            <el-input v-model="skuParams.price" placeholder="价格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="sku重量(g)">
            <el-input v-model="skuParams.weight" placeholder="重量" type="number"></el-input>
        </el-form-item>
        <el-form-item label="sku描述">
            <el-input v-model="skuParams.skuDesc" placeholder="sku描述" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form inline>
                <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId" placeholder="选择内容" style="width: 200px;">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList"
                            :key="attrValue.id" :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form inline>
                <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId" placeholder="选择内容" style="width: 200px;">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`"
                            v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table" style="margin: 10px 0;">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" alt="" style="width:100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts" setup>
import { reqAttr } from '@/api/product/attr'
import { reqSaleAttrList, reqImage, reqAddSku } from '@/api/product/spu'
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';


//存放平台属性
let attrArr = ref<any>([])
//存放销售属性
let saleArr = ref<any>([])
//存放照片数据
let imgArr = ref<any>([])
//获取table组件实例
let table = ref<any>();
//收集SKU的参数
let skuParams = reactive<any>({
    //父组件传递过来的数据
    "category3Id": "",//三级分类的ID
    "spuId": "",//已有的SPU的ID
    "tmId": "",//SPU品牌的ID
    //v-model收集
    "skuName": "",//sku名字
    "price": "",//sku价格
    "weight": "",//sku重量
    "skuDesc": "",//sku的描述

    "skuAttrValueList": [//平台属性的收集
    ],
    "skuSaleAttrValueList": [//销售属性
    ],
    "skuDefaultImg": "",//sku图片地址
})
const initaddSku = async (c1Id: number | string, c2Id: number | string, row: any) => {
    //每次添加sku清空之前记录
    skuParams.skuName = ""
    skuParams.price = ""
    skuParams.weight = ""
    skuParams.skuDesc = ""
    skuParams.skuDefaultImg = ""
    skuParams.skuAttrValueList = []
    skuParams.skuSaleAttrValueList = []
    // 清空数组内下拉绑定的临时属性
    attrArr.value = []
    saleArr.value = []
    imgArr.value = []
    
    //收集数据
    skuParams.category3Id = row.category3Id;
    skuParams.spuId = row.id;
    skuParams.tmId = row.tmId;
    const result = await reqAttr(c1Id, c2Id, row.category3Id)
    // console.log("平台属性:", result)
    attrArr.value = result.data
    const result1 = await reqSaleAttrList(row.id)
    // console.log("销售属性:", result1)
    saleArr.value = result1.data
    const result2 = await reqImage(row.id)
    // console.log("照片:", result2)
    imgArr.value = result2.data
}
//设置默认图片
const handler = (row: any) => {
    imgArr.value.forEach((item: any) => {
        table.value.toggleRowSelection(item, false)
    })
    //选中的图片才勾选
    table.value.toggleRowSelection(row, true);
    //收集图片地址
    skuParams.skuDefaultImg = row.imgUrl;
}
const save = async () => {
    //验证是否选择了默认图片
    if (!skuParams.skuDefaultImg) {
        ElMessage({
            type: 'warning',
            message: '请选择默认图片（点击图片行的"设置默认"按钮）'
        });
        return;
    }
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':');
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId, saleAttrValueId
            })
        }
        return prev;
    }, []);

    //添加SKU的请求
    let result: any = await reqAddSku(skuParams);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功'
        });
        //通知父组件切换场景为零
        $emit('changeScene', { flag: 0, params: '' })
    } else {
        ElMessage({
            type: 'error',
            message: result.message || '添加SKU失败'
        })
    }

}
//取消按钮的回调
const cancel = () => {
    $emit('changeScene', { flag: 0, params: '' });
}
//自定义事件的方法
let $emit = defineEmits(['changeScene']);
defineExpose({ initaddSku })
</script>
<script lang="ts">
export default {
    name: 'skuForm'
}
</script>

<style lang="scss" scoped></style>