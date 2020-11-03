# 利用vue3+ts实现管理后台（增删改查）

[Github地址](https://github.com/CuteSunLee/vue3_ts_admin.git)

vue3 之后新增了composition API。本文就是利用composition API，将可复用的逻辑抽离到composition API中，并引入ts，实现一个简单的管理后台功能。

## 利用@vue/cli创建项目

```shell
vue create admin
cd admin
npm run serve
```

create选择手动选择Manually select features，会有一些交互性的选择，是否要安装router、vuex等选项，空格可以切换是否选中。我们选中TypeScript、Router、Vuex、CSS Pre-processors。

我们利用axios + axios-mock-adapter + mockjs来进行接口请求、接口模拟及假数据生成，接下来再安装这几个包。

```js
npm install axios
npm install -D axios-mock-adapter mockjs
```

