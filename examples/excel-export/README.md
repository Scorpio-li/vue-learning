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

