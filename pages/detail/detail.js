// pages/detail.js

const xml2json = require('../../xmllib/xml2json.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkurl:'',
    title:'',
    author:'',
    pubTime:'',
    summary:'',
    article:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    console.log(options) ;

    var linkurl = "";
    if ( options.url.length == 0 ){
      const rssData = wx.getStorageSync('rssData') || {};
      const author = rssData.title || '';

      const rssDataItem = rssData.item[options.id];
      const { title, link, pubDate } = rssDataItem;

      console.log(link.text)

      linkurl = link.text.substring(link.text.lastIndexOf('/'), link.text.length);
      linkurl = 'https://m.cnbeta.com/view' + linkurl;

    }else{
      linkurl = options.url ;
    }
   

    wx.setStorageSync('linkurl', linkurl) ;

    console.log(linkurl) ;
    that.setData({
      linkurl:linkurl ,
    })

    this.getArticle(linkurl) ;
    

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

        var regTitle = new RegExp("<title>([\\s\\S]*?)...............</title>","g") ;
        var title = regTitle.exec(res.data) ;
        if( title != null){
          console.log(title[1]);
          that.setData({
            title:title[1],
          });
        }

        var regTime = new RegExp('<time class="time">([\\s\\S]*?)</time>', "g");
        var time = regTime.exec(res.data);
        if (time != null) {
          console.log(time[1]);
          that.setData({
            pubTime: time[1],
          });
        }

        var regAuthor = new RegExp('<span><a href=".*?" target="_blank"><span>(.*?)</span></a>&nbsp;&nbsp;</span>', "g");
        var author = regAuthor.exec(res.data);
        if (author != null) {
          console.log(author[1]);
          that.setData({
            author: author[1],
          });
        }

        var regSum = new RegExp('<div class="article-summ"><b>...</b>([\\s\\S]*?)</div>', "g");
        var summary = regSum.exec(res.data);
        if (summary != null) {
          console.log(summary[1]);
          that.setData({
            summary: '摘要：' + summary[1],
          });
        }

        var regTopic = new RegExp('<div class="article-topic">([\\s\\S]*?)</div>', "g");
        var topic = regTopic.exec(res.data);
        if(topic != null){
          res.data = res.data.replace(topic[0], "")
        }
        
       // console.log(res.data);
        
        var regContent = new RegExp('<div class="articleCont" id="artibody">([\\s\\S]*?)</div>', "g");
        var content = regContent.exec(res.data);
        if (content != null) {
          console.log(content[1]);

          var regImgstyle = new RegExp('<img', "g");
          var article = content[1].replace(regImgstyle, '<img style="max-width:100%;height:auto;margin-left:-24px;" '); //防止图片过大 ;

          var regImgurl = new RegExp('https://static.cnbetacdn.com', "g");
          article = article.replace(regImgurl, "https://images.weserv.nl/?url=https://static.cnbetacdn.com")

          var regPstyle = new RegExp('<p style="', "g");
          article = article.replace(regPstyle, '<p class="textattr" style="margin-top:24px;');

          var regPstyle2 = new RegExp('<p>', "g");
          article = article.replace(regPstyle2, '<p class="textattr" style="margin-top:24px;">');

          that.setData({
            article: article,
          });
        }

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
  onShareAppMessage: function (res) {

    const that = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: 'cnBeta最新资讯',
      path: '/pages/index/index?url='+that.data.linkurl,
    }

  }
})