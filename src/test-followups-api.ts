import axios from 'axios';
import * as chalk from 'chalk';

/**
 * 牙科诊所随访管理API测试
 * 测试随访记录相关的API接口
 */

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'testuser11',
  password: '123456',
};

// 测试数据
const testPatient = {
  name: '随访测试患者',
  gender: 'MALE',
  phone: '13800138003',
  birthdate: '1988-08-08',
  address: '测试地址',
  allergies: '无',
  medicalHistory: '糖尿病'
};

const testMedicalRecord = {
  diagnosis: '龋齿',
  treatment: '根管治疗',
  medications: '抗生素',
  notes: '完成治疗',
  diagnosisDetails: '左下第一磨牙龋齿',
  treatmentDetails: '完成根管治疗和临时充填',
  nextVisitPlan: '一周后复诊'
};

const testFollowup = {
  method: 'PHONE',
  status: 'SCHEDULED',
  scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 一周后
  content: '电话随访，了解恢复情况',
  notes: '提醒患者注意饮食，避免使用患牙进食'
};

const updatedFollowup = {
  method: 'IN_PERSON',
  status: 'COMPLETED',
  completedDate: new Date().toISOString().split('T')[0],
  content: '患者来院复诊，恢复良好',
  notes: '已完成永久性充填，无不适'
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
let testFollowupId = '';

// 带认证的API客户端
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
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
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function createTestPatient() {
  log.section('创建测试患者');
  
  try {
    log.info('创建用于随访测试的患者...');
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
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function createTestMedicalRecord() {
  log.section('创建测试病历');
  
  try {
    log.info(`为患者 ${testPatientId} 创建病历...`);
    
    const response = await apiClient.post(`/dental/patients/${testPatientId}/records`, testMedicalRecord);
    
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
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testFollowupCreation() {
  log.section('测试创建随访记录');
  
  try {
    // 为随访记录添加病历ID引用
    const followupData = {
      ...testFollowup,
      medicalRecordId: testMedicalRecordId
    };
    
    log.info(`为患者 ${testPatientId} 创建随访记录...`);
    log.info(`随访数据: ${JSON.stringify(followupData)}`);
    
    const response = await apiClient.post(`/dental/patients/${testPatientId}/followups`, followupData);
    
    testFollowupId = response.data.data?.id;
    
    if (!testFollowupId) {
      log.error('创建随访记录失败 - 未收到ID');
      return false;
    }
    
    log.success(`随访记录创建成功，ID: ${testFollowupId}`);
    return true;
  } catch (error) {
    log.error(`创建随访记录失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testGetFollowups() {
  log.section('测试获取随访记录列表');
  
  try {
    log.info(`获取患者 ${testPatientId} 的随访记录列表...`);
    const response = await apiClient.get(`/dental/patients/${testPatientId}/followups`);
    
    const followups = response.data.data?.items || [];
    log.success(`成功获取随访记录列表，共 ${followups.length} 条记录`);
    
    return true;
  } catch (error) {
    log.error(`获取随访记录列表失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testGetFollowupDetails() {
  log.section('测试获取随访记录详情');
  
  try {
    log.info(`获取随访记录详情，ID: ${testFollowupId}...`);
    const response = await apiClient.get(`/dental/followups/${testFollowupId}`);
    
    const followup = response.data.data;
    if (!followup) {
      log.error('获取随访记录详情失败 - 无数据返回');
      return false;
    }
    
    log.success(`成功获取随访记录详情`);
    log.info(`随访方式: ${followup.method}, 状态: ${followup.status}, 计划日期: ${followup.scheduledDate}`);
    
    return true;
  } catch (error) {
    log.error(`获取随访记录详情失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testUpdateFollowup() {
  log.section('测试更新随访记录');
  
  try {
    log.info(`更新随访记录，ID: ${testFollowupId}...`);
    log.info(`更新数据: ${JSON.stringify(updatedFollowup)}`);
    
    const response = await apiClient.put(`/dental/followups/${testFollowupId}`, updatedFollowup);
    
    if (!response.data.success) {
      log.error('更新随访记录失败');
      return false;
    }
    
    log.success('随访记录更新成功');
    
    // 验证更新结果
    const verifyResponse = await apiClient.get(`/dental/followups/${testFollowupId}`);
    const updated = verifyResponse.data.data;
    
    log.info(`更新后的随访方式: ${updated.method}, 状态: ${updated.status}`);
    log.info(`完成日期: ${updated.completedDate}, 内容: ${updated.content}`);
    
    return true;
  } catch (error) {
    log.error(`更新随访记录失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testDeleteFollowup() {
  log.section('测试删除随访记录');
  
  try {
    log.info(`删除随访记录，ID: ${testFollowupId}...`);
    
    const response = await apiClient.delete(`/dental/followups/${testFollowupId}`);
    
    if (!response.data.success) {
      log.error('删除随访记录失败');
      return false;
    }
    
    log.success('随访记录成功删除');
    return true;
  } catch (error) {
    log.error(`删除随访记录失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function cleanup() {
  log.section('清理测试数据');
  
  try {
    if (testMedicalRecordId) {
      log.info(`删除测试病历，ID: ${testMedicalRecordId}...`);
      await apiClient.delete(`/dental/records/${testMedicalRecordId}`);
      log.success('测试病历成功删除');
    }
    
    if (testPatientId) {
      log.info(`删除测试患者，ID: ${testPatientId}...`);
      const response = await apiClient.delete(`/dental/patients/${testPatientId}`);
      
      if (response.data.success) {
        log.success('测试患者成功删除');
      } else {
        log.error('删除测试患者失败');
      }
    }
    
    return true;
  } catch (error) {
    log.error(`清理测试数据失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 运行所有测试
async function runTests() {
  log.section('开始牙科诊所随访管理API测试');
  
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
  
  // 创建测试病历
  const medicalRecordCreated = await createTestMedicalRecord();
  if (!medicalRecordCreated) {
    log.error('创建测试病历失败，终止测试');
    await cleanup();
    process.exit(1);
  }
  
  // 测试随访功能
  const results = {
    createFollowup: await testFollowupCreation(),
    getFollowups: await testGetFollowups(),
    getFollowupDetails: await testGetFollowupDetails(),
    updateFollowup: await testUpdateFollowup(),
    deleteFollowup: await testDeleteFollowup()
  };
  
  // 清理测试数据
  await cleanup();
  
  // 输出测试报告
  log.section('测试结果汇总');
  Object.entries(results).forEach(([test, result]) => {
    log.info(`${test}: ${result ? '通过' : '失败'}`);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
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