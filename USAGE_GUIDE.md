# 牙科诊所管理系统 API 使用指南

本文档提供了使用牙科诊所管理系统API服务的详细说明和示例代码。

## 目录

- [安装](#安装)
- [基本配置](#基本配置)
- [认证](#认证)
- [用户管理](#用户管理)
- [患者管理](#患者管理)
- [医疗记录](#医疗记录)
- [预约管理](#预约管理)
- [随访记录](#随访记录)

## 安装

```bash
# 使用npm安装
npm install dental-clinic-api

# 使用yarn安装
yarn add dental-clinic-api
```

## 基本配置

```typescript
import { DentalClinicApiService } from 'dental-clinic-api';

// 创建API客户端实例
const apiService = new DentalClinicApiService({
  baseURL: 'http://your-api-server/api',
  timeout: 10000, // 请求超时时间(ms)
  handleError: true, // 自动处理错误
});
```

## 认证

### 登录

```typescript
import { DentalClinicApiService } from 'dental-clinic-api';

const apiService = new DentalClinicApiService({
  baseURL: 'http://your-api-server/api',
});

async function login() {
  try {
    const response = await apiService.auth.login({
      username: 'admin',
      password: 'password123',
    });
    
    if (response.success) {
      console.log('登录成功', response.data);
      // 登录成功后，令牌会自动设置到API客户端
      // 你也可以手动保存令牌用于后续使用
      localStorage.setItem('token', response.data.token);
    } else {
      console.error('登录失败', response.message);
    }
  } catch (error) {
    console.error('登录异常', error);
  }
}
```

### 登出

```typescript
async function logout() {
  try {
    const response = await apiService.auth.logout();
    
    if (response.success) {
      console.log('登出成功');
      localStorage.removeItem('token');
    } else {
      console.error('登出失败', response.message);
    }
  } catch (error) {
    console.error('登出异常', error);
  }
}
```

## 用户管理

### 获取用户列表

```typescript
async function getUsers() {
  try {
    const response = await apiService.users.getUsers({
      username: 'admin', // 可选，模糊查询
      role: 'admin',     // 可选，筛选角色
      page: 1,           // 可选，分页
      limit: 10,         // 可选，每页条数
    });
    
    if (response.success) {
      console.log('用户总数:', response.data.total);
      console.log('用户列表:', response.data.list);
    } else {
      console.error('获取用户列表失败', response.message);
    }
  } catch (error) {
    console.error('获取用户列表异常', error);
  }
}
```

### 创建用户

```typescript
async function createUser() {
  try {
    const response = await apiService.users.createUser({
      username: 'doctor1',
      password: 'password123',
      realName: '张医生',
      phone: '13800138000',
      role: 'doctor',
      status: 'active',
    });
    
    if (response.success) {
      console.log('创建用户成功', response.data);
    } else {
      console.error('创建用户失败', response.message);
    }
  } catch (error) {
    console.error('创建用户异常', error);
  }
}
```

### 更新用户

```typescript
async function updateUser(userId: string) {
  try {
    const response = await apiService.users.updateUser(userId, {
      realName: '李医生',
      phone: '13900139000',
    });
    
    if (response.success) {
      console.log('更新用户成功', response.data);
    } else {
      console.error('更新用户失败', response.message);
    }
  } catch (error) {
    console.error('更新用户异常', error);
  }
}
```

### 删除用户

```typescript
async function deleteUser(userId: string) {
  try {
    const response = await apiService.users.deleteUser(userId);
    
    if (response.success) {
      console.log('删除用户成功');
    } else {
      console.error('删除用户失败', response.message);
    }
  } catch (error) {
    console.error('删除用户异常', error);
  }
}
```

## 患者管理

类似用户管理，系统提供了患者相关的API调用方法，包括：

- 获取患者列表
- 获取患者详情
- 创建患者
- 更新患者信息
- 删除患者

详细使用方法请参考API文档和类型定义。

## 医疗记录

系统提供了医疗记录相关的API调用方法，包括：

- 获取患者医疗记录列表
- 创建医疗记录
- 更新医疗记录
- 删除医疗记录

详细使用方法请参考API文档和类型定义。

## 预约管理

系统提供了预约相关的API调用方法，包括：

- 获取预约列表
- 获取指定日期的预约
- 创建预约
- 更新预约
- 删除预约

详细使用方法请参考API文档和类型定义。

## 随访记录

系统提供了随访记录相关的API调用方法，包括：

- 获取随访记录列表
- 创建随访记录
- 更新随访记录
- 删除随访记录

详细使用方法请参考API文档和类型定义。

## 错误处理

API客户端默认会自动处理常见的错误情况，如请求超时、网络错误等。你也可以通过设置`handleError: false`来禁用自动错误处理，然后通过try-catch手动处理异常：

```typescript
const apiService = new DentalClinicApiService({
  baseURL: 'http://your-api-server/api',
  handleError: false, // 禁用自动错误处理
});

async function exampleWithManualErrorHandling() {
  try {
    const response = await apiService.users.getUsers();
    // 处理成功响应
  } catch (error) {
    // 手动处理错误
    if (error.response) {
      // 服务器返回了错误响应
      console.error('服务器错误:', error.response.data);
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('网络错误:', error.request);
    } else {
      // 请求设置过程中出现错误
      console.error('请求错误:', error.message);
    }
  }
}
```