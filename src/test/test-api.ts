/**
 * API接口测试脚本
 * 用于测试牙科诊所管理系统API
 */
import { DentalClinicApiService } from './shared/client';
import {
  UserRole,
  UserStatus,
  PatientGender,
  PatientStatus,
  MedicalRecordStatus,
  AppointmentStatus,
  AppointmentType,
  FollowupMethod,
  FollowupStatus,
} from './shared/interfaces';

// 创建API服务实例
const apiService = new DentalClinicApiService({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  handleError: true,
});

// 测试认证模块
async function testAuthModule() {
  console.log('\n====== 测试认证模块 ======');

  try {
    // 登录
    console.log('测试登录...');
    const loginResponse = await apiService.auth.login({
      username: 'testuser11',
      password: '123456',
    });
    console.log('登录结果:', loginResponse.success ? '成功' : '失败');

    if (loginResponse.success && loginResponse.data) {
      console.log('用户信息:', {
        id: loginResponse.data.id,
        username: loginResponse.data.username,
        role: loginResponse.data.role,
      });
    } else {
      console.error('登录失败:', loginResponse.message);
    }

    // 登出
    console.log('测试登出...');
    const logoutResponse = await apiService.auth.logout();
    console.log('登出结果:', logoutResponse.success ? '成功' : '失败');
  } catch (error) {
    console.error('认证模块测试失败:', error.message);
  }
}

// 测试用户模块
async function testUserModule() {
  console.log('\n====== 测试用户模块 ======');

  try {
    // 先登录获取权限
    await apiService.auth.login({
      username: 'admin',
      password: 'admin123',
    });

    // 创建用户
    console.log('测试创建用户...');
    const createUserResponse = await apiService.users.createUser({
      username: 'testdoctor',
      password: 'password123',
      realName: '测试医生',
      phone: '13800138000',
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
    });
    console.log('创建用户结果:', createUserResponse.success ? '成功' : '失败');

    if (createUserResponse.success && createUserResponse.data) {
      const userId = createUserResponse.data.id;
      console.log('创建的用户ID:', userId);

      // 查询用户
      console.log('测试查询用户...');
      const getUserResponse = await apiService.users.getUser(userId);
      console.log('查询用户结果:', getUserResponse.success ? '成功' : '失败');

      if (getUserResponse.success) {
        console.log('用户信息:', {
          id: getUserResponse.data.id,
          username: getUserResponse.data.username,
          realName: getUserResponse.data.realName,
        });
      }

      // 更新用户
      console.log('测试更新用户...');
      const updateUserResponse = await apiService.users.updateUser(userId, {
        realName: '更新后的医生',
        phone: '13900139000',
      });
      console.log(
        '更新用户结果:',
        updateUserResponse.success ? '成功' : '失败',
      );

      // 获取用户列表
      console.log('测试获取用户列表...');
      const listUsersResponse = await apiService.users.getUsers({
        role: UserRole.DOCTOR,
        page: 1,
        limit: 10,
      });
      console.log(
        '获取用户列表结果:',
        listUsersResponse.success ? '成功' : '失败',
      );

      if (listUsersResponse.success) {
        console.log('用户总数:', listUsersResponse.data.total);
        console.log('用户列表数量:', listUsersResponse.data.list.length);
      }

      // 删除用户
      console.log('测试删除用户...');
      const deleteUserResponse = await apiService.users.deleteUser(userId);
      console.log(
        '删除用户结果:',
        deleteUserResponse.success ? '成功' : '失败',
      );
    }
  } catch (error) {
    console.error('用户模块测试失败:', error.message);
  }
}

// 测试错误处理
async function testErrorHandling() {
  console.log('\n====== 测试错误处理 ======');

  // 创建一个新的服务实例，禁用自动错误处理
  const errorTestService = new DentalClinicApiService({
    baseURL: 'http://localhost:3000/api',
    handleError: false,
  });

  try {
    // 尝试访问不存在的用户
    console.log('测试访问不存在的资源...');
    await errorTestService.users.getUser('non-existent-id');
  } catch (error) {
    console.log('成功捕获错误:', error.message);

    if (error.response) {
      console.log('服务器响应状态:', error.response.status);
      console.log('服务器响应数据:', error.response.data);
    } else if (error.request) {
      console.log('请求已发送但无响应');
    } else {
      console.log('请求设置出错');
    }
  }
}

// 运行测试
async function runTests() {
  console.log('开始测试牙科诊所管理系统API...');

  // 运行测试函数
  await testAuthModule();
  await testUserModule();
  await testErrorHandling();

  console.log('\n所有测试已完成！');
}

// 执行测试
runTests().catch((error) => {
  console.error('测试过程中发生错误:', error);
});
