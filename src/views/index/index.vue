<template>
    <div id="index">
        <bookList v-show="selected === 'index'"></bookList>
        <bookshelf v-show="selected === 'bookshelf'"></bookshelf>
        <mine v-show="selected === 'mine'"></mine>
        <mt-tabbar fixed v-model="selected">
            <mt-tab-item id="index">
                <img slot="icon" src="../../assets/logo.png">
                首页
            </mt-tab-item>
            <mt-tab-item id="bookshelf">
                <img slot="icon" src="../../assets/logo.png">
                书架
            </mt-tab-item>
            <mt-tab-item id="mine">
                <img slot="icon" src="../../assets/logo.png">
                我的
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
import bookList from './bookList'
import bookshelf from '../bookshelf/index'
import mine from '../mine/index'

export default {
    data(){
        return {
            selected: 'index'
        }
    },
    components: {
        bookList,
        bookshelf,
        mine
    }
}
</script>
<style lang="less" scoped>
    #index{
        padding-bottom: 55px;
    }
</style>


