import axios from 'axios';
import * as chalk from 'chalk';

/**
 * 牙科诊所预约管理API测试
 * 测试预约管理相关的API接口
 */

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'testuser11',
  password: '123456',
};

// 测试数据
const testPatient = {
  name: '预约测试患者',
  gender: 'MALE',
  phone: '13800138001',
  birthdate: '1990-01-01',
  address: '测试地址',
  allergies: '无',
  medicalHistory: '无特殊病史',
};

// 获取明天的日期
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

// 获取后天的日期
const dayAfterTomorrow = new Date();
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const dayAfterTomorrowFormatted = dayAfterTomorrow.toISOString().split('T')[0];

const testAppointment = {
  patientId: '', // 将在测试中设置
  date: tomorrowFormatted,
  time: '09:00',
  duration: 30,
  type: 'EXAMINATION',
  notes: '常规口腔检查预约',
};

const updatedAppointment = {
  date: dayAfterTomorrowFormatted,
  time: '14:00',
  duration: 45,
  notes: '更新后的预约信息',
};

// 工具函数
const log = {
  info: (message) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message) => console.log(chalk.green(`[SUCCESS] ${message}`)),
  warning: (message) => console.log(chalk.yellow(`[WARNING] ${message}`)),
  error: (message) => console.log(chalk.red(`[ERROR] ${message}`)),
  section: (message) => console.log(chalk.magenta(`\n=== ${message} ===`)),
};

let authToken = '';
let testPatientId = '';
let testAppointmentId = '';

// 带认证的API客户端
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 测试套件
async function authenticate() {
  log.section('测试认证');

  try {
    log.info(`尝试使用账户 ${TEST_USER.username} 登录...`);
    const response = await apiClient.post('/auth/login', TEST_USER);

    authToken = response.data.data?.access_token;

    if (!authToken) {
      log.error('认证失败 - 未收到token');
      log.error(`响应数据: ${JSON.stringify(response.data)}`);
      return false;
    }

    log.success('认证成功');
    return true;
  } catch (error) {
    log.error(`认证失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function createTestPatient() {
  log.section('创建测试患者');

  try {
    log.info('创建用于预约测试的患者...');
    const response = await apiClient.post('/dental/patients', testPatient);

    testPatientId = response.data.data?.id;

    if (!testPatientId) {
      log.error('创建测试患者失败 - 未收到ID');
      return false;
    }

    log.success(`测试患者创建成功，ID: ${testPatientId}`);
    return true;
  } catch (error) {
    log.error(`创建测试患者失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testAppointmentCreation() {
  log.section('测试预约创建');

  try {
    // 设置患者ID
    testAppointment.patientId = testPatientId;

    log.info('创建预约...');
    log.info(`预约数据: ${JSON.stringify(testAppointment)}`);

    const response = await apiClient.post(
      '/dental/appointments',
      testAppointment,
    );
    testAppointmentId = response.data.data?.id;

    if (!testAppointmentId) {
      log.error('创建预约失败 - 未收到ID');
      return false;
    }

    log.success(`预约创建成功，ID: ${testAppointmentId}`);
    return true;
  } catch (error) {
    log.error(`创建预约失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testGetAppointments() {
  log.section('测试获取预约列表');

  try {
    log.info('获取所有预约...');
    const response = await apiClient.get('/dental/appointments');

    const appointments = response.data.data?.items || [];
    log.success(`成功获取预约列表，共 ${appointments.length} 条预约`);

    // 测试按日期查询
    log.info(`查询 ${tomorrowFormatted} 的预约...`);
    const dateResponse = await apiClient.get(
      `/dental/appointments/date/${tomorrowFormatted}`,
    );

    const dateAppointments = dateResponse.data.data || [];
    log.success(
      `成功获取 ${tomorrowFormatted} 的预约，共 ${dateAppointments.length} 条`,
    );

    return true;
  } catch (error) {
    log.error(`获取预约列表失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testGetAppointmentDetails() {
  log.section('测试获取预约详情');

  try {
    log.info(`获取预约详情，ID: ${testAppointmentId}...`);
    const response = await apiClient.get(
      `/dental/appointments/${testAppointmentId}`,
    );

    const appointment = response.data.data;
    if (!appointment) {
      log.error('获取预约详情失败 - 无数据返回');
      return false;
    }

    log.success(`成功获取预约详情`);
    log.info(
      `预约时间: ${appointment.date} ${appointment.time}, 类型: ${appointment.type}`,
    );

    return true;
  } catch (error) {
    log.error(`获取预约详情失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testUpdateAppointment() {
  log.section('测试更新预约');

  try {
    log.info(`更新预约，ID: ${testAppointmentId}...`);
    log.info(`更新数据: ${JSON.stringify(updatedAppointment)}`);

    const response = await apiClient.put(
      `/dental/appointments/${testAppointmentId}`,
      updatedAppointment,
    );

    if (!response.data.success) {
      log.error('更新预约失败');
      return false;
    }

    log.success('预约更新成功');

    // 验证更新结果
    const verifyResponse = await apiClient.get(
      `/dental/appointments/${testAppointmentId}`,
    );
    const updated = verifyResponse.data.data;

    log.info(
      `更新后的预约时间: ${updated.date} ${updated.time}, 持续时间: ${updated.duration}分钟`,
    );

    return true;
  } catch (error) {
    log.error(`更新预约失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testCancelAppointment() {
  log.section('测试取消预约');

  try {
    log.info(`取消预约，ID: ${testAppointmentId}...`);

    const response = await apiClient.put(
      `/dental/appointments/${testAppointmentId}`,
      {
        status: 'CANCELLED',
        cancellationReason: '测试取消预约',
      },
    );

    if (!response.data.success) {
      log.error('取消预约失败');
      return false;
    }

    log.success('预约成功取消');

    // 验证取消结果
    const verifyResponse = await apiClient.get(
      `/dental/appointments/${testAppointmentId}`,
    );
    const appointment = verifyResponse.data.data;

    log.info(
      `预约状态: ${appointment.status}, 取消原因: ${appointment.cancellationReason}`,
    );

    return true;
  } catch (error) {
    log.error(`取消预约失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testDeleteAppointment() {
  log.section('测试删除预约');

  try {
    log.info(`删除预约，ID: ${testAppointmentId}...`);

    const response = await apiClient.delete(
      `/dental/appointments/${testAppointmentId}`,
    );

    if (!response.data.success) {
      log.error('删除预约失败');
      return false;
    }

    log.success('预约成功删除');
    return true;
  } catch (error) {
    log.error(`删除预约失败: ${error.message}`);
    if (error.response) {
      log.error(
        `状态: ${error.response.status}, 数据: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function cleanup() {
  log.section('清理测试数据');

  if (testPatientId) {
    try {
      log.info(`删除测试患者，ID: ${testPatientId}...`);
      const response = await apiClient.delete(
        `/dental/patients/${testPatientId}`,
      );

      if (response.data.success) {
        log.success('测试患者成功删除');
      } else {
        log.error('删除测试患者失败');
      }
    } catch (error) {
      log.error(`删除测试患者失败: ${error.message}`);
    }
  }
}

// 运行所有测试
async function runTests() {
  log.section('开始牙科诊所预约管理API测试');

  // 认证
  const authSuccess = await authenticate();
  if (!authSuccess) {
    log.error('认证失败，终止测试');
    process.exit(1);
  }

  // 创建测试患者
  const patientCreated = await createTestPatient();
  if (!patientCreated) {
    log.error('创建测试患者失败，终止测试');
    process.exit(1);
  }

  // 测试预约功能
  const results = {
    createAppointment: await testAppointmentCreation(),
    getAppointments: await testGetAppointments(),
    getAppointmentDetails: await testGetAppointmentDetails(),
    updateAppointment: await testUpdateAppointment(),
    cancelAppointment: await testCancelAppointment(),
    deleteAppointment: await testDeleteAppointment(),
  };

  // 清理测试数据
  await cleanup();

  // 输出测试报告
  log.section('测试结果汇总');
  Object.entries(results).forEach(([test, result]) => {
    log.info(`${test}: ${result ? '通过' : '失败'}`);
  });

  const allPassed = Object.values(results).every((result) => result);

  if (allPassed) {
    log.section('所有测试通过');
    process.exit(0);
  } else {
    log.section('部分测试失败');
    process.exit(1);
  }
}

// 执行测试
runTests();
