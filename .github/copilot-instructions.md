# 开发规范与指令

## 1. UI 规范指令

- 使用 shadcn/ui 组件库进行开发。
- 如果需要使用新的组件（如 Button, Card），请先检查 `^/components/ui` 目录下是否存在。
- 如果不存在该组件，请在终端执行命令 `pnpm dlx shadcn@latest add <component-name>` 进行安装。
- 编写代码时，始终参考 ui.shadcn.com 的最新标准。
