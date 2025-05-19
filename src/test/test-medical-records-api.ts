import axios from 'axios';
import * as chalk from 'chalk';

/**
 * 牙科诊所病历管理API测试
 * 测试病历管理相关的API接口
 */

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'testuser11',
  password: '123456',
};

// 测试数据
const testPatient = {
  name: '病历测试患者',
  gender: 'FEMALE',
  phone: '13800138002',
  birthdate: '1985-05-15',
  address: '测试地址',
  allergies: '青霉素过敏',
  medicalHistory: '无特殊病史',
};

const testMedicalRecord = {
  diagnosis: '牙龈炎',
  treatment: '洗牙、局部用药',
  medications: '牙龈消炎剂',
  notes: '建议注意口腔卫生',
  doctorId: null, // 由系统自动分配当前登录医生
  diagnosisDetails: '牙龈红肿，出血',
  treatmentDetails: '完成全口洁治，应用消炎药物',
  nextVisitPlan: '两周后复查',
};

const updatedMedicalRecord = {
  treatment: '洗牙、局部用药、口腔护理指导',
  medications: '牙龈消炎剂、口腔漱口水',
  notes: '已完成治疗，需定期复查',
  status: 'COMPLETED',
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
let testMedicalRecordId = '';

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
    log.info('创建用于病历测试的患者...');
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

async function testMedicalRecordCreation() {
  log.section('测试创建病历');

  try {
    log.info(`为患者 ${testPatientId} 创建病历...`);
    log.info(`病历数据: ${JSON.stringify(testMedicalRecord)}`);

    const response = await apiClient.post(
      `/dental/patients/${testPatientId}/records`,
      testMedicalRecord,
    );

    testMedicalRecordId = response.data.data?.id;

    if (!testMedicalRecordId) {
      log.error('创建病历失败 - 未收到ID');
      return false;
    }

    log.success(`病历创建成功，ID: ${testMedicalRecordId}`);
    return true;
  } catch (error) {
    log.error(`创建病历失败: ${error.message}`);
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

async function testGetMedicalRecords() {
  log.section('测试获取病历列表');

  try {
    log.info(`获取患者 ${testPatientId} 的病历列表...`);
    const response = await apiClient.get(
      `/dental/patients/${testPatientId}/records`,
    );

    const records = response.data.data?.items || [];
    log.success(`成功获取病历列表，共 ${records.length} 条记录`);

    return true;
  } catch (error) {
    log.error(`获取病历列表失败: ${error.message}`);
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

async function testGetMedicalRecordDetails() {
  log.section('测试获取病历详情');

  try {
    log.info(`获取病历详情，ID: ${testMedicalRecordId}...`);
    const response = await apiClient.get(
      `/dental/records/${testMedicalRecordId}`,
    );

    const record = response.data.data;
    if (!record) {
      log.error('获取病历详情失败 - 无数据返回');
      return false;
    }

    log.success(`成功获取病历详情`);
    log.info(`诊断: ${record.diagnosis}, 治疗: ${record.treatment}`);

    return true;
  } catch (error) {
    log.error(`获取病历详情失败: ${error.message}`);
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

async function testUpdateMedicalRecord() {
  log.section('测试更新病历');

  try {
    log.info(`更新病历，ID: ${testMedicalRecordId}...`);
    log.info(`更新数据: ${JSON.stringify(updatedMedicalRecord)}`);

    const response = await apiClient.put(
      `/dental/records/${testMedicalRecordId}`,
      updatedMedicalRecord,
    );

    if (!response.data.success) {
      log.error('更新病历失败');
      return false;
    }

    log.success('病历更新成功');

    // 验证更新结果
    const verifyResponse = await apiClient.get(
      `/dental/records/${testMedicalRecordId}`,
    );
    const updated = verifyResponse.data.data;

    log.info(`更新后的治疗: ${updated.treatment}, 状态: ${updated.status}`);

    return true;
  } catch (error) {
    log.error(`更新病历失败: ${error.message}`);
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

async function testDeleteMedicalRecord() {
  log.section('测试删除病历');

  try {
    log.info(`删除病历，ID: ${testMedicalRecordId}...`);

    const response = await apiClient.delete(
      `/dental/records/${testMedicalRecordId}`,
    );

    if (!response.data.success) {
      log.error('删除病历失败');
      return false;
    }

    log.success('病历成功删除');
    return true;
  } catch (error) {
    log.error(`删除病历失败: ${error.message}`);
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
  log.section('开始牙科诊所病历管理API测试');

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

  // 测试病历功能
  const results = {
    createMedicalRecord: await testMedicalRecordCreation(),
    getMedicalRecords: await testGetMedicalRecords(),
    getMedicalRecordDetails: await testGetMedicalRecordDetails(),
    updateMedicalRecord: await testUpdateMedicalRecord(),
    deleteMedicalRecord: await testDeleteMedicalRecord(),
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
