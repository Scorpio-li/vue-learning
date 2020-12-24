<template>
  <div class="excel-option-main">
    <el-popover
      placement="right"
      width="400"
      trigger="click"
      @show="handleExcel">
      <div class="excel-option-container">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"/>
        <el-checkbox-group v-model="checkedExcel" @change="handleCheckedExcelChange">
          <el-checkbox v-for="(item) in excelOptions" :key="item.key" class="excel-option-checkbox" :label="item">{{ item.value }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-button :loading="downloadLoading" class="excel-option-btn" size="small" type="primary" @click="handleDownload">
        确认导出
      </el-button>
      <el-button slot="reference" class="filter-item" type="default">
        导出excel
      </el-button>
    </el-popover>
  </div>
</template>

<script>
  import { exportExcel } from '@/utils'
  export default {
    name: 'ExportOptionExcel',
    props: {
      // 整个table的数据 => 用来切割成表头和数据
      table: {
        type: Object,
        default: () => {}
      },
      // 最后格式化后的数据（结合父组件查看）
      data: {
        type: Array,
        default: () => []
      },
      // 是否开启了element的table勾选功能
      check: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        lock: false,
        downloadLoading: false,
        // 是否全部勾选
        checkAll: false,
        // 已勾选数据
        checkedExcel: [],
        // 可勾选的表头字段
        excelOptions: [],
        // table的数据
        list: [],
        // element的多选框字段（可到官网查看噢）
        isIndeterminate: true
      }
    },
    created() {
      // 组件首次加载 -> 开锁（防止多次添加可勾选的表头字段）
      this.lock = false
    },
    methods: {
      // 全选
      handleCheckAllChange(val) {
        this.checkedExcel = val ? this.excelOptions : []
        this.isIndeterminate = false
      },
      // 勾选字段
      handleCheckedExcelChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.excelOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.excelOptions.length
      },
      // 点击弹出框 => 初始化组件
      handleExcel() {
        // 防止多次添加可勾选的表头字段
        if (this.lock) return
        // 获取table数据切割表头和对应的prop字段
        console.log('this', this.table);
        this.table.$children.forEach(v => {
          if (!v.label || !v.prop) return
          this.excelOptions.push({ key: v.prop, value: v.label })
        })
        this.list = this.check ? this.table.selection : this.table.data
        // 闭锁
        this.lock = true
      },
      // 确认导出按钮
      async handleDownload() {
        // 判断是否勾选数据
        if (!this.list.length || !this.checkedExcel.length) {
          return this.$message({
            type: 'warning',
            message: '请勾选导出数据'
          })
        }
        this.downloadLoading = true
        const headers = []
        const valueFilter = []
        // 将已勾选的数据提取
        this.checkedExcel.forEach(({ key, value }) => {
          headers.push(value)
          valueFilter.push(key)
        })
        // 格式化数据
        await this.formatJson(valueFilter, this.list)
        // 设置导出的excel文件名
        const { title } = this.$route.meta
        await exportExcel(headers, this.data, `${title}`)
        this.downloadLoading = false
      },
      /**
       * @description 格式化
       */
      async formatJson(valueFilter, listData) {
        await this.$emit('formatJson', valueFilter, listData)
      }
    }
  }
</script>

<style scoped>
.excel-option-main {
  display: inline-block;
  margin-left: 10px;
}

.excel-option-container {
  padding: 10px;
}
.excel-option-checkbox {
  display: inline-block;
  width: 85px;
  height: 30px;
}
.excel-option-btn {
  margin-left: 3%;
}

</style>

