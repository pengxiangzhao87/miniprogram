//获取用户订单
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "ourcity-develop-f6gqc"
})

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const orderType = event.orderType;
  const pageNum = event.pageNum;
  const pageSize = event.pageSize;
  return await db.collection("cust_order").aggregate()
        .lookup({
          from: 'user_info',
          localField: '_openid',
          foreignField: '_openid',
          as: 'userInfo'
    }).match({
      order_type: orderType
    }).sort({
      create_date:-1
    }).skip(pageNum).limit(pageSize).end()

}