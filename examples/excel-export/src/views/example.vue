<template>
  <div class="app-container">
    <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
      导出excel
	  </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
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
  import { exportExcel } from '@/utils'
  export default {
    name: 'Example',
    filters: {
      statusFilter(status) {
        return paymentStatusMap[status]
      }
    },
    data() {
      return {
        list: [
          {
          	sn: '测试单号',
            name: '1',
            status: 1,
            amount: '1111',
            paymentTime: '2020-12-23',
            remark: '备注测试',
            creatorName: '创建人'
        	},
          {
          	sn: '测试单号',
            name: '1',
            status: 1,
            amount: '1111',
            paymentTime: '2020-12-23',
            remark: '备注测试',
            creatorName: '创建人'
        	},
          {
          	sn: '测试单号',
            name: '1',
            status: 1,
            amount: '1111',
            paymentTime: '2020-12-23',
            remark: '备注测试',
            creatorName: '创建人'
        	},
          {
          	sn: '测试单号',
            name: '1',
            status: 1,
            amount: '1111',
            paymentTime: '2020-12-23',
            remark: '备注测试',
            creatorName: '创建人'
        	}   
        ],
        listLoading: false,
        downloadLoading: false,
        statusOptions: paymentStatusMap
      }
    },
    methods: {
      async handleDownload() {
        this.downloadLoading = true
        const header = ['缴费单号', '缴费单名称', '状态', '缴费金额', '缴费时间 ', '备注', '创建人', '创建时间', '更新时间']
        const filterVal = ['sn', 'name', 'status', 'amount', 'paymentTime', 'remark', 'creatorName', 'createTime', 'updateTime']
        const data = this.formatJson(filterVal, this.list)
        await exportExcel(header, data, '测试列表')
        this.downloadLoading = false
      },
      /**
       * @description 格式化
       */
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'status') {
            return paymentStatusMap[v[j]]
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

