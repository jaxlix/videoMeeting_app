<template>
    <div id="search">
        <header class="head">
            <input class="input" v-model="keyWord" @input="search" type="text" placeholder="搜索书名/作者名">
            <a class="a-btn" @click="$router.history.go(-1)" href="javascript:void(0)">取消</a>
        </header>
        <div>
            <mt-cell v-for="(item, index) in dataList" :key="index">
                <router-link to="/bookDetail">
                    {{item.bookName}}
                </router-link>
            </mt-cell>
        </div>
        <div class="footer">
            <input type="text">
        </div>
    </div>
</template>
<script>
var times
export default {
    data(){
        return {
            dataList: [],
            keyWord: '',
            classes: 0,
            dataNumber: 0
        }
    },
    methods: {
        search(){
            clearTimeout(times)
            let _this = this
            times = setTimeout(function(){
                _this.getBookList()
            },500)
        },
        getBookList(){
            let data = {
                classes: this.classes,
                keyWord: this.keyWord,
                dataNumber: this.dataNumber
            }
            this.$post(this.$api.findBooksOfPage, data)
            .then( res => {
                if(res.code === 1){
                    this.dataList = res.content
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    #search{
        padding-top: 40px;
        .head{
            display: flex;
            position:fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background-color: #26a2ff;
            .input{
                flex: 1;
                margin: 5px 10px;
                border-radius: 15px;
                padding-left: 20px;
            }
            .a-btn{
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #fff;
            }
        }
        .footer{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 40px;
            border-top: 1px solid #333;
            background-color: #f5f5f5;
        }
    }
</style>

