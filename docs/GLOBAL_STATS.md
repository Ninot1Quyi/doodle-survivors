# 全服游戏局数与时长

所有玩家共享同一个 D1 数据库；开始界面通过 `/api/stats` 读取累计值。没有把本机 localStorage 当作全服数据，也没有补造上线前的记录。

- 点击进入战场或重新开始时，生成一个随机局 ID，计一局。菜单演示不计。两种游戏版本共用统计。
- 只累计页面可见且游戏处于 `playing` 的实际时间；暂停、升级选择、商店、设置、结算、后台页签均不计。胜利后继续无限模式属于同一局。
- 每 15 秒上报累计毫秒；离开战斗、切后台、关闭页面时尝试追加上报。重复、乱序、重试不会重复增加局数或时长。
- localStorage 只保留最多 32 条尚未确认的匿名上报，用于网络恢复重试；公开数字始终来自服务器。不保存玩家账号、邮箱或稳定设备标识。
- 断网、强制结束进程、清理浏览器存储可能丢失未上报时间。服务器按记录创建后的墙钟时间加 15 秒递送宽限限制累计值；长时间离线首次上报不保证补全。
- 匿名公开计数用于了解使用量，不是防作弊账本。不会据此推算独立玩家人数；自动化客户端仍可能伪造开局。

## 实现

`public/global-stats.js` 管理匿名局生命周期。`app/api/stats/route.ts` 调用 `app/stats-service.mjs`，使用事务批次写入 `game_runs`。数据库触发器同步 `game_totals`，每次读取无需扫描所有历史局。迁移只创建表和触发器，不写测试数据。

`public/` 是游戏源码；Vinext 构建结果在 `dist/`。原游戏仍可使用 Python 静态服务独立运行，此时共享统计显示连接不可用，但不影响战斗。

## 本地完整运行

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_public_stepford_cuckoos.sql
npm start
```

迁移只在新的本地数据库执行一次。线上 D1 由 Sites 在发布时创建绑定并应用迁移，和本地数据库相互独立。

## 验证

`node scripts/test-global-stats.mjs` 使用真实 SQLite 运行迁移及 API SQL，覆盖多局累计、重复/乱序消息、异常时长、输入和来源校验；执行实际前端脚本检查暂停、后台及重新开局。部署前另以本地 Worker HTTP 验证根页面、音频资源与 API。未使用虚构线上记录充当真实玩家统计。
