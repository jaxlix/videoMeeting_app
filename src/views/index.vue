<template>
    <div id="index" ref="index">
        <Header title="发起视频会商" back="android" rightBtn="toCheckedList" />
        <router-link to="/search" class="cell">
            <i class="icon-search"></i>
            <span>通讯录搜索</span>
        </router-link>
        <router-link to="/addPhone" class="cell">
            <i class="icon-addPhone"></i>
            <span>添加电话</span>
        </router-link>
        <div class="collect-box" ref="collect">
            <p class="title">收藏夹</p>
            <div class="scroll">
                <div class="item" v-for="(d, i) in collect" :key="i" @click="checkCollect(d)">
                    <i class="icon-collect"></i>
                    <span class="name">{{d.name}}</span>
                    <i :class="checked[d.id] ? 'icon-check icon-checked' : 'icon-check'"></i>
                </div>
            </div>
        </div>
        <div class="contact-box" :style="setHeight">
            <p class="title">常用联系人</p>
            <div class="scroll">
                <div class="item" v-for="(d, i) in contact" :key="i">
                    <i class="icon-collect"></i>
                    <span class="name">{{d.name}}</span>
                    <i :class="d.collect ? 'icon-xing icon-xing_sc' : 'icon-xing'" @click="clickCollect(i)"></i>
                    <i :class="checked[d.id] ? 'icon-check icon-checked' : 'icon-check'" @click="checkContact(d)"></i>
                </div>
            </div>
        </div>
        <div class="footer-btn" @click="startMeeting">开始会商</div>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
    data() {
        return {
            collect: [
                {
                    id: 1,
                    name: "开大会"
                },
                {
                    id: 2,
                    name: "部门会议"
                }
            ],
            contact: [
                {
                    id: 6,
                    name: "开大会",
                    collect: false
                },
                {
                    id: 7,
                    name: "部门会议",
                    collect: true
                },
                {
                    id: 8,
                    name: "大会2",
                    collect: false
                },
                {
                    id: 9,
                    name: "开大会3",
                    collect: true
                }
            ],
            checked: {},
            setHeight: {}
        }
    },
    components: {
        Header
    },
    methods: {
        // 选择收藏夹
        checkCollect(d){
            if(this.checked[d.id]){
                this.$set(this.checked, d.id, false)
            }else{
                this.$set(this.checked, d.id, d)
            }
            this.$store.commit("setChecked", this.checked)
        },
        // 选择常用联系人
        checkContact(d){
            if(this.checked[d.id]){
                this.$set(this.checked, d.id, false)
            }else{
                this.$set(this.checked, d.id, d)
            }
            this.$store.commit("setChecked", this.checked)
        },
        // 收藏
        clickCollect(index){
            let d = this.contact[index]
            d.collect = !d.collect
            this.$set(this.contact, index, d)
        },
        // 开始会商
        startMeeting(){
            this.$router.push("/meeting")
        }
    },
    created(){
        this.checked = this.$store.state.checked
    },
    mounted(){
        if(this.$refs.collect.offsetHeight < 167){
            this.setHeight = {
                height: this.$refs.index.offsetHeight - 184 - this.$refs.collect.offsetHeight + "px"
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
        display: block;
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
            height: 30px;
            margin-left: 20px;
            line-height: 30px;
            color: #B5E5F0;
        }
        .scroll{
            max-height: 126px;
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
        height: calc(100% - 312px);
        .title{
            height: 30px;
            margin-left: 20px;
            line-height: 30px;
            color: #B5E5F0;
        }
        .scroll{
            height: calc( 100% - 30px);
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
                .icon-xing{
                    width: 24px;
                    height: 24px;
                    padding: 8px 10px;
                    background: url(../assets/xing.png) center center no-repeat;
                    background-size: 24px 24px;
                    &.icon-xing_sc{
                        background: url(../assets/xing_sc.png) center center no-repeat;
                        background-size: 24px 24px;
                    }
                }
            }
        }
    }
    .footer-btn{
        margin: 10px 20px;
        height: 40px;
        background-color: #37B8E9;
        text-align: center;
        line-height: 40px;
        color: #fff;
        border-radius: 6px;
    }
}
</style>