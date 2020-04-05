let isGaw = false   // 是否公安网
const IP = isGaw ? 'http://59.32.1.174:6061' : 'https://106.12.14.136:18086'

export const api = {
  getMemberByNo: IP + "/file/getMemberByNo", // 获取账号信息
  getRecent: IP + "/users/contacts/recent", //?uniqueNo=123132 获取最近联系人
  favoriteUsers: (no) => IP + "/users/"+no+"/favoriteUsers",  // 
  addUsers: id => IP + "/favorites/"+id+"/addUsers",  // 添加用户到收藏夹
  deleteUser: id => IP + "/favorites/"+id+"/deleteUser",  // 删除收藏夹中的用户

  // 视频服务
  meetingWsUrl: 'wss://106.12.14.136:18086/videoMeetingService/groupcall',
  meetingServiceUrl: 'https://106.12.14.136:18086/videoMeetingService/'
}
