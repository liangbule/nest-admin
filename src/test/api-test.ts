import axios from 'axios';

/**
 * API测试工具
 * 用于测试API接口是否能够正常连通和响应
 */
async function runApiTests() {
  console.log('========= 开始测试牙科诊所API接口 =========');

  // 基本配置
  const baseUrl = 'http://localhost:3000/api';
  let token = '';

  // 尝试登录获取token
  try {
    console.log('1. 测试登录接口...');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      username: 'admin',
      password: '123456',
    });

    if (
      loginResponse.data &&
      loginResponse.data.data &&
      loginResponse.data.data.token
    ) {
      token = loginResponse.data.data.token;
      console.log('✅ 登录成功，获取到token');
    } else {
      console.log('❌ 登录接口返回了数据，但没有找到token');
      console.log('返回内容:', JSON.stringify(loginResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 登录接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 设置请求头部
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 测试患者列表接口
  try {
    console.log('\n2. 测试患者列表接口...');
    const patientsResponse = await axios.get(`${baseUrl}/dental/patients`, {
      headers,
    });

    if (patientsResponse.data && patientsResponse.data.success) {
      console.log('✅ 成功获取患者列表');
      console.log(
        `   获取到 ${
          patientsResponse.data.data?.items?.length || 0
        } 个患者记录`,
      );
    } else {
      console.log('❌ 患者列表接口返回了数据，但格式不符合预期');
      console.log('返回内容:', JSON.stringify(patientsResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 患者列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 测试预约列表接口
  try {
    console.log('\n3. 测试预约列表接口...');
    const appointmentsResponse = await axios.get(
      `${baseUrl}/dental/appointments`,
      { headers },
    );

    if (appointmentsResponse.data && appointmentsResponse.data.success) {
      console.log('✅ 成功获取预约列表');
      console.log(
        `   获取到 ${
          appointmentsResponse.data.data?.items?.length || 0
        } 个预约记录`,
      );
    } else {
      console.log('❌ 预约列表接口返回了数据，但格式不符合预期');
      console.log(
        '返回内容:',
        JSON.stringify(appointmentsResponse.data, null, 2),
      );
    }
  } catch (error) {
    console.log('❌ 预约列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 测试库存列表接口
  try {
    console.log('\n4. 测试库存列表接口...');
    const inventoryResponse = await axios.get(`${baseUrl}/dental/inventory`, {
      headers,
    });

    if (inventoryResponse.data && inventoryResponse.data.success) {
      console.log('✅ 成功获取库存列表');
      console.log(
        `   获取到 ${
          inventoryResponse.data.data?.items?.length || 0
        } 个库存记录`,
      );
    } else {
      console.log('❌ 库存列表接口返回了数据，但格式不符合预期');
      console.log('返回内容:', JSON.stringify(inventoryResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 库存列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\n========= API接口测试完成 =========');
}

// 运行测试
runApiTests().catch((error) => {
  console.error('测试过程中出现未捕获的错误:', error);
});
