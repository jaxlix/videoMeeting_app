<template>
    <div id="meeting">
        <Header title="返回" />
        <video autoplay class="video" id="video">Your browser does not support HTML5 video.</video>
        <div v-for="d in playListFilter().slice(0, 9)" :key="d.uniqueNo" class="video-box" :class="'video-box-'+videoNum">
            <video autoplay class="video" :id="'video-' + d.uniqueNo">
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
        // ws是否连接成功
        meetingWsConnected(val){
            
        }
    },
    methods: {
        // 获取当前用户信息
        getUserMsg(){
            if(this.uniqueNo){
                let params = new URLSearchParams();
                params.append('no', this.uniqueNo);
                this.$get(this.$api.getMemberByNo, params).then(res => {
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
                            this.magList = result.data;
                            var mag = _.findWhere(this.magList, item => {
                                item.uniqueNo == this.currentUser.uniqueNo
                            });
                            if (mag) {
                                mag.online = true;
                            }
                        } else {
                            result.data.forEach(item => {
                                var finded = _.some(this.magList, mag => {
                                    return mag.uniqueNo == item.uniqueNo;
                                });
                                if (!finded) {
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
                        this.checkedData()
                        // 
                        this.$meetingApi.register(this.uniqueNo, result.data.id);
                        this.$meetingApi.startMeeting(this.roomId, res => {
                            console.log("开始会商")
                            console.log(res)
                            this.room = res.data;
                            this.play();
                        });
                    });
                }
            }else{
                this.$toast("meeting websocket连接未创建成功")
            }
        },
        // 加载视频流
        play() {
            this.$nextTick(()=>{
                let arr = this.playListFilter()
                console.log("播放视频流")
                console.log(arr)
                arr.forEach(playItem => {
                    var video = document.getElementById('video-' + playItem.uniqueNo);
                    if(playItem.uniqueNo == this.currentUser.uniqueNo) {
                        console.log("播放本机视频流")
                        this.$meetingApi.sendOnly(video, !this.muted(playItem));
                    } else {
                        console.log("播放其他视频流")
                        this.$meetingApi.receiveOnly(video, playItem.uniqueNo, !this.muted(playItem));
                    }
                });
            });
        },
        playListFilter() {
            if(this.room.status == 1) {
                return _.filter(this.magList, mag => (mag.online || mag.uniqueNo == this.currentUser.uniqueNo));
            } else {
                return [];
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
}
</style>