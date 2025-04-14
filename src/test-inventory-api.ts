import axios from 'axios';
import * as chalk from 'chalk';

/**
 * 牙科诊所库存管理API测试
 * 测试库存管理相关的API接口
 */

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'testuser11',
  password: '123456',
};

// 测试数据
const testInventoryItem = {
  name: '一次性口腔检查套装',
  code: 'DC-KQ-001',
  category: 'material',
  specification: '标准规格',
  unit: '套',
  quantity: 100,
  safetyStock: 20,
  price: 8.5,
  supplier: '医疗用品供应商A',
  remark: '日常口腔检查使用'
};

const testInboundRecord = {
  inventoryId: '',
  quantity: 50,
  type: 'purchase',
  unitPrice: 8.0,
  supplier: '医疗用品供应商A',
  batchNumber: 'BN-20230601',
  operator: 'admin',
  remarks: '常规采购入库'
};

const testOutboundRecord = {
  inventoryId: '',
  quantity: 10,
  type: 'use',
  batchNumber: 'BN-20230601',
  purpose: '门诊使用',
  operator: 'admin',
  remarks: '门诊日常领用'
};

// 工具函数
const log = {
  info: (message: string) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message: string) => console.log(chalk.green(`[SUCCESS] ${message}`)),
  warning: (message: string) => console.log(chalk.yellow(`[WARNING] ${message}`)),
  error: (message: string) => console.log(chalk.red(`[ERROR] ${message}`)),
  section: (message: string) => console.log(chalk.magenta(`\n=== ${message} ===`)),
};

let authToken = '';
let createdInventoryId = '';
let createdInboundId = '';
let createdOutboundId = '';

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
async function testAuthentication() {
  log.section('测试认证');
  
  try {
    log.info(`尝试使用账户 ${TEST_USER.username} 登录...`);
    const response = await apiClient.post('/auth/login', TEST_USER);
    log.info(`收到登录响应: ${JSON.stringify(response.data)}`);
    
    authToken = response.data.data?.access_token;
    
    if (!authToken) {
      log.error('认证失败 - 未收到token');
      log.error(`响应数据: ${JSON.stringify(response.data)}`);
      process.exit(1);
    }
    
    log.success('认证成功');
    return true;
  } catch (error) {
    log.error(`认证失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      log.error('请求已发送但未收到响应');
    } else {
      log.error(`发送请求前出错: ${error.message}`);
    }
    process.exit(1);
  }
}

async function testInventoryManagement() {
  log.section('测试库存管理');
  
  try {
    // 创建库存项
    log.info('创建测试库存项...');
    log.info(`发送数据: ${JSON.stringify(testInventoryItem)}`);
    
    const createResponse = await apiClient.post('/dental/inventory', testInventoryItem);
    log.info(`创建响应: ${JSON.stringify(createResponse.data)}`);
    
    createdInventoryId = createResponse.data.data?.id;
    if (!createdInventoryId) {
      log.error('创建库存项失败 - 未收到ID');
      return false;
    }
    
    log.success(`库存项创建成功，ID: ${createdInventoryId}`);
    
    // 获取库存列表
    log.info('获取库存列表...');
    const listResponse = await apiClient.get('/dental/inventory');
    log.info(`列表响应: ${JSON.stringify(listResponse.data)}`);
    
    if (!listResponse.data.data?.items) {
      log.error('获取库存列表失败 - 无法获取items');
      return false;
    }
    
    log.success(`获取到 ${listResponse.data.data.items.length} 条库存记录`);
    
    // 按ID获取库存项
    log.info(`获取ID为 ${createdInventoryId} 的库存项...`);
    const getResponse = await apiClient.get(`/dental/inventory/${createdInventoryId}`);
    log.info(`获取响应: ${JSON.stringify(getResponse.data)}`);
    
    if (!getResponse.data.data?.name) {
      log.error('获取库存项详情失败 - 无法获取名称');
      return false;
    }
    
    log.success(`获取到库存项: ${getResponse.data.data.name}`);
    
    // 更新库存项
    log.info('更新测试库存项...');
    const updateData = {
      safetyStock: 30,
      remark: '更新后的备注信息'
    };
    log.info(`更新数据: ${JSON.stringify(updateData)}`);
    
    const updateResponse = await apiClient.put(`/dental/inventory/${createdInventoryId}`, updateData);
    log.info(`更新响应: ${JSON.stringify(updateResponse.data)}`);
    
    if (!updateResponse.data.success) {
      log.error('更新库存项失败');
      return false;
    }
    
    log.success(`库存项更新成功: ${updateResponse.data.data.remark}`);
    
    return true;
  } catch (error) {
    log.error(`库存管理测试失败: ${error.message}`);
    if (error.response) {
      log.error(`响应状态: ${error.response.status}`);
      log.error(`响应数据: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      log.error('请求已发送但未收到响应');
    } else {
      log.error(`发送请求前出错: ${error.message}`);
    }
    return false;
  }
}

async function testInboundManagement() {
  log.section('测试入库管理');
  
  try {
    // 准备入库记录数据
    testInboundRecord.inventoryId = createdInventoryId;
    
    // 创建入库记录
    log.info('创建测试入库记录...');
    const createResponse = await apiClient.post('/dental/inventory/in-records', testInboundRecord);
    createdInboundId = createResponse.data.data.id;
    log.success(`入库记录创建成功，ID: ${createdInboundId}`);
    
    // 获取入库记录列表
    log.info('获取入库记录列表...');
    const listResponse = await apiClient.get('/dental/inventory/in-records');
    log.success(`获取到 ${listResponse.data.data.items.length} 条入库记录`);
    
    // 按ID获取入库记录
    log.info(`获取ID为 ${createdInboundId} 的入库记录...`);
    const getResponse = await apiClient.get(`/dental/inventory/in-records/${createdInboundId}`);
    log.success(`获取到入库记录，数量: ${getResponse.data.data.quantity}`);
    
    return true;
  } catch (error) {
    log.error(`入库管理测试失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testOutboundManagement() {
  log.section('测试出库管理');
  
  try {
    // 准备出库记录数据
    testOutboundRecord.inventoryId = createdInventoryId;
    
    // 创建出库记录
    log.info('创建测试出库记录...');
    const createResponse = await apiClient.post('/dental/inventory/out-records', testOutboundRecord);
    createdOutboundId = createResponse.data.data.id;
    log.success(`出库记录创建成功，ID: ${createdOutboundId}`);
    
    // 获取出库记录列表
    log.info('获取出库记录列表...');
    const listResponse = await apiClient.get('/dental/inventory/out-records');
    log.success(`获取到 ${listResponse.data.data.items.length} 条出库记录`);
    
    // 按ID获取出库记录
    log.info(`获取ID为 ${createdOutboundId} 的出库记录...`);
    const getResponse = await apiClient.get(`/dental/inventory/out-records/${createdOutboundId}`);
    log.success(`获取到出库记录，数量: ${getResponse.data.data.quantity}`);
    
    return true;
  } catch (error) {
    log.error(`出库管理测试失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function testInventoryStatistics() {
  log.section('测试库存统计');
  
  try {
    // 获取统计信息
    log.info('获取库存统计信息...');
    const statsResponse = await apiClient.get('/dental/inventory/statistics');
    
    log.success('获取库存统计成功');
    log.info(`库存总数: ${statsResponse.data.data.totalCount}`);
    log.info(`库存预警数量: ${statsResponse.data.data.warningCount}`);
    log.info(`库存为0数量: ${statsResponse.data.data.emptyCount}`);
    
    return true;
  } catch (error) {
    log.error(`库存统计测试失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function cleanup() {
  log.section('清理测试数据');
  
  try {
    // 按创建顺序的相反顺序删除，以避免外键约束
    if (createdOutboundId) {
      log.info(`删除出库记录: ${createdOutboundId}`);
      await apiClient.delete(`/dental/inventory/out-records/${createdOutboundId}`);
      log.success('出库记录删除成功');
    }
    
    if (createdInboundId) {
      log.info(`删除入库记录: ${createdInboundId}`);
      await apiClient.delete(`/dental/inventory/in-records/${createdInboundId}`);
      log.success('入库记录删除成功');
    }
    
    if (createdInventoryId) {
      log.info(`删除库存项: ${createdInventoryId}`);
      await apiClient.delete(`/dental/inventory/${createdInventoryId}`);
      log.success('库存项删除成功');
    }
    
    return true;
  } catch (error) {
    log.error(`清理操作失败: ${error.message}`);
    if (error.response) {
      log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 运行所有测试
async function runTests() {
  log.section('开始牙科诊所库存管理API测试');
  
  try {
    // 认证必须成功才能继续其他测试
    const authResult = await testAuthentication();
    if (!authResult) return;
    
    // 运行主要测试套件并捕获详细错误
    let inventoryResult = false;
    let inboundResult = false;
    let outboundResult = false;
    let statisticsResult = false;
    
    try {
      log.info('开始测试库存管理功能...');
      inventoryResult = await testInventoryManagement();
    } catch (error) {
      log.error(`库存管理测试异常: ${error.message}`);
      if (error.response) {
        log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    try {
      log.info('开始测试入库管理功能...');
      inboundResult = await testInboundManagement();
    } catch (error) {
      log.error(`入库管理测试异常: ${error.message}`);
      if (error.response) {
        log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    try {
      log.info('开始测试出库管理功能...');
      outboundResult = await testOutboundManagement();
    } catch (error) {
      log.error(`出库管理测试异常: ${error.message}`);
      if (error.response) {
        log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    try {
      log.info('开始测试库存统计功能...');
      statisticsResult = await testInventoryStatistics();
    } catch (error) {
      log.error(`库存统计测试异常: ${error.message}`);
      if (error.response) {
        log.error(`状态: ${error.response.status}, 数据: ${JSON.stringify(error.response.data)}`);
      }
    }
    
    // 无论测试结果如何都进行清理
    try {
      await cleanup();
    } catch (error) {
      log.error(`清理操作异常: ${error.message}`);
    }
    
    // 报告总体结果
    log.section('测试总结');
    log.info(`认证: ${authResult ? '通过' : '失败'}`);
    log.info(`库存管理: ${inventoryResult ? '通过' : '失败'}`);
    log.info(`入库管理: ${inboundResult ? '通过' : '失败'}`);
    log.info(`出库管理: ${outboundResult ? '通过' : '失败'}`);
    log.info(`库存统计: ${statisticsResult ? '通过' : '失败'}`);
    
    const allPassed = authResult && inventoryResult && inboundResult && 
                     outboundResult && statisticsResult;
    
    if (allPassed) {
      log.section('所有测试通过');
      process.exit(0);
    } else {
      log.section('测试完成，但有失败项');
      process.exit(1);
    }
  } catch (error) {
    log.error(`测试执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 执行测试
runTests();