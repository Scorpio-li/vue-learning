<template>
    <div class="animate">
        <ul>
            <!-- <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">css过度属性transition</a>
            </li>
            <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">css动画属性animation</a>
            </li> -->
            <li>
                <a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%8D%95%E5%85%83%E7%B4%A0-%E7%BB%84%E4%BB%B6%E7%9A%84%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">vue动画介绍</a>
            </li>
            <li>
                <a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">vue动画之列表</a>
            </li>
        </ul>

        <!-- 1.跟进列表 -->
        <div class="pic"></div>
        <div class="flex">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
        <transition-group
            name="more"
            v-bind:css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
        >
            
            <div class="item" v-for="item in arr" v-bind:data-index="item" v-bind:key="item">
                <div v-if="show3">
                    <div class="square"></div>
                    <div class="content">
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                    </div>
                </div>
            </div>
            
        </transition-group>
    </div>
</template>

<script>

export default {
    name: 'FlowList',
    data() {
        return {
            show1: false,
            show2: false,
            show3: false,
            arr: [1, 2, 3, 4, 5, 6, 7, 8]
        }
    },
    methods: {
        beforeEnter (el) {
            el.style.opacity = 0
        },
        enter (el, done) {
            // console.log(el.dataset.index)
            const delay = el.dataset.index * 100
            setTimeout(()=>{
                el.style.transition = 'opacity 0.4s '
                el.style.opacity = 1
                el.style.animation = 'one-in 0.4s infinite'
                el.style['animation-iteration-count'] = 1
                done()
            }, delay)
        }
    },
    mounted () {
        setTimeout(()=>{
            this.show1 = !this.show1
            this.show2 = !this.show2
            this.show3 = !this.show3
        })
    }
}
</script>

<style scoped>
    .pic {
        width: 97%;
        height: 120px;
        margin: 20px 5px;
        border-radius: 8px;
        background: #CAE5E8;
    }
    .item {
        margin: 5px;
        padding: 0px;
        overflow: hidden;
    }
    .item div {
        display: inline;
        float: left;
    }
    .flex {
        display: flex;
        justify-content: space-between
    }
    .card {
        width: 65px;
        height: 65px;
        margin: 15px 12px;
        margin-top: 0px;
        border-radius: 8px;
        background: #CAE5E8;
    }
    .item::after {
        content: "";
        clear: both;
        display: block;
    }
    .square {
        width: 20%;
        height: 75px;
        background: #CAE5E8;
        border-radius: 8px;
    }
    .content {
        width: 79%;
    }
    .content div {
        margin: 15px;
        margin-top: 0px;
        padding: 0px;
        width: 95%;
        border-radius: 8px;
        line-height: 30px;
        background: #99D1D3;
    }
    .content div:last-child {
        width: 65%;
        background: #CAE5E8;
    }
    @keyframes one-in {
        from {
            padding-top: 100px;
            height: 0%;
        }
        to {
            padding-top: 0px;
            height: 100%;
        }
    }
</style>