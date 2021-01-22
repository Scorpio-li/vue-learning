# vue3-demo

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

## 目录树

```js
vue3-demo                                        
├─ public                                        
│  ├─ img                                        
│  │  └─ icons                                   
│  │     ├─ android-chrome-192x192.png           
│  │     ├─ android-chrome-512x512.png           
│  │     ├─ android-chrome-maskable-192x192.png  
│  │     ├─ android-chrome-maskable-512x512.png  
│  │     ├─ apple-touch-icon-120x120.png         
│  │     ├─ apple-touch-icon-152x152.png         
│  │     ├─ apple-touch-icon-180x180.png         
│  │     ├─ apple-touch-icon-60x60.png           
│  │     ├─ apple-touch-icon-76x76.png           
│  │     ├─ apple-touch-icon.png                 
│  │     ├─ favicon-16x16.png                    
│  │     ├─ favicon-32x32.png                    
│  │     ├─ msapplication-icon-144x144.png       
│  │     ├─ mstile-150x150.png                   
│  │     └─ safari-pinned-tab.svg                
│  ├─ favicon.ico                                
│  ├─ index.html                                 
│  └─ robots.txt                                 
├─ src                                           
│  ├─ Hooks            // hooks用来定义一些公共组件的方法，可以在多个组件里面复用，也可以和vuex联用                           
│  ├─ assets                                     
│  │  └─ logo.png                                
│  ├─ components                                 
│  │  └─ HelloWorld.vue                          
│  ├─ request          // request定义一些http请求。                          
│  │  ├─ api.js                              
│  │  ├─ api.js.map                              
│  │  ├─ api.ts        // api请求大全                               
│  │  ├─ base.js                                 
│  │  ├─ base.js.map                             
│  │  ├─ base.ts       // base路径                          
│  │  ├─ http.js                                 
│  │  ├─ http.js.map                             
│  │  └─ http.ts       // http.ts 可以做一下axios请求拦截和配置一下环境。(development， product）                          
│  ├─ router                                     
│  │  ├─ index.js                                
│  │  ├─ index.js.map                            
│  │  └─ index.ts                                
│  ├─ store                                      
│  │  ├─ index.js                                
│  │  ├─ index.js.map                            
│  │  └─ index.ts                                
│  ├─ typing           // typing定义一些你需要使用的ts类型                          
│  │  ├─ index.js                                
│  │  ├─ index.js.map                            
│  │  ├─ index.ts                                
│  │  ├─ menu.js                                 
│  │  ├─ menu.js.map                             
│  │  └─ menu.ts                                 
│  ├─ views                                      
│  │  ├─ About.vue                               
│  │  └─ Home.vue                                
│  ├─ App.vue                                    
│  ├─ main.js                                    
│  ├─ main.js.map                                
│  ├─ main.ts                                    
│  ├─ registerServiceWorker.js                   
│  ├─ registerServiceWorker.js.map               
│  ├─ registerServiceWorker.ts                   
│  └─ shims-vue.d.ts                             
├─ README.md                                     
├─ babel.config.js                               
├─ package.json                                  
├─ tsconfig.json                                 
└─ yarn.lock                                     
                                 
```