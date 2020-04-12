// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "ourcity-develop-f6gqc"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = event.openid;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;

  return await db.collection("merchant_order").aggregate()
    .lookup({
      from: 'user_info',
      localField: '_openid',
      foreignField: '_openid',
      as: 'userInfo'
    }).match({
      _openid: openid
    }).sort({
      createDate: -1
    }).skip(pageNum).limit(pageSize).end()
}