<!--
 * @Author: Li Zhiliang
 * @Date: 2020-12-24 15:41:19
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-25 09:50:05
 * @FilePath: /vue-learning/examples/excel-export/README.md
-->

## excel导出功能

### 1. 使用file-saver 和 xlsx

- 安装插件

```shell
npm i file-saver xlsx -S-D

npm i script-loader -D
```

- 目录结构

```js
-src（源代码目录）

--utils（公共方法目录）

---index.js（入口文件）

---Export2Excel.js（导出excel文件）

--views（页面目录）

--- example.vue（测试页面）
```

#### 可选导出功能

利用element-ui的界面和table来封装一个可选excel功能的组件

##### 目录结构

在原先excel导出功能的基础上

```
-src（源代码目录）

--components（组件目录）

---exportOptionExcel.vue（可选组件

--views

--chooseData.vue
```

> 有个注意的地方是el-table-column都需加上对应的prop值，这样才不会让可选字段丢失

### 2.使用 vue-json-excel 插件实现

优点：简单便捷，易上手，开箱即用；

缺点：不支持 excel 表格样式设置，且支持功能比较单一；

#### 1.安装 vue-json-excel 依赖

```shell
npm install -S vue-json-excel
```

#### 2.注册插件到 vue 实例

```js
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);
```

#### 3.使用方式

在需要触发导出事件的外出包裹 download-excel 组件

```html
<download-excel :data="json_data">
  Download Data
  <img src="download_icon.png" />
</download-excel>
```

首先需要处理导出到 excel 文件的数据内容，分别是以下数据：

- 表头名数据 json_fields：可以选择要导出的字段，并为字段分配标签。该数据类型为 Object ，key 对应的是标签，value 对应的是 JSON 字段，将导出与数据列表相同字段的数据。如果需要自定义导出的数据，可以定义回调函数。

- 表格数据 json_data：该数据类型为 Array，存储了需要导出的数据内容；

```js
let json_fields = {
  // fieldLabel(表头名)，attributeName(对应字段名)
  fieldLabel: attributeName,
  // 使用回调自定义导出数据
  anotherFieldLabel: {
    field: anotherAttributeName,
    callback: (value) => {
      return `formatted value ${value}`;
    },
  },
};

let json_data = [
    {
        attributeName: value1,
        anotherAttributeName: value2
    },
    {
        attributeName: value3,
        anotherAttributeName: value4
    }
];
```

处理完数据之后则可以将数据传入 download-excel 组件中，该组件没有任何样式，只需要设置内部包裹的元素样式即可；

```html
<download-excel
  class="btn btn-default"
  :data="json_data"
  :fields="json_fields"
  worksheet="My Worksheet"
  name="filename.xls"
>
  Download Excel (you can customize this with html code!)
</download-excel>
```

- 相关案例

```js
<template>
    <div id="app">
        <downloadexcel
            class            = "btn"
            :fetch           = "fetchData"
            :fields          = "json_fields"
            :before-generate = "startDownload"
            :before-finish   = "finishDownload">
            Download Excel
        </downloadexcel>
    </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
import axios from 'axios';

export default {
    name: "App",
    components: {
        downloadexcel,
    },
    data(){
        return {
            json_fields: {
                'Complete name': 'name',
                'Date': 'date',
            },
        }
    }, //data
    methods:{
        async fetchData(){
            const response = await axios.get(URL);
            return response.data.holidays;
        },
        startDownload(){
            alert('show loading');
        },
        finishDownload(){
            alert('hide loading');
        }
    }
};
</script>
```


### 3. 基于 sheetJS-xlsx 解析器的 xlsx-style 实现（推荐）

优点：支持格式众多，支持 excel 表格样式设置，功能强大，可控性高，可读取和导出excel；

缺点：使用较为复杂，上手成本较大，且高级功能需要收费，但该功能可以借助 xlsx-style 实现

该插件不仅支持 excel 文件的导出，也支持文件导入功能，并且导出 excel 文件的不仅支持 json 数据，也支持 table 导出；

#### 1.安装依赖

```shell
npm install -S xlsx
npm install -S xlsx-style
```
而 xlsx-style 插件在使用的时候会报错，官方也对该问题给出了解决方案，就是在根目录下的vue.config.js配置文件添加如下代码：

```js
module.exports = {
	configureWebpack: {
    	externals: {
      		'./cptable': 'var cptable'
    	}
  	}
}
```

#### 2.使用方法

这里封装了 json 导出 excel 文件的方法，其中，文件下载的功能有两个方案实现，分别是：

- 通过 a 标签的文件下载功能，利用 URL.createObjectURL 方法生成下载链接实现；（本文使用的方法）

- 通过第三方插件 file-saver 插件实现文件下载功能；

js-xlsx 插件封装了相关的函数去方便实现不同数据格式的转换：

- aoa_to_sheet converts an array of arrays of JS data to a worksheet.

- json_to_sheet converts an array of JS objects to a worksheet.

- table_to_sheet converts a DOM TABLE element to a worksheet.

- sheet_add_aoa adds an array of arrays of JS data to an existing worksheet.

- sheet_add_json adds an array of JS objects to an existing worksheet.

封装export2Excel函数具体代码：

```js
// ./src/utils/exportExcel.js
/**
 * create by lwj
 * @file 导出export插件封装
 */

import * as styleXLSX from 'xlsx-style'

/**
 * 将 String 转换成 ArrayBuffer 
 * @method 类型转换
 * @param {String} [s] wordBook内容
 * @return {Array} 二进制流数组
 */
function s2ab (s) {
    let buf = null;

    if (typeof ArrayBuffer !== 'undefined') {
        buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);

        for (let i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }

        return buf;
    }

    buf = new Array(s.length);

    for (let i = 0; i != s.length; ++i) {

        // 转换成二进制流
        buf[i] = s.charCodeAt(i) & 0xFF;
    }

    return buf;
}

/**
 * 方案一：利用 URL.createObjectURL 下载 （以下选用）
 * 方案二：通过 file-saver 插件实现文件下载
 * @method 文件下载
 * @param {Object} [obj] 导出内容 Blob 对象
 * @param {String} [fileName] 文件名 下载是生成的文件名
 * @return {void}
 */ 
function saveAs (obj, fileName) {
    let aLink = document.createElement("a");

    if (typeof obj == 'object' && obj instanceof Blob) {
        aLink.href = URL.createObjectURL(obj); // 创建blob地址
    }
    
    aLink.download = fileName;
    aLink.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
}

/**
 * @method 数据导出excel
 * @param {Object} [worksheets] 工作表数据内容
 * @param {String} [fileName='ExcelFile'] 导出excel文件名
 * @param {String} [type='xlsx'] 导出文件类型
 */
export default function export2Excel ({
    worksheets, 
    fileName = 'ExcelFile',
    type = 'xlsx'
} = {}) {

    let sheetNames = Object.keys(worksheets);
    let workbook = {
        SheetNames: sheetNames, //保存的工作表名
        Sheets: worksheets
    };

    // excel的配置项
    let wopts = {  
        bookType: type,  // 生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'  
    }

    // attempts to write the workbook
    let wbout = styleXLSX.write(workbook, wopts);
    let wbBlob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    });

    saveAs(wbBlob, fileName + '.' + type);
}
```

需注意的问题：

- xlsx 和 xlsx-style 的默认导出函数名都是 XLSX ，如果同时导入的话，需要注意设置别名，避免函数覆盖出现问题；

- 如果不想使用 xlsx 插件，只使用 xlsx-style 插件同样也是可以的，只是要自己将需要导出的数据转换成 worksheet 格式对象，其原理也就是将导出数据转换成 worksheet 规定的数据格式，具体可以查看 [js-xlsx](https://github.com/SheetJS/sheetjs) 文档说明；（可以自己尝试实现）

- 然后只需要在需要导出 excel 的地方调用即可，如果对导出表格样式有要求的情况下，需要去了解如何配置表格样式，具体配置方法可以去 xlsx-style 文档 中查看。

相关案例：
```js

import XLSX from 'xlsx';
import export2Excel from '@/assets/utils/export2Excel';

// json 格式
let jsonTable = [{
    "sheet1id": 1,
    "表头1": "数据11",
    "表头2": "数据12",
    "表头3": "数据13",
    "表头4": "数据14"
}, {
    "sheet1id": 2, 
    "表头1": "数据21",
    "表头2": "数据22",
    "表头3": "数据23",
    "表头4": "数据24"
}];

// 二维数组格式
let aoa = [
    ['sheet2id', '表头1', '表头2', '表头3', '表头4'],
    [1, '数据11', '数据12', '数据13', '数据14'],
    [2, '数据21', '数据22', '数据23', '数据24']
]

function handleExportExcel () {
    
    // 使用 XLSX 内置的工具库将 json 转换成 sheet
    let worksheet1 = XLSX.utils.json_to_sheet(jsonTable);

    // 使用 XLSX 内置的工具库将 aoa 转换成 sheet
    let worksheet2 = XLSX.utils.aoa_to_sheet(aoa);

    // 设置 excel 表格样式
    worksheet1["B1"].s = { 
        font: { 
            sz: 14, 
            bold: true, 
            color: { 
                rgb: "FFFFAA00"
            } 
        }, 
        fill: { 
            bgColor: { 
                indexed: 64 
            }, 
            fgColor: { 
                rgb: "FFFF00" 
            } 
        } 
    };

    // 单元格合并
    worksheet1["!merges"] = [{
        s: { c: 1, r: 0 },
        e: { c: 4, r: 0 }
    }];

    export2Excel({
        worksheets: {
            sheet1: worksheet1,
            sheet2: worksheet2
        }, // 导出excel的数据，key表示工作表名，value表示对应工作表的 sheet 数据，支持导出多个工作表
        fileName: '我的excel', // 导出文件名
        type: 'xlsx' // 文件导出类型
    });
}
```
