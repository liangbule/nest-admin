/**
 * API 服务器检查脚本
 * 用于检查API服务器状态和接口可用性
 */
import axios from 'axios';

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// 辅助函数：延迟执行
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 测试API服务器连接
async function checkApiServer() {
  console.log('=== API服务器连接检查 ===');

  try {
    // 检查API服务器是否在线
    console.log(`尝试连接到 ${API_BASE_URL}...`);
    await axios.get(API_BASE_URL, { timeout: 5000 });
    console.log('✅ API服务器连接成功！');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ 无法连接到API服务器，请确保服务器已启动');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ 连接超时，服务器响应时间过长');
    } else {
      if (error.response) {
        // 收到服务器响应，但状态码不在2xx范围内
        console.log(
          `✅ API服务器连接成功！(响应状态: ${error.response.status})`,
        );
        return true;
      } else {
        console.error('❌ 连接失败:', error.message);
      }
    }
    return false;
  }
}

// 检查认证接口
async function checkAuthEndpoints() {
  console.log('\n=== 认证接口检查 ===');

  try {
    // 检查登录接口
    console.log('正在检查登录接口...');
    const loginEndpoint = `${API_BASE_URL}/auth/login`;

    try {
      const loginResponse = await axios.post(loginEndpoint, TEST_CREDENTIALS);
      console.log('✅ 登录接口可用');
      console.log('响应状态码:', loginResponse.status);
      console.log('响应数据:', JSON.stringify(loginResponse.data, null, 2));

      // 保存token用于后续测试
      const token = loginResponse.data.data?.token || loginResponse.data.token;
      if (token) {
        console.log('✅ 成功获取认证令牌');
        return token;
      } else {
        console.log('⚠️ 未能从登录响应中获取令牌');
        return null;
      }
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ 登录接口返回错误: ${error.response.status}`);
        console.log('响应内容:', JSON.stringify(error.response.data, null, 2));

        // 显示可能的原因
        if (error.response.status === 401) {
          console.log('可能的原因: 用户名或密码不正确');
          console.log(`尝试使用的凭据: ${JSON.stringify(TEST_CREDENTIALS)}`);
        } else if (error.response.status === 404) {
          console.log('可能的原因: 登录接口未实现或路径不正确');
          console.log(`尝试的接口路径: ${loginEndpoint}`);
        }
      } else {
        console.error('❌ 登录接口请求失败:', error.message);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ 检查认证接口时出错:', error.message);
    return null;
  }
}

// 检查用户接口
async function checkUserEndpoints(token: string | null) {
  console.log('\n=== 用户接口检查 ===');

  if (!token) {
    console.log('⚠️ 缺少认证令牌，跳过用户接口检查');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // 检查用户列表接口
    console.log('正在检查用户列表接口...');
    const usersEndpoint = `${API_BASE_URL}/users`;

    try {
      const usersResponse = await axios.get(usersEndpoint, { headers });
      console.log('✅ 用户列表接口可用');
      console.log('响应状态码:', usersResponse.status);
      console.log(
        '响应数据:',
        JSON.stringify(usersResponse.data, null, 2).substring(0, 300) + '...',
      );
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ 用户列表接口返回错误: ${error.response.status}`);
        console.log('响应内容:', JSON.stringify(error.response.data, null, 2));

        if (error.response.status === 404) {
          console.log('可能的原因: 用户列表接口未实现或路径不正确');
        } else if (error.response.status === 403) {
          console.log('可能的原因: 权限不足');
        }
      } else {
        console.error('❌ 用户列表接口请求失败:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ 检查用户接口时出错:', error.message);
  }
}

// 检查患者接口
async function checkPatientEndpoints(token: string | null) {
  console.log('\n=== 患者接口检查 ===');

  if (!token) {
    console.log('⚠️ 缺少认证令牌，跳过患者接口检查');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // 检查患者列表接口
    console.log('正在检查患者列表接口...');
    const patientsEndpoint = `${API_BASE_URL}/patients`;

    try {
      const patientsResponse = await axios.get(patientsEndpoint, { headers });
      console.log('✅ 患者列表接口可用');
      console.log('响应状态码:', patientsResponse.status);
      console.log(
        '响应数据:',
        JSON.stringify(patientsResponse.data, null, 2).substring(0, 300) +
          '...',
      );
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ 患者列表接口返回错误: ${error.response.status}`);
        console.log('响应内容:', JSON.stringify(error.response.data, null, 2));

        if (error.response.status === 404) {
          console.log('可能的原因: 患者列表接口未实现或路径不正确');
        }
      } else {
        console.error('❌ 患者列表接口请求失败:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ 检查患者接口时出错:', error.message);
  }
}

// 检查接口结构与预期是否一致
async function checkApiResponseStructure(token: string | null) {
  console.log('\n=== API响应结构检查 ===');

  if (!token) {
    console.log('⚠️ 缺少认证令牌，跳过API响应结构检查');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // 获取一个接口的响应并检查结构
    console.log('正在检查API响应结构...');

    try {
      const testEndpoint = `${API_BASE_URL}/users`;
      const response = await axios.get(testEndpoint, { headers });

      const data = response.data;

      console.log('响应结构:');
      console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');

      // 检查期望的API响应结构
      if ('success' in data) {
        console.log('✅ 发现标准字段: success');
      } else {
        console.log('⚠️ 未找到标准字段: success');
      }

      if ('message' in data) {
        console.log('✅ 发现标准字段: message');
      } else {
        console.log('⚠️ 未找到标准字段: message');
      }

      if ('data' in data) {
        console.log('✅ 发现标准字段: data');

        // 检查分页结构
        const responseData = data.data;
        if (responseData && typeof responseData === 'object') {
          if ('total' in responseData && 'list' in responseData) {
            console.log('✅ 分页结构正确 (total + list)');
          } else {
            console.log('⚠️ 未发现预期的分页结构 (total + list)');
          }
        }
      } else {
        console.log('⚠️ 未找到标准字段: data');
      }
    } catch (error) {
      if (error.response) {
        console.log(`⚠️ 接口返回错误: ${error.response.status}`);
        console.log('响应内容:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('❌ 接口请求失败:', error.message);
      }
    }
  } catch (error) {
    console.error('❌ 检查API响应结构时出错:', error.message);
  }
}

// 运行所有检查
async function runDiagnostics() {
  console.log('开始API服务器诊断...\n');

  // 检查服务器连接
  const serverOnline = await checkApiServer();
  if (!serverOnline) {
    console.error('\n❌ API服务器连接失败，无法继续检查');
    return;
  }

  await delay(500);

  // 检查认证接口
  const token = await checkAuthEndpoints();

  await delay(500);

  // 检查用户接口
  await checkUserEndpoints(token);

  await delay(500);

  // 检查患者接口
  await checkPatientEndpoints(token);

  await delay(500);

  // 检查API响应结构
  await checkApiResponseStructure(token);

  console.log('\n=== 诊断完成 ===');

  if (!token) {
    console.log('\n⚠️ 建议: 请检查认证接口和用户账户设置');
  }

  console.log('\n提示: 如果接口返回404错误，说明该接口可能尚未实现');
  console.log('提示: 如果要继续测试，请确保所有API接口已正确实现');
}

// 运行诊断工具
runDiagnostics().catch((error) => {
  console.error('运行诊断工具时出错:', error);
});
