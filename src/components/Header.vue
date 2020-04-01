<template>
    <header id="head">
        <mt-button class="left-btn" icon="back" @click="goBack"></mt-button>
        <p class="title">{{title}}</p>
        <!-- 切换警种 -->
        <mt-button v-if="rightBtn == 'switch'" class="right-btn" @click="popupVisible=!popupVisible">
            {{typeNames[identity]}}
            <i class="down"></i>
        </mt-button>
        <mt-popup v-model="popupVisible" class="popup">
            <p class="prop-title">切换勤务模式</p>
            <p class="prop-msg">切换后，当天的勤务状态将重置。</p>
            <mt-radio :value="identity2" :options="options" @change="selectIdentity"></mt-radio>
            <div class="brns">
                <button @click="identity2=identity,popupVisible=false">取消</button>
                <button @click="change">切换</button>
            </div>
        </mt-popup>
        <!-- 打卡记录 -->
        <mt-button v-if="rightBtn == 'record'" class="right-btn" @click="toRecord">
            <i class="record"></i>
        </mt-button>
        <!-- 已选择列表 -->
        <mt-button v-if="rightBtn == 'toCheckedList'" class="right-btn" @click="toCheckedList">
            已选择（{{checkNum}}）
        </mt-button>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            identity2: this.$store.state.identity,
            popupVisible: false,
            typeNames: {
                "TRAIN_POLICEMAN": "乘警",
                "PATROLMAN": "巡警",
                "CIVIL_POLICEMAN": "机关民警"
            },
            options: [
                {
                    label: "乘警",
                    value: "TRAIN_POLICEMAN"
                },
                {
                    label: "巡警",
                    value: "PATROLMAN"
                },
                {
                    label: "机关民警",
                    value: "CIVIL_POLICEMAN"
                }
            ],
            checkNum: 0
        }
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        back: {
            type: String,
            default: "router"
        },
        rightBtn: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters({
            identity: "identity",
            checked: "checked"
        })
    },
    watch: {
        identity(val){
            this.identity2 = val
        },
        popupVisible(){
            this.identity2 = this.identity
        },
        checked(v){
            this.checkNum = Object.keys(v).length
        }
    },
    methods: {
        selectIdentity(val){
            this.identity2 = val
        },
        change(){
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                stateMachineSign: this.identity2,
                stateSign: 'RESTING'
            }
            this.$get(this.$api.setMemberState, obj).then( res => {
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.popupVisible = false
                    this.$store.commit("setIdentity", this.identity2)
                    this.$store.commit("setStatus", "RESTING")
                    switch (this.identity2) {
                        case "CIVIL_POLICEMAN":
                            this.$router.replace("/officePolice")
                            break;
                        case "PATROLMAN":
                            this.$router.replace("/patrolPolice")
                            break;
                        case "TRAIN_POLICEMAN":
                            this.$router.replace("/railwayPolice")
                            break;
                        default:
                            break;
                    }
                    this.$toast({
                        message: '切换成功',
                        iconClass: 'icon icon-success'
                    });
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        goBack(){
            if(this.back == "android"){
                window.android.closePage()
            }else if(this.back == "router"){
                this.$router.history.go(-1)
            }
        },
        toRecord(){
            this.$toast("玩命开发中")
        },
        toCheckedList(){
            this.$router.push("/attendees")
        }
    }
};
</script>

<style lang="less" scoped>
#head {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    .left-btn {
        width: 40px;
        height: 40px;
        padding: 0;
        border: 0;
        background-color: transparent;
        font-size: 1.4rem;
        color: #fff;
        box-shadow: none;
    }
    .title {
        flex: 1;
        color: #fff;
        text-align: left;
    }
    .right-btn {
        min-width: 40px;
        height: 40px;
        padding: 0;
        margin-right: 9px;
        border: 0;
        background-color: transparent;
        font-size: 1.4rem;
        color: #fff;
        box-shadow: none;
        .down{
            display: inline-block;
            width: 18px;
            height: 10px;
            background: url(../assets/down.png) center center no-repeat;
            background-size: 100% 100%;
        }
        .record{
            display: inline-block;
            width: 18px;
            height: 20px;
            background: url(../assets/record.png) center center no-repeat;
            background-size: 100% 100%;
        }
    }
    .popup {
        width: 80%;
        border-radius: 6px;
        // padding: 10px;
        .prop-title{
            margin-left: 20px;
        }
        .prop-msg{
            margin-left: 20px;
            margin-bottom: 30px;
            color: #F39800;
        }
        .brns{
            display: flex;
            border-top: 1px solid #A0A0A0;
            background-color: #fff;
            border-bottom-right-radius: 6px;
            border-bottom-left-radius: 6px;
            button{
                flex: 1;
                height: 40px;
                border: 0;
                text-align: center;
                line-height: 40px;
                background-color: transparent;
                &:last-child{
                    border-left: 1px solid #A0A0A0;
                    color: #26A2FF;
                }
            }
        }
        /deep/.mint-cell{
            margin-bottom: 15px;
        }
    }
}
</style>

