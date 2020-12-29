# Vue组件间的通信 ☎️

## 1. 父组件传给子组件

父组件通过使用v-bind变量来实现数据的传入

```js
// 父组件
<Child :name="name" :clickFn="handleClick"/>
```

子组件通过实现options上面的props来接受父组件传递过来的数据

props接受约束数据，下面罗列了四种方式：

```js
// 方式1：直接传递变量名，不做任何的类型约束以及值约束
props:['name','handleClick']


// 方式2：传递变量名 + 类型的约束
props:{
  name: String,
  handleClick: Function
}

// 方式3 ：传递变量名 + 多个类型的约束
props:{
  name: [String, Number]
}

// 方式4：传递变量名 + 类型的约束 + 默认值
props:{ 
  name:{
    type:String,
    default: 'zhangshan'
  },
  handleClick:{
     type: Function,
     default: ()=>{}
  }
}
```

并且为了保证单行数据流，不会造成其他子组件使用到父组件传递过来的数据的异常，要求子组件是不能够修改props的数据的值

## 2. 子组件传给父组件

vue的原型上实现了$emit的方法，用来做事件的发送

子组件会通过$emit发送事件给父组件，父组件通过v-on的形式来监听子组件发送来的事件

```js
// 子组件
<button @click="$emit('onChildClick')">click me </button>

// 父组件
<Child @onChildClick=“onChildClick”/>
```

如果需要传递参数，可以直接在$emit的第二个参数处写入

```js
// 子组件
<button @click="$emit('onChildClick', item)">click me </button>

// 父组件
<Child @onChildClick=“onChildClick”/>

onChildClick(item){
  console.log('我接受到了子组件传递过来的参数啦！', item)
}
```

## 3. 父组件主动获取子组件实例

ref是可以设置在子组件标签上面的一个属性，我们可以通过this.$refs.childRef来获取到子组件的实例，从而从实例上面调用子组件的属性或者方法！

```js
<Child ref="childRef"/>

this.$refs.childRef.onChildClick()
```

除了ref，还可以使用$children来获取到子组件的实例，从而从实例上面调用子组件的属性或者方法！

```js
this.$children[0] // 第一个孩子组件
```

## 4. 子组件主动获取父组件的实例

在子组件可以通过this.$parent来获取到父组件的实例，从而从实例上面调用子组件的属性或者方法！用法同上。

## 5. 父组件传递到孙组件

- 默认传递方法(依次传递)

```js
// 爷爷
<Parent :name="name" :age="age" :gender=“gender”/>

// 父亲
<Child :name="name" :age="age" :gender=“gender”/>
props:['name', 'age', 'gender']

// 孙子
<div>{{name}} - {{age}} - {{gender}}</div>
props:['name', 'age', 'gender']
```

- 录音笔传递（v-bind="$props" 传递全部的props）

```js
// 爷爷
<Parent :name="name" :age="age" :gender=gender/>

// 爸爸 props接受 && props一起传
<Child v-bind="$props"/>
props:['name', 'age', 'gender']

// 儿子 props接受
<div>{{name}} - {{age}} - {{gender}}</div>
props:['name', 'age', 'gender']
```

但父组件仍然需要将props的参数分解出来再传递下去，稍显复杂

- v-bind="$attrs"的其中一个功能是可以实现传递不在props里面的值

```js
// 爷爷
<Parent :name="name" :age="age" :gender=gender/>

// 父亲
<Child v-bind="$attrs"/>

// 儿子 props接受
<div>{{name}} - {{age}} - {{gender}}</div>
props:['name', 'age', 'gender']
```

```js
// 儿子 props 不接受
<div>{{$attrs.name}} - {{$attrs.age}} - {{$attrs.gender}}</div>
```

## 6. 孙组件给父组件通信

孙子先把电话$emit('onChildClick')打给了爸爸，爸爸拆解了孙子要说的话，再打电话给爷爷@onChildClick="$emit('onChildClick')"

```js
// 儿子
<button @click="$emit('onChildClick')" @click="$emit('onChildClick1')">click me </button>

// 爸爸
<Child @onChildClick="$emit('onChildClick')"  @onChildClick1="$emit('onChildClick1')"/>

// 爷爷
<Parent @onChildClick="console.log('我终于收到了孙子辈的点击事件了！')"  @onChildClick1="console.log('我终于收到了孙子辈的点击事件了1！')"/>
```

- 为了保证通话的安全性，v-on="$listeners"可以实现事件的打包📦

```js
// 儿子
<button @click="$emit('onChildClick')">click me </button>

// 爸爸
<Child v-on=“$listeners”/>
  
// 爷爷
<Parent @onChildClick="console.log('我终于收到了孙子辈的点击事件了！')"/>
```

## 7. 跨多层通信

当我们的组件层级更深的时候，A -> B -> C -> D -> E  -> F ，上面的方法都显得不太适用了，我们可以使用 provide & inject 来实现跨层级的数据传递。

父组件只要声明了provide，在其子组件，孙组件，曾孙组件等能形成上下游关系的组件中交互，无论多深都能通过inject来访问provider中的数据。

```js
// 最上面的组件 elForm
provide(){
   return {elForm:this}  
}

// 最下面的组件 elFormItem
inject:['elForm']
```

## 8. 兄弟组件之间通信

比较累的做法：props + emit + on

兄弟1组件emit -> 父组件on -> 兄弟2组件props

期望做法：兄弟1组件emit事件，兄弟2组件on事件

- event bus

全局EventBus，虽然在某些示例中不提倡使用，但它是一种非常漂亮且简单的方法，可以跨组件之间共享数据。

    1.定义一个空的Vue实例，作为中央事件总线。

    2.A组件定义方法去触发自定义事件

    3.B组件在钩子里面去监听

```js
var EventBus = new Vue();

this.$bus.$emit('call',{...});

this.$bus.$on('call',($event) => {...})
```

- vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

```js
export default new Vuex.Store({
  state: {
    userInfo:{}
  },
  mutations: { // commit
    updateUserInfo (state,Object) {
       state.userInfo= Object
    }
  },
  actions: { // dispatch 副作用
    getUserInfo(context){
    		// 1.发送http请求，拿到用户信息数据
    		const userInfo = http()
    		
    		// 2.通过commit发送mutation里面的方法修改state
    		context.commit('updateUserInfo', userInfo)
    }
  },
  getters:{
    userInfo: state.userInfo
  }
})
```

## Vue组件通信方式总结：

### 1. prop &  this.$emit

prop通信方式大家最常见的，也是最常用的父子组件通信类型，我们可以直接在标签里面给子组件绑定属性和方法，对于属性我们可以直接通过子组件声明的prop拿到，对于父元素的方法，我们可以通过 this.$emit触发。

- 父组件：

```js
<template>
  <div class="father" >
     <input  v-model="mes"   /> <button @click="send"  >对子组件说</button>
     <div>子组件对我说：{{  sonMes  }}</div>
     <son :fatherMes="sendSonMes" @sonSay="sonSay"   />
  </div>
</template>
<script>
import son from './son'
export default {
   name:'father',
   components:{
       son /* 子组件 */
   },
   data(){
       return {
          mes:'',
          sendSonMes:'', /* 来自子组件的信息 */
          sonMes:''      /* 发送给子组件的信息  */
       } 
   },
   methods:{
      /* 传递给子组件 */
      send(){
          this.sendSonMes = this.mes
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
}
</script>
```

我们这里只需要将给子组件的数据fatherMes和提供给子组件的方法 sonSay 通过标签方式传递给子组件。

- 子组件：

```js
<template>
    <div class="son" >
        <div> 父组件对我说：{{ fatherMes  }} </div>
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
    </div> 
</template>
<script>
export default {
   name:'son',
   props:{
      fatherMes:{
        type:String,
        default:''
      }
   },
   data(){
       return {
           mes:''
       }
   },
   methods:{
       send(){
           this.$emit('sonSay',this.mes)
       }
   },  
}
</script>
```

子组件通过props来定义接受父组件传递过来的信息,我们就可以直接通过this获取到，对于父组件传递的事件，我们可以通过this.$emit来触发事件。

#### 优点：

props传递数据优点是显而易见的，灵活简单，可以对props数据进行计算属性，数据监听等处理。父子组件通信灵活方便。这里可能单单仅限父子一层。

#### 缺点： 

1. props篡改：我们在子组件中使用父组件props的时候，如果涉及一些变量赋值，修改等操作，props被莫名其妙的修改了，连同父组件的数据也被篡改了。如果props是基础数据类型，当我们改变的时候，就会曝出错误。但是当我们传过来的是一个引用数据类型，并且修改数据下某一个属性的时候。子组件虽然不能直接对父组件prop进行重新赋值，但是当父组件是引用类型的时候，子组件可以修改父组件的props下面的属性。

2. 跨层级通信，兄弟组件通讯困难：对于父组件-子组件-子组件的子组件这种跨层级的通信，显然需要我们一层一层的prop绑定属性和方法，如果遇到更复杂的情况，实现起来比较困难。对于兄弟组件之间的通讯，props需要通过父组件作为桥梁，实现子组件-> 父组件 -> 子组件通信模式，如果想要通过父组件做媒介，那么必定会造成父组件重新渲染，为了实现兄弟组件通信付出的代价比较大。

#### 应用场景

props的应用场景很简单，就是正常不是嵌套很深的父子组件通信，和关系不是很复杂的兄弟组件组件通信。

### 2. this.$xxx:

我们所谓的组件，最终都会是一个对象，存放组件的各种信息,组件和组件通过this.$children和this.$parent指针关联起来。

因为在项目中只有一个root根组件,理论上，我们可以找到通过this.$children this.$parent来访问页面上的任何一个组件 ，但是实际上如何精确匹配到目标组件，确是一个无比棘手的问题。

- 父组件

```js
<template>
  <div class="father" >
     <input  v-model="mes"   /> <button @click="send"  >对子组件说</button>
     <son2 v-if="false" />
     <div>子组件对我说：{{  sonMes  }}</div>
     <son />
  </div>
</template>
<script>
import son from './son'
import son2 from './son2'
export default {
   name:'father',
   components:{
       son ,/* 子组件 */
       son2
   },
   data(){
       return {
          mes:'',
          sendSonMes:'', /* 来自子组件的信息 */
          sonMes:''      /* 发送给子组件的信息  */
       } 
   },
   methods:{
      /* 传递给子组件 */
      send(){
          /* 因为son组件是第一个有效组件所以直接去下标为0的组件 */
          const currentChildren = this.$children[0]
          currentChildren.accept(this.mes)
      },
      /* 接收子组件的信息 */
      accept(value){
         this.sonMes = value
      }
      
   },
}
</script>
```

- 子组件

```js
<template>
    <div class="son" >
        <div> 父组件对我说：{{ fatherMes  }} </div>
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
    </div> 
</template>
<script>
export default {
   name:'son',
   data(){
       return {
           mes:'',
           fatherMes:''
       }
   },
   methods:{
       /* 接受父组件内容 */
       accept(value){
         this.fatherMes = value
       },
       /* 向父组件发送信息 */
       send(){
           this.$parent.accept(this.mes)
       },
   },
}
</script>
```

我们可以清楚看到，和props通信相比，this.$parent，this.$children显得更加简洁，无需再给子组件绑定事件和属性，只需要在父组件和子组件声明发送和接受数据的方法。就可以实现组件间的通信，看起来很是便捷，但是实际操作中会有很大的弊端，而且vue本身也不提倡这种通信方式。而且这种通信方式也有很多风险性，我们稍后会给予解释。

#### 优点：

简单，方便 **this.$children,this.$parent this.$refs** 这种通信方式，更加的简单直接获取vue实例，对vue实例下的数据和方法直接获取或者引用。

#### 缺点：

1. $this.children不可控性大,有一定风险：对于v-if动态控制组件显示隐藏的不建议用this.$children用法，取而代之的我们可以用ref获取对应子组件的实例。

2. 不利于组件化

3. 兄弟组件深层次嵌套组件通讯困难

#### 应用场景：

直接通过实例获取的通信方式适合已知的，固定化的页面结构,这种通讯方式，要求父子组件高度透明化，知己知彼，很明确父子组件有那些方法属性，都是用来干什么。所以说这种方式更适合页面组件，而不适合一些第三方组件库，或者是公共组件。

### 3. provide inject

在父组件上通过provide将方法，属性，或者是自身实例暴露出去，子孙组件，插槽组件,甚至是子孙组件的插槽组件，通过inject把父辈provide引进来。提供给自己使用，很经典的应用 provide和 inject的案例就是 element-ui中 el-form和 el-form-item

#### 基本用法：

我们用父组件 -> 子组件 -> 孙组件 的案例

- 父组件：

```js
<template>
  <div class="father" >
     <div>子组件对我说：{{  sonMes  }}</div>
     <div>孙组件对我说：{{  grandSonMes  }}</div>
     <son />
  </div>
</template>
<script>
import son from './son'
export default {
   name:'father',
   components:{
       son /* 子组件 */
   },
   provide(){
       return {
           /* 将自己暴露给子孙组件 ,这里声明的名称要于子组件引进的名称保持一致 */
           father:this
       }
   },
   data(){
       return {
          grandSonMes:'', /* 来自子组件的信息 */
          sonMes:''      /* 发送给子组件的信息  */
       } 
   },
   methods:{
      /* 接受孙组件信息 */
      grandSonSay(value){
          this.grandSonMes = value
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
}
</script>
```

这里我们通过provide把本身暴露出去。⚠️⚠️⚠️这里声明的名称要与子组件引进的名称保持一致

- 子组件： 

```js
<template>
    <div class="son" >
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
        <grandSon />
    </div> 
</template>

<script>
import  grandSon from './grandSon'
export default {
    /* 子组件 */
   name:'son',
   components:{
       grandSon /* 孙组件 */
   },
   data(){
       return {
           mes:''
       }
   },
   /* 引入父组件 */
   inject:['father'],
   methods:{
       send(){
           this.father.sonSay(this.mes)
       }
   },
    
}
</script>
```

子组件通过inject把父组件实例引进来，然后可以直接通过this.father可以直接获取到父组件，并调用下面的sonSay方法。

- 孙组件

```js
<template>
   <div class="grandSon" >
        <input  v-model="mes"  /> <button @click="send"  >对爷爷组件说</button>
    </div> 
</template>

<script>
export default {
    /* 孙组件 */
   name:'grandSon',
   /* 引入爷爷组件 */
   inject:['father'],
   data(){
       return {
           mes:''
       }
   },
   methods:{
       send(){
           this.father.grandSonSay( this.mes )
       }
   }
}
</script>
```

孙组件没有如何操作，引入的方法和子组件一致。

#### 插槽方式

provide , inject 同样可以应用在插槽上，我们给父子组件稍微变动一下。

- 父组件：

```js
<template>
  <div class="father" >
     <div>子组件对我说：{{  sonMes  }}</div>
     <div>孙组件对我说：{{  grandSonMes  }}</div>
     <son >
         <grandSon/>
     </son>
  </div>
</template>
<script>
import son from './slotSon'

import grandSon from './grandSon' 
export default {
   name:'father',
   components:{
       son, /* 子组件 */
       grandSon /* 孙组件 */
   },
   provide(){
       return {
           /* 将自己暴露给子孙组件 */
           father:this
       }
   },
   data(){
       return {
          grandSonMes:'', /* 来自子组件的信息 */
          sonMes:''      /* 发送给子组件的信息  */
       } 
   },
   methods:{
      /* 接受孙组件信息 */
      grandSonSay(value){
          this.grandSonMes = value
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
}
</script>
```

- 子组件

```js
<template>
    <div class="son" >
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
        <slot />
    </div> 
</template>
```

达到了同样的通信效果。实际这种插槽模式,所在都在父组件注册的组件，最后孙组件也会绑定到子组件的children下面。和上述的情况差不多。

#### 其他用法

provide不仅能把整个父组件全部暴露出去，也能根据需要只暴露一部分（一些父组件的属性或者是父组件的方法），上述的例子中，在子孙组件中，只用到了父组件的方法，所以我们可以只提供两个通信方法。但是这里注意的是，如果我们向外提供了方法,如果方法里面有操作this行为，需要绑定this

- 父组件：

```js
   provide(){
       return {
           /* 将通信方法暴露给子孙组件(注意绑定this) */
           grandSonSay:this.grandSonSay.bind(this),
           sonSay:this.sonSay.bind(this)
       }
   },   
   methods:{
      /* 接受孙组件信息 */
      grandSonSay(value){
          this.grandSonMes = value
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
```

- 子组件：

```js
/* 引入父组件方法 */
   inject:['sonSay'],
   methods:{
       send(){
           this.sonSay(this.mes)
       }
   },
```

#### 优点：

1. 组件通信不受到子组件层级的影响：provide inject用法 和 react.context非常相似， provide相当于Context.Provider ,inject 相当于 Context.Consumer,让父组件通信不受到组件深层次子孙组件的影响。

2. 适用于插槽，嵌套插槽：provide inject 让插槽嵌套的父子组件通信变得简单，这就是刚开始我们说的，为什么 el-form 和 el-form-item能够协调管理表单的状态一样。在element源码中 el-form 就是将this本身provide出去的。

#### 缺点：

1. 不适合兄弟通讯：provide-inject 协调作用就是获取父级组件们提供的状态，方法，属性等，流向一直都是由父到子，provide提供内容不可能被兄弟组件获取到的，所以兄弟组件的通信不肯能靠这种方式来完成。

2. 父级组件无法主动通信：provide-inject更像父亲挣钱给儿子花一样，儿子可以从父亲这里拿到提供的条件，但是父亲却无法向儿子索取任何东西。正如这个比方，父组件对子组件的状态一无所知。也不能主动向子组件发起通信。

#### 应用场景

provide-inject这种通信方式，更适合深层次的复杂的父子代通信，子孙组件可以共享父组件的状态，还有一点就是适合el-form el-form-item这种插槽类型的情景。

### 4. vuex

vuex算是vue中处理复杂的组件通信的最佳方案，毕竟是vue和vuex一个娘胎里出来的。而且vuex底层也是用vue实现的。相信不少同学对vuex并不陌生。接下来我们开始介绍vuex。

#### 基础用法

- vuex文件

```js
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        fatherMes:'',
        sonMes:'',
        fatherMesAsync:''
    },
    mutations:{
       sayFaher(state,value){
           state.fatherMes = value
       },
       saySon(state,value){
           state.sonMes = value
       },
       sayAsyncFather(state,value){
           state.fatherMesAsync = value
       }
    },
    actions:{
       asyncSayFather({ commit },payload){
           return new Promise((resolve)=>{
               setTimeout(()=>{
                   resolve(payload)
               },2000)
           }).then(res=>{
               commit('sayAsyncFather',res)
           })
       }
    }
})
```

在store文件中，我们声明三个mutations 分别是向父组件通信saySon，父组件向子组件通信，同步方法sayFaher和异步方法sayAsyncFather ,actions中模拟了一个三秒后执行的异步任务asyncSayFather。

- main.js注入store

```js
import store from './components/vuex/store'

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```

- 父组件：

```js
<template>
  <div class="father" >
     <input  v-model="mes"   /> <button @click="send"  >同步：对子组件说</button><br/>
      <input  v-model="asyncMes"   /> <button @click="asyncSend" >异步：对子组件说</button><br/>
     <div>子组件对我说：{{  sonMes  }}</div>
     <son />
  </div>
</template>
<script>
import son from './son'
export default {
   /* 父组件 */
   name:'father',
   components:{
       son ,/* 子组件 */
   },
   data(){
       return {
          mes:'',
          asyncMes:''
       } 
   },
   computed:{
       sonMes(){
           return this.$store.state.sonMes
       }
   },
   mounted(){
       console.log(this.$store)
   },
   methods:{
      /* 触发mutations，传递数据给子组件 */
      send(){
        this.$store.commit('sayFaher',this.mes)
      },
      /* 触发actions，传递数据给子组件 */
      asyncSend(){
         this.$store.dispatch('asyncSayFather',this.asyncMes) 
      }
   },
}
</script>
```

父组件分别触发同步异步方法，把信息发送给子组件。用computed来接受vuex中的state。

- 子组件：

```js
<template>
    <div class="son" >
        <div> 父组件对我说：{{ fatherMes  }} </div>
        <div> 父组件对我说(异步)：{{ fatherMesAsync  }} </div>
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
    </div> 
</template>
<script>
export default {
   name:'son',
   data(){
       return {
           mes:'',
       }
   },
   computed:{
       /* 接受父组件同步消息 */
       fatherMes(){
           return this.$store.state.fatherMes
       },
       /* 接受父组件异步消息 */
       fatherMesAsync(){
           return this.$store.state.fatherMesAsync
       }
   },
   methods:{
       /* 向父组件发送信息 */
       send(){
           this.$store.commit('saySon',this.mes)
       },
   },
    
}
</script>
```

#### 优点：

1. 根本解决复杂组件的通信问题

2. 支持异步组件通信

vuex中actions允许我们做一些异步操作，然后通过commit可以把数据传入对应的mutation,至于actions为什么可以执行异步，是因为里面底层通过Promise.resolve能够获取异步任务完成的状态。

#### 应用场景
实际开发场景中，不会存在demo项目这样简单的通信，vuex的出现，就是解决这些比较复杂的组件通信场景。对于中大型项目，vuex是很不错的状态管理，数据通信方案。


### 5. 事件总线一 EventBus

EventBus事件总线, EventBus 所有事件统一调度，有一个统一管理事件中心，一个组件绑定事件，另一个组件触发事件，所有的组件通信不再收到父子组件的限制，那个页面需要数据，就绑定事件，然后由数据提供者触发对应的事件来提供数据，这种通讯场景不仅仅应用在vue,而且也应用在react。

EventBus 核心思想是事件的绑定和触发，这一点和vue中 this.$emit 和 this.$on一样，这个也是整个EventBus核心思想。接下来我们来重点解析这个流程。

- EventBus

```js
export default class EventBus {
    es = {}
     /* 绑定事件 */ 
    on(eventName, cb) {
        if (!this.es[eventName]) {
            this.es[eventName] = []
        }
        this.es[eventName].push({
            cb
        })
    }
    /* 触发事件 */
    emit(eventName, ...params) {
        const listeners = this.es[eventName] || []
        let l = listeners.length

        for (let i = 0; i < l; i++) {
            const { cb } = listeners[i]
            cb.apply(this, params)
        }
    }
}

export default new EventBus()
```

- 父组件：

```js
<template>
  <div class="father" >
     <input  v-model="mes"   /> <button @click="send"  >对子组件说</button>
     <div>子组件对我说：{{  sonMes  }}</div>
     <son />
     <brotherSon />
  </div>
</template>
<script>
import son from './son'
import brotherSon from './brother'
import EventBus from './eventBus'
export default {
   name:'father',
   components:{
       son ,/* 子组件 */
       brotherSon, /* 子组件 */
   },
   data(){
       return {
          mes:'',
          sonMes:''/* 发送给子组件的信息  */
       } 
   },
   mounted(){
      /* 绑定事件 */
      EventBus.on('sonSay',this.sonSay)
   },
   methods:{
      /* 传递给子组件 */
      send(){
          EventBus.emit('fatherSay',this.mes)
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
}
</script>
```

我们在初始化的时候通过EventBus的on方法绑定sonSay方法供给给子组件使用。向子组件传递信息的时候，通过emit触发子组件的绑定方法，实现了父子通信。 接下来我们看一下子组件。

- 子组件：

```js
<template>
    <div class="son" >
        <div> 父组件对我说：{{ fatherMes  }} </div>
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button>
        <div>
            <input  v-model="brotherMes"   /> <button @click="sendBrother"  >对兄弟组件说</button>
        </div>
    </div> 
</template>
<script>
import EventBus from './eventBus' 
export default {
   name:'son',
   data(){
       return {
           mes:'',
           brotherMes:'',
           fatherMes:''
       }
   },
   mounted(){
       /* 绑定事件 */
       EventBus.on('fatherSay',this.fatherSay)
   },
   methods:{
       /* 向父组件传递信息 */
       send(){
          EventBus.emit('sonSay',this.mes)
       },
       /* 向兄弟组件传递信息 */
       sendBrother(){
          EventBus.emit('brotherSay',this.brotherMes)
       },
       /* 父组件对我说 */
       fatherSay(value){
          this.fatherMes = value
       }
   },
    
}
</script>
```

和父组件的逻辑差不多，把需要接受数据的方法，通过EventBus绑定，通过触发eventBus方法，来向外部传递信息。我们还模拟了兄弟之间通信的场景。我们建立一个兄弟组件。

- 兄弟组件

```js
<template>
  <div class="son" > 兄弟组件对我说: {{ brotherMes  }} </div>
</template>

<script>

import EventBus from './eventBus'
export default {
   /* */
   name:'brother',
   data(){
       return {
          brotherMes:''
       }
   },
   mounted(){
       /* 绑定事件给兄弟组件 */
       EventBus.on('brotherSay',this.brotherSay)
   },
   methods:{
       brotherSay(value){
           this.brotherMes = value 
       }
   }

}
</script>
```
#### 优点

1. 简单灵活，父子兄弟通信不受限制。

eventBus的通信方式，相比之前的几种比较简单，而且不受到组件层级的影响，可以实现任意两个组件的通信。需要数据就通过on绑定，传递数据就emit触发。

2. 通信方式不受框架影响

eventBus的通信方式，不只是vue可以用，react,小程序都可以使用这种通信方式，而且笔者感觉这种通信方式更适合小程序通信，至于为什么稍后会一一道来。

#### 缺点

1. 维护困难，容易引起连锁问题

如果我们采用事件总线这种通信模式，因为所有事件是高度集中，统一管理的，中间如果有一个环节出现错误，就会造成牵一发动全身的灾难.而且后期维护也是十分困难的。

2. 需要谨小慎微的命令规范

现实的应用场景，要比demo场景复杂的多，实际场景会有无数对父子组件，无数对兄弟组件，我们不肯能每个事件都叫相同名字，所以eventBus绑定事件的命名要有严格的规范，不能起重复名字，也不能用错名字。

3. 不利于组件化开发

eventBus通信方式是无法进行有效的组件化开发的，假设一个场景，一个页面上有多个公共组件，我们只要向其中的一个传递数据，但是每个公共组件都绑定了数据接受的方法。我们怎么样做到把数据传递给需要的组件呢？

#### 应用场景

实现总线这种方式更适合，微信小程序，和基于vue构建的小程序，至于为什么呢，因为我们都知道小程序采用双线程模型（渲染层+逻辑层）（如下图所示），渲染层作用就是小程序wxml渲染到我们的视线中，而逻辑层就是我们写的代码逻辑，在性能上，我们要知道在渲染层浪费的性能要远大于逻辑层的代码执行性能开销，如果我们在小程序里采用通过props等传递方式，属性是绑定在小程序标签里面的，所以势必要重新渲染视图层。如果页面结构复杂，可能会造成卡顿等情况，所以我们通过eventBus可以绕过渲染层，直接有逻辑层讲数据进行推送，节约了性能的开销。

### 6. 事件总线二 new Vue

new Vue 这种通信方式和eventBus大致差不多，有一点不同的是，以vue实例作为eventBus中心，除了我们可以用$on,$emit之外，我们还可以用vue下的data,watch等方法，而且我们建立多个多个vue，作为不同模块的数据通信桥梁，相比上边那个EventBus方法，new Vue这种方法更高效,更适合vue项目场景。我们接着往下看。

- VueBus

```js
import Vue from 'vue'

export default new Vue()
```

- 父组件

```js
<template>
  <div class="father" >
     <input  v-model="mes"   /> <button @click="send"  >对子组件说</button>
     <div>子组件对我说：{{  sonMes  }}</div>
     <son />
  </div>
</template>
<script>
import son from './son'
import VueBus from './vueBus'
export default {
   /* 父组件 */ 
   name:'father',
   components:{
       son ,/* 子组件 */
   },
   data(){
       return {
          mes:'',
          sonMes:'' /* 发送给子组件的信息  */
       } 
   },
   created(){
       /* 绑定属性 */
       VueBus._data.mes = 'hello,world'
   },
   mounted(){
      /* 绑定事件 */
      VueBus.$on('sonSay',this.sonSay)
   },
   methods:{
      /* 传递给子组件 */
      send(){
         VueBus.$emit('fatherSay',this.mes)
      },
      /* 接受子组件信息 */ 
      sonSay(value){
          this.sonMes = value
      },
   },
}
</script>
```

我们通过 $on绑定了接受数据的方法，初始化的时候向 vue_data下面绑定了数据。

- 子组件：

```js
<template>
    <div class="son" >
        <div> 父组件对我说：{{ fatherMes  }} </div>
        <input  v-model="mes"   /> <button @click="send"  >对父组件说</button><br/>
        <button @click="getFatherMes" >获取数据</button>
    </div> 
</template>

<script>
import VueBus from './vueBus' 
export default {
   name:'son',
   data(){
       return {
           mes:'',
           brotherMes:'',
           fatherMes:''
       }
   },
   mounted(){
       /* 绑定事件 */
       VueBus.$on('fatherSay',this.fatherSay)
   },
   methods:{
       /* 向父组件传递信息 */
       send(){
          VueBus.$emit('sonSay',this.mes)
       },
       /* 父组件对我说 */
       fatherSay(value){
          this.fatherMes = value
       },
       /* 获取父组件存入vue中的数据 */
       getFatherMes(){
           console.log( VueBus._data.mes )
       }
   },

    
}
</script>
```

和eventBus事件总线一样,我们还可以直接通过_data数据直接获取到父组件传递的内容。

#### 优点

1. 简单灵活，任意组件之间通信。

和上边eventBus通信方式一样，这种通信方式很灵活，可以轻松在任意组件间实现通信。

2. 除了通信还可以使用watch  , computed等方法

如果我们通过vue作为通信媒介，那么只用其中的$emit和$on真的是有点大材小用了，既然实例了一个vue，我们可以轻松的使用vue的 $watch computed等功能。

#### 缺点

基本上EventBus的缺点，都在vue这种通信方式中都有存在。

#### 应用场景

在项目中不考虑用vuex的中小型项目中，可以考虑采用vue事件总线这种通信方式，在使用的这种方式的时候，我们一定要注意命名空间，不要重复绑定事件名称。分清楚业务模块，避免后续维护困难。

