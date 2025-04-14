import axios from 'axios';

/**
 * 库存API自动化测试工具
 * 专注于测试牙科诊所库存管理相关接口
 */
async function testInventoryApi() {
  console.log('========= 开始测试牙科诊所库存管理API接口 =========');

  // 基本配置
  const baseUrl = 'http://localhost:3000/api';
  let token = '';
  let testInventoryId = '';

  // 步骤1: 尝试登录获取token
  try {
    console.log('1. 登录获取认证token...');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      username: 'testuser',
      password: 'test123'
    });
    
    if (loginResponse.data && loginResponse.data.data && loginResponse.data.data.access_token) {
      token = loginResponse.data.data.access_token;
      console.log('✅ 登录成功，获取到token');
    } else {
      console.error('❌ 登录失败：未获取到token');
      console.log('返回内容:', JSON.stringify(loginResponse.data, null, 2));
      return; // 如果登录失败，终止测试
    }
  } catch (error) {
    console.error('❌ 登录接口测试失败');
    console.error('错误信息:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
    return; // 如果登录失败，终止测试
  }

  // 设置请求头部
  const headers = { Authorization: `Bearer ${token}` };

  // 步骤2: 获取库存列表
  try {
    console.log('\n2. 获取库存列表...');
    const inventoryResponse = await axios.get(`${baseUrl}/dental/inventory`, { headers });
    
    if (inventoryResponse.data && inventoryResponse.data.data && inventoryResponse.data.data.success) {
      const itemCount = inventoryResponse.data.data.data?.items?.length || 0;
      console.log(`✅ 成功获取库存列表，共 ${itemCount} 条记录`);
      
      // 如果有库存记录，保存第一个库存项ID用于后续测试
      if (itemCount > 0) {
        testInventoryId = inventoryResponse.data.data.data.items[0].id;
        console.log(`   使用库存项ID: ${testInventoryId} 进行后续测试`);
      }
    } else {
      console.log('❌ 获取库存列表失败，接口返回格式不符合预期');
      console.log('返回内容:', JSON.stringify(inventoryResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 获取库存列表失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 步骤3: 创建测试库存项
  try {
    console.log('\n3. 创建测试库存项...');
    const testInventory = {
      name: '测试牙刷',
      code: 'TEST-' + Math.floor(Math.random() * 10000),
      type: 'material',
      specification: '中号，软毛',
      unit: '支',
      currentQuantity: 0,
      safetyQuantity: 10,
      location: 'A区-12柜',
      manufacturer: '口腔护理用品厂',
      referencePrice: 12.5,
      remarks: '自动化测试创建的库存项'
    };
    
    console.log('发送的库存数据:', JSON.stringify(testInventory));
    const createResponse = await axios.post(`${baseUrl}/dental/inventory`, testInventory, { headers });
    
    if (createResponse.data && createResponse.data.data && createResponse.data.data.success) {
      console.log('✅ 成功创建测试库存项');
      // 更新测试库存项ID
      testInventoryId = createResponse.data.data.data.id;
      console.log(`   新创建的库存项ID: ${testInventoryId}`);
    } else {
      console.log('❌ 创建库存项失败');
      console.log('返回内容:', JSON.stringify(createResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 创建库存项接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 步骤4: 通过ID获取库存详情
  if (testInventoryId) {
    try {
      console.log('\n4. 获取库存详情...');
      const detailResponse = await axios.get(`${baseUrl}/dental/inventory/${testInventoryId}`, { headers });
      
      if (detailResponse.data && detailResponse.data.data && detailResponse.data.data.success) {
        console.log('✅ 成功获取库存详情');
        console.log(`   库存名称: ${detailResponse.data.data.data.name}`);
        console.log(`   当前库存: ${detailResponse.data.data.data.currentQuantity} ${detailResponse.data.data.data.unit}`);
      } else {
        console.log('❌ 获取库存详情失败');
        console.log('返回内容:', JSON.stringify(detailResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 获取库存详情接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n4. 跳过获取库存详情测试，因为没有可用的库存项ID');
  }

  // 步骤5: 更新库存信息
  if (testInventoryId) {
    try {
      console.log('\n5. 更新库存信息...');
      const updateData = {
        name: '高级测试牙刷',
        safetyQuantity: 15,
        remarks: '这是通过自动化测试更新的库存项'
      };
      
      const updateResponse = await axios.put(`${baseUrl}/dental/inventory/${testInventoryId}`, updateData, { headers });
      
      if (updateResponse.data && updateResponse.data.data && updateResponse.data.data.success) {
        console.log('✅ 成功更新库存信息');
      } else {
        console.log('❌ 更新库存信息失败');
        console.log('返回内容:', JSON.stringify(updateResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 更新库存接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n5. 跳过更新库存信息测试，因为没有可用的库存项ID');
  }

  // 步骤6: 库存入库
  if (testInventoryId) {
    try {
      console.log('\n6. 创建入库记录...');
      
      const inRecordData = {
        inventoryId: testInventoryId,
        quantity: 50,
        type: 'purchase',
        unitPrice: '10.00',
        supplier: '牙刷批发商',
        batchNumber: 'LOT-' + Math.floor(Math.random() * 10000),
        operator: '库管员小王',
        remarks: '自动化测试创建的入库记录'
      };
      
      console.log('发送的入库数据:', JSON.stringify(inRecordData));
      const inRecordResponse = await axios.post(`${baseUrl}/dental/inventory/in-records`, inRecordData, { headers });
      
      if (inRecordResponse.data && inRecordResponse.data.data && inRecordResponse.data.data.success) {
        console.log('✅ 成功创建入库记录');
        console.log(`   入库记录ID: ${inRecordResponse.data.data.data.id}`);
      } else {
        console.log('❌ 创建入库记录失败');
        console.log('返回内容:', JSON.stringify(inRecordResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 创建入库记录接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n6. 跳过创建入库记录测试，因为没有可用的库存项ID');
  }

  // 步骤7: 再次获取库存详情，检查库存数量是否已更新
  if (testInventoryId) {
    try {
      console.log('\n7. 获取更新后的库存详情...');
      const detailResponse = await axios.get(`${baseUrl}/dental/inventory/${testInventoryId}`, { headers });
      
      if (detailResponse.data && detailResponse.data.data && detailResponse.data.data.success) {
        console.log('✅ 成功获取更新后的库存详情');
        console.log(`   当前库存: ${detailResponse.data.data.data.currentQuantity} ${detailResponse.data.data.data.unit}`);
      } else {
        console.log('❌ 获取更新后的库存详情失败');
        console.log('返回内容:', JSON.stringify(detailResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 获取更新后的库存详情接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n7. 跳过获取更新后的库存详情测试，因为没有可用的库存项ID');
  }

  // 步骤8: 库存出库
  if (testInventoryId) {
    try {
      console.log('\n8. 创建出库记录...');
      
      const outRecordData = {
        inventoryId: testInventoryId,
        quantity: 5,
        type: 'use',
        operator: '牙医张医生',
        remarks: '自动化测试创建的出库记录'
      };
      
      console.log('发送的出库数据:', JSON.stringify(outRecordData));
      const outRecordResponse = await axios.post(`${baseUrl}/dental/inventory/out-records`, outRecordData, { headers });
      
      if (outRecordResponse.data && outRecordResponse.data.data && outRecordResponse.data.data.success) {
        console.log('✅ 成功创建出库记录');
        console.log(`   出库记录ID: ${outRecordResponse.data.data.data.id}`);
      } else {
        console.log('❌ 创建出库记录失败');
        console.log('返回内容:', JSON.stringify(outRecordResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 创建出库记录接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n8. 跳过创建出库记录测试，因为没有可用的库存项ID');
  }

  // 步骤9: 获取库存统计信息
  try {
    console.log('\n9. 获取库存统计信息...');
    const statsResponse = await axios.get(`${baseUrl}/dental/inventory/statistics/summary`, { headers });
    
    if (statsResponse.data && statsResponse.data.data && statsResponse.data.data.success) {
      console.log('✅ 成功获取库存统计信息');
      const stats = statsResponse.data.data.data;
      console.log(`   库存总数: ${stats.totalCount}`);
      console.log(`   预警数量: ${stats.warningCount}`);
      console.log(`   缺货数量: ${stats.emptyCount}`);
    } else {
      console.log('❌ 获取库存统计信息失败');
      console.log('返回内容:', JSON.stringify(statsResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 获取库存统计信息接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 步骤10: 获取入库记录列表
  try {
    console.log('\n10. 获取入库记录列表...');
    const inRecordsResponse = await axios.get(`${baseUrl}/dental/inventory/records/in/list`, { headers });
    
    if (inRecordsResponse.data && inRecordsResponse.data.data && inRecordsResponse.data.data.success) {
      const itemCount = inRecordsResponse.data.data.data?.items?.length || 0;
      console.log(`✅ 成功获取入库记录列表，共 ${itemCount} 条记录`);
    } else {
      console.log('❌ 获取入库记录列表失败');
      console.log('返回内容:', JSON.stringify(inRecordsResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 获取入库记录列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 步骤11: 获取出库记录列表
  try {
    console.log('\n11. 获取出库记录列表...');
    const outRecordsResponse = await axios.get(`${baseUrl}/dental/inventory/records/out/list`, { headers });
    
    if (outRecordsResponse.data && outRecordsResponse.data.data && outRecordsResponse.data.data.success) {
      const itemCount = outRecordsResponse.data.data.data?.items?.length || 0;
      console.log(`✅ 成功获取出库记录列表，共 ${itemCount} 条记录`);
    } else {
      console.log('❌ 获取出库记录列表失败');
      console.log('返回内容:', JSON.stringify(outRecordsResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 获取出库记录列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('\n========= 库存管理API接口测试完成 =========');
}

// 运行测试
testInventoryApi().catch(error => {
  console.error('测试过程中出现未捕获的错误:', error);
}); 