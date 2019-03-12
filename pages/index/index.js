//index.js
//获取应用实例

const util = require('../../utils/util.js');
const xml2json = require('../../xmllib/xml2json.js')
const app = getApp()


Page({
  /**
   * 页面的初始数据
   */
  data: {
    author: '',     // 源名称
    favicon: '',    // 源logo
    copyright: '',  // 源版权
    pubDate: '',    // 源更新时间
    rssData: {},    // 源数据
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

    // 默认值
    let rssUrl = 'https://service-ox5moi4m-1258237701.gz.apigw.tencentcs.com/test/cnbetafeed';

    this.getRss(rssUrl);
  },

  getRss: function (rssUrl) {
    const that = this;

    wx.showLoading({
      title: '加载中...',
    });
     
    wx.request({
      url: rssUrl,
      data: {},
      header: {
        'content-type': 'application/xml' // 默认值
      },
      success: function (res) {

        var rssData = xml2json(res.data).rss.channel;//.channel.item.slice(0, 50);
        console.log('rssdata:', rssData)

        const {description, link, lastBuildDate = '', copyright = '', pubDate = '' } = rssData;

        that.setData({
          author: description.text,     // 源名称
          //favicon: '',    // 源logo
          copyright: copyright.text,  // 源版权
          pubDate: (lastBuildDate || pubDate) ? util.formatDate("yyyy-MM-dd HH:mm:ss", lastBuildDate || pubDate.text) : '',    // 源更新时间
          rssData: rssData,    // 源数据
        });

        wx.hideLoading();
        wx.stopPullDownRefresh()

        wx.setStorageSync('rssData', rssData);
      }
    });
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    let that = this;
    that.setData({
      author: '',     // 源名称
      favicon: '',    // 源logo
      copyright: '',  // 源版权
      pubDate: '',    // 源更新时间
      rssData: {},    // 源数据
    })
    
    let rssUrl = 'https://service-ox5moi4m-1258237701.gz.apigw.tencentcs.com/test/cnbetafeed';
    that.getRss(rssUrl)
  },
  // 点击跳转至文章详情页
  handleRssItemTap: (event) => {
    const rssItemData = event.currentTarget.dataset.rssItemData;
    const favicon = event.currentTarget.dataset.rssItemFavicon;
    console.log(event)
    // wx.navigateTo({
    //   url: `../detail/detail?id=${rssItemData}&favicon=${favicon}`,
    // });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
