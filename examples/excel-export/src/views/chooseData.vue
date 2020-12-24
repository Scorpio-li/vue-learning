<template>
    <div class="app-container">
    
	<export-option-excel :table="excelTable" :check="true" :data="excelData" @formatJson="formatJson" />
    
    <el-table
        ref="multipleTable" 
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange">
        <!-- 可选择是否table开启可选框 => 若开启 => 传入子组件check="true" => 反之则不传 -->
        <el-table-column
            type="selection"
            align="center"
            check="true"
            width="55" />  
        <el-table-column label="缴费单号" prop="sn" align="center"/>
        <el-table-column label="缴费单名称" prop="name" align="center" />
        <el-table-column label="状态" align="center">
            <template #default="{row}">
                <span>{{ row.status | statusFilter }}</span>
            </template>
        </el-table-column>
        <el-table-column label="缴费金额" prop="amount" align="center"/>
        <el-table-column label="缴费时间" prop="paymentTime" align="center" width="100px"/>
        <el-table-column label="备注" prop="remark" align="center"/>
        <el-table-column label="创建人" prop="creatorName" align="center"/>
        </el-table>
    </div>
</template>

<script>
const paymentStatusMap = ['良好', '正常', '优秀']
  // 将导入方法替换为子组件导入
  // import { exportExcel } from '@/utils'
import exportOptionExcel from '@/components/exportOptionExcel' 
export default {
    name: 'ChooseExample',
    components: { exportOptionExcel }, 
    filters: {
        statusFilter(status) {
            return paymentStatusMap[status]
        }
    },
    data() {
        return {
            list: [{
                sn: '测试单号',
                name: '1',
                status: 1,
                amount: '1111',
                paymentTime: '2020-12-23',
                remark: '备注测试',
                creatorName: '创建人'
            }, {
                sn: '测试单号',
                name: '1',
                status: 1,
                amount: '1111',
                paymentTime: '2020-12-23',
                remark: '备注测试',
                creatorName: '创建人'
            }, {
                sn: '测试单号',
                name: '1',
                status: 1,
                amount: '1111',
                paymentTime: '2020-12-23',
                remark: '备注测试',
                creatorName: '创建人'
            }, {
                sn: '测试单号',
                name: '1',
                status: 1,
                amount: '1111',
                paymentTime: '2020-12-23',
                remark: '备注测试',
                creatorName: '创建人'
            }],
            listLoading: false,
            downloadLoading: false,
            statusOptions: paymentStatusMap,
            excelTable: undefined,	// 初始化传入table数据
            excelData: [],	// 格式化后的数据
            multipleSelection: []
        }
    },
    mounted() {
      // await this.getList()	若是请求后端异步拿到table数据则需要async/await
       this.excelTable = this.$refs.multipleTable 	// 初始化table数据
       console.log('excelTable', this.$refs.multipleTable, this.multipleSelection)
    },
    
    methods: {
        // handleDownload导出excel方法删除掉
        // 自定义格式化table的数据 => 回调数据给子组件
        formatJson(filterVal, jsonData) {
            this.excelData = jsonData.map(v => filterVal.map(j => {
            return v[j]
            }))
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    }
}
</script>

