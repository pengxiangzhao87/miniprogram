// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "findgoods-ox7sn"
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = event.openid;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;
  //商家发布的订单，关联用户信息
  return await db.collection("cust_merchant_order").aggregate()
    .lookup({
      from: 'merchant_order',
      localField: 'orderid',
      foreignField: '_id',
      as: 'merchant'
    }).match({
      _openid: openid
    }).sort({
      createDate: -1
    }).skip(pageNum).limit(pageSize).end()
}