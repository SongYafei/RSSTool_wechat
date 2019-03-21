//index.js
//获取应用实例

const util = require('../../utils/util.js');
const xml2json = require('../../xmllib/xml2json.js')
const app = getApp()
// 导入rss源数据
const rsscenter = require('../../data/rss.js')


Page({
  /**
   * 页面的初始数据
   */
  data: {
    author: '',     // 源名称
    favicon: '/res/cnbetalogo.png',    // 源logo
    copyright: '',  // 源版权
    pubDate: '',    // 源更新时间
    rssData: {},    // 源数据
    logoloadfin:'',
    detailType: 'description', //文章正文获取方式 description：从描述中获取 content-encode：从content-encode获取 crawl：正则匹配抓取
    title:'RSS Feed', // 新闻站名
    rssUrl:'',
    fromsharedetailurl:'',  //从分享页过来的正文url
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
      title: 'RSS Reader-' + that.data.title,
      path: `/pages/index/index?rssUrl=${encodeURIComponent(that.data.rssUrl)}`,
    }

  },
  onLogoLoad: function(e) {
    const that = this ;
    
    that.setData({
      logoloadfin:'true',
    });
  },
  onLoad: function (options) {

    console.log("options.rssurl", options)
    var rssUrl = decodeURIComponent(options.rssUrl)
    console.log(rssUrl)
    var rssDataFind = [];
    rsscenter.rssData.forEach( function(item) {
      if (rssUrl == item.rssUrl) {
        rssDataFind = item;
      }
    });
    
    console.log('rssdatafind',rssDataFind);

    // 默认值
    this.setData({
      favicon: rssDataFind.favicon,
      detailType: rssDataFind.detail,
      title: rssDataFind.title,
      rssUrl: rssUrl,
    });

    wx.setNavigationBarTitle({
      title: this.data.title,
    });

    wx.setStorageSync('navigationbartitle', this.data.title);

    if( options.url ){

      var detailurl = decodeURIComponent(options.url) ;
      // if (detailType == 'description'
      // || detailType == 'content:encoded') {
      //   this.setData({
      //     fromsharedetailurl: detailurl,
      //   })
      // }else {
        wx.navigateTo({
          url: `../detail/detail?url=${detailurl}`,
        });
        console.log(detailurl);
     // }

     
    } 
    else if (options.article) {
      wx.navigateTo({
        url: `../detail/detail?author=${options.author}&pubtime=${options.pubtime}&title=${options.detailtitle}&article=${options.article}`,
      });
    }

    wx.setStorageSync('curDetailType', this.data.detailType);

    this.getRss(this.data.rssUrl);
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

        wx.setStorageSync('rssData', rssData);

        //判断是否是从分享页跳转过来的
        if( that.data.fromsharedetailurl.length != 0){
          console.log("fromsharedetailurl", that.data.fromsharedetailurl)
          var findid = -1;
          for (i = 0; i < rssData.item.length; i++) {
            if (rssData.item[i].link.text == that.data.fromsharedetailurl) {
              wx.navigateTo({
                url: `../detail/detail?id=${i}&url=`,
              });
              break;
            }
          }
        }

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
     // favicon: '',    // 源logo
      copyright: '',  // 源版权
      pubDate: '',    // 源更新时间
      rssData: {},    // 源数据
      logoloadfin:'',
    });

    that.getRss(this.data.rssUrl);
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
