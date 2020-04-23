// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "ourcity-develop-f6gqc"
})

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const orderid = event.orderid;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;
  return await db.collection("merchant_cust_contact").aggregate()
    .lookup({
      from: 'chatroom',
      let: {
        merchant_openid: '$_openid',
        order_orderid: '$orderid'
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_openid', '$$merchant_openid']),
          $.eq(['$orderid', '$$order_orderid'])
        ])))
        .project({
          _id: 1,
          msgType:1,
          sendTime: 1,
          textContent:1
        })
        .done(),
      as: 'chatRoom'
    }).match({
      orderid: orderid
    }).sort({
      createDate: -1
    }).skip(pageNum).limit(pageSize).end()
}