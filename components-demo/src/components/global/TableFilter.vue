<template>
  <div>
    <el-form :inline="true" :model="filter" class="demo-form-inline">
      <el-form-item v-for="item in filterItems" :key="item.prop" :label="item.label">
        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="filter[item.prop]"
          :default-time="['00:00:00', '23:59:59']"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="filter[item.prop]"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-select v-else-if="item.type === 'select'" v-model="filter[item.prop]" :placeholder="item.placeholder || item.label" clearable>
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
        <el-input v-else v-model="filter[item.prop]" :placeholder="item.placeholder || item.label" :type="item.type" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="filterItems && filterItems.length > 0">
        <el-button type="primary" @click="refresh">查询</el-button>
      </el-form-item>
      <el-form-item v-if="filterItems && filterItems.length > 0">
        <el-button @click="reset">重置条件</el-button>
      </el-form-item>
    </el-form>
    <slot :data="list"></slot>
    <div class="pagination">
      <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="page"
          :page-size="rows"
          :total="total"
          @current-change="changePage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TableFilter',
  props: {
    // 可选，表格数据
    tableData: Array,
    // 可选，请求api地址
    url: String,
    // 表格筛选项
    filterItems: {
      type: Array,
      default () {
        return []
      }
    },
    // 筛选数据
    filter: {
      type: Object,
      default () {
        return {}
      }
    },
    // 每页展示数据量
    defaultRows: {
      type: Number,
      default: 10
    },
    // 格式化规则
    formatTableData: Function
  },
  data () {
    return {
      defaultFilter: { ...this.filter },
      list: [],
      rows: this.defaultRows,
      total: 0,
      page: 1
    }
  },
  watch: {
    tableData: {
      handler (tableData) {
        this.calcTableData(tableData)
      },
      immediate: true
    }
  },
  methods: {
    reset () {
      for (const key in this.filter) {
        if (this.filter.hasOwnProperty(key)) {
          this.filter[key] = this.defaultFilter[key]
        }
      }
    },
    changePage (page) {
      this.page = page
      this.search()
    },
    // 针对用户传入表格数据的情况做前端分页
    calcTableData (tableData = []) {
      const list = tableData.slice((this.page - 1) * this.rows, this.page * this.rows)
      this.list = this.formatTableData ? this.formatTableData(list) : list
      this.total = tableData.length
    },
    search () {
      if (this.tableData) {
        this.calcTableData(this.tableData)
      } else {
        // 发送请求
        const filter = {}
        Object.keys(this.filter).forEach(key => {
          if (this.filter[key]) {
            if (key === 'daterange') {
              filter['startTime'] = this.filter[key][0]
              filter['endTime'] = this.filter[key][1]
            } else {
              filter[key] = this.filter[key]
            }
          }
        })
        this.$http.get(this.url, { params: { ...filter, page: this.page, rows: this.rows } }).then(({ total, list }) => {
          this.total = total
          this.list = this.formatTableData ? this.formatTableData(list) : list
        })
      }
    },
    refresh () {
      this.page = 1
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
