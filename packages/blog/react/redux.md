# Redux

## 随笔

- redux 是一个中心化存储工具，特点是单向数据流
- 有几个核心的概念
  - Action: 本质是一个对象，具有 type 和 payload 属性
  - ActionCreator: 是一个返回 Action 的函数，用来进行 Action 的复用
  - Reducer: 一个接受旧状态并且返回新状态的函数，其中旧状态不可修改，只能返回一个新的状态
  - Dispatch: 用来触发 Action 的函数
