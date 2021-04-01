<template>
    <div>
        <el-upload
            class="upload-demo"
            action=""
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :file-list="fileListUpload"
            :limit="limitUpload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'ExcelResolve',
    data () {
        return {
            fileTemp: null,
            limitUpload: 1,
            fileListUpload: [],
            accountList: []
        }
    },
    methods: {
        handleChange(file){
            this.fileTemp = file.raw
            let returnData = [];
            if(this.fileTemp){
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')){
                    returnData = this.importfxx(this.fileTemp)
                    console.log('returnData', returnData)
                } else {
                    this.$message({
                        type:'warning',
                        message:'附件格式错误，请删除后重新上传！'
                    })
                }
            } else {
                this.$message({
                    type:'warning',
                    message:'请上传附件！'
                })
}
        },

        handleRemove(file,fileList){
            this.fileTemp = null
            console.log('fileList', fileList)
        },
        handleExceed() {
            console.log('handleExceed')
            
        },
        // importfxx(obj) {
        //     // let _this = this;
        //     // 通过DOM取文件数据
        //     this.file = obj
        //     var rABS = false; //是否将文件读取为二进制字符串
        //     var f = this.file;
        //     var reader = new FileReader();
        //     //if (!FileReader.prototype.readAsBinaryString) {
        //     FileReader.prototype.readAsBinaryString = function(f) {
        //         var binary = "";
        //         var rABS = false; //是否将文件读取为二进制字符串
        //         // var pt = this;
        //         var wb; //读取完成的数据
        //         var outdata;
        //         var reader = new FileReader();
        //         reader.onload = function() {
        //         var bytes = new Uint8Array(reader.result);
        //         var length = bytes.byteLength;
        //         for(var i = 0; i < length; i++) {
        //             binary += String.fromCharCode(bytes[i]);
        //         }
        //         var XLSX = require('xlsx');
        //         if(rABS) {
        //             // wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
        //             //     type: 'base64'
        //             // });
        //         } else {
        //             wb = XLSX.read(binary, {
        //                 type: 'binary'
        //             });
        //         }
        //         outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
        //             this.da = [...outdata]
        //             let arr = []
        //             console.log('da', this.da)
        //             this.da.map(v => {
        //                 let obj = {}
        //                 obj.code = v['ICCID']
        //                 obj.type = v['IMSL']
        //                 obj.cardType = v.['Card Type']
        //                 arr.push(obj)
        //             })
        //             return arr
        //         }
        //         reader.readAsArrayBuffer(f);
        //     }
            
        //     if(rABS) {
        //         return reader.readAsArrayBuffer(f);
        //     } else {
        //         return reader.readAsBinaryString(f);
        //     }
        // },
        importfxx(obj) {
 
            let _this = this;
        
            // let inputDOM = this.$refs.inputer;   // 通过DOM取文件数据
        
            this.file = obj;  
        
            var rABS = false; //是否将文件读取为二进制字符串
        
            var f = this.file;
        
            var reader = new FileReader();
        
            //if (!FileReader.prototype.readAsBinaryString) {
        
            FileReader.prototype.readAsBinaryString = function(f) {
        
            var binary = "";
        
            var rABS = false; //是否将文件读取为二进制字符串
        
            // var pt = this;
        
            var wb; //读取完成的数据
        
            var outdata;
        
            var reader = new FileReader();
        
            reader.onload = function() {
        
                var bytes = new Uint8Array(reader.result);
        
                var length = bytes.byteLength;
        
                for(var i = 0; i < length; i++) {
        
                    binary += String.fromCharCode(bytes[i]);
        
                }
        
                var XLSX = require('xlsx');
        
                if(rABS) {
        
                    // wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
        
                    //     type: 'base64'
        
                    // });
        
                } else {
        
                    wb = XLSX.read(binary, {
        
                        type: 'binary'
        
                    });
        
                }
        
                // outdata就是你想要的东西 excel导入的数据
        
                outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
        
                // excel 数据再处理
        
                let arr = []
        
                outdata.map(v => {
        
                    let obj = {}
        
                    obj.code = v['ICCID']
                    obj.type = v['IMSL']
                    obj.cardType = v.['Card Type']
        
                    arr.push(obj)
        
                })
        
                _this.accountList = [...arr];
        
                console.log( _this.accountList)
        
                // _this.reload();
        
                }
        
                reader.readAsArrayBuffer(f);
        
            }
        
            if(rABS) {
        
                reader.readAsArrayBuffer(f);
        
            } else {
        
                reader.readAsBinaryString(f);
        
            }
        
        
        
        }
    }
}
</script>