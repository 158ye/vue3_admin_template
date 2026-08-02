<template>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0;">
        <div v-show="scene == 0">
            <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                @click="addSpu">添加SPU</el-button>
            <el-table style="margin: 10px 0;" border :data="spuArr">
                <el-table-column label="序号" width="80" type="index" align="center" />
                <el-table-column label="SPU名称" width="180" prop="spuName" />
                <el-table-column label="SPU描述" prop="description" />
                <el-table-column label="SPU操作" width="300">
                    <template #="{ row, index }">
                        <el-button type="primary" icon="Plus" title="新增SKU" @click="addSku(row)"></el-button>
                        <el-button type="warning" icon="Edit" title="编辑SPU" @click="updateSpu(row)"></el-button>
                        <el-button type="info" icon="View" title="查看SKU" @click="findSku(row)"></el-button>
                        <el-popconfirm width="200px" confirm-button-text="确定" cancel-button-text="取消" icon="InfoFilled"
                            icon-color="#626AEF" :title="`你确定要删除${row.spuName}吗?`" @confirm="deleteSpu(row)"
                            @cancel="cancelEvent">
                            <template #reference>
                                <el-button type="danger" icon="Delete" title="删除"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" background
                layout=" prev, pager, next, jumper,->,total, sizes" :total="total" @size-change="changeSize"
                @current-change="changePage" />
        </div>
        <div v-show="scene == 1">
            <spuForm ref="spu" @changeScene="changeScene"></spuForm>
        </div>
        <div v-show="scene == 2">
            <skuForm ref="sku" @changeScene="changeScene"></skuForm>
        </div>
    </el-card>
    <el-dialog title="sku列表" v-model="show">
        <el-table border :data="skuArr">
            <el-table-column label="名字" prop="skuName"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="重量" prop="weight"></el-table-column>
            <el-table-column label="图片">
                <template #="{ row, index }">
                    <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
                </template>

            </el-table-column>
        </el-table>
    </el-dialog>
</template>
<script setup lang="ts">
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type { SpuResponseData, records } from '@/api/product/spu/type'
import { ref, watch, onBeforeUnmount } from 'vue';
import useCategoryStore from '@/store/modules/category';
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()
//当前页面
let pageNo = ref<number>(1)
//每页多少条数据
let limit = ref<number>(3)
//用来判断展示内容(0——spu展示已有数据,1——spu新增或修改页,2——sku新增页)
let scene = ref<number>(0)
//存储已有SPU数据
let spuArr = ref<records>([])
//总条数
let total = ref<number>(1)
//标记子组件
let spu = ref()
let sku = ref()
//用来判断是否查看spu下的sku
let show = ref<boolean>(false);
//存储sku数据
let skuArr = ref<any>([])
watch(() => categoryStore.c3Id, () => {
    spuArr.value = []
    if (!categoryStore.c3Id) return
    //当有三级Id时，调用SPU页面数据
    getSpuArr()
})
onBeforeUnmount(() => {
    categoryStore.$reset()
})
//调用SPU页面数据
const getSpuArr = async (pager = 1) => {
    pageNo.value = pager
    let result: SpuResponseData = await reqHasSpu(pageNo.value, limit.value, categoryStore.c3Id)
    // console.log(result)
    spuArr.value = result.data.records
    total.value = result.data.total
}

//添加SPU
const addSpu = () => {
    scene.value = 1
    spu.value.initAddSpu(categoryStore.c3Id)
}
//修改SPU
const updateSpu = (row: any) => {
    // console.log(row)
    scene.value = 1
    spu.value.initHasSpuData(row)
}
const changeScene = (Obj: any) => {
    scene.value = Obj.flag
    if (Obj.params == 'update') {
        getSpuArr(pageNo.value)
    } else {
        getSpuArr()
    }
}
//新增sku
const addSku = (row: any) => {
    scene.value = 2
    sku.value.initaddSku(categoryStore.c1Id, categoryStore.c2Id, row)
    // console.log(row)
}
//查看sku
const findSku = async (row: any) => {
    // console.log(row)
    let result = await reqSkuList(row.id)
    // console.log(result)
    if (result.code == 200) {
        skuArr.value = result.data
        show.value = true
    }
}
//删除spu
const deleteSpu = async (row: any) => {
    // console.log(row)
    let result1 = await reqRemoveSpu(row.id)
    // console.log(result)
    if (result1.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        });
        getSpuArr(spuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

}
const cancelEvent = () => {
    //   console.log('cancel!')
}
const changePage = (pager: number) => {
  getSpuArr(pager)
}
// 切换每页条数 → 必须回到第1页！
const changeSize = () => {
  getSpuArr(1)
}
</script>
<script lang="ts">
export default {
    name: 'Spu'
}
</script>

<style scoped lang="scss"></style>