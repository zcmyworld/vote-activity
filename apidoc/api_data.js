define({ "api": [
  {
    "type": "GET",
    "url": "/api/v1/admin/acttime",
    "title": "获取活动时间",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求成功\",\n  \"data\": {\n    startTime: startTime,\n    endTime: endTime,\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/AdminController.js",
    "groupTitle": "Admin",
    "name": "GetApiV1AdminActtime"
  },
  {
    "type": "POST",
    "url": "/api/v1/admin/acttime",
    "title": "设置活动时间",
    "group": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "startTime",
            "description": "<p>活动开始时间</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "endTime",
            "description": "<p>活动结束时间</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求成功\",\n  \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/AdminController.js",
    "groupTitle": "Admin",
    "name": "PostApiV1AdminActtime"
  },
  {
    "type": "DELETE",
    "url": "/api/v1/candidate/:cuid",
    "title": "删除候选人",
    "group": "Candidates",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"删除成功\",\n  \"data\": {\n    \"candidates\": []\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/CandidateController.js",
    "groupTitle": "Candidates",
    "name": "DeleteApiV1CandidateCuid"
  },
  {
    "type": "GET",
    "url": "/api/v1/candidates",
    "title": "获取候选人列表",
    "group": "Candidates",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"登录成功\",\n  \"data\": {\n    \"candidates\": [{\n      cuid: 10,\n      name: \"姓名\",\n      info: 消息\",\n      createdAt: \"创建时间\",\n      votes: \"当前票数\"\n    }]\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/CandidateController.js",
    "groupTitle": "Candidates",
    "name": "GetApiV1Candidates"
  },
  {
    "type": "POST",
    "url": "/api/v1/candidate/:cuid",
    "title": "修改候选人信息",
    "group": "Candidates",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求成功\",\n  \"data\": {\n    \"candidates\": []\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/CandidateController.js",
    "groupTitle": "Candidates",
    "name": "PostApiV1CandidateCuid"
  },
  {
    "type": "PUT",
    "url": "/api/v1/candidate",
    "title": "添加候选人",
    "group": "Candidates",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "201",
          "content": "{\n  \"code\": 0,\n  \"message\": \"添加成功\",\n  \"data\": {\n    \"candidates\": []\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/CandidateController.js",
    "groupTitle": "Candidates",
    "name": "PutApiV1Candidate"
  },
  {
    "type": "GET",
    "url": "/api/v1/user/active/:urltoken",
    "title": "用户激活",
    "group": "User",
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求成功\",\n  \"data\": {\n    \"utoken\": \"xxx\"\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/UserController.js",
    "groupTitle": "User",
    "name": "GetApiV1UserActiveUrltoken"
  },
  {
    "type": "GET",
    "url": "/api/v1/user/vote",
    "title": "用户投票",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "utoken",
            "description": "<p>用户登录令牌</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求成功\",\n  \"data\": {\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/UserController.js",
    "groupTitle": "User",
    "name": "GetApiV1UserVote"
  },
  {
    "type": "POST",
    "url": "/api/v1/user/login",
    "title": "用户登录",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "200",
          "content": "{\n  \"code\": 0,\n  \"message\": \"登录成功\",\n  \"data\": {\n    \"utoken\": \"xxx\"\n  },\n}",
          "type": "json"
        },
        {
          "title": "201",
          "content": "{\n  \"code\": 0,\n  \"message\": \"创建成功\",\n  \"data\": {\n  },\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "400",
          "content": "{\n  \"code\": 0,\n  \"message\": \"请求参数不正确\",\n  \"data\": {},\n}",
          "type": "json"
        },
        {
          "title": "403",
          "content": "{\n  \"code\": 0,\n  \"message\": \"用户没有权限\",\n  \"data\": {},\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/Controllers/UserController.js",
    "groupTitle": "User",
    "name": "PostApiV1UserLogin"
  }
] });
