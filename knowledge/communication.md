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

