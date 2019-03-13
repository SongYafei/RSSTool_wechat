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
    linkurl = 'https://m.cnbeta.com/view' + linkurl ;

    wx.setStorageSync('linkurl', linkurl) ;

    console.log(link.text) ;

    this.getArticle(link.text) ;
    

  },

  getArticle:function(url) {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this ;
    console.log("getArticle");
    wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'application/html' // 默认值
      },
      success: function (res) {
       // console.log(res.data)
        wxParse.wxParse('article', 'html', res.data, that, 5)

        wx.stopPullDownRefresh();
        wx.hideLoading();
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
    const linkurl = wx.getStorageSync('linkurl') || {};
    this.getArticle(linkurl);
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