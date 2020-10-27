## 使用vite+vue3.0搭建项目

1. 全局安装create-vite-app
```shell
yarn global add create-vite-app@1.18.0
```

2. 创建项目目录
```shell
cva vue3-ui
或者
create-vite-app vue3-ui
```

## 实现暗/亮模式

1. 在 public 目录内创建一个 css/dark.css 文件，这是我们将在黑暗模式环境中存储所有CSS代码的地方。

2. 在src目录中创建 src/theme.js 文件,在head中创建一个link标签将其设置为我们创建的 dark.css 文件，以便可以应用在此定义的所有样式

3. 编辑 components/HelloWorld.vue 中的代码, 引入 themeChanger 类的实例，然后将其存储在Vue.js data实例中。然后，我们创建一个按钮，该按钮将调用我们在 theme.js 文件中创建的 _darkThemeSwitch
