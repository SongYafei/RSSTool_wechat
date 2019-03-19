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
    favicon: 'cnbetalogo.png',    // 源logo
    copyright: '',  // 源版权
    pubDate: '',    // 源更新时间
    rssData: {},    // 源数据
    logoloadfin:'',
    detailType: 'description', //文章正文获取方式 description：从描述中获取 content-encode：从content-encode获取 crawl：正则匹配抓取
    title:'RSS Feed', // 新闻站名
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    });
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
      //path: '/pages/detail?url=' + that.data.linkurl,
    }

  },
  onLogoLoad: function(e) {
    const that = this ;
    
    that.setData({
      logoloadfin:'true',
    });
  },
  onLoad: function (options) {

    if( options.title ){
      this.setData({
        title:options.title,
      });
    }

    wx.setNavigationBarTitle({
      title: this.data.title,
    });

    wx.setStorageSync('navigationbartitle', this.data.title);

    if( options.url ){
      wx.navigateTo({
        url: `../detail/detail?url=${options.url}`,
      });
      console.log(options.url);
     // return;
    }


    // 默认值
    let rssUrl = options.rssUrl;
    this.setData({
      favicon: `https://images.weserv.nl/?url=${options.favicon}`,
      detailType: options.detailType,
    });

    wx.setStorageSync('curDetailType', this.data.detailType);

    this.getRss(rssUrl);
  },

  getRss: function (rssUrl) {
    const that = this;

    wx.setStorageSync('curRssUrl', rssUrl);

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
        //console.log("srcdata", res.data);
        var dataJson = xml2json(res.data) ;
        console.log(dataJson) ;
        var rssData = dataJson.rss.channel;//.channel.item.slice(0, 50);
        console.log('rssdata:', rssData);

        const {description, link, lastBuildDate = '', copyright = '', pubDate = '',image='' } = rssData;
        var author = description.text || '' ;

        that.setData({
          author: author.replace('cnBeta.COM -',''),     // 源名称
         // favicon: 'https://images.weserv.nl/?url='+image.url.text,    // 源logo
          copyright: copyright.text || '',  // 源版权
          pubDate: (lastBuildDate || pubDate) ? util.formatDate("yyyy-MM-dd HH:mm:ss", lastBuildDate.text || pubDate.text) : '',    // 源更新时间
          rssData: rssData,    // 源数据
        });

        that.setData({
          logoloadfin: 'true',
        });

        wx.hideLoading();
        wx.stopPullDownRefresh();

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
      favicon: 'cnbetalogo.png',    // 源logo
      copyright: '',  // 源版权
      pubDate: '',    // 源更新时间
      rssData: {},    // 源数据
      logoloadfin:'',
    });
    
    let rssUrl = 'https://www.cnbeta.com/backend.php';
    that.getRss(rssUrl);
  },
  getUrl: function (index) {
    return this.data.rssData.item[index].link.text;
  },
  // 点击跳转至文章详情页
  handleRssItemTap: (event) => {
    const rssItemData = event.currentTarget.dataset.rssItemData;
    const favicon = event.currentTarget.dataset.rssItemFavicon;
    console.log(rssItemData);
    wx.navigateTo({
      url: `../detail/detail?id=${rssItemData}&url=`,
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
