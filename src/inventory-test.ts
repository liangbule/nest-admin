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
  let testInRecordId = '';  // 用于保存入库记录ID
  let testOutRecordId = ''; // 用于保存出库记录ID

  // 步骤1: 尝试登录获取token
  try {
    console.log('1. 登录获取认证token...');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      username: 'testuser11',
      password: '123456'
    });
    
    if (loginResponse.data && loginResponse.data.code === 200 && loginResponse.data.data && loginResponse.data.data.access_token) {
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
    
    if (inventoryResponse.data && inventoryResponse.data.code === 200 && inventoryResponse.data.data) {
      const itemCount = inventoryResponse.data.data.items?.length || 0;
      console.log(`✅ 成功获取库存列表，共 ${itemCount} 条记录`);
      
      // 如果有库存记录，保存第一个库存项ID用于后续测试
      if (itemCount > 0) {
        testInventoryId = inventoryResponse.data.data.items[0].id;
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
      name: 'Test Item',
      code: 'TEST001',
      type: 'material',
      specification: 'Test Spec',
      unit: 'pcs',
      currentQuantity: 100,
      safetyQuantity: 10,
      location: 'Test Location',
      manufacturer: 'Test Manufacturer',
      referencePrice: '10.00',
      remarks: 'Test remarks'
    };
    
    console.log('发送的库存数据:', JSON.stringify(testInventory));
    const createResponse = await axios.post(`${baseUrl}/dental/inventory`, testInventory, { headers });
    
    if (createResponse.data && createResponse.data.code === 200 && createResponse.data.data) {
      console.log('✅ 成功创建测试库存项');
      // 更新测试库存项ID
      testInventoryId = createResponse.data.data.id;
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
      
      if (detailResponse.data && detailResponse.data.code === 200 && detailResponse.data.data) {
        console.log('✅ 成功获取库存详情');
        console.log(`   库存名称: ${detailResponse.data.data.name}`);
        console.log(`   当前库存: ${detailResponse.data.data.currentQuantity} ${detailResponse.data.data.unit}`);
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
      
      if (updateResponse.data && updateResponse.data.code === 200) {
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

  // 步骤6: 创建入库记录
  if (testInventoryId) {
    try {
      console.log('\n6. 创建入库记录...');
      const inRecordData = {
        inventoryId: testInventoryId,
        quantity: 10,
        unitPrice: "15.50",
        supplier: "测试供应商",
        type: "purchase",
        operator: "库管员",
        remarks: "测试入库"
      };
      console.log('发送入库记录数据:', JSON.stringify(inRecordData, null, 2));
      
      const createInRecordResponse = await axios.post(
        `${baseUrl}/dental/inventory/in-records`,
        inRecordData,
        { headers }
      );
      
      if (createInRecordResponse.data && createInRecordResponse.data.code === 200) {
        console.log('✅ 成功创建入库记录');
        
        // 获取入库记录详情
        if (createInRecordResponse.data.data && createInRecordResponse.data.data.id) {
          const inRecordId = createInRecordResponse.data.data.id;
          testInRecordId = inRecordId; // 保存ID用于后续测试
          console.log(`   入库记录ID: ${inRecordId}`);
          
          try {
            console.log('\n6.1. 获取入库记录详情...');
            const inRecordDetailResponse = await axios.get(
              `${baseUrl}/dental/inventory/in-records/${inRecordId}`, 
              { headers }
            );
            
            if (inRecordDetailResponse.data && inRecordDetailResponse.data.code === 200 && inRecordDetailResponse.data.data) {
              console.log('✅ 成功获取入库记录详情');
              console.log(`   入库数量: ${inRecordDetailResponse.data.data.quantity}`);
              console.log(`   单价: ${inRecordDetailResponse.data.data.unitPrice}`);
            } else {
              console.log('❌ 获取入库记录详情失败');
              console.log('返回内容:', JSON.stringify(inRecordDetailResponse.data, null, 2));
            }
          } catch (error) {
            console.log('❌ 获取入库记录详情接口测试失败');
            console.log('错误信息:', error.message);
            if (error.response) {
              console.log('响应状态:', error.response.status);
              console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
            }
          }
        }
      } else {
        console.log('❌ 创建入库记录失败');
        console.log('返回内容:', JSON.stringify(createInRecordResponse.data, null, 2));
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
      
      if (detailResponse.data && detailResponse.data.code === 200 && detailResponse.data.data) {
        console.log('✅ 成功获取更新后的库存详情');
        console.log(`   当前库存: ${detailResponse.data.data.currentQuantity} ${detailResponse.data.data.unit}`);
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

  // 步骤8: 创建出库记录
  if (testInventoryId) {
    try {
      console.log('\n8. 创建出库记录...');
      const outRecordData = {
        inventoryId: testInventoryId,
        quantity: 5,
        recipient: "测试领用人",
        department: "测试科室",
        type: "use",
        operator: "库管员",
        remarks: "测试出库"
      };
      console.log('发送出库记录数据:', JSON.stringify(outRecordData, null, 2));
      
      const createOutRecordResponse = await axios.post(
        `${baseUrl}/dental/inventory/out-records`,
        outRecordData,
        { headers }
      );
      
      if (createOutRecordResponse.data && createOutRecordResponse.data.code === 200) {
        console.log('✅ 成功创建出库记录');
        
        // 获取出库记录详情
        if (createOutRecordResponse.data.data && createOutRecordResponse.data.data.id) {
          const outRecordId = createOutRecordResponse.data.data.id;
          testOutRecordId = outRecordId; // 保存ID用于后续测试
          console.log(`   出库记录ID: ${outRecordId}`);
          
          try {
            console.log('\n8.1. 获取出库记录详情...');
            const outRecordDetailResponse = await axios.get(
              `${baseUrl}/dental/inventory/out-records/${outRecordId}`, 
              { headers }
            );
            
            if (outRecordDetailResponse.data && outRecordDetailResponse.data.code === 200 && outRecordDetailResponse.data.data) {
              console.log('✅ 成功获取出库记录详情');
              console.log(`   出库数量: ${outRecordDetailResponse.data.data.quantity}`);
              console.log(`   领用人: ${outRecordDetailResponse.data.data.recipient}`);
            } else {
              console.log('❌ 获取出库记录详情失败');
              console.log('返回内容:', JSON.stringify(outRecordDetailResponse.data, null, 2));
            }
          } catch (error) {
            console.log('❌ 获取出库记录详情接口测试失败');
            console.log('错误信息:', error.message);
            if (error.response) {
              console.log('响应状态:', error.response.status);
              console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
            }
          }
        }
      } else {
        console.log('❌ 创建出库记录失败');
        console.log('返回内容:', JSON.stringify(createOutRecordResponse.data, null, 2));
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
    console.log('⚠️ 当前版本暂不支持通过API直接获取库存统计信息，跳过此测试用例');
    /*
    const statisticsResponse = await axios.get(`${baseUrl}/dental/inventory/stats123`, { headers });
    
    if (statisticsResponse.data && statisticsResponse.data.code === 200 && statisticsResponse.data.data) {
      console.log('✅ 成功获取库存统计信息');
      console.log(`   总库存项数: ${statisticsResponse.data.data.totalCount}`);
      console.log(`   预警数量: ${statisticsResponse.data.data.warningCount}`);
      console.log(`   库存为零: ${statisticsResponse.data.data.emptyCount}`);
    } else {
      console.log('❌ 获取库存统计信息失败');
      console.log('返回内容:', JSON.stringify(statisticsResponse.data, null, 2));
    }
    */
  } catch (error) {
    /*
    console.log('❌ 获取库存统计信息接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
    */
  }

  // 步骤10: 获取入库记录列表
  try {
    console.log('\n10. 获取入库记录列表...');
    const inRecordsResponse = await axios.get(`${baseUrl}/dental/inventory/records/in/list`, { headers });
    
    if (inRecordsResponse.data && inRecordsResponse.data.code === 200) {
      const itemCount = inRecordsResponse.data.data?.items?.length || 0;
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
    
    if (outRecordsResponse.data && outRecordsResponse.data.code === 200) {
      const itemCount = outRecordsResponse.data.data?.items?.length || 0;
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

  // 步骤12: 删除库存项
  if (testInventoryId) {
    try {
      console.log('\n12. 删除库存项...');
      const deleteResponse = await axios.delete(`${baseUrl}/dental/inventory/${testInventoryId}`, { headers });
      
      if (deleteResponse.data && deleteResponse.data.code === 200) {
        console.log('✅ 成功删除库存项');
      } else {
        console.log('❌ 删除库存项失败');
        console.log('返回内容:', JSON.stringify(deleteResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 删除库存项接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n12. 跳过删除库存项测试，因为没有可用的库存项ID');
  }

  // 步骤13: 验证删除后的库存列表
  try {
    console.log('\n13. 验证删除后的库存列表...');
    const inventoryResponse = await axios.get(`${baseUrl}/dental/inventory`, { 
      headers,
      params: { 
        page: 1,
        limit: 20,
        name: 'Test Item' // 搜索我们创建的测试项目
      }
    });
    
    if (inventoryResponse.data && inventoryResponse.data.code === 200 && inventoryResponse.data.data) {
      const items = inventoryResponse.data.data.items || [];
      const deletedItemExists = items.some(item => item.id === testInventoryId);
      
      if (!deletedItemExists) {
        console.log('✅ 验证成功：已删除的库存项不再出现在列表中');
      } else {
        console.log('❌ 验证失败：已删除的库存项仍然出现在列表中');
      }
      
      console.log(`   当前搜索到与"Test Item"相关的库存项: ${items.length} 条记录`);
    } else {
      console.log('❌ 验证删除后的库存列表失败');
      console.log('返回内容:', JSON.stringify(inventoryResponse.data, null, 2));
    }
  } catch (error) {
    console.log('❌ 验证删除后的库存列表接口测试失败');
    console.log('错误信息:', error.message);
    if (error.response) {
      console.log('响应状态:', error.response.status);
      console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 步骤14: 删除入库记录
  if (testInRecordId) {
    try {
      console.log('\n14. 删除入库记录...');
      const deleteInRecordResponse = await axios.delete(
        `${baseUrl}/dental/inventory/in-records/${testInRecordId}`, 
        { headers }
      );
      
      if (deleteInRecordResponse.data && deleteInRecordResponse.data.code === 200) {
        console.log('✅ 成功删除入库记录');
      } else {
        console.log('❌ 删除入库记录失败');
        console.log('返回内容:', JSON.stringify(deleteInRecordResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 删除入库记录接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n14. 跳过删除入库记录测试，因为没有可用的入库记录ID');
  }

  // 步骤15: 删除出库记录
  if (testOutRecordId) {
    try {
      console.log('\n15. 删除出库记录...');
      const deleteOutRecordResponse = await axios.delete(
        `${baseUrl}/dental/inventory/out-records/${testOutRecordId}`, 
        { headers }
      );
      
      if (deleteOutRecordResponse.data && deleteOutRecordResponse.data.code === 200) {
        console.log('✅ 成功删除出库记录');
      } else {
        console.log('❌ 删除出库记录失败');
        console.log('返回内容:', JSON.stringify(deleteOutRecordResponse.data, null, 2));
      }
    } catch (error) {
      console.log('❌ 删除出库记录接口测试失败');
      console.log('错误信息:', error.message);
      if (error.response) {
        console.log('响应状态:', error.response.status);
        console.log('响应数据:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } else {
    console.log('\n15. 跳过删除出库记录测试，因为没有可用的出库记录ID');
  }

  console.log('\n========= 库存管理API接口测试完成 =========');
}

let accessToken: string;
let refreshToken: string;

async function refreshAccessToken() {
  try {
    const response = await axios.post('http://localhost:3000/auth/refresh', {
      refreshToken: refreshToken
    });
    accessToken = response.data.accessToken;
    refreshToken = response.data.refreshToken;
    console.log('Token refreshed successfully');
  } catch (error) {
    console.error('Failed to refresh token:', error.response?.data || error.message);
    throw error;
  }
}

async function makeRequest(config: any, retry = true) {
  try {
    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401 && retry) {
      console.log('Token expired, refreshing...');
      await refreshAccessToken();
      return makeRequest(config, false);
    }
    throw error;
  }
}

// 运行测试
testInventoryApi().catch(error => {
  console.error('测试过程中出现未捕获的错误:', error);
}); 