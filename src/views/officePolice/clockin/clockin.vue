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
            <button class="btn-left"></button>
            <button class="btn" @click="toClass">{{caozuo[status]}}</button>
            <button class="btn-right"></button>
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
            CIVIL_POLICEMAN: {
                "RESTING": "休息",
                "START_WORK": "上班"
            },
            caozuo: {
                "RESTING": "上班",
                "START_WORK": "下班"
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
            this.$get(this.$api.getMemberStateLogs, {machineSign: "CIVIL_POLICEMAN", memberSign: sessionStorage.getItem("UNIQUENO")}).then( res => {
                if(res.result == 0 && res.data.length > 0){
                    this.list = res.data
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 上班
        toClass(){
            if(this.status == "RESTING"){
                let o = {
                    memberSign: sessionStorage.getItem("UNIQUENO"),  // 成员标识
                    longitude: 114.3420836700,   // 触发位置经度
                    latitude: 30.5455528300,    // 触发位置纬度
                    workLongitude: 114.3420836700,   // 
                    workLatitude: 30.5455528300,
                    startTimeOnPlan: "2020-02-24 09:00:00",
                    endTimeOnPlan: "2020-02-24 18:00:00"
                }
                this.$get(this.$api.doEventForToStartWork, o).then(res => {
                    if(res.data.success == 'false'){
                        this.$toast(res.data.desc)
                    }else{
                        this.$toast({
                            message: '上班报备成功',
                            iconClass: 'icon icon-success'
                        });
                        this.$store.commit("setStatus", "START_WORK")
                        this.getMemberStateLogs()
                    }
                }).catch( () => {
                    this.$toast("连接服务器失败，请检查网络")
                })
            }else{
                this.afterwork()
            }
        },
        // 下班
        afterwork(){
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "TO_RESTING",
                longitude: 114.3420836700,
                latitude: 30.5455528300
            }
            this.$get(this.$api.doEvent, obj).then( res => {
                console.log(res)
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.$toast({
                        message: '下班报备成功',
                        iconClass: 'icon icon-success'
                    });
                    this.$store.commit("setStatus", "RESTING")
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        }
    },
    created(){
        this.getMemberStateLogs()
        // let d = this.$common.dateFormatter(new Date().getTime(), "dateTimeWeek")
        // this.date = {
        //     time: d.split(" ")[1].slice(0,5),
        //     date: d.split(" ")[0],
        //     week: d.split(" ")[2]
        // }
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
                // background: url(../../../assets/btn-left.png) center center no-repeat;
                // background-size: 100% 100%;
                text-align: center;
                color: #B5E5F0;
                background-color: transparent;
            }
            .btn{
                width: 160px;
                height: 160px;
                border-radius: 50%;
                line-height: 160px;
                background-color: rgba(6, 70, 85, .6);
                font-size: 24px;
                color: #B5E5F0;
            }
            .btn-right{
                width: 80px;
                height: 100px;
                line-height: 100px;
                // background: url(../../../assets/btn-right.png) center center no-repeat;
                // background-size: 100% 100%;
                color: #B5E5F0;
                writing-mode: sideways-rl;
                background-color: transparent;
            }
        }
    }
</style>

