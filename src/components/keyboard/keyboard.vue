<template>
    <div id="keyboard">
        <div class="title">
            <img v-show="!showKeys" class="switch" src="./images/switch2.png" alt="" @click="showKeys=true">
            <span class="kw">{{keyword ? keyword : '请输入'}}</span>
            <img v-show="!showKeys" class="clear" src="./images/clear.png" alt="" @click="keyword='', showKeys=true">
        </div>
        <div class="keys" v-show="showKeys">
            <div class="item" :class="touchId == d.id ? 'hover' : ''" v-for="(d, i) in keys" :key="i" @click="clickItem(d)" @touchstart="touch(d.id)" @touchend="touchend">
                <span class="num" v-show="d.type == 'number'">{{d.num}}</span>
                <span v-if="letter" class="letter" v-show="d.type == 'number'">{{d.letter || ''}}</span>
                <img v-if="d.img" :class="d.type" :src="d.img" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            keyword: '',
            keys: [
                {
                    id: "1",
                    type: "number",
                    num: 1
                },
                {
                    id: "2",
                    type: "number",
                    num: 2,
                    letter: "ABC"
                },
                {
                    id: "3",
                    type: "number",
                    num: 3,
                    letter: "DEF"
                },
                {
                    id: "4",
                    type: "number",
                    num: 4,
                    letter: "GHI"
                },
                {
                    id: "5",
                    type: "number",
                    num: 5,
                    letter: "JKL"
                },
                {
                    id: "6",
                    type: "number",
                    num: 6,
                    letter: "MNO"
                },
                {
                    id: "7",
                    type: "number",
                    num: 7,
                    letter: "PQRS"
                },
                {
                    id: "8",
                    type: "number",
                    num: 8,
                    letter: "TUV"
                },
                {
                    id: "9",
                    type: "number",
                    num: 9,
                    letter: "WXYZ"
                },
                {
                    id: "10",
                    type: "switch",
                    img: require("./images/switch.png")
                },
                {
                    id: "01",
                    type: "number",
                    num: 0
                },
                {
                    id: "11",
                    type: "back",
                    img: require("./images/back.png")
                }
            ],
            showKeys: true,
            touchId: ''
        }
    },
    props: {
        letter: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        clickItem(d){
            if(d.type == "number"){
                this.keyword = this.keyword + String(d.num)
            }else if(d.type == "back"){
                this.keyword = this.keyword.substring(0, this.keyword.length-1)
            }else if(d.type == "switch"){
                this.showKeys = false
            }
        },
        touch(id){
            this.touchId = id
        },
        touchend(){
            this.touchId = ''
        }
    }
};
</script>

<style lang="less" scoped>
#keyboard {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 999;
    width: 100%;
    color: #B5E5F0;
    background:linear-gradient(0deg,rgba(13,24,43,1),rgba(51,75,116,1));
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 46px;
        border-bottom: 1px solid rgba(255, 255, 255, .1);
        .switch{
            width: 22px;
            height: 25px;
            margin-left: 40px;
        }
        .kw{
            flex: 1;
            text-align: center;
            font-size: 17px;
        }
        .clear{
            width: 20px;
            height: 20px;
            margin-right: 40px;
        }
    }
    .keys{
        display: flex;
        flex-wrap: wrap;
        color: #63D5F6;
        .item{
            width: 33%;
            padding: 8px 0;
            text-align: center;
            &.hover{
                background-color: rgb(13,24,43);
            }
            .num{
                font-size: 28px;
            }
            .letter{
                display: inline-block;
                width: 42px;
            }
            .switch{
                width: 22px;
                height: 25px;
            }
            .back{
                width: 35px;
                height: 22px;
            }
        }
    }
}
</style>