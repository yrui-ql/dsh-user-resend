# dsh-user-resend

A DeepSeek Harness plugin that adds a **resend** action to user messages in Chat.

After a Harness restart, a process interruption or a failed request, your user
message is still in the conversation but the model may not continue. Hover that
message, click **Resend**, and the plugin submits it again through the official
composer path — text, image attachments and `@` file mentions included — so the
Agent continues without retyping.

在 DSH 对话（Chat）里，给**用户角色发送的消息**加一个「重新发送」按钮。

DSH 重启、进程中断、请求失败后，用户消息还在对话里，但 AI 可能不再继续输出。把鼠标移到那条用户消息上，点「重新发送」，插件会把该消息**连同图片附件和 @ 文件提及**重新发一次（走标准发送链路：排队和失败处理都由 Session Controller 负责），AI 会继续回答，不需要重新输入。

## 行为

- 用户消息右侧动作行：`时间 · 复制 · 重新发送`，与官方行一致（旧消息默认悬停显示）。
- 重发内容：
  - 文本按原顺序保留；`@path` / `@"path with spaces"` 文件提及是普通提示文本，原样发送。
  - 图片附件从会话附件存储读回，重新编码后随消息一起发送（多张图片保持原顺序）。
- 点击后按钮进入「正在重新发送…」状态；Host 接受后对话里出现这条新的用户消息（含图片），AI 开始回答。
- **只在回合空闲时发送**：会话正在运行时点击会直接提示「回合进行中，等它结束再重发」，不会把消息塞进宿主的排队区 —— 排队副本没有本地回显、可能与相邻消息合并或被丢弃（0.2.1 修掉的就是这个：用户点了 A，排队里出现的却是更早的 B / 两条被拼成一条）。
- 发送走与输入框相同的提交链路：先 `session.beginSubmission` 登记本地回显，再带 `requestId` 调 `session.prompt`；失败时 retire 回显，不留下孤儿排队项。
- 发送失败（会话不可用、图片读取失败、连接失败等）时按钮变红并提示「重新发送失败」，2.5 秒后恢复。
- 中英文文案跟随 DSH 语言设置。

## 限制

- **回合运行中暂不支持重发**：点击只提示等待，不排队。需要在运行中插入内容时请直接用输入框（官方排队/打断语义）。
- **通用文件附件暂不重发**：拖入的非图片文件在会话里只记录一个持久附件引用（模型侧通过只读路径读取），客户端没有把它重新变成发送回执（receipt）的接口。文本和图片仍会发送。
- 斜杠命令（如 `/goal`）不经过命令解析器，会作为普通文本发送。需要命令语义时请用输入框。
- 重发会在会话里追加一条新的用户消息（与官方「发送」一致）；不会原地改写历史，也不会创建分支。需要从某条消息另开分支时用官方的「分支」动作（助手消息尾部）。
- 图片重发会在附件存储里再保存一份归一化副本；DSH 的附件本来就不会自动删除。
- 替换了官方 `conversation.chat.node` 的 `user` 渲染器（保留官方内容工厂，因此气泡、图片、引用仍由 ui-chat 渲染）。DSH 升级后若该渲染器签名变化，需要同步本插件。
- 在 DeepSeek Harness `0.2.1-rc.5` 上开发与验证。

## 安装 / 卸载

```bash
git clone https://github.com/yrui-ql/dsh-user-resend.git
```

然后在 DSH 会话中通过插件管理器安装（`plugin_manager` 的 `install_bundle`，`target` 指向克隆目录的绝对路径）。安装后它按普通 bundle 出现在「设置 → 插件」里。

卸载：在「设置 → 插件」中禁用或移除 `dsh-user-resend` 即可；它不写任何会话数据或配置文件。

## 实现说明

- 内容重建：对 `user/message` 的每个 content block，`text` 直接成为 `{ type: 'text', text }`；`image` 用 `session.readAttachment(attachmentId)` 读回字节，转 canonical base64 后成为 `{ type: 'image', mediaType, data, name }`。
- 发送调用：与官方输入框同一条链路 —— 先 `session.beginSubmission({ mode: 'queue', text, attachments })` 登记本地回显并拿到 `requestId`，再 `session.prompt(content, 'queue', undefined, requestId)`。失败时 `submission.abandon()` 撤回回显；宿主负责排队、会话唤醒与错误上报。
- 回合运行中直接拒绝重发（`session.running === true` 时提示等待），避免无回显的排队副本被合并/丢弃。
- 渲染：`conversation.chat.node` 的 `user` 键注册 `priority: -1` 覆盖官方渲染器；内容仍调用官方 `conversation.chat.user.content` Factory（session 作用域），因此气泡、附件、引用展示不变。
- 样式只使用主题 token（`--dsw-alias-*`）和宿主字体变量，不自带颜色方案。

## 文件

| 文件 | 作用 |
|---|---|
| `package.json` | bundle 清单：`dsh.bundle.patch` + `dsh.client` |
| `cordis.patch.yml` | 插入 `dsh-user-resend` 插件行 |
| `index.js` | Host 空壳（能力完全在浏览器侧） |
| `client.js` | 替换 user 消息渲染器 + 重新发送动作 |
| `locale/zh.json`、`locale/en.json` | 插件展示元数据与 UI 文案 |
| `icon.svg` | 插件管理器图标 |
| `test/manifest.test.mjs` | 清单、导出、locale 与图标自检 |

## 开发

```bash
npm test   # node test/manifest.test.mjs
```

要求 Node.js 22+（仅校验需要；插件本身无运行时依赖）。

## 变更记录

见 [CHANGELOG.md](CHANGELOG.md)。

## License

[MIT](LICENSE)
