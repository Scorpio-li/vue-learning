// import { createApp } from 'vue'
// import App from './App.vue'
// import './index.css'

// createApp(App).mount('#app')

import { createApp } from 'vue'
import { Button } from 'vant';
import 'lib-flexible/flexible'
import store from './store'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'; // 全局引入样式
import './index.css'

const app = createApp(App) // 创建实例

app.use(Button) // 注册组件
app.use(store)
app.use(router)

app.mount('#app')