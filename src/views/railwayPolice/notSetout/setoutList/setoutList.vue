<template>
    <div id="setout-list">
        <div class="msg">
            <img class="logo" :src="userMsg.img" alt="头像">
            <div>
                <p class="name">
                    <span>{{userMsg.name}}</span>
                    <span class="no">{{userMsg.no}}</span>
                </p>
                <p class="dept">{{userMsg.department ? userMsg.department.name : ''}}</p>
            </div>
        </div>
        <div class="train-list">
            <div class="item" v-for="(d, i) in trainList" :key="i">
                <div class="train-msg">
                    <p>
                        <span class="name">{{d.trainRoute.railwayNo}}</span>
                        <span class="station">从<span>{{d.startStation.name}}</span>出发</span>
                    </p>
                    <p>
                        <span class="time-label">出发时间</span>
                        <span class="time" :class="i == 0 ? 'yello' : ''">{{d.trainRoute.departureTime}}</span>
                    </p>
                </div>
                <a href="javascript:void(0)">开柜</a>
                <a @click="chucheng(i)" href="javascript:void(0)">出乘</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            userMsg: {},
            trainList: []
        }
    },
    created(){
        this.getData()
    },
    methods: {
        getData(){
            this.$get(this.$api.scheduleByAccoutNo+sessionStorage.getItem("UNIQUENO")).then( res => {
                if(res.status == 200){
                    this.userMsg = res.content.account
                    this.userMsg.img = require("@/assets/tx.png"),
                    this.trainList = res.content.trains
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        },
        chucheng(i){
            let t = this.trainList[i]
            let p = {
                memberSign: this.userMsg.no,
                longitude: 114.3420836700,   // 事件触发地点经度
                latitude: 30.5455528300,    // 事件触发地点经度
                trainsSign: t.trainRoute.railwayNo,
                departureTimeOnPlan: t.trainRoute.departureTime,
                departureLongitude: t.startStation.longitude,
                departureLatitude: t.startStation.latitude,
                arrivalTimeOnPlan: t.trainRoute.stoppingTime,
                arrivalLongitude: t.endStation.longitude,
                arrivalLatitude: t.endStation.latitude
            }
            this.$get(this.$api.doEventForToSetOff, p).then(res => {
                if(res.data.success == 'false'){
                    this.$toast(res.data.desc)
                }else{
                    this.$store.commit("setStatus", "SET_OFF")
                    this.$toast({
                        message: '出乘报备成功',
                        iconClass: 'icon icon-success'
                    });
                    sessionStorage.setItem("TRAIN", JSON.stringify({startStation: t.startStation.name, railwayNo: t.trainRoute.railwayNo}))
                    this.$emit("success")
                }
            }).catch( () => {
                this.$toast("连接服务器失败，请检查网络")
            })
        }
    }
}
</script>

<style lang="less" scoped>
    #setout-list{
        padding-top: 40px;
        .msg{
            display: flex;
            align-items: center;
            height: 60px;
            color: #B5E5F0;
            border-bottom: 1px solid rgba(181, 229, 240, .3);
            .logo{
                width: 30px;
                height: 30px;
                padding: 15px 15px 15px 20px;
            }
            .name{
                font-size: 18px;
                .no{
                    margin-left: 10px;
                }
            }
            .dept{
                font-size: 12px;
            }
        }
        .train-list{
            height: calc(100% - 60px);
            overflow-x: hidden;
            overflow-y: auto;
            color: #B5E5F0;
            .item{
                display: flex;
                align-items: center;
                padding: 10px 20px;
                border-bottom: 1px solid rgba(181, 229, 240, .1);
                .train-msg{
                    flex: 1;
                    .name{
                        color: #43E0F3;
                        font-size: 16px;
                    }
                    .station{
                        margin-left: 10px;
                        font-size: 16px;
                        span{
                            color: #43E0F3;
                        }
                    }
                    .time-label{
                        font-size: 12px;
                    }
                    .time{
                        margin-left: 10px;
                        font-size: 12px;
                        &.yello{
                            color: #F8B551;
                        }
                    }
                }
                a{
                    width: 50px;
                    height: 23px;
                    margin-left: 10px;
                    color: #B5E5F0;
                    text-align: center;
                    line-height: 23px;
                    border: 1px solid rgba(181, 229, 240, .3);
                    font-size: 12px;
                    box-shadow: 0 0 5px rgba(181, 229, 240, .3) inset;
                }
            }
        }
    }
</style>