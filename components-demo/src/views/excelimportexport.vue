<template>
  <div class="app-content">
    <el-row>
      <el-col :span="7">
        <el-upload
          action="/"
          :on-change="onChange"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xls, .xlsx"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </el-col>
      <el-col :span="7">
        <el-button size="small" type="primary" @click="exportExcel">文件导出</el-button>
      </el-col>
    </el-row>
    <el-table
      style="margin:20px 0;"
      :data="outputs"
      border
      :header-cell-style="{background:'#f1f1f1',color:'#606266'}"
    >
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  data() {
    return {
      outputs: [], // 保存读取出来的数据列表
      fileData: "" // 保存选择的文件数据
    };
  },
  methods: {
    
    //文件选择时
    onChange(file, fileList) {
      this.fileData = file; // 保存当前选择文件
      this.readExcel(); // 调用读取数据的方法
    },

    //读取文件数据
    readExcel(e) {
      let that = this;
      const files = that.fileData;
      if (!files) {
        //如果没有文件
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          //导入的文件名称
          console.log(workbook.SheetNames);
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.outputs = []; //清空接收数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = {
              // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
              //此处的字段名对应 上面表格数据的字段名
              age: ws[i]["年龄"],
              name: ws[i]["姓名"]
            };
            that.outputs.push(sheetData);
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(files.raw);
    },

    //导出文件
    exportExcel() {
      if (!this.outputs.length) {
        this.$message.warning("暂无数据导出");
        return false;
      }
      import("@/vendor/Export2Excel").then(excel => {
        //导出表格头部内容（要与下面字段对照）
        const tHeader = ["姓名", "年龄"];
        const filterVal = ["name", "age"];
        const data = this.formatJson(filterVal);
        //保存excel
        excel.export_json_to_excel({
          header: tHeader,
          data,
          //导出的文件名
          filename: "table-list"
        });
      });
    },

    //格式转换
    formatJson(filterVal) {
      return this.outputs.map(v =>
        // obj = {
        //   name:'',
        //   age:''
        // }
        filterVal.map(j => {
          // obj[name]
          // obj[age]
          console.log(v[j]);
          return v[j];
        })
      );
      // [[name,age],[name,age],[name,age]]
    }
  }
};
</script>

<style>
</style>
