<template>
    <div id="bl">
        <header class="head">
            <mt-button class="left-btn" icon="back" @click="$router.history.go(-1)">返回</mt-button>
            <input class="input" @focus="toSearch" type="text" placeholder="搜索书名/作者名">
        </header>
    </div>
</template>
<script>
export default {
    methods: {
        toSearch(){
            this.$router.history.push('/search')
        }
    }
}
</script>

<style lang="less" scoped>
    #bl{
        padding-top: 40px;
        .head{
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            width: 100%;
            height: 40px;
            line-height: 40px;
            background-color: #26a2ff;
            color: #fff;
            .left-btn{
                width: 50px;
                height: 40px;
                padding: 0;
                margin-left: 9px;
                border: 0;
                background-color: transparent;
                font-size: 1.4rem;
                color: #fff;
                box-shadow: none;
            }
            .input{
                flex: 1;
                margin: 5px 10px;
                padding-left: 20px;
                border-radius: 15px;
                line-height: 30px;
            }
        }
    }
</style>

