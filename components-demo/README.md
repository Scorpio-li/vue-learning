<!--
 * @Author: Li Zhiliang
 * @Date: 2020-11-24 18:26:07
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-01-06 17:44:00
 * @FilePath: /vue-learning/components-demo/README.md
-->
# components-demo

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

## Vue前端HTML保存为PDF的两种常用方式

### 1. 使用html2Canvas和JsPDF库，转化为图片后保存PDF。

- 优点：
    
    - 没有预览点击即可保存
    
    - 不需要手动配置保存
    
    - 可选取部分Dom保存

- 缺点：

    - 较不清晰

    - 需要先转化为图片

    - 没有提前预览

    - 不适合保存过长分页内容

    - 依赖html2Canvas和JsPDF库


1. 安装html2canvas库 npm install html2canvas

2. 安装jspdf库 npm install jspdf

3. 编写保存函数 文件位置：src/utils/htmlToPdf.js



### 2. 调用浏览器window.print()，然后手动保存为PDF。

- 优点

    - 可以提前预览

    - 适合保存过长分页内容比较合适

    - 直接由浏览器API保存，内容清晰

    - 开发便利快速。

- 缺点

    - 第一次需要在预览框手动配置参数

    - 需要手动点击保存

    - 会有Print预览弹窗

    - 不可选取部分Dome，只能保存当前整页面。

1. 代码位置：src/views/PdfPage2.vue

## Layout组件

```js
├── src                        
    ├── components             
        └── common  
            ├── Sidebar              # 侧边菜单栏
            │   ├── MenuItem.vue     # 菜单子项
            │   └── index.vue        # 菜单栏
            ├── Header.vue           # 顶部导航
            └── Layout.vue           # Layout组件
```

## 权限控制

权限控制是每个控制台都逃不掉的课题，最普遍简单的做法就是通过constRoutes静态路由和asyncRoutes动态路由来实现。

这里我们做个小小的升级，为了可以更灵活的配置权限，除了可配置的角色权限外，我们还额外引入一个全局可以展示的所有菜单列表，添加这个列表的好处是，当我们在版本迭代时，会存在删减需求的情况，这时候比起一个个角色修改可显示菜单，还是直接修改可展示列表更为高效便捷。

权限控制的流程：

1. 未登录的情况跳转登录页面

2. 用户登录获取token及权限可访问菜单

3. 在浏览器地址栏输入访问地址时比较可展示菜单和用户可访问菜单，满足条件则跳转

4. 菜单栏比较可展示菜单和用户可访问菜单显示符合条件的菜单

目录：

```js
├── router                        
│   ├── modules                  # 划分路由
│   │   ├── page.js              # page菜单下所有路由配置           
│   │   └── setting.js           # setting菜单下所有路由配置
│   └── index.js                 # 路由主路径
├── utils
    └── menulist.js              # 所有可展示菜单
```

## 全局组件注册

项目中必然会存在一些全局公用的组件，但如果我们一个个去注册会很麻烦，所以这里我们把全局组件提到一个专门的目录下，通过一个registerComponent的方法，批量注册，以后，我们就可以直接在页面里引用这些组件。

```js
├── src                        
    ├── components             
        └── global             # 存放全局组件的目录
            ├── TableData.vue  # 全局组件  
            └── index.js       # 用来批量处理组件组册的函数入口
```

- app.js

```js
import Vue from 'vue'
import registerComponent from './components/global'

registerComponent(Vue)
```

- 页面中无需引入

```js
<template>
  <div>
    <TableData></TableData>
  </div>
</template>
```

## 全局过滤器注册

在项目中，我们会频繁遇到对诸如时间、金额的格式化，将他们作为全局的过滤器，将更方便我们后续的使用。

```js
├── src                        
    ├── utils             
        └── filters.js           # 存放全局过滤器函数入口
```

- app.js

```js
import Vue from 'vue'
import registerFilter from './utils/filters'

registerFilter(Vue)
```

- 组件中使用：

```js
<template>
  <div>{{ price | formatPrice }}</div>
</template>
```

## 表格过滤组件

控制台项目里，最常见的就是查询记录以表格的形式展现出来，表格的功能大多也都比较类似，所以我们可以封装一个通用的表格组件，帮助我们简化一下表格的操作。

这个表格组件将包含以下功能：(./components/global/TableFilter.vue)

- 多种数据来源：表格的数据可以由用户传入，也可以通过请求api获得数据

- 数据查询：可以支持常见的输入框、下拉框、时间选择器的筛选

- 分页：根据传入参数，动态决定每页展示数据量

- 格式化数据：根据传入的规则对查询获取的数据格式化

- 自定义表格内容：允许用户自由编辑表格内容

多种数据来源：

> 这个比较容易实现，通过可选传入url或者tableData进行判断

数据查询：

> 通过filterItems传入，filterItems的形如：

```js
[
  { prop: 'name', type: 'text', label: '名称' },
  { prop: 'gender', type: 'select', label: '性别', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] }
]
```

分页:

> 通过传入的defaultRows控制。

格式化数据：

> 通过传入的formatTableData进行格式化，formatTableData的函数形如：

```js
const formatItem = (item) => {
 // do something...
}

const formatTableData = (list) => {
  list.map(formatItem)
}
```

自定义表格内容：

> 这里我们巧妙的运用了作用域插槽，让插槽内容可以访问子组件中的数据。

```js
<!-- 子组件：-->
<slot :data="list"></slot>

<!-- 插槽内容 -->
<template v-slot="{ data }"></template>
```

- 使用实例：

```js
<template>
  <div>
    <TableFilter url="/getUser" :filterItem="filterItem" :filter="filter" :defaultRows="20" :formatTableData="formatTableData">
      <template v-slot="{ data }">
        <el-table :data="data">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="gender" label="性别"></el-table-column>
          <el-table-column label="添加时间" sortable prop="createtime">
            <template v-slot="{ row }">
              <div >{{ row.createtime | formatTime }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-link :underline="false" @click="toDetail(row.id)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      <template>
    </TableFilter>
  </div>
</template>
<script>
const formatItem = (item) => {
  // do something
}
export default {
  data () {
    return {
      filterItem: [
        { prop: 'name', type: 'text', label: '名称' },
        { prop: 'gender', type: 'select', label: '性别', options: this.genderOptions }
      ],
      genderOptions: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }],
      filter: {
        status: 'enable'
      }
    }
  },
  methods: {
    formatTableData (list) {
      list.map(formatItem)
    }
  }
}
</script>
```

## 单例插件

项目中存在一类组件，这类组件可能是个在页面中会被频繁调用的弹出框，对于这类组件，显然在页面中引入多个是个不明智的做法，所以大多时候，我们会引入一个，让他根据不同的交互场景重新渲染内容，但是更好的做法是将他做成一个单例插件，通过函数调用的方法使用。

这里将介绍两种方法：

- 封装成vue插件，全局引入

- 单独引入，函数式调用

两种方法在使用上其实相差无几，在项目中，可以根据自己的喜好任选一种。

### vue插件：

- 目录结构：

```js
├── SingleComponent                       
    ├── component.vue       # 组件内容        
    └── index.js            # 组件创建
```

- index.js：

```js
import component from './component.vue'

let SingleComponent = {
  install: function (Vue) {
    const Constructor = Vue.extend(component)
    const instance = new Constructor()
    instance.init = false

    Vue.prototype.$singleComponent = (options, callback) => {
      if (!instance.init) {
        instance.$mount()
        document.body.appendChild(instance.$el)
        instance.init = true
      }

      // 从options里获取参数，赋值给组件实例中的data
      // 传入的callback绑定给组件实例的某个方法，实例方法将会把组件的数据暴露给这个回调
      instance.someOption = options.someValue
      instance.someMethods = callback
    }
  } 
}
export default SingleComponent
```

- app.js

```js
import Vue from 'vue'
import SingleComponent from './global/SingleComponent'

Vue.use(SingleComponent)
```

- 组件内使用：

```js
export default {
  data () {
    return {
      studentsList: []
    }
  }
  methods: {
    useComponent () {
      this.$singleComponent({ gender: 'male', age: 12 }, (list) => {
        this.studentsList = list
      })
    }
  }
}
```

### 函数式组件：

- 目录结构：

```js
├── SingleComponent                       
    ├── component.vue       # 组件内容        
    └── index.js            # 组件创建
```

- index.js：

```js
import Vue from '@/app.js'
import Component from './component.vue'

let instance = null
let SingleComponent = (options, callback) => {
  if (!instance) {
    const Consturctor = Vue.extend(Component)
    instance = new Consturctor()
    instance.$mount()
    document.body.appandchild(instance.$el)
  }

  // 从options里获取参数，赋值给组件实例中的data
  // 传入的callback绑定给组件实例的某个方法，实例方法将会把组件的数据暴露给这个回调
  instance.someOption = options.someValue
  instance.someMethods = callback

  return instance
}
```

- 组件中使用：

```js
import SingleComponent from '@/global/SingleComponent'

export default {
  data () {
    return {
      studentsList: []
    }
  },
  methods: {
    useComponent () {
      SingleComponent({ gender: 'male', age: 12 }, (list) => {
        this.studentsList = list
      })
    }
  }
}
```

## CMS组件

CMS（Content Management System）即内容管理系统，它的作用是可以让一个即使没有编码能力的用户，通过可视化的操作，就能编写出一个自定义的页面。

这里的示例，部分将会使用伪代码，主要提供一个CMS系统的设计思路。

```js
├── CMS                        
    ├── components                 # 存放公用组件
    ├── Modules                    # CMS组件库
    │   ├── Text                   # 示例文本组件
    │   │   ├── Module.vue         # 预览模块
    │   │   ├── options.js         # 可修改配置属性及校验
    │   │   └── Options.vue        # 配置属性操作面板
    │   └── index.js               # 注册CMS组件
    └── index.vue                  # 主面板
```

### 自选组件

从前面的目录结构，我们已经可以看出来，一个自选模块我们将用三个文件来实现：

- 预览模块：根据配置最终将展示的组件成品

- 属性及校验：定义组件将使用的属性结构及保存所需的校验

- 属性操作面板：包含所有可配置属性的表单

这里我们以一个文字组件作为示例，我们先来看看其中最关键的属性结构和校验的定义：

- options.js：

```js
import Validator from 'async-validator'
export const name = '文本'  // 自选组件名称

// 校验规则
const descriptor = {
  target: {
    type: 'object',
    fields: {
      link: { type: 'string', required: false },
      name: { type: 'string', required: false }
    }
  },
  text: { type: 'string', required: true, message: `${name}组件，内容不能为空` }
}

const validator = new Validator(descriptor)
export const validate = (obj) => {
  return validator.validate(obj)
}

// 默认属性
export const defaultOptions = () => {
  return {
    target: {
      link: '',
      name: ''
    },
    text: '',
    color: 'rgba(51, 51, 51, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    fontSize: '16px',
    align: 'left',
    fontWeight: 'normal'
  }
}
```

对属性的定义有了了解后，我们来看看对应的操作面板：

- Options.vue：

```js
<template>
  <el-form label-width="100px" :model="form">
    <el-form-item label="文本：" prop="text">
      <el-input type="textarea" :rows="3" v-model="form.text"></el-input>
    </el-form-item>
    <el-form-item label="字体大小：" class="inline">
      <el-input v-model.number="fontSize"></el-input>px
    </el-form-item>
    <el-form-item label="字体颜色：">
      <el-color-picker v-model="form.color" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="背景颜色：">
      <el-color-picker v-model="form.backgroundColor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="字体加粗：">
      <el-checkbox v-model="checked"></el-checkbox>
    </el-form-item>
    <el-form-item label="对齐方式：">
      <el-radio-group v-model="form.align">
        <el-radio label="left">左对齐</el-radio>
        <el-radio label="center">居中对齐</el-radio>
        <el-radio label="right">右对齐</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>
import { defaultOptions } from './options'
export default {
  name: 'options',
  props: {
    form: {
      type: Object,
      default () {
        return defaultOptions()
      }
    }
  },
  watch: {
    fontSize (val) {
      this.fontSize = val.replace(/[^\d]/g, '')
    }
  },
  computed: {
    // 字体大小
    fontSize: {
      get () {
        return this.form.fontSize.slice(0, -2)
      },
      set (val) {
        this.form.fontSize = val + 'px'
      }
    },
    // 字体是否加粗
    checked: {
      get () {
        return this.form.fontWeight === 'bold'
      },
      set (val) {
        if (val) {
          this.form.fontWeight = 'bold'
        } else {
          this.form.fontWeight = 'normal'
        }
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>
```

实际上，每个自选组件的配置属性，都将保存在form属性中，之后他会作为prop属性传给Module以展示预览效果。

- Module.vue：

```vue
<template>
  <div class="text" :style="style">
    {{options.text}}
  </div>
</template>
<script>
export default {
  name: 'module',
  props: {
    options: {
      type: Object,
      default () {
        return {
          text: '',
          align: 'left',
          color: 'rgba(19, 206, 102, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          fontSize: '16px',
          fontWeight: 'normal'
        }
      }
    }
  },
  computed: {
    style () {
      return {
        textAlign: this.options.align,
        color: this.options.color,
        backgroundColor: this.options.backgroundColor,
        fontSize: this.options.fontSize,
        fontWeight: this.options.fontWeight
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="css" scoped>
.text {
  word-break: break-all;
}
</style>
```

光看自选组件的三个文件，我们好像并没有将他们串在一起，别急，这些我们最终会在主面板里实现。

### 自选组件注册入口

- index.js：

```js
// 获取需要引入的自选组件
export const getComponents = () => {
  const modules = require.context('./', true, /.vue$/)
  const components = {}
  modules.keys().map(fileName => {
    const componentName = fileName.replace(/\.\/(\w+)\/(\w+).vue$/, '$1$2')
    components[componentName] = modules(fileName).default
  })
  return components
}

// 获取自选组件的预览模块
export const getModules = () => {
  const modules = require.context('./', true, /.vue$/)
  const cells = modules.keys().map(fileName => {
    return fileName.replace(/\.\/(\w+)\/\w+.vue$/, '$1')
  })
  return Array.from(new Set(cells))
}

// 获取自选组件默认属性
export const getDefaultOptions = () => {
  const modules = require.context('./', true, /options.js$/)
  const ret = {}
  modules.keys().forEach(fileName => {
    ret[fileName.replace(/\.\/(\w+)\/\w+.js$/, '$1')] = modules(fileName).defaultOptions
  })
  return ret
}

// 获取自选组件校验函数
export const getValidates = () => {
  const modules = require.context('./', true, /options.js$/)
  const ret = {}
  modules.keys().forEach(fileName => {
    ret[fileName.replace(/\.\/(\w+)\/\w+.js$/, '$1')] = modules(fileName).validate
  })
  return ret
}

// 获取自选组件名称
export const getModuleName = () => {
  const modules = require.context('./', true, /options.js$/)
  const ret = {}
  modules.keys().forEach(fileName => {
    ret[fileName.replace(/\.\/(\w+)\/\w+.js$/, '$1')] = modules(fileName).name
  })
  return ret
}
```

在index.js中定义的几个函数，都将在主面板中使用。

### 主面板

页面主要分为这样几个区块：

1. 自选组件列表

2. 已添加组件列表操作面板

3. 预览区域

4. 详情操作面板

![示例图：](https://cdn.jsdelivr.net/gh/Scorpio-li/picture/document/img/auto-component.png)

现在我们来看看主面板的实现：

```vue
<template>
  <div class="manage-content">
    <div class="designer">
      <div class="designer-menus__left">
        <div class="label">组件列表：</div>
        <span class="cell" v-for="cell in cells" :key="cell" @click="addModule(cell)">{{nameMap[cell]}}</span>
        <div class="label">页面导航：</div>
        <div v-if="modules.length === 0" class="map-wrapper">
          <div class="map-module">
            未添加组件
          </div>
        </div>
        <draggable v-else v-model="modules" class="map-wrapper" handle=".el-icon-rank">
          <div v-for="module in modules" class="map-module" :class="{ select: module.id === curModule.id }" :key="module.id" @click="selModule(module)">
            <i class="el-icon-rank"></i>
            <div class="name">
              {{nameMap[module.type]}}
            </div>
            <i class="el-icon-close" @click.stop="delModule(module.id)"></i>
          </div>
        </draggable>
      </div>
      <div class="designer-content">
        <!-- 预览区域 -->
        <div class="screen" ref="screen">
          <div class="module" v-for="module in modules" :key="module.id" @click="selModule(module)" :class="{ select: module.id === curModule.id }" :id="module.id">
            <component :is="module.type + 'Module'" :options="module.options"></component>
          </div>
        </div>
        <!-- 操作区域 -->
        <div class="operation-content">
          <el-button @click="$router.back()">取消</el-button>
          <el-button @click="save">保存</el-button>
        </div>
      </div>
      <div class="designer-menus__right">
        <!-- tab栏,配置组件和页面 -->
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="组件管理" name="module">
            <component v-if="curModule.type" :is="curModule.type + 'Options'" :form="curModule.options"></component>
          </el-tab-pane>
          <el-tab-pane label="页面管理" name="page">
            <!-- 页面全局信息配置，因为不是重点所以这里就不具体展示 -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { v1 } from 'uuid'
import draggable from 'vuedraggable'
import { getModules, getDefaultOptions, getComponents, getModuleName, getValidates } from './Modules'

const validates = getValidates()
const defaultOptions = getDefaultOptions()
export default {
  name: 'Designer',
  components: { ...getComponents(), draggable },
  props: {
    // 页面信息,用于回显
    pageForm: {
      type: Object
    }
  },
  data () {
    return {
      nameMap: getModuleName(),
      cells: getModules(),
      modules: [],
      curModule: {
        type: ''
      },
      activeName: 'module' // tab激活页
    }
  },
  created () {
    this.resumePage() // 检测是否需要回填数据
  },
  methods: {
    // 回填数据
    resumePage () {
      if (this.pageForm) {
        let page = JSON.parse(this.pageForm.page)
        this.modules = page.modules
        if (this.modules.length > 0) {
          this.curModule = this.modules[0]
        }
      }
    },
    selModule (module) {
      this.curModule = module
      const elem = document.getElementById(module.id)
      this.$refs.screen.scrollTo(0, elem.offsetTop)
    },
    delModule (id) {
      const index = this.modules.findIndex(({ id: _id }) => id === _id)
      this.modules.splice(index, 1)
      this.curModule = this.modules.length > 0 ? this.modules[index > 0 ? index - 1 : index] : { type: '' }
    },
    addModule (module) {
      const id = v1()
      this.modules.push({ id, type: module, options: defaultOptions[module]() })
      this.curModule = this.modules[this.modules.length - 1]
      this.$nextTick(() => {
        const elem = document.getElementById(id)
        this.$refs.screen.scrollTo(0, elem.offsetTop)
      })
    },
    // 保存
    save () {
      let pageContent = {
        modules: this.modules
      }
      let form = {
        page: JSON.stringify(pageContent)
      }
      // 校验组件数据
      const promises = this.modules.map(({ type, options }) => {
        return validates[type](options)
      })
      Promise.all(promises).then(data => {
        // submit form
      }).catch(({ error, fields }) => {
        const [{ message }] = Object.values(fields)[0]
        this.$message.error(message)
      })
    }
  }
}
</script>
```

这里比较关键的一点是，因为我们将会频繁对自选组件进行增删改，预览区域渲染的自选组件和详情操作面板中的内容将会经常变换，所以我们可以使用动态组件 **component** 结合is属性的绑定来实现。

