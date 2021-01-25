<template>
    <div>
        <h2>使用 vue-json-excel 插件实现</h2>
        <downloadexcel
            class            = "btn"
            :data="json_data"
            :fields="json_fields"
            :before-generate = "startDownload"
            :before-finish   = "finishDownload"
            worksheet="My Worksheet"
            name="filename.xls">
            Download Excel
        </downloadexcel>
    </div>
</template>

<script>
import downloadexcel from "vue-json-excel";
// import axios from 'axios';

export default {
    name: "JsonExcel",
    components: {
        downloadexcel,
    },
    data(){
        return {
            // json_fields: {
            //     'Complete name': '下载完成',
            //     'Date': new Date(),
            // },
            json_fields: {
                "Complete name": "name",
                City: "city",
                Telephone: "phone.mobile",
                "Telephone 2": {
                    field: "phone.landline",
                    callback: (value) => {
                    return `Landline Phone - ${value}`;
                    },
                },
            },
            json_data: [
            {
                name: "Tony Peña",
                city: "New York",
                country: "United States",
                birthdate: "1978-03-15",
                phone: {
                mobile: "1-541-754-3010",
                landline: "(541) 754-3010",
                },
            },
            {
                name: "Thessaloniki",
                city: "Athens",
                country: "Greece",
                birthdate: "1987-11-23",
                phone: {
                mobile: "+1 855 275 5071",
                landline: "(2741) 2621-244",
                },
            },
            ],
            json_meta: [
            [
                {
                key: "charset",
                value: "utf-8",
                },
            ],
            ],
        }
    }, //data
    methods:{
        // async fetchData(){
        //     const response = await axios.get(URL);
        //     return response.data.holidays;
        // },
        startDownload(){
            alert('show loading');
        },
        finishDownload(){
            alert('hide loading');
        }
    }
};
</script>
