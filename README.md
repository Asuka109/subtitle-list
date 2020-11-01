## 介绍

提供在视频播放场景下快速定位获取字幕对象的简单数据结构。

## 安装

前置需要安装 `react`，推荐版本为 `^17.0.1`。

```
npm install subtitle-list
# 或使用 yarn
yarn add subtitle-list
```

## 使用

使用 `SubtitleList` 对象：

```javascript
import {SubtitleList} from 'subtitle-list'

const subtitles = [
    { start: 500, end: 1000, id: 'a1' },
    { start: 1000, end: 1500, id: 'a2' },
    { start: 1000, end: 1700, id: 'a3' }
]
const subtitleList = new SubtitleList(subtitles)
const result = subtitleList.findAll(1000)
const idList = result.map(subtitle => subtitle.id)
console.log(idList)    // ['a2', 'a3‘]
```
