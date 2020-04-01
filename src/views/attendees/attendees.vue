<template>
    <div id="attendees">
        <Header title="已选择" back="router" />
        <div class="content">
            <div class="item" v-for="(d, i) in collect" :key="i">
                <i class="icon-collect"></i>
                <span class="name">{{d.name}}</span>
                <i :class="d.collect ? 'icon-xing icon-xing_sc' : 'icon-xing'" @click="clickCollect(i)"></i>
                <i class="icon-del"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
    data() {
        return {
            collect: [],
            checkedCol: {}
        }
    },
    components: {
        Header
    },
    methods: {
        
    },
    created(){
        this.collect = this.$store.state.checked
    }
};
</script>

<style lang="less" scoped>
#attendees {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 40px;
    box-sizing: border-box;
    color: #B5E5F0;
    .content{
        padding-bottom: 10px;
        overflow: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            background-color: #0d182b;
        }
        &::-webkit-scrollbar {
            width: 8px;
            background-color: #0d182b;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
            background-color: #555;
        }
        .item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            border-bottom: 2px solid rgba(14,24,43,.5);
            .icon-collect{
                margin-left: 20px;
                width: 33px;
                height: 33px;
                background-color: rgb(13,56,87);
                border-radius: 5px;
            }
            .name{
                flex: 1;
                font-size: 16px;
                margin-left: 10px;
                text-align: left;
            }
            .icon-xing{
                width: 24px;
                height: 24px;
                padding: 8px 10px;
                background: url(../../assets/xing.png) center center no-repeat;
                background-size: 24px 24px;
                &.icon-xing_sc{
                    background: url(../../assets/xing_sc.png) center center no-repeat;
                    background-size: 24px 24px;
                }
            }
            .icon-del{
                width: 20px;
                height: 20px;
                padding: 8px 10px;
                background: url(../../assets/del.png) center center no-repeat;
                background-size: 20px 20px;
            }
        }
    }
}
</style>