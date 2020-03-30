let isGaw = false   // 是否公安网
const IP = isGaw ? 'http://59.32.1.170:9011' : 'http://106.12.14.136:16062/issts'   // 百度云测试环境
// const IP = isGaw ? 'http://59.32.1.170:9011' : 'http://192.168.1.223:8811'   // 公司测试环境
// const IP2 = isGaw ? 'http://59.32.1.174:6061' : 'http://192.168.1.223:6061'    // 文件服务

export const api = {
  doEvent: IP + "/customer/member/doEvent", // 普通事件接口,普通事件: 处警 -> 出警(FINISH_INSTRUCTION),处警 -> 巡逻(FINISH_INSTRUCTION), 出警 -> 预退出(TO_PRE_GO_OFF),巡逻 -> 预退出(TO_PRE_LEAVE_PATROLLING),上班 -> 休息(TO_RESTING)出乘 -> 间休(TO_INTERVAL), 间休 -> 出乘(FINISH_INTERVAL)
  doEventForToHandleAlarm: IP + "/customer/member/doEventForToHandleAlarm",   // 乘警/巡警开始处警事件接口
  doEventForToPatrolling: IP + "/customer/member/doEventForToPatrolling", // 巡警开始巡逻事件接口
  doEventForToSetOff: IP + "/customer/member/doEventForToSetOff", // 乘警开始出乘事件接口
  doEventForToStartWork: IP + "/customer/member/doEventForToStartWork",   // 机关民警开始上班事件接口
  getMemberState: IP + "/customer/member/getMemberState", // 用来查询指定成员的状态
  getMemberStateByDepartment: IP + "/customer/member/getMemberStateByDepartment", //用来查询指定部门下所有成员的状态
  scheduleByAccoutNo: "http://106.12.14.136:16062/railway/rest/train/scheduleByAccoutNo/",   // 查询乘警信息和出乘信息
  setMemberState: IP + "/customer/member/setMemberState", // 修改成员状态?memberSign=1&stateMachineSign=1&stateSign=1
  getMemberStateLogs: IP + "/customer/member/getMemberStateLogs", // ?memberSign=88192250 查询状态记录
}
