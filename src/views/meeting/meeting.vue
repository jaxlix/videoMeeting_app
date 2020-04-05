<template>
    <div id="meeting">
        <Header title="返回" />
        <div class="content">
            <div v-for="d in playListFilter().slice(0, 9)" :key="d.id" class="video-box">
                <video v-if="d.uniqueNo" autoplay class="video" :id="'video-' + d.uniqueNo">
                    Your browser does not support HTML5 video.
                </video>
                <!-- <div class="watermark" :class="fullScreen===d.uniqueNo ? 'watermark_fullScreen' : ''">
                    <span>{{d.name}}</span>
                    <span>{{d.no}}</span>
                    <span v-show="d.deptName">({{d.deptName}})</span>
                </div> -->
                <!-- <img v-if="d.audioEnable == 0" class="jy" :class="fullScreen===d.uniqueNo ? 'jy_fullScreen' : ''" src="@/assets/icon/videoMeeting/jingyin.png" alt="静音"> -->
            </div>
        </div>
        <div class="panel">
            <a href="javascript:void(0)">摄像头</a>
            <a href="javascript:void(0)">免提</a>
            <a href="javascript:void(0)">静音</a>
            <a href="javascript:void(0)">旋转摄像头</a>
            <a class="stop" href="javascript:void(0)"></a>
            <a href="javascript:void(0)">邀请</a>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from "@/components/Header"
const _ = require("underscore")._

export default {
    data() {
        return {
            currentUser: {},
            roomId: -1,
            room: {},
            magList: []
        };
    },
    components: {
        Header
    },
    computed: {
        ...mapGetters({
            meetingWsConnected: "meetingWsConnected"
        })
    },
    watch: {
        
    },
    methods: {
        // 获取当前用户信息
        getUserMsg(){
            if(this.uniqueNo){
                let params = new URLSearchParams();
                params.append('no', this.uniqueNo);
                this.$get(this.$api.getMemberByNo, params).then(res => {
                    console.log("获取到当前用户信息")
                    console.log(res)
                    this.currentUser = {
                        deptId: res.account.department.id,
                        deptName: res.account.department.name,
                        name: res.account.name,
                        no: res.account.no,
                        phone: res.account.phoneNumber,
                        type: res.terminalMemberType,
                        uniqueNo: res.uniqueNo
                    }
                    this.start()
                }).catch(err => {
                    console.log(err)
                })
            }else{
                this.$toast("未获取到当前用户的uniqueNo")
            }
        },
        // 添加参会人员
        checkedData(data) {
            data = [{
                deptId: 1,
                deptName: "顶级部门",
                name: "侯纪月",
                no: 88000015,
                phone: "",
                status: 1,
                type: "TERMINAL_PHONE",
                uniqueNo: "308503534918172672"
            }]
            let addUserList = [this.currentUser].concat(data)
            if (addUserList.length > 0) {
                this.$meetingApi.addRoomUsers( this.roomId, addUserList, () => {
                    this.$meetingApi.getRoomUsers(this.roomId, result => {
                        console.log("添加参会人员")
                        console.log(result)
                        console.log(this.room)
                        if (this.room.status == 0) {
                            // status:0未开始  1进行中  2已结束
                            this.magList = result.data;
                            var mag = _.findWhere(this.magList, item => {
                                item.uniqueNo == this.currentUser.uniqueNo
                            });
                            if (mag) {
                                mag.online = true;
                            }
                        } else {
                            result.data.forEach(item => {
                                let has = false
                                for( let i = 0; i < this.magList.length; i++){
                                    if(item.uniqueNo == this.magList[i].uniqueNo){
                                        has = true
                                        break
                                    }
                                }
                                if (!has) {
                                    this.magList.push(item);
                                }
                            });
                        }
                    });
                });
            }
        },
        //开始视频会商
        start(){
           if(this.meetingWsConnected) {
                if(this.roomId != -1) {
                    this.$meetingApi.getRoomInfo(this.roomId, result => {
                        this.room = result.data;
                        this.$meetingApi.getRoomUsers(this.roomId, result => {
                            this.magList = result.data;
                            this.magList.forEach(mag => this.initUserSoundEnable(mag));
                            this.$meetingApi.register(this.uniqueNo, this.roomId);
                            this.$meetingApi.startMeeting(this.roomId, (res)=>{
                                this.room = res.data;
                                this.play();
                            });
                        });
                    });
                } else {
                    this.$meetingApi.createRoom(this.uniqueNo, result => {
                        console.log("创建房间成功")
                        console.log(result)
                        this.roomId = String(result.data.id)
                        this.room = result.data;
                        // 添加参会人员
                        let data = [{
                            deptId: 1,
                            deptName: "顶级部门",
                            name: "侯纪月",
                            no: 88000015,
                            phone: "",
                            status: 1,
                            type: "TERMINAL_PHONE",
                            uniqueNo: "308503534918172672"
                        }]
                        let addUserList = [this.currentUser].concat(data)
                        if (addUserList.length > 0) {
                            this.$meetingApi.addRoomUsers( this.roomId, addUserList, () => {
                                this.$meetingApi.getRoomUsers(this.roomId, result => {
                                    console.log("添加参会人员")
                                    console.log(result)
                                    console.log(this.room)
                                    if (this.room.status == 0) {
                                        // status:0未开始  1进行中  2已结束
                                        this.magList = result.data;
                                        this.$meetingApi.startMeeting(this.roomId, res => {
                                            console.log("开始会商")
                                            console.log(res)
                                            this.room = res.data;
                                            this.play();
                                        });
                                        // var mag = _.findWhere(this.magList, item => {
                                        //     item.uniqueNo == this.currentUser.uniqueNo
                                        // });
                                        // if (mag) {
                                        //     mag.online = true;
                                        // }
                                    } else {    // 进行中，添加参会人员
                                        result.data.forEach(item => {
                                            let has = false
                                            for( let i = 0; i < this.magList.length; i++){
                                                if(item.uniqueNo == this.magList[i].uniqueNo){
                                                    has = true
                                                    break
                                                }
                                            }
                                            if (!has) {
                                                this.magList.push(item);
                                                // 添加人员
                                                this.$meetingApi.register(item.uniqueNo, this.roomId );
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            }else{
                this.$toast("meeting websocket连接未创建成功")
            }
        },
        // 加载视频流
        play() {
            this.$nextTick(()=>{
                let arr = []
                if(this.room.status == 1) {
                    for( let i = 0; i < this.magList.length; i++){
                        if(this.currentUser.uniqueNo == this.magList[i].uniqueNo || this.magList[i].online){
                            arr.push(this.magList[i])
                        }
                    }
                }
                arr.forEach(playItem => {
                    var video = document.getElementById('video-' + playItem.uniqueNo);
                    if(playItem.uniqueNo == this.currentUser.uniqueNo) {
                        this.$meetingApi.sendOnly(video, false);
                    } else {
                        this.$meetingApi.receiveOnly(video, playItem.uniqueNo, true);
                    }
                });
            });
        },
        playListFilter() {
            if(this.room.status == 1) {
                let arr = []
                for( let i = 0; i < this.magList.length; i++){
                    if(this.currentUser.uniqueNo == this.magList[i].uniqueNo || this.magList[i].online){
                        this.magList[i].id = Math.random()
                        arr.push(this.magList[i])
                    }
                }
                let num = 9-arr.length
                if(arr.length < 9){
                    for(let i = 0; i < num; i++){
                        arr.push({id: Math.random()})
                    }
                }
                console.log(arr)
                return arr
            } else {
                let arr = []
                for(let i = 0; i < 10; i++){
                    arr.push({id: Math.random()})
                }
                return arr
            }
        },
        // 结束视频会商
        stop(t){
            this.stopVis = false
            if(t == 1){	// 离开会商
                this.$get("http://127.0.0.1:8099/system/closeVideoMeetingWindow").then(res => {
                    console.log(res)
                })
            }else{	// 结束会商
                this.$meetingApi.endMeeting(this.roomId, (res)=>{
                    this.room = res.data;
                    this.$get("http://127.0.0.1:8099/system/closeVideoMeetingWindow").then(res => {
                        console.log(res)
                    })
                });
            }
        },
    },
    created(){
        this.uniqueNo = sessionStorage.getItem("UNIQUENO")
    },
    mounted(){
        this.getUserMsg()
    }
};
</script>

<style lang="less" scoped>
#meeting {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 40px;
    box-sizing: border-box;
    color: #b5e5f0;
    .content{
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #000;
        .video-box{
            box-sizing: border-box;
            width: 33.3%;
            border-bottom: 1px solid #000;
            &:not(:nth-child(3n)) {
                border-right: 1px solid #000;
            }
            &:before {
                content:"";
                display: inline-block;
                padding-bottom: 100%;
            }
            .video{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .panel{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 25px;
        background-color: #000;
        a{
            width: 33.3%;
            height: 60px;
            text-align: center;
            line-height: 60px;
            color: #fff;
            &.stop{
                background: url(../../assets/stop.png) center center no-repeat;
                background-size: 60px 60px;
            }
        }
    }
}
</style>