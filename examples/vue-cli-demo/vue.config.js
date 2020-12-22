module.exports  =   {
    /**
     * *如果您打算在子路径下部署站点，则需要设置publicPath，  
     * *例如GitHub Pages。 如果您打算将网站部署到https://foo.github.io/bar/，  
     * *然后publicPath应该设置为“ / bar /”。  
     * *在大多数情况下，请使用'/'！  
     * *详细信息：https://cli.vuejs.org/config/#publicpath  
     * */
    publicPath:   "./",
       // 静态资源访问  
    outputDir:   "dist",
      // 打包输出路径  
    productionSourceMap:  false,
      // 是否生成SourceMap文件定位错误（文件会比较多影响性能建议取消）  
    // 配置开发环境的代理用来解决跨域情况，注意 devServer 只在开发环境有效，打包以后出现的跨域情况可由后端和nginx反向代理解决  
    devServer:  {    
        port:  4000,
            
        proxy:  {      
            "/":  {        
                target:  process.env.VUE_APP_BASE_API,
                        
                pathRewrite:  {          
                    "^/":   "/"        
                }      
            }    
        }  
    }
}