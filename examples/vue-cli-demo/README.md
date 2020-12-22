# vue-cli-demo

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


## Eslint配置

- 首先我们得在项目根目录建立一个  .eslintrc.js 文件，里面配置相关的规则，这边我发出平时我自己用的 👉Elisnt规则 吧，采用的是花裤衩的规则（我很多东西都是从他项目里学来的，感谢大佬），当然想要了解更详细的配置说明可以看这里 👉eslint配置说明

- 再建立一个 👉.eslintignore 文件，可以设置eslint的忽略文件/文件夹

- 接下来就是重头戏了，配置我们的VsCode编译器，来达到失去焦点就自动按照相关规则格式化，首先你得安装VsCode插件（eslint，prettier），然后在工作区设置setting.json（建议在工作区配置，毕竟每个项目都有不同的规则吧），添加如下配置

```js
{ 
    "files.autoSave": "onFocusChange",  
    "editor.codeActionsOnSave": {    
        "source.fixAll.eslint": true  
    }
}
```

## 配置环境变量和模式

相信很多小伙伴的请求API的地址大致应该有两个吧，一个是开发过程中用的测试接口，一个是打包上线的正式接口，那么我们好些时候可能打包的时候会忘记替换接口怎么办呢，虽然很多时候只需要Nginx反向代理一下就好了，但是会出现在这个问题，假设测试请求地址是  http://127.0.0.1:4000/a，正式请求地址是  http://127.0.0.1:4000/a/b，配置Nginx的人只代理了  http://127.0.0.1:4000/a，那正式环境就GG了，请求不到b啊，当然这是不专业情况，专业的都没问题的，本次就来处理碰到不专业的同事该怎么解决问题。前面只是个🌰，配置环境变量和模式还是可以干很多事情的

- 首先我们得去了解 👉环境变量和模式 是怎么给理解的以及如何配置及注意哪些细节

- 创建几个env文件（当然可以根据实际情况创建多个）

```js
.env.dev            
# 只在开发环境中被载入    
# 以下是 .env.dev 里面的内容    
NODE_ENV = development    
# 指定执行环境    
ENV = 'dev'  
# 指定执行脚本的 mode    V
UE_APP_BASE_API = 'http://127.0.0.1:4000/a'  
# 指定请求的接口    

.env.build_test     
# 只在打包测试环境被载入    
# 以下是 .env.build_test 里面的内容    
NODE_ENV = production    
ENV = 'build_test'    
VUE_APP_BASE_API = 'http://127.0.0.1:4000/a'    .

env.build_prod     
# 只在打包正式环境被载入    
# 以下是 .env.build_prod 里面的内容    
NODE_ENV = production    
ENV = 'build_prod'    
VUE_APP_BASE_API = 'http://127.0.0.1:4000/a/b'
```

- 配置我们的package.json的执行脚本

```js
"scripts": {    
    "serve": "vue-cli-service serve --mode dev",    
    "build:test": "vue-cli-service build --mode build_test",    
    "build:prod": "vue-cli-service build --mode build_prod"  
}
```

当我们执行 yarn serve / npm run serve 就会使用到 .env.dev 里面的配置了，执行其他的也是如此，然后我们可以在axios或者fetch配置请求的前缀了，请注意，在客户端侧代码中使用环境变量（如我们的请求地址），只有以 VUE_APP_ 开头的变量才可以被读取到，这些都是文档中明确说明的

```js
import axios from "axios";
const service = axios.create({  
    // 当前可以在此处访问到.env*文件的 VUE_APP_BASE_API  
    baseURL: process.env.VUE_APP_BASE_API
});
```

##  配置vue.config.js做一些配置和优化

在项目根目录创建 vue.config.js 文件，就可以在里面进行相关配置了，当然，这只是简单的配置

```js
module.exports = {
    /**
     * *如果您打算在子路径下部署站点，则需要设置publicPath，  
     * *例如GitHub Pages。 如果您打算将网站部署到https://foo.github.io/bar/，  
     * *然后publicPath应该设置为“ / bar /”。  
     * *在大多数情况下，请使用'/'！  
     * *详细信息：https://cli.vuejs.org/config/#publicpath  
     * */ 
    publicPath: "./",  // 静态资源访问  
    outputDir: "dist", // 打包输出路径  
    productionSourceMap: false, // 是否生成SourceMap文件定位错误（文件会比较多影响性能建议取消）  
    // 配置开发环境的代理用来解决跨域情况，注意 devServer 只在开发环境有效，打包以后出现的跨域情况可由后端和nginx反向代理解决  
    devServer: {    
        port: 4000,    
        proxy: {      
            "/": {        
                target: process.env.VUE_APP_BASE_API,        
                pathRewrite: {          
                    "^/": "/"        
                }      
            }    
        }  
    }
}
```

## 在 configureWebpack 和 chainWebpack 中进行相关的配置

- 首先对于常用的路径我想你不希望看到组件很深的时候需要用到某个资源就出现 ../../../utils/index.js 这种情况吧，所以我们可以配置 configureWebpack 中的alias，以后访问只需要 @/utils/index.js 替代了，可以这么说，此时的 '../../../  ===  @'，是不是很赏心悦目

```js
// 在 module.exports 导出对象中
configureWebpack:{  
    resolve: {    
        alias: {      
            '@': path.join(__dirname, 'src')    
        }  
    }
}
```

- 应该很多人不太习惯debug吧，大都是console满天飞，如果我们要解决打包以后消除项目中的 console，总不能一个个去找一个个删，那得多累人啊，万一以后还要用，又得加，多麻烦啊，所以我们要用上我们的插件了 terser-webpack-plugin，这样你在线上看不到console了

```js
// yarn add terser-webpack-plugin -D
const TerserPlugin = require('terser-webpack-plugin');

// 在 module.exports 导出对象中
configureWebpack:{  
    optimization: {      
        minimizer: [        
            new TerserPlugin({          
                terserOptions: {            
                    ecma: undefined,            
                    warnings: false,            
                    parse: {},            
                    compress: {              
                        drop_console: true,              
                        drop_debugger: false,              
                        pure_funcs: ['console.log'] // 移除console            
                    }          
                }        
            })      
        ]   
    }
}
```

- 对于Gzip压缩大概都不陌生，但是在nginx中配置远远不够的，我们还得在我们自己项目中加上这个，打包的时候对项目进行gzip压缩，配合nginx的gzip，在线上环境的时候大大提升资源加载速度，那就摆出我们的二号插件吧 compression-webpack-plugin ，在这里我们就需要判断啥环境使用该插件了

```js
// yarn add compression-webpack-plugin -D

const CompressionPlugin = require('compression-webpack-plugin');

const plugins = []

if(process.env.NODE_ENV === 'production'){  
    plugins.push(new CompressionPlugin({      
        test: /\.js$|\.html$|\.css/, // 对识别到的文件进行压缩      
        threshold: 10240, //对超过10k的数据压缩      
        deleteOriginalAssets: false //不删除源文件，如果nginx开启了gzip可以删除  
    })
)}
// 在 module.exports 导出对象中
configureWebpack:{
    // 在此引入  
    plugins:plugins
}
```

说真的，这个插件相当的有用，真的，gzip显著的提升了资源加载速度，怎么说来着，在公司的用作测试环境的土豆服务器上访问未开启gizp的项目，出现首屏的时间我足足等了40多s，但是开启了只需要9s，9s啊，快了好多好多了

- 接下来我们在 chainWebpack 中进行更细粒的配置，接下来在下方贴上配置

```js
chainWebpack(config) {
    // 可以提高第一个屏幕的速度，建议打开预加载，这句话使上面的9s的加载速度降低至7s，虽然不高，但是蚊子再小也是肉
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    //当页面很多时，它将导致太多无意义的请求
    config.plugins.delete('prefetch')
    
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          // 只打包第三方的依赖
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            // 使用optimization.splitChunks配置选项之后，可以移除重复的依赖模块。需要注意的是，插件将一些第三方模块分离到单独的块，减小了代码的体积，可以查看dist文件中文件块的体积
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs', 
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial'
                },
                antdUI: {
                  name: 'chunk-antdUI', // 我这边用的antdv 将antdv切割成一个包
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/ 
                }
              }
            })
            
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
```

