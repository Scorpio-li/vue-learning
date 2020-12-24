# excel-export

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## excel导出功能

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

## 可选导出功能

利用element-ui的界面和table来封装一个可选excel功能的组件

### 目录结构

在原先excel导出功能的基础上

```
-src（源代码目录）

--components（组件目录）

---exportOptionExcel.vue（可选组件

--views

--chooseData.vue
```

> 有个注意的地方是el-table-column都需加上对应的prop值，这样才不会让可选字段丢失


