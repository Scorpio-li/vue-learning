<template>
    <div id="PdfPage1" ref="screen">
        <button type="button" class="btn btn-primary" @click="pdfBtn">导出PDF0</button>
        <div id="pdfDom" class="pdf-screen" style="padding:10px;background-color:#fff;">
            <img alt="Vue logo" src="@/assets/logo.png">
            <h1>Welcome to Your Vue.js App</h1>
            <p v-for="(item,index) in 5" :key="index">{{item}}Welcome to Your Vue.js App</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PdfPage",
        data(){
            return{
                htmlTitle:'页面导出PDF文件名',
            }
        },
        methods:{
            pdfBtn(){
                // htmlToPdf.getPdf(this.htmlTitle);
                // 在需要导出pdf的函数中调用
                // dom是需要导出的最外层元素
                // this.$pdf(dom, options);

                // 使用案例（该配置可参考HTML2CANVAS相关配置）
                this.$pdf(this.$refs.screen, {
                    name: 'filename',   // 导出文件名
                    scale: 2,   // 导出文件清晰度，值越大清晰度越高，文件体积越大（默认值为设备dpr*2）
                    ignoreElements: (element) => {  // 忽略渲染元素（通过查询dom元素，不局限于类名查询）
                        if (element.className.indexOf('className') !== -1) {
                            return true;
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>
</style>
