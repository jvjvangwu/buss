# API 接口文档

## 基础信息
- **基础URL**: `http://localhost:3000/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

## 认证相关

### 用户注册
**POST** `/auth/register`

**请求体**:
```json
{
  "username": "string, 必填, 3-50字符",
  "email": "string, 必填, 有效邮箱格式",
  "password": "string, 必填, 最小6字符",
  "display_name": "string, 可选"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "display_name": "测试用户",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 用户登录
**POST** `/auth/login`

**请求体**:
```json
{
  "username": "string, 必填",
  "password": "string, 必填"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "display_name": "测试用户",
      "role": "user",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "token": "jwt_token_here"
  }
}
```

### 获取当前用户信息
**GET** `/auth/me`

**Headers**:
```
Authorization: Bearer {token}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "display_name": "测试用户",
      "role": "user",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "个人简介",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

## 帖子相关

### 获取帖子列表
**GET** `/posts`

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认20
- `category`: 分类ID或slug
- `tag`: 标签ID或slug
- `sort`: 排序方式，可选值：`latest`, `popular`, `hot`
- `search`: 搜索关键词

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "帖子标题",
        "slug": "post-slug",
        "excerpt": "帖子摘要",
        "user": {
          "id": 1,
          "username": "author",
          "display_name": "作者",
          "avatar_url": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": 1,
          "name": "技术",
          "slug": "tech"
        },
        "tags": [
          {"id": 1, "name": "JavaScript", "slug": "javascript", "color": "#F7DF1E"}
        ],
        "view_count": 100,
        "like_count": 10,
        "comment_count": 5,
        "is_pinned": false,
        "is_featured": false,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5
    }
  }
}
```

### 获取单个帖子
**GET** `/posts/{id}`

**路径参数**:
- `id`: 帖子ID或slug

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "帖子标题",
      "slug": "post-slug",
      "content": "帖子完整内容...",
      "user": {
        "id": 1,
        "username": "author",
        "display_name": "作者",
        "avatar_url": "https://example.com/avatar.jpg",
        "bio": "作者简介"
      },
      "category": {
        "id": 1,
        "name": "技术",
        "slug": "tech",
        "description": "技术分类"
      },
      "tags": [
        {"id": 1, "name": "JavaScript", "slug": "javascript", "color": "#F7DF1E"}
      ],
      "view_count": 100,
      "like_count": 10,
      "comment_count": 5,
      "is_pinned": false,
      "is_featured": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 创建帖子
**POST** `/posts`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体**:
```json
{
  "title": "string, 必填, 最大200字符",
  "content": "string, 必填",
  "category_id": "integer, 可选",
  "tags": ["array of tag IDs or names", "可选"],
  "status": "string, 可选, 默认published"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "新帖子标题",
      "slug": "new-post-slug",
      "content": "帖子内容...",
      "user_id": 1,
      "category_id": 1,
      "status": "published",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 更新帖子
**PUT** `/posts/{id}`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数**:
- `id`: 帖子ID

**请求体**:
```json
{
  "title": "string, 可选",
  "content": "string, 可选",
  "category_id": "integer, 可选",
  "tags": ["array of tag IDs or names", "可选"],
  "status": "string, 可选"
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "更新后的标题",
      "slug": "updated-slug",
      "content": "更新后的内容...",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 删除帖子
**DELETE** `/posts/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**路径参数**:
- `id`: 帖子ID

**成功响应** (200):
```json
{
  "success": true,
  "message": "帖子已删除"
}
```

## 评论相关

### 获取帖子评论
**GET** `/posts/{postId}/comments`

**查询参数**:
- `page`: 页码，默认1
- `limit`: 每页数量，默认50
- `sort`: 排序方式，可选值：`latest`, `oldest`, `popular`

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "评论内容",
        "user": {
          "id": 2,
          "username": "commenter",
          "display_name": "评论者",
          "avatar_url": "https://example.com/avatar.jpg"
        },
        "post_id": 1,
        "parent_id": null,
        "like_count": 5,
        "created_at": "2024-01-01T00:00:00Z",
        "replies": [
          {
            "id": 2,
            "content": "回复内容",
            "user": {...},
            "parent_id": 1,
            "like_count": 2,
            "created_at": "2024-01-01T01:00:00Z"
          }
        ]
      }
    ],
    "pagination": {...}
  }
}
```

### 创建评论
**POST** `/posts/{postId}/comments`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体**:
```json
{
  "content": "string, 必填",
  "parent_id": "integer, 可选, 回复的评论ID"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": 1,
      "content": "评论内容",
      "user_id": 1,
      "post_id": 1,
      "parent_id": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

## 点赞相关

### 点赞/取消点赞帖子
**POST** `/posts/{postId}/like`

**Headers**:
```
Authorization: Bearer {token}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "liked": true,  // true表示点赞，false表示取消点赞
    "like_count": 11
  }
}
```

### 点赞/取消点赞评论
**POST** `/comments/{commentId}/like`

**Headers**:
```
Authorization: Bearer {token}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "liked": true,
    "like_count": 6
  }
}
```

## 分类和标签

### 获取分类列表
**GET** `/categories`

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "技术",
        "slug": "tech",
        "description": "技术讨论",
        "post_count": 100,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 获取标签列表
**GET** `/tags`

**查询参数**:
- `popular`: boolean, 是否按热度排序

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": 1,
        "name": "JavaScript",
        "slug": "javascript",
        "color": "#F7DF1E",
        "post_count": 50,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 用户相关

### 获取用户信息
**GET** `/users/{username}`

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "display_name": "测试用户",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "个人简介",
      "post_count": 10,
      "comment_count": 50,
      "follower_count": 100,
      "following_count": 50,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 获取用户帖子
**GET** `/users/{username}/posts`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量

### 关注/取消关注用户
**POST** `/users/{username}/follow`

**Headers**:
```
Authorization: Bearer {token}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "following": true,  // true表示关注，false表示取消关注
    "follower_count": 101
  }
}
```

## 搜索功能

### 搜索帖子
**GET** `/search/posts`

**查询参数**:
- `q`: 搜索关键词
- `page`: 页码
- `limit`: 每页数量
- `sort`: 排序方式

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {...}
  }
}
```

## 错误响应
所有API错误都返回以下格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}  // 可选，详细错误信息
  }
}
```

### 常见错误码
- `VALIDATION_ERROR`: 参数验证失败
- `AUTH_REQUIRED`: 需要登录
- `PERMISSION_DENIED`: 权限不足
- `NOT_FOUND`: 资源不存在
- `DUPLICATE_ENTRY`: 重复记录
- `INTERNAL_ERROR`: 服务器内部错误