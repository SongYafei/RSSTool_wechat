# RSS Tool 微信小程序
### 介绍

RSS Tool 小程序通过提供固定列表地址进行最新RSS资讯获取，以列表形式展示出来，并通过爬取每篇新闻的正文进行文章的展示。

目前支持：cnBeta 爱范儿 知乎每日精选 36氪 豆瓣书评，后续可能添加更多的RSS源，由于要保证展示效果，需要调试后增加

### 说明

1.抓取正文是抓取富文本的部分，通过微信rich-text组件进行展示

2.正文通过正则进行匹配抓取

3.界面部分，用到了有赞开发的ZanUI

4.对新闻源正文进行处理，其中用到图片对手机屏幕的自适应，增加段落间距 等

### 遗留

1.rich-text中加载图片速度比较慢，且针对防盗链图片展示不稳定，使用图片代理https://images.weserv.nl/?url= 依然存在不稳定的问题

2.目前个人账户的微信小程序，无法上传资讯时政类别的小程序，因此目前小城还未上架(如果想使用体验版，可添加我微信Yafei_S ，说明来意，可添加体验权限(*￣︶￣))

