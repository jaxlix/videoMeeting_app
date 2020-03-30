<template>
    <div id="clockin">
        <dateTime />
        <div class="list">
            <div class="msg" v-for="(d, i) in list" :key="i">
                <div class="msg-cj">
                    <span class="icon-circle"></span>
                    <span>{{d.eventMsg}}</span>
                </div>
                <div class="msg-dk">报备时间 {{$common.dateFormatter(d.updateTime)}}</div>
            </div>
        </div>
        <div class="caozuo">
            <button class="btn-left no-click" @click="jx">间休</button>
            <button class="btn" :class="status == 'PRE_LEAVE_PATROLLING' ? 'no-click2' : ''" @click="doing">
                {{status == "RESTING" ? "开始巡逻" : "结束巡逻"}}
            </button>
            <button class="btn-right" :class="status == 'INSTRUCTION_HANDLING' ? 'checked' : status == 'PRE_LEAVE_PATROLLING' ? 'no-click' : ''" @click="cj">处警</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateTime from "@/components/dateTime";

export default {
    data () {
        return {
            list: [],
            PATROLMAN: {
                "RESTING": "休息",
                "INSTRUCTION_HANDLING": "处警",
                "PATROLLING": "巡逻",
                "PRE_LEAVE_PATROLLING": "预结束巡逻"
            },
            date: {}
        }
    },
    components: {
        dateTime
    },
    computed: {
        ...mapGetters({
            status: "status"
        })
    },
    methods: {
        getMemberStateLogs(){
            this.$get(this.$api.getMemberStateLogs, {machineSign: "PATROLMAN", memberSign: sessionStorage.getItem("UNIQUENO")}).then( res => {
                if(res.result == 0 && res.data.length > 0){
                    this.list = res.data
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        doing(){
            if(this.status == "RESTING"){
                this.xl()
            }else if(this.status == "PATROLLING"){
                this.stopxl()
            }else{
                let msg = {
                    "INSTRUCTION_HANDLING": "请先结束处警",
                    "PRE_LEAVE_PATROLLING": "已结束巡逻"
                }
                this.$toast(msg[this.status])
            }
        },
        jx(){},
        // 巡逻
        xl(){
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                longitude: 114.3420836700,
                latitude: 30.5455528300,
                areaDesc: "123",
                areaLongitude: 114.3420836700,
                areaLatitude: 30.5455528300,	
                startTimeOnPlan: "2020-02-24 12:00:00",
                endTimeOnPlan: "2020-02-24 12:00:00"
            }
            this.$get(this.$api.doEventForToPatrolling, obj).then( res => {
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.$store.commit("setStatus", "PATROLLING")
                    this.$toast({
                        message: '巡逻报备成功',
                        iconClass: 'icon icon-success'
                    });
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 结束巡逻
        stopxl(){
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "TO_PRE_LEAVE_PATROLLING",
                longitude: 114.3420836700,
                latitude: 30.5455528300
            }
            this.$get(this.$api.doEvent, obj).then( res => {
                console.log(res)
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.$store.commit("setStatus", "PRE_LEAVE_PATROLLING")
                    this.$toast({
                        message: '30分钟后自动结束巡逻',
                        iconClass: 'icon icon-success'
                    });
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 结束处警
        stopCj(){
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "FINISH_INSTRUCTION",
                longitude: 114.3420836700,
                latitude: 30.5455528300
            }
            this.$get(this.$api.doEvent, obj).then( res => {
                console.log(res)
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.$store.commit("setStatus", "PATROLLING")
                    this.$toast({
                        message: '结束处警',
                        iconClass: 'icon icon-success'
                    });
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 处警
        cj(){
            if(this.status == "INSTRUCTION_HANDLING"){
                this.stopCj()
            }else if(this.status == "PATROLLING"){
                let obj = {
                    memberSign: sessionStorage.getItem("UNIQUENO"), // 成员标识
                    alarmDesc: '测试', // 处警描述
                    longitude: 114.3420836700,
                    latitude: 30.5455528300
                }
                this.$get(this.$api.doEventForToHandleAlarm, obj).then( res => {
                    console.log(res)
                    if(res.data.success == 'false'){
                        this.$toast(res.data.desc)
                    }else{
                        this.$store.commit("setStatus", "INSTRUCTION_HANDLING")
                        this.$toast({
                            message: '开始处警',
                            iconClass: 'icon icon-success'
                        });
                        this.getMemberStateLogs()
                    }
                }).catch( () => {
                    this.$toast("连接服务器失败，请检查网络")
                })
            }else{
                this.$toast("请先开始巡逻")
            }
        },
    },
    created(){
        this.getMemberStateLogs()
        let d = this.$common.dateFormatter(new Date().getTime(), "dateTimeWeek")
        this.date = {
            time: d.split(" ")[1].slice(0,5),
            date: d.split(" ")[0],
            week: d.split(" ")[2]
        }
    }
}
</script>

<style lang="less" scoped>
    #clockin{
        height: 100%;
        overflow: hidden;
        padding-top: 40px;
        padding-bottom: 56px;
        box-sizing: border-box;
        .list{
            height: calc(100% - 295px);
            overflow-y: scroll;
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
            .msg{
                padding-left: 20px;
                padding-top: 10px;
                color: #fff;
                .msg-cj{
                    display: flex;
                    align-items: center;
                    .icon-circle{
                        width: 18px;
                        height: 18px;
                        margin-left: 32px;
                        margin-right: 10px;
                        background: url(../../../assets/circle.png) center center no-repeat;
                        background-size: 100% 100%;
                    }
                }
                .msg-dk{
                    margin-left: 60px;
                }
            }
        }
        .caozuo{
            height: 180px;
            display: flex;
            justify-content: center;
            align-items: center;
            .btn-left{
                width: 80px;
                height: 100px;
                line-height: 100px;
                background: url(../../../assets/btn-left.png) center center no-repeat;
                background-size: 100% 100%;
                text-align: center;
            }
            .btn{
                width: 160px;
                height: 160px;
                border-radius: 50%;
                line-height: 160px;
                background-color: rgba(6, 70, 85, .6);
                font-size: 2.4rem;
                color: #B5E5F0;
            }
            .btn-right{
                width: 80px;
                height: 100px;
                line-height: 100px;
                background: url(../../../assets/btn-right.png) center center no-repeat;
                background-size: 100% 100%;
                color: #B5E5F0;
                writing-mode: sideways-rl;
                &.checked{
                    background: url(../../../assets/check_right.png) center center no-repeat;
                    background-size: 100% 100%;
                }
            }
            .no-click{
                background-color: transparent;
                color: rgba(181, 229, 240, .3);
            }
            .no-click2{
                background-color: rgba(6, 70, 85, 0.3);
                color: rgba(181, 229, 240, .3);
            }
        }
    }
</style>

