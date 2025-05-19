# 自动化测试脚本

本目录包含牙科诊所管理系统的所有自动化测试脚本，用于验证API接口的正确性和功能完整性。

## 测试脚本清单

| 文件名 | 描述 |
|------|------|
| `inventory-test.ts` | 库存和库存盘点API测试 |
| `test-inventory-api.ts` | 库存管理API测试 |
| `test-patient-api.ts` | 患者管理API测试 |
| `test-appointments-api.ts` | 预约管理API测试 |
| `test-medical-records-api.ts` | 病历管理API测试 |
| `test-followups-api.ts` | 随访管理API测试 |
| `test-patient-appointment.ts` | 患者预约集成测试 |
| `comprehensive-api-test.ts` | 综合API测试 |
| `api-test.ts` | 通用API测试框架 |
| `test-api.ts` | API测试工具函数 |

## 运行测试

### 运行所有测试

```bash
npm run test:api
```

### 运行单个测试

```bash
# 运行库存测试
npx ts-node src/test/inventory-test.ts

# 运行患者测试
npx ts-node src/test/test-patient-api.ts

# 运行综合测试
npx ts-node src/test/comprehensive-api-test.ts
```

## 测试前的准备工作

1. 确保API服务已经启动并正常运行
2. 确保测试数据库已正确配置
3. 确保测试环境中已安装所有依赖

```bash
# 启动API服务
npm run start:dev

# 安装依赖
npm install
```

## 测试账号

测试脚本中使用以下账号进行API测试：

- 用户名: `admin`
- 密码: `Admin@123`

## 测试框架

测试脚本使用直接的HTTP请求方式（使用axios）来测试API，不依赖于特定的测试框架，这使得测试更加直观和易于维护。

每个测试脚本的基本结构如下：

1. 设置测试参数（API地址、认证信息等）
2. 登录获取认证Token
3. 执行一系列API调用测试
4. 验证API响应并输出测试结果

## 创建新的测试脚本

创建新测试脚本时，建议参考现有的测试脚本结构，遵循以下步骤：

1. 导入必要的依赖（axios等）
2. 定义测试参数和辅助函数
3. 创建主测试函数，按逻辑顺序组织测试步骤
4. 使用try-catch结构处理潜在的错误
5. 输出清晰的测试结果信息

示例框架：

```typescript
import axios from 'axios';

// 测试参数
const API_BASE_URL = 'http://localhost:3000/api';
const username = 'admin';
const password = 'Admin@123';

// 主测试函数
async function testSomeApi() {
  console.log('开始测试XXX API...');
  
  try {
    // 1. 登录获取token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    
    const token = loginResponse.data.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    // 2. 执行API测试
    console.log('测试获取XXX列表...');
    const listResponse = await axios.get(`${API_BASE_URL}/xxx`, { headers });
    
    if (listResponse.data.code === 200) {
      console.log('✅ 获取XXX列表成功');
    } else {
      console.log('❌ 获取XXX列表失败');
    }
    
    // 3. 更多测试...
    
    console.log('XXX API测试完成');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 执行测试
testSomeApi();
```

## 注意事项

1. 测试脚本应当处理各种可能的错误情况
2. 在测试完成后，应当清理测试过程中创建的数据
3. 测试结果应当清晰明了，便于快速识别问题
4. 测试脚本应当遵循代码规范，保持良好的可读性
5. 当API接口发生变化时，及时更新相应的测试脚本 