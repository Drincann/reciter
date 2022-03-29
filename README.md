# Reciter

让程序为你接管遗忘曲线，提供一目了然的单词复习周期。

## 技术栈

Node.js/Browser

- vuejs

- koa

## debug

使用 vscode 调试，启动 beckend 与 frontend，这两者均会进行 watch，一切修改均会进行热更新。

## build

```shell
npm run buildall
```

它会做两件事，将后端通过 tsc 编译到 `./dist`，前端使用 vite 编译到 `./dist/public`。

你也可以分别 build。

```shell
npm run build && cd front && npm run build ; cd ..
```

## start

```shell
npm run start:prod
```

## 抽象设计

## 接口
