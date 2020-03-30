<template>
    <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        // created(){
        //     let no = this.$route.query.uniqueNo || sessionStorage.getItem("UNIQUENO");
        //     if(!no){
        //         this.$toast("未获取到警员编号，请退出重试")
        //         return
        //     }
        //     sessionStorage.setItem("UNIQUENO", no)
        //     // 状态
        //     this.$get(this.$api.getMemberState, {memberSign: no}).then( res => {
        //         let PATROLMAN = res.data[no].PATROLMAN    // 巡警
        //         let CIVIL_POLICEMAN = res.data[no].CIVIL_POLICEMAN    // 机关民警
        //         let TRAIN_POLICEMAN = res.data[no].TRAIN_POLICEMAN    // 乘警
        //         if(CIVIL_POLICEMAN){
        //             this.$store.commit("setIdentity", "CIVIL_POLICEMAN")
        //             this.$store.commit("setStatus", CIVIL_POLICEMAN)
        //             this.$router.replace("/officePolice")
        //         }else if(PATROLMAN){
        //             this.$store.commit("setIdentity", "PATROLMAN")
        //             this.$store.commit("setStatus", PATROLMAN)
        //             this.$router.replace("/patrolPolice")
        //         }else if(TRAIN_POLICEMAN){
        //             this.$store.commit("setIdentity", "TRAIN_POLICEMAN")
        //             this.$store.commit("setStatus", TRAIN_POLICEMAN)
        //             this.$router.replace("/railwayPolice")
        //         }
        //     }).catch( () => {
        //         this.$toast("连接服务器失败，请检查网络")
        //     })
        // }
    }
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    background-color: rgb(15,23,45);
}
</style>
