# nanguo

支持自定义新标签页的 Chrome 扩展，将在新标签页上展示中国传统色的层叠波浪动画效果搭配经典诗词,并播放🌧️声和🎹声。

A Chrome extension with custom new tab page featuring Chinese poems and P5.js enabled noise waves in Chinese traditional colors

[几枝 | Jizhi](https://github.com/unicar9/jizhi) 的React实现

## 本地装载

* 生成build文件
```bash
    git clone https://github.com/daihy8759/nanguo
    yarn build
```
* 在浏览器里输入 chrome://extensions/ 进入插件管理页面
* 打开右上角开发者模式（Developer mode）
* 点击左上角 "Load unpacked" 按钮并选取build目录
* 装载成功，打开新标签页试试吧

## 功能

* 左侧淡出中国色名称。
* 右下播放键为动效开关。
* 右下下载键储存 JPEG 格式背景图到本地。


## 示例

![bg 1](https://github.com/daihy8759/nanguo/blob/master/examples/Snipaste_2019-03-30_10-15-35.png)

## 鸣谢

* 动画实现均来自(我连readme都是拷贝的🤪)[几枝 | Jizhi](https://github.com/unicar9/jizhi)
* 诗词名句调用使用[古诗词·一言API](https://gushi.ci/)。
* 播放雨声和钢琴声来自v友[链接](https://www.v2ex.com/t/549569#reply187)
* 使用的字体为方正楷体
