<template>
    <div id="office">
        <Header title="报备" />
        <clockin v-show="selected == 'clockin'"></clockin>
        <statistical v-show="selected == 'statistical'"></statistical>
        <substitute v-show="selected == 'substitute'"></substitute>
        <mt-tabbar fixed v-model="selected" class="tab">
            <mt-tab-item id="clockin">
                <img v-show="selected != 'clockin'" slot="icon" src="@/assets/clockin.png">
                <img v-show="selected == 'clockin'" slot="icon" src="@/assets/clockin_checked.png">
                勤务报备
            </mt-tab-item>
            <mt-tab-item id="statistical">
                <img v-show="selected != 'statistical'" slot="icon" src="@/assets/statistical.png">
                <img v-show="selected == 'statistical'" slot="icon" src="@/assets/statistical_checked.png">
                统计
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
import Header from "@/components/Header"
import clockin from './clockin/clockin'
import statistical from './statistical/statistical'
import substitute from './substitute/substitute'

export default {
    data(){
        return {
            selected: 'clockin'
        }
    },
    components: {
        Header,
        clockin,
        statistical,
        substitute
    }
}
</script>
<style lang="less" scoped>
    #office{
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


