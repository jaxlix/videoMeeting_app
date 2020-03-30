<template>
    <div id="index">
        <Header title="发起视频会商" rightBtn="toCheckedList" />
        <div class="cell">
            <i class="icon-search"></i>
            <span>通讯录搜索</span>
        </div>
        <div class="cell">
            <i class="icon-addPhone"></i>
            <span>添加电话</span>
        </div>
        <div class="collect-box">
            <p class="title">收藏夹</p>
            <div class="scroll">
                <div class="item" v-for="(d, i) in collect" :key="i" @click="checkCollect(d)">
                    <i class="icon-collect"></i>
                    <span class="name">{{d.name}}</span>
                    <i :class="checkedCol[d.id] ? 'icon-check icon-checked' : 'icon-check'"></i>
                </div>
            </div>
        </div>
        <div class="contact-box">
            <p class="title">常用联系人</p>
            <div class="scroll">
                <div class="item" v-for="(d, i) in contact" :key="i" @click="checkContact(d)">
                    <i class="icon-collect"></i>
                    <span class="name">{{d.name}}</span>
                    <i :class="checkedCon[d.id] ? 'icon-check icon-checked' : 'icon-check'"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
    data() {
        return {
            collect: [
                // {
                //     id: 1,
                //     name: "开大会"
                // },
                // {
                //     id: 2,
                //     name: "部门会议"
                // },
                // {
                //     id: 3,
                //     name: "大会2"
                // },
                // {
                //     id: 4,
                //     name: "开大会3"
                // },
                // {
                //     id: 5,
                //     name: "开大会4"
                // }
            ],
            checkedCol: {},
            contact: [
                {
                    id: 6,
                    name: "开大会"
                },
                {
                    id: 7,
                    name: "部门会议"
                },
                {
                    id: 8,
                    name: "大会2"
                },
                {
                    id: 9,
                    name: "开大会3"
                },
                {
                    id: 10,
                    name: "开大会4"
                },
                {
                    id: 11,
                    name: "开大会"
                },
                {
                    id: 12,
                    name: "部门会议"
                },
                {
                    id: 13,
                    name: "大会2"
                },
                {
                    id: 14,
                    name: "开大会3"
                },
                {
                    id: 15,
                    name: "开大会4"
                }
            ],
            checkedCon: {},
        }
    },
    components: {
        Header
    },
    methods: {
        // 选择收藏夹
        checkCollect(d){
            console.log(d)
            if(this.checkedCol[d.id]){
                this.$set(this.checkedCol, d.id, false)
            }else{
                this.$set(this.checkedCol, d.id, true)
            }
        },
        // 选择常用联系人
        checkContact(d){
            console.log(d)
            if(this.checkedCon[d.id]){
                this.$set(this.checkedCon, d.id, false)
            }else{
                this.$set(this.checkedCon, d.id, true)
            }
        }
    }
};
</script>

<style lang="less" scoped>
#index {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 40px;
    box-sizing: border-box;
    color: #B5E5F0;
    .cell{
        padding: 10px 0;
        border-bottom: 1px solid rgba(30, 45, 63, .5);
        line-height: 20px;
        font-size: 16px;
        .icon-search{
            display: inline-block;
            width: 17px;
            height: 17px;
            margin-left: 20px;
            margin-right: 20px;
            background: url(../assets/icon-search.png) center center no-repeat;
            background-size: 100% 100%;
        }
        .icon-addPhone{
            display: inline-block;
            width: 17px;
            height: 17px;
            margin-left: 20px;
            margin-right: 20px;
            background: url(../assets/icon-addPhone.png) center center no-repeat;
            background-size: 100% 100%;
        }
    }
    .collect-box{
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(30, 45, 63, .5);
        .title{
            margin-left: 20px;
            padding: 5px 0;
            color: #B5E5F0;
        }
        .scroll{
            max-height: 120px;
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
                .icon-check{
                    width: 24px;
                    height: 24px;
                    padding: 8px 10px;
                    background: url(../assets/icon-check.png) center center no-repeat;
                    background-size: 24px 24px;
                    &.icon-checked{
                        background: url(../assets/icon-checked.png) center center no-repeat;
                        background-size: 24px 24px;
                    }
                }
            }
        }
    }
    .contact-box{
        height: calc(100% - 244px);
        .title{
            height: 30px;
            margin-left: 20px;
            padding: 5px 0;
            color: #B5E5F0;
        }
        .scroll{
            height: calc( 100% - 42px);
            overflow: hidden;
            overflow-y: auto;
            margin-bottom: 20px;
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
                .icon-check{
                    width: 24px;
                    height: 24px;
                    padding: 8px 10px;
                    background: url(../assets/icon-check.png) center center no-repeat;
                    background-size: 24px 24px;
                    &.icon-checked{
                        background: url(../assets/icon-checked.png) center center no-repeat;
                        background-size: 24px 24px;
                    }
                }
            }
        }
    }
}
</style>