<template>
    <div id="meeting">
        <Header title="返回" />
        <video autoplay class="video" id="video">Your browser does not support HTML5 video.</video>
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
            if(val === true) {
                if(this.roomId != -1) {
                    this.$meetingApi.getRoomInfo(this.roomId, result => {
                        this.room = result.data;
                        this.$meetingApi.getRoomUsers(this.roomId, result => {
                            this.magList = result.data;
                            this.magList.forEach(mag => this.initUserSoundEnable(mag));
                            this.$meetingApi.register(this.uniqueNo, this.roomId);
                        });
                    });
                } else {
                    this.$meetingApi.createRoom(this.uniqueNo, result => {
                        debugger
                        this.roomId = '' + result.data.id;
                        this.room = result.data;
                        this.$meetingApi.register(this.uniqueNo, result.data.id);
                    });
                }
            }
        },
        // 获取roomId
        roomId (val) {
            let query = this.$router.history.current.query;
            let path = this.$router.history.current.path;
            //对象的拷贝
            let newQuery = JSON.parse(JSON.stringify(query));
            // 地址栏的参数值赋值
            newQuery.roomId = val;
            this.$router.push({ path, query: newQuery });
        },
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
                        this.showAdd = false;
                    });
                });
            }
        },
        //开始视频会商
        start(){
            if(this.magList.length > 1){
                this.$meetingApi.startMeeting(this.roomId, (res)=>{
                    this.room = res.data;
                    this.play();
                });
            }else{
                this.$message({
                    message: "请添加人员",
                    type: "warning"
                })
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
        }
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