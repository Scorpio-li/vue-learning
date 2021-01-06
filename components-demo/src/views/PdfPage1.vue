<template>
    <div id="PdfPage1">
        <button type="button" class="btn btn-primary" @click="pdfBtn">导出PDF</button>
        <div id="pdfDom" style="padding:10px;background-color:#fff;">
            <img alt="Vue logo" src="@/assets/logo.png">
            <h1>Welcome to Your Vue.js App</h1>
            <p v-for="(item,index) in 5" :key="index">{{item}}Welcome to Your Vue.js App</p>
        </div>
    </div>
</template>

<script>
    import htmlToPdf from '@/utils/htmlToPdf'
    export default {
        name: "PdfPage",
        data(){
            return{
                htmlTitle:'页面导出PDF文件名',
            }
        },
        methods:{
            pdfBtn(){
                htmlToPdf.getPdf(this.htmlTitle);
            }
        }
    }
</script>

<style scoped>
</style>
