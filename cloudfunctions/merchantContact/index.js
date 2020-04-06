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
  return await db.collection("merchant_cust_contact").aggregate()
    .lookup({
      from: 'cust_order',
      localField: 'orderid',
      foreignField: '_id',
      as: 'custOrder'
    }).match({
      _openid: openid
    }).sort({
      createDate: -1
    }).skip(pageNum).limit(pageSize).end()
}