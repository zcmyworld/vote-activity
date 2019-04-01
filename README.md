# vote-activity 一个投票活动项目


## 安装

### 环境依赖：

 1. 安装 Node v8.11.1
 2. 安装 MySQL 5.7
 3. 安装 Redis 2.8
 4. 在 MySQL 创建数据库，执行 vote-activity.sql
 5. npm install & npm start

### 使用Docker-compose

```
构建镜像 docker-compose build
创建容器 docker-compose up -d

```

### 环境变量
>
  - NODE_ENV=当前环境
  - REDIS_HOST=Redis host 地址
  - REDIS_PORT=Redis端口
  - DB_HOST=MySQl host 地址
  - DB_PORT=MySQL端口
  - DB_USER=MySQL用户
  - DB_PWD=MySQL密码
  - DB_NAME=vote-activity
  - SEND_HOST=smtp.exmail.qq.com
  - SEND_EMAIL=发送系统邮件的邮件账号
  - SEND_PWD=发送系统邮件的邮件密码
  - HOSTURL=项目域名

## 文档

```
npm run apidoc

```

## 测试

```

npm test

> 注意：运行测试会清空 Redis 和 MySQl，禁止在生产环境中执行

```

## 目录结构

```
vote-activity
  |- apidoc                           # 接口文档
  |- app                              # 项目文件
    |- Configs                        # 项目文件
    |- Controllers                    # 控制器
    |- Crons                          # 定时任务
    |- Middlewares                    # 中间件
    |- Models                         # 模型
    |- Routes                         # 路由
    |- Services                       # 业务逻辑
    |- Tools                          # 工具
  |- test                             # 测试用例
  |- app.js                           # 入口文件

```

## 投票流程讲解

1. 用户投票前，需要先登录获取 utoken，用户信息将会以 HASH session:${utoken} 的形式保存到 Redis

2. 假设用户向候选人 1,2,3 进行投票，则向服务端传值 cuids:1,2,3

3. 投票信息以 HASH voted:${uid} 保存到 Redis

4. 在候选人列表中进行票数+1，保存在 ZSET candidates ，候选人列表会以进行排序

5. 最后，会将这次投票信息加入到已投票队列 LIST votesinfo 中，由消费者定时读取这个队列，将数据同步到 MySQL