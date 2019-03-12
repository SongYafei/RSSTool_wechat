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
    author: 'cnBeta',     // 源名称
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

    // const favicon = options.favicon || '';

    // if (favicon) {
    //   this.setData({
    //     favicon,
    //   })
    // }

    // 默认值
    let rssUrl = 'https://service-ox5moi4m-1258237701.gz.apigw.tencentcs.com/test/cnbetafeed';

    this.getRss(rssUrl);
  },

  getRss: function (rssUrl) {
    const that = this;

    wx.showLoading({
      title: '拼命加载中...',
    });

    // 由于个人服务器资源有限，这里仅能提供模拟数据和方法
     
    wx.request({
      url: rssUrl,
      data: {},
      header: {
        'content-type': 'application/xml' // 默认值
      },
      success: function (res) {

        var rssData = xml2json(res.data).rss.channel;//.channel.item.slice(0, 50);
        console.log('rssdata:', rssData)
        

        const { title, link, lastBuildDate = '', copyright = '', pubDate = '' } = rssData;

        that.setData({
          author: title,     // 源名称
          //favicon: '',    // 源logo
          copyright: copyright,  // 源版权
          pubDate: (lastBuildDate || pubDate) ? util.formatDate("yyyy-MM-dd HH:mm:ss", lastBuildDate || pubDate) : '',    // 源更新时间
          rssData: rssData,    // 源数据
        });

        wx.hideLoading();

        wx.setStorageSync('rssData', rssData);
      }
    });
    
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
