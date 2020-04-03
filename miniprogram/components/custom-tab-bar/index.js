var app = getApp();

Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: []
  },
  lifetimes: {
    attached() {
      this.setData({
        list: app.globalData.list
      })
    }
  },
 
  methods: {
    switchTab(e) {
      console.info(e)
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})

 