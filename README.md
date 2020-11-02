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

使用为 `React` 提供的 `useSubtitles hook`：

```jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSubtitles } from "subtitle-list";

const Subtitle = (props) => {
  const { find } = useSubtitles(props.subtitles);
  const subtitles = useMemo(() => find(props.time), [props, find]);

  return (
    <div>
      <p>time: {props.time}</p>
      <p>subtitles: </p>
      <ul>
        {subtitles.map((subtitle) => (
          <li>{subtitle.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  const [time, setTime] = useState(0);
  const subtitles = [
    { start: 500, end: 1000, id: "a1", content: "a1" },
    { start: 1000, end: 1500, id: "a2", content: "a2" },
    { start: 1000, end: 1700, id: "a3", content: "a3" }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time + 100) % 2000);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      <Subtitle subtitles={subtitles} time={time} />
    </div>
  );
}
```

或者在 CodeSandbox [查看在线演示](https://codesandbox.io/s/subtitle-list-use-subtitles-elg59?file=/src/App.js)
