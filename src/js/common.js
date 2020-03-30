/* eslint-disable no-unreachable */
const common = {
    dateFormatter: function (t, type) {
        let time = new Date(parseInt(t))
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        month = month > 9 ? month : '0' + month  //月份是从0开始的
        let day = time.getDate()
        day = day > 9 ? day : '0' + day
        let hour = time.getHours()
        hour = hour > 9 ? hour : '0' + hour
        let minute = time.getMinutes()
        minute = minute > 9 ? minute : '0' + minute
        let second = time.getSeconds()
        second = second > 9 ? second : '0' + second
        let week = time.getDay()
        let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
        week = weeks[week];
        switch (type) {
            case "dateTime":
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
                break;
            case "date":
                return year + '-' + month + '-' + day
                break;
            case "time":
                return hour + ':' + minute + ':' + second
                break;
            case "week":
                return week
                break;
            case "dateTimeWeek":
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + " " + week
                break;
            default:
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
                break;
        }
    }
}

export default common