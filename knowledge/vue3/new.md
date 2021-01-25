# Vue3与Vue2的区别

## 新特性fragments

允许组件有多个根元素！

## template允许设置key

循环template再也不用往里面设置key了。

## 🔥$attrs 将包含class和style

```js
vue2.x中，class和style会被直接设置在组件的根元素上并且不会出现在$attrs中。
但是在vue3中，如果子组件只有一个根元素，则class和style会被直接设置在该元素上。超过一个则不会设置。
如果组件中设置了inheritAttrs: false，则无论如何都不会自动设置根元素的class和style。
```

## $listeners被移除

事件监听器也被包含还在了$attrs中。

## scopedSlots正式弃用

vue2.6中对slot进行了改版，但是仍然对scopedSlots兼容，vue3正式弃用掉scopedSlots

## 监听数组变化需要用deep属性啦

如果不加deep只能检测整个数组被替换。

## $children 被移除

如果想访问子组件，使用$refs。

## Filter被移除

不能再用|使用filter。