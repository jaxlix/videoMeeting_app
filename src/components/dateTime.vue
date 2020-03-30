<template>
    <div id="date">
        <div class="time">{{date.time}}</div>
        <div class="date-time">{{date.date}} {{date.week}}</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            date: null
        }
    },
    created(){
        let d = this.$common.dateFormatter(new Date().getTime(), "dateTimeWeek")
        let dateArr = d.split(" ")[0].split("-")
        this.date = {
            time: d.split(" ")[1].slice(0,5),
            date: dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日",
            week: d.split(" ")[2]
        }
        setInterval( () => {
            let d = this.$common.dateFormatter(new Date().getTime(), "dateTimeWeek")
            let dateArr = d.split(" ")[0].split("-")
            this.date = {
                time: d.split(" ")[1].slice(0,5),
                date: dateArr[0] + "年" + dateArr[1] + "月" + dateArr[2] + "日",
                week: d.split(" ")[2]
            }
        }, 60*1000)
    }
}
</script>

<style lang="less" scoped>
#date {
    height: 115px;
    overflow: hidden;
    .time {
        color: #b5e5f0;
        font-size: 50px;
        text-align: center;
    }
    .date-time {
        margin-top: 10px;
        color: #b5e5f0;
        text-align: center;
    }
}
</style>