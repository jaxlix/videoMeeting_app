<template>
    <div id="rail-clockin">
        <dateTime />
        <div class="list">
            <div class="msg" v-for="(d, i) in list" :key="i">
                <div class="msg-cj">
                    <span class="icon-circle"></span>
                    <span>{{d.eventMsg}}&nbsp;</span>
                    <span v-if="d.memberToStateSign == 'SET_OFF' && d.extendParams != null && JSON.parse(d.extendParams).trainsSign">
                        乘值列车
                        <span class="blue">{{JSON.parse(d.extendParams).trainsSign}}</span>&nbsp;
                    </span>
                    <span v-if="false">
                        从
                        <span class="blue">{{JSON.parse(d.extendParams).startStation}}</span>出发
                    </span>
                </div>
                <div class="msg-dk">报备时间 {{$common.dateFormatter(d.updateTime)}}</div>
            </div>
            <div class="train-msg">
                <div class="item" v-for="(d, i) in trainData.person" :key="i">
                    <i :class="'logo_'+d.type"></i>
                    <span class="type">{{d.typeName}}</span>
                    <span class="name">{{d.name}}</span>
                    <span class="phone">{{d.phone}}</span>
                    <a class="call" :href="'tel:'+d.phone"></a>
                </div>
            </div>
        </div>
        <div class="caozuo">
            <button class="btn-left" :class="status == 'INTERVAL' ? 'check' : ''" @click="jx">间休</button>
            <button
                class="btn"
                :class="status == 'PRE_GO_OFF' ? 'no-click' : ''"
                @click="doing"
            >退乘</button>
            <button
                class="btn-right"
                :class="status == 'INSTRUCTION_HANDLING' ? 'check' : ''"
                @click="cj"
            >处警</button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import dateTime from "@/components/dateTime";

export default {
    data() {
        return {
            trainData: {
                person: [
                    {
                        type: "lcz",
                        typeName: "列车长",
                        name: "李思言",
                        phone: 13886247771
                    },
                    {
                        type: "aqy",
                        typeName: "安全员",
                        name: "张亮",
                        phone: 13886247771
                    },
                    {
                        type: "sj",
                        typeName: "司机",
                        name: "赵海军",
                        phone: 13886247771
                    },
                    {
                        type: "jxs",
                        typeName: "机械师",
                        name: "王聪",
                        phone: 13886247771
                    }
                ]
            },
            TRAIN_POLICEMAN: {
                RESTING: "休息",
                SET_OFF: "出乘",
                INTERVAL: "间休",
                INSTRUCTION_HANDLING: "处警",
                PRE_GO_OFF: "预退乘"
            },
            date: {},
            list: []
        };
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
            this.$get(this.$api.getMemberStateLogs, {machineSign: "TRAIN_POLICEMAN", memberSign: sessionStorage.getItem("UNIQUENO")}).then( res => {
                if(res.result == 0 && res.data.length > 0){
                    this.list = res.data
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        doing() {
            if (this.status == "SET_OFF") {
                this.tc();
            } else {
                let msg = {
                    "INTERVAL": "请先结束间休",
                    "INSTRUCTION_HANDLING": "请先结束处警",
                    "PRE_GO_OFF": "已退乘"
                }
                this.$toast(msg[this.status])
            }
        },
        // 处警
        cj() {
            if(this.status == 'INSTRUCTION_HANDLING'){
                this.stopCj()
            }else if(this.status == "SET_OFF"){
                let obj = {
                    memberSign: sessionStorage.getItem("UNIQUENO"), // 成员标识
                    alarmDesc: "测试", // 处警描述
                    longitude: 114.34208367,
                    latitude: 30.54555283
                };
                this.$get(this.$api.doEventForToHandleAlarm, obj).then(res => {
                    if (res.data.success == "false") {
                        this.$toast(res.data.desc);
                    } else {
                        this.$store.commit("setStatus", "INSTRUCTION_HANDLING");
                        this.$toast({
                            message: "开始处警",
                            iconClass: "icon icon-success"
                        });
                        this.getMemberStateLogs()
                    }
                }).catch( () => {
                    this.$toast("连接服务器失败，请检查网络")
                })
            }else{
                let msg = {
                    "INTERVAL": "请先结束间休",
                    "PRE_GO_OFF": "已退乘"
                }
                this.$toast(msg[this.status])
            }
        },
        // 结束处警
        stopCj() {
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "FINISH_INSTRUCTION",
                longitude: 114.34208367,
                latitude: 30.54555283
            };
            this.$get(this.$api.doEvent, obj).then(res => {
                console.log(res);
                if (res.data.success == "false") {
                    this.$toast(res.data.desc);
                } else {
                    this.$store.commit("setStatus", "SET_OFF");
                    this.$toast({
                        message: "结束处警",
                        iconClass: "icon icon-success"
                    });
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 退乘
        tc() {
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "TO_PRE_GO_OFF",
                longitude: 114.34208367,
                latitude: 30.54555283
            };
            this.$get(this.$api.doEvent, obj).then(res => {
                console.log(res);
                if (res.data.success == "false") {
                    this.$toast(res.data.desc);
                } else {
                    this.$store.commit("setStatus", "PRE_GO_OFF");
                    this.$toast({
                        message: "30分钟后自动退乘",
                        iconClass: "icon icon-success"
                    });
                    this.getMemberStateLogs()
                    this.$router.push("/review");
                    // setTimeout(() => {
                    //     location.reload()
                    // }, 10*1000);
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        // 开始间休
        jx() {
            if(this.status == 'INTERVAL'){
                this.stopJx()
            }else if(this.status == "SET_OFF"){
                let obj = {
                    memberSign: sessionStorage.getItem("UNIQUENO"),
                    eventSign: "TO_INTERVAL",
                    longitude: 114.34208367,
                    latitude: 30.54555283
                };
                this.$get(this.$api.doEvent, obj).then(res => {
                    console.log(res);
                    if (res.data.success == "false") {
                        this.$toast(res.data.desc);
                    } else {
                        this.$store.commit("setStatus", "INTERVAL");
                        this.$toast({
                            message: "开始间休",
                            iconClass: "icon icon-success"
                        });
                        this.getMemberStateLogs()
                    }
                }).catch( () => {
                    this.$toast("连接服务器失败，请检查网络")
                })
            }else{
                let msg = {
                    "INSTRUCTION_HANDLING": "请先结束处警",
                    "PRE_GO_OFF": "已退乘"
                }
                this.$toast(msg[this.status])
            }
        },
        // 结束间休
        stopJx() {
            let obj = {
                memberSign: sessionStorage.getItem("UNIQUENO"),
                eventSign: "FINISH_INTERVAL",
                longitude: 114.34208367,
                latitude: 30.54555283
            };
            this.$get(this.$api.doEvent, obj).then(res => {
                console.log(res);
                if (res.data.success == "false") {
                    this.$toast(res.data.desc);
                } else {
                    this.$store.commit("setStatus", "SET_OFF");
                    this.$toast({
                        message: "结束间休",
                        iconClass: "icon icon-success"
                    });
                    this.getMemberStateLogs()
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        }
    },
    created() {
        this.getMemberStateLogs()
        let d = this.$common.dateFormatter(
            new Date().getTime(),
            "dateTimeWeek"
        );
        this.date = {
            time: d.split(" ")[1].slice(0, 5),
            date: d.split(" ")[0],
            week: d.split(" ")[2]
        };
    }
};
</script>

<style lang="less" scoped>
#rail-clockin {
    height: 100%;
    overflow: hidden;
    padding-top: 40px;
    padding-bottom: 56px;
    box-sizing: border-box;
    .list {
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
        .msg {
            padding-left: 20px;
            padding-top: 10px;
            color: #fff;
            .msg-cj {
                display: flex;
                align-items: center;
                .icon-circle {
                    width: 18px;
                    height: 18px;
                    margin-left: 32px;
                    margin-right: 10px;
                    background: url(../../../../assets/circle.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
                .blue {
                    color: #43f3e0;
                }
            }
            .msg-dk {
                margin-left: 60px;
                font-size: 1.2rem;
            }
        }
        .train-msg {
            margin-top: 20px;
            color: #b5e5f0;
            .item {
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                .logo_lcz {
                    width: 17px;
                    height: 20px;
                    background: url(../../../../assets/lcz.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
                .logo_aqy {
                    width: 17px;
                    height: 20px;
                    background: url(../../../../assets/aqy.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
                .logo_sj {
                    width: 17px;
                    height: 20px;
                    background: url(../../../../assets/sj.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
                .logo_jxs {
                    width: 17px;
                    height: 20px;
                    background: url(../../../../assets/jxs.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
                .type {
                    font-size: 14px;
                    width: 50px;
                    text-align: justify;
                }
                .name {
                    width: 60px;
                    margin-left: 10px;
                    margin-right: 10px;
                    text-align: left;
                }
                .phone {
                    margin-right: 10px;
                }
                .call {
                    width: 20px;
                    height: 20px;
                    background: url(../../../../assets/call.png) center center
                        no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
    .caozuo {
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-left {
            width: 90px;
            height: 10rem;
            line-height: 10rem;
            background: url(../../../../assets/btn-left.png) center center
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            color: #b5e5f0;
            &.check {
                background: url(../../../../assets/check_left.png) center center
                    no-repeat;
                background-size: 100% 100%;
            }
        }
        .btn {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            line-height: 160px;
            background-color: rgba(6, 70, 85, 0.6);
            font-size: 24px;
            color: rgb(181, 229, 240);
            &.no-click{
                background-color: rgba(6, 70, 85, 0.3);
                color: rgba(181, 229, 240, .3);
            }
        }
        .btn-right {
            width: 90px;
            height: 100px;
            line-height: 100px;
            background: url(../../../../assets/btn-right.png) center center
                no-repeat;
            background-size: 100% 100%;
            color: #b5e5f0;
            writing-mode: sideways-rl;
            &.check {
                background: url(../../../../assets/check_right.png) center
                    center no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>

