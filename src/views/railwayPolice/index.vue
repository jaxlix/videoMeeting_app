<template>
    <div id="train">
        <Header :title="titles[selected] || '报备'" :rightBtn="rightBtn" />
        <!-- 已出乘状态 -->
        <clockin v-if="selected === 'clockin'" />
        <equipment v-show="selected === 'equipment'" />
        <inTrain v-show="selected === 'inTrain'" />
        <intelligence v-show="selected === 'intelligence'" />
        <instruction v-show="selected === 'instruction'" />
        <mt-tabbar v-if="setout" class="tab" fixed v-model="selected">
            <mt-tab-item id="clockin">
                <img v-show="selected != 'clockin'" slot="icon" src="@/assets/clockin.png">
                <img v-show="selected == 'clockin'" slot="icon" src="@/assets/clockin_checked.png">
                勤务报备
            </mt-tab-item>
            <mt-tab-item id="equipment">
                <img v-show="selected != 'equipment'" slot="icon" src="@/assets/equipment.png">
                <img v-show="selected == 'equipment'" slot="icon" src="@/assets/equipment_checked.png">
                装备
            </mt-tab-item>
            <mt-tab-item id="inTrain">
                <img v-show="selected != 'inTrain'" slot="icon" src="@/assets/inTrain.png">
                <img v-show="selected == 'inTrain'" slot="icon" src="@/assets/inTrain_checked.png">
                车内
            </mt-tab-item>
            <mt-tab-item id="intelligence">
                <img v-show="selected != 'intelligence'" slot="icon" src="@/assets/intelligence.png">
                <img v-show="selected == 'intelligence'" slot="icon" src="@/assets/intelligence_checked.png">
                情报
            </mt-tab-item>
            <mt-tab-item id="instruction">
                <img v-show="selected != 'instruction'" slot="icon" src="@/assets/instruction.png">
                <img v-show="selected == 'instruction'" slot="icon" src="@/assets/instruction_checked.png">
                指令
            </mt-tab-item>
        </mt-tabbar>
        <!-- 未出乘状态 -->
        <setoutList v-show="selected === 'setoutList'" @success="setout=true, selected = 'clockin'"></setoutList>
        <substitute v-show="selected === 'substitute'"></substitute>
        <mt-tabbar v-if="!setout" class="tab" fixed v-model="selected">
            <mt-tab-item id="setoutList">
                <img v-show="selected != 'setoutList'" slot="icon" src="@/assets/setout.png">
                <img v-show="selected == 'setoutList'" slot="icon" src="@/assets/setout_checked.png">
                出乘
            </mt-tab-item>
            <mt-tab-item id="substitute">
                <img v-show="selected != 'substitute'" slot="icon" src="@/assets/substitute.png">
                <img v-show="selected == 'substitute'" slot="icon" src="@/assets/substitute_checked.png">
                替班
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Header from "@/components/Header"
import setoutList from './notSetout/setoutList/setoutList'
import substitute from './notSetout/substitute/substitute'
import clockin from './setout/clockin/clockin'
import equipment from './setout/equipment/equipment'
import instruction from './setout/instruction/instruction'
import intelligence from './setout/intelligence/intelligence'
import inTrain from './setout/inTrain/inTrain'

export default {
    data(){
        return {
            setout: false,  // 是否出乘
            selected: '',
            TRAIN_POLICEMAN: {
                "RESTING": "休息",
                "SET_OFF": "出乘",
                "INTERVAL": "间休",
                "INSTRUCTION_HANDLING": "处警",
                "PRE_GO_OFF": "预退乘"
            },
            titles: {
                "setoutList": "智慧乘务",
                "substitute": "智慧乘务"
            },
            rightBtn: 'switch'
        }
    },
    components: {
        Header,
        setoutList,
        substitute,
        clockin,
        equipment,
        instruction,
        intelligence,
        inTrain
    },
    computed: {
        ...mapGetters({
            status: "status"
        })
    },
    watch: {
        status(){
            if(this.status == "RESTING"){
                this.setout = false
                this.selected = "setoutList"
                this.rightBtn = "record"
            }else if(this.status == "PRE_GO_OFF"){
                this.rightBtn = null
                this.$router.push("/review")
            }else{
                this.setout = true
                this.selected = "clockin"
                this.rightBtn = "record"
            }
        }
    },
    mounted() {
        if(this.status == "RESTING"){
            this.setout = false
            this.selected = "setoutList"
        }else if(this.status == "PRE_GO_OFF"){
            this.$router.push("/review")
        }else{
            this.setout = true
            this.selected = "clockin"
        }
    }
}
</script>
<style lang="less" scoped>
    #train{
        height: 100%;
        overflow: hidden;
        .tab{
            color: #B5E5F0;
            border-top: 1px solid #B5E5F0;
            background-color: #0d182b;
            &.mint-tabbar>.mint-tab-item.is-selected{
                background-color: transparent;
                color: #00BAFF;
            }
        }
    }
</style>


