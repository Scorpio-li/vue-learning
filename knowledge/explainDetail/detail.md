<!--
 * @Author: Li Zhiliang
 * @Date: 2021-03-05 15:13:56
 * @LastEditors: Li Zhiliang
 * @LastEditTime: 2021-03-05 15:56:09
 * @FilePath: /vue-learning/knowledge/explainDetail/detail.md
-->

# Vue学习

## Vue实例

每个 **Vue** 应用都是通过用 Vue 函数创建一个新的 Vue 实例开始，分别添加Vue的周边生态：路由 **vue-router** 、国际化 **vue-i18n** 、状态管理 **vuex** ，和将要渲染的节点#app。

```js
new Vue({   
  el: '#app',
  router,  //vue-router
  i18n,    //vue-i18n
  store,   //vuex
  render: h => h(App)
})
```

## Vue模板

Vue的一个页面构成比较简单明了，更像是原来的html结构。

template里编写标签来生成dom节点，script里编写JavaScript来处理逻辑，style里编写css来处理样式。

```vue
<template>
  <div class='text'> 
      {{msg}}
  </div>
</template>

<script>
export default {
   name:'hello',
   //定义成函数是为了组件复用
   data:function(){
        return{
            msg:'Hello Vue!'
        }
    },
}
</script>

<style>
    .text{
        color:'red';
    }
</style>
```

Vue可以直接在模板里使用 msg属性 而不是 this.data.msg 这样使用，模板里使用 双括号。

## 常用指令

### v-if/v-else/v-else-if

v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回true值的时候被渲染, 也可以用 v-else-if 继续做判断，最后再用 v-else 做最后处理。

```vue
//Vue的模板语法  这里只有v-else的文字会显示出来
<template>
  <div id='app'> 
      <div v-if='flag === 0'>
          由于v-if里的条件判断结果是false,故现在不能看到文字
      </div>
      <div v-else-if = 'flag === 2'>
          v-else-if必须紧跟v-if后面，否则会无效
      </div>
      <div v-else>
           v-else必须紧跟v-if或者v-else-if后面，否则会无效
      </div>
  </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            flag:1
        }
    },
}
</script>

<style>
</style>	
```

### v-show

另一个用于根据条件展示元素的选项是 v-show 指令。

```js
//Vue的模板语法
<template>
  <div id='app'> 
      <div v-show='flag'>
          由于v-show里的条件判断结果是true,故现在可以看到文字
      </div>
  </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            flag:true
        }
    },
}
</script>

<style>
</style>
```

- v-if 就像if和else一样动态地创建元素，当v-if为false时会将 dom节点移除。所以当v-if控制的是组件，切换过程中条件块内的事件监听器和子组件会被 销毁和重建 ，会触发组件和子组件的生命周期。

- v-show 初始化时为false时会添加 style:'display:none' ，为true时会移除 display:none，不管渲染条件是什么，元素总是会被渲染，然后再进行css的操作。

### v-bind

一些指令能够接收一个 “参数”，在指令名称之后以冒号表示。例如，v-bind 指令可以用于响应式地更新 dom属性。

```vue
//Vue的模板语法
<template>
  <div id='app'> 
      <a v-bind:href='url' >
          跳转到百度
      </a>
      //缩写
      <a  :href='url' >
          跳转到百度
      </a>
  </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            url:'www.baidu.com'
        }
    }
}
</script>

<style>
</style>
```

### v-on

用于指出一个指令应该以特殊方式绑定。例如，v-on:click.prevent 修饰符告诉 v-on 指令对于触发点击的事件时并调用 event.preventDefault()，常用修饰符除.prevent以外常用的还有：

- .stop - 调用 event.stopPropagation()；

- .once - 只触发一次回调；

```js
//Vue的模板语法
<template>
  <div id='app'> 
      <span>{{ num }}</span>
      <button v-on:click.prevent="add">增加</button>

      //缩写
      <button @click.prevent="add">增加</button>
  </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            num:0
        }
    },
   methods:{
       add(){
           this.num++;
       } 
   }
}
</script>

<style>
</style>
```

### Vue的计算属性与侦听器

Vue模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护，所以任何复杂逻辑，应当使用计算属性。

```vue
<template>
  <div id='app'> 
  
      //bad example
      <div id='bad'>
          {{msg.split('').reverse().join('')}}  
      </div>
      
      //good example
      <div id='good'>
          {{reverseMsg}}
      </div>
  </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            msg:'Hello'
        }
    },
    computed:{
        reverseMsg: function(){
            return this.msg.split('').reverse().join('')
        }
    }
}
</script>
```

绑定普通属性一样在模板中绑定计算属性，Vue 知道 reversedMsg 依赖于  this.msg ，因此当 this.message 发生改变时，所有依赖 reversedMsg 的绑定也会更新。

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：侦听属性 watch ，可以用来监听值的变化来做一些事情，但是如果有一些数据要随着其他数据变动而变动时，应该使用   computed 而不是 watch。

```vue
<script>
export default {
   name:'hello',
   data:function(){
        return{
            a:{
                b:{
                    c:5
                }
            }
        }
    },
    watch: {
        c:{
            //属性变化时触发的事件
            handler:function(value,oldValue){
                console.log('新数据:'+value,'原数据:'+oldValue)
            },
            //该回调会在任何被侦听的对象的属性改变时被调用，不论其被嵌套多深
            deep:true,
            //该回调将会在侦听开始之后立马被调用
            immediate:true
        }
    } 
}
</script>
```

### Vue列表渲染

我们可以用 v-for 指令基于一个数组来渲染一个列表。v-for 指令需要使用 item in items 形式的特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的别名。

```vue
//Vue的模板语法
<template>
  <div id='app'> 
      <ul id="example">
          <li 
              v-for="(item,index) in items" 
              :key="item.message"
          >     
              {{ item.message }} - {{index}}
          </li>
      </ul>
  </div>
</template>

<script>
export default {
   name:'hello',
   //定义成函数是为了组件复用
   data:function(){
        return{
            items: [       
                { message: 'Foo' },       
                { message: 'Bar' }     
            ]
        }
    },
}
</script>
```

#### 数组更新检测

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：push()、pop()、shift()、unshift()、splice()、sort()、reverse()

```vue
//Vue的模板语法
<template>
  <div id='app'> 
      <span>{{ arr }}</span>
      <button @click="arr.pop()">出栈</button>
   </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            arr:[1,2,3,4,5]        
        }
    },
}
</script>
```

当点击按钮以后，数组每次就会 出栈一个元素，并且视图发生更新，但是当使用Array的filter()、concat() 和 slice() 等api时，它们将不会改变原数组，而是返回一个新数组，直接使用时不会更新视图，这里可以用新数组去替换原数组。

```vue
//Vue的模板语法
<template>
  <div id='app'> 
      <span>{{ arr }}</span>
      <button @click="filterArray">筛选大于等于3的元素</button>
   </div>
</template>

<script>
export default {
   name:'hello',
   data:function(){
        return{
            arr:[1,2,3,4,5]        
        }
    },
    methods:{
        filterArray(){
            this.arr = this.arr.filter.filter(function(item){
                return item >= 3
            })
        }
    }
}
</script>
```

### Vue组件传值与插槽

Vue 实现了一套内容分发的 API，将 slot 元素作为承载分发内容的出口。

Vue的子组件传递给父组件时，如果子组件触发的是 方法，则使用 this.$emit(eventName, args) 用来做自定义事件。如果子组件获取父组件的 属性值， 则使用 props 进行定义 类型 和 默认值。

```vue
//Vue子组件
<template>
    <div>
        <div @click="say">
            {{msg}}
            //插槽，类似于react里的{children}
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:'Hello',
    //定义props里的值类型和默认值
    props:{
        msg:{
            type:String,
            default:''
        }
    },
    methods:{
        say(){
            console.log('触发子方法给父组件')
            //给父组件的自定义方法
            this.$emit('say')
        }
    }
}
</script>

//Vue父组件
<template>
    <div>
        <Hello :msg="msg" @say="say">
          <div>插槽文字</div>
        </Hello>
    </div>
</template>

<script>
import Hello from "./Hello.vue";
export default {
    name:'App',
    //定义props里的值类型和默认值
    data:function(){
        return{
            msg:'传递给子组件的值'
        }
    },
    //注册组件
    components: {
        Hello,
    },
    methods:{
        say(){
            console.log('Hello')
        }
    }
}
</script>
```

## Vue生命周期

Vue的生命周期比较于React来说相对简单点，Vue大体划分四个阶段：

- 初始化：beforeCreate、created

- 渲染：beforeMount、mounted

- 更新：beforeUpdate、updated

- 卸载：beforeDestroy、destroy

还有三个生命周期较少使用，在updated后触发：

- activated	( keep-alive 组件激活时调用 )

- deactivated	( keep-alive 组件停用时调用 )

- errorCaptured （当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。）

```vue
<script>
        new Vue({
            el:'#app',
            data:{
                title:'hello word',
            },
            methods:{
                top(){
                    this.title="hi"
                }
            },
            beforeCreate(){
                //不能获得实例化data里的值
                //页面加载出来就会执行
                console.log(this.title)
                console.log('创建之前')
                //页面没加载出来，可以写加载的loading图
            },
            created(){
                console.log(this.title)
                console.log('创建之后')
            },
            beforeMount(){
                //把当前实例化的Vue挂载到绑定的DOM元素上
                //this.$el是获取当前实例化内的所有DOM节点
                //此时DOM中的变量没有被渲染
                //页面加载出来就会执行
                console.log(this.$el)
                console.log('挂载之前')
            },
            mounted(){
                //此时DOM内的变量已经被渲染
                console.log(this.$el)
                console.log('挂载之后') 
            },
            beforeUpdate(){
            //数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
                //你可以在这个钩子中进一步地更改状态，
                //这不会触发附加的重渲染过程。
                //改变的是DOM元素里的数据变更
                //data里的数据变更不会触发
                //页面加载出来不会执行，当数据变更才会执行
    console.log(document.querySelector('#val').innerHTML)
                console.log('更新之前')
                //该钩子在服务器端渲染期间不被调用。
            },
            updated(){
                //此时的DOM已经更新
                //避免在此期间更改状态，因为这可能会导致更新无限循环。
    console.log(document.querySelector('#val').innerHTML)
                console.log('更新之后'); 
            },
            beforeDestroy(){
                //实例销毁之前调用。在这一步，实例仍然完全可用。
                console.log('催毁之前'); 
            },
            destroy(){
        //Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定
         // 所有的事件监听器会被移除，所有的子实例也会被销毁。
                console.log('摧毁之后')
            }
        })
    </script>
```

#### 关于网络请求放在哪个生命周期里？

可以放置于created、beforeMount、mounted中进行，因为这三个生命周期里 this.data 已经被创建，可以将服务端返回数据进行赋值。

但是目前Vue的项目多用于 ssr服务端渲染 ，ssr 不支持 beforeMount、mounted生命周期函数，故推荐在 created 里调用请求，并且它能更快获取到服务端数据，减少loading时间。


