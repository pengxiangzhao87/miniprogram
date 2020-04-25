// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "findgoods-ox7sn"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = event.openid;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;
  //商家联系过的用户订单，_openid商户ID，orderid用户订单ID
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