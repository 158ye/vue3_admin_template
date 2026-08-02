<template>
    <el-card>
        <el-table border style="margin: 10px 0;" :data="skuArr">
            <el-table-column label="序号" type="index" width="80px"></el-table-column>
            <el-table-column label="名称" prop="skuName"></el-table-column>
            <el-table-column label="描述" prop="skuDesc"></el-table-column>
            <el-table-column label="图片">
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" prop="weight"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="操作" fixed="right" width="300px">
                <template #="{ row, $index }">
                    <el-button type="primary" :icon="row.isSale == 1 ? 'Bottom' : 'Top'" @click="updateSale(row)" />
                    <el-button type="primary" icon="Edit" @click="updateSku" />
                    <el-button type="primary" icon="InfoFilled" />
                    <el-popconfirm :title="`你确定要删除${row.skuName}吗?`" @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button type="primary" icon="Delete" />
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
            size="small" background="background" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
            @size-change="changeSize" @current-change="changePage" />
    </el-card>
</template>
<script setup lang="ts">
import { reqSkuList, reqSaleSku, reqCancelSale, reqRemoveSku } from '@/api/product/sku'
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

//默认页码
let pageNo = ref<number>(1)
//每页展示条数
let limit = ref<number>(10)
//总条数
let total = ref<number>(0)
//存储sku数据
let skuArr = ref<any>([])

onMounted(() => {
    getskuArr()
})
//获取页面数据
const getskuArr = async (pager = 1) => {
    pageNo.value = pager
    let result: any = await reqSkuList(pageNo.value, limit.value)
    // console.log(result)
    if (result.code == 200) {
        skuArr.value = result.data.records
        total.value = result.data.total
    }
}
//上架或者下架
const updateSale = async (row: any) => {
    // console.log(row)
    //如果isSale为1，处于上架状态，点击之后下架，调用下架接口
    if (row.isSale == 1) {
        await reqCancelSale(row.id)
        ElMessage({ type: 'success', message: '下架成功' });
        getskuArr(pageNo.value);
    }
    else {
        await reqSaleSku(row.id)
        ElMessage({ type: 'success', message: '上架成功' });
        getskuArr(pageNo.value);
    }
}
//编辑
const updateSku = () => {
    ElMessage({ type: 'success', message: '功能正在实现中' });
}
//删除
const removeSku = async (id: number) => {
    let result = await reqRemoveSku(id)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getskuArr(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({ type: 'error', message: '删除失败' })
    }
}

//分页问题
// 切换页码
const changePage = (pager: number) => {
  getskuArr(pager)
}
// 切换每页条数 → 必须回到第1页！
const changeSize = () => {
  getskuArr(1)
}
</script>
<script lang="ts">
export default {
    name: 'Sku'
}
</script>

<style scoped lang="scss"></style>