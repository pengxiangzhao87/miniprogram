// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "ourcity-develop-f6gqc"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const orderid = event.orderid;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;
  //商家发布的订单，关联用户信息
  return await db.collection("cust_merchant_order").aggregate()
    .lookup({
      from: 'user_info',
      localField: '_openid',
      foreignField: '_openid',
      as: 'custInfo'
    }).match({
      orderid: orderid
    }).lookup({
      from: 'chatroom',
      localField: '_openid',
      foreignField: '_openid',
      as: 'chatRoom'
    }).skip(pageNum).limit(pageSize).end()
}