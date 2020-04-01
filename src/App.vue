<template>
    <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        created(){
            let no = this.$route.query.uniqueNo || sessionStorage.getItem("UNIQUENO");
            if(!no){
                this.$toast("未获取到警员编号，请退出重试")
                return
            }
            sessionStorage.setItem("UNIQUENO", no)
        }
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
