// pages/detail.js

var wxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const rssData = wx.getStorageSync('rssData') || {};
    const author = rssData.title || '';

    const rssDataItem = rssData.item[options.id];
    const { title, link, pubDate } = rssDataItem;

    console.log(link.text)

    var linkurl = link.text.substring(link.text.lastIndexOf('/'), link.text.length);
    linkurl = 'https://m.cnbeta.com/view' + linkurl

    console.log(link.text)

    wx.request({
      url: link.text,
      data: {},
      header: {
        'content-type': 'application/html' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        // let domainReg = new RegExp('https://static.cnbetacdn.com', 'g');
        // var sid='826855'
        // let article = {
        //   sid,
        //   source: $('.article-byline span a').html() || $('.article-byline span').html(),
        //   summary: $('.article-summ p').html(),
        //   content: $('.articleCont').html().replace(styleReg.reg, styleReg.replace).replace(scriptReg.reg, scriptReg.replace).replace(domainReg, serverAssetPath),
        // };
        // console.log(article)
        wxParse.wxParse('article','html',res.data, that, 5)
      }
    });
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})