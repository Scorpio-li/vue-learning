<template>
  <div class="hello">
    <h1 data-step="1" data-intro="这是第一步">{{ msg }}</h1>
    <p data-step="2" data-intro="这是第二步">
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3 data-step="3" data-intro="这是第三步">Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import introJs from 'intro.js'
import 'intro.js/introjs.css'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  // 钩子函数
    mounted() {
        this.guide()
    },
  // 定义方法
    methods: {
        guide() {
            introJs()
            .setOptions({
                nextLabel: '下一个',  // 下一个按钮文字
                prevLabel: '上一个',  // 上一个按钮文字
                skipLabel: '跳过',    // 跳过按钮文字
                doneLabel: '立即体验',// 完成按钮文字
                hidePrev: true,       // 在第一步中是否隐藏上一个按钮
                hideNext: true,       // 在最后一步中是否隐藏下一个按钮
                exitOnOverlayClick: false,  // 点击叠加层时是否退出介绍
                showStepNumbers: false,     // 是否显示红色圆圈的步骤编号
                disableInteraction: true,   // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
                showBullets: false          // 是否显示面板指示点
            }).start()
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
