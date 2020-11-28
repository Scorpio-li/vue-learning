# 可能会用到的Vue.js库

## 1.Click Off to Close(元素范围之外的点击事件)

有的时候，我们需要在用户点击元素之外的时候触发一个事件。最常见的用例是当你想通过点击关闭一个下拉框或对话框时。这是一个必不可少的包，几乎在我构建的每个应用中都会用到。

首选：vue-clickaway

### 安装

我通常会将它安装在 main.js 中，以便在我的应用程序中使用。如果你只在一个或两个页面上使用它，你可能会想单独导入它。

如果你真的单独导入，请记住，指令需要在指令下暴露。

✅ directives: { onClickaway }

而不是组件：

❌ components: { onClickaway }

使其全局可用（在 main.js 中）：

```js
import { directive as onClickaway } from 'vue-clickaway'
Vue.directive('on-clickaway', onClickaway)
```

- 在模板中

```html
<button
    v-on-clickaway="closeYearSelect"
></button>
```

## 2.Toasts (Notification Bar) - 提示

首选：vue-toastification

Vue-toastification提供了几种在其文档中使用它的方法。你可以在组件级别，全局级别甚至在Vuex内执行此操作，如果你希望根据状态或与服务器相关的操作显示toasts

- 全局使用

```js
import Toast from 'vue-toastification'
// Toast styles
import 'vue-toastification/dist/index.css'
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 3,
  newestOnTop: true,
  position: 'top-right',
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.7,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false
})
```

1. 选项1：在组件（模板）中使用Toast

```
<button @click="showToast">Show toast</button> 

methods: {
    showToast() {
        this.$toast.success("I'm a toast!")
    }
}
```

2. 选项2：在Vuex action中发现错误（或成功）时调用Toast

```js
this._vm.$toast.error('Error Message:')
```

## 3.Tables

首选：vue-good-table


## 4.Date Picker

首选：vue2-datepicker

在组件或视图中导入，使其可以使用。

```js
import DatePicker from 'vue2-datepicker';
// styles
import 'vue2-datepicker/index.css';
```

- 在模板中

```js
<date-picker
    v-model="dateRange"
    value-type="format"
    range
    @clear="resetList"
    @input="searchDate"
>
</date-picker>
```

## 5.User Ratings（）评分

首选：vue-star-rating


