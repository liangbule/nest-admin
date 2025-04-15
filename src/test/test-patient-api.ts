import axios from 'axios';

/**
 * 患者API自动化测试工具
 * 专注于测试牙科诊所患者相关接口
 */
async function testPatientApi() {
  console.log('========= 开始测试牙科诊所患者API接口 =========');
  console.log('测试时间:', new Date().toLocaleString());

  // 基本配置
  const baseUrl = 'http://localhost:3000/api';
  let token = '';
  let testPatientId = '';

  // 封装错误处理函数
  const handleError = (error, operation) => {
    console.error(`❌ ${operation}失败`);
    if (error.response) {
      console.error(`状态码: ${error.response.status}`);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('请求已发送但未收到响应，检查服务器是否运行');
    } else {
      console.error('错误信息:', error.message);
    }
  };

  // 步骤1: 尝试登录获取token
  try {
    console.log('1. 登录获取认证token...');
    console.log('请求URL:', `${baseUrl}/auth/login`);
    console.log('请求数据:', { username: 'testuser11', password: '******' });

    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      username: 'testuser11',
      password: '123456',
    });

    console.log('登录响应:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data?.data?.access_token) {
      token = loginResponse.data.data.access_token;
      console.log('✅ 登录成功，获取到token');
    } else {
      console.error('❌ 登录失败：未获取到token');
      return; // 如果登录失败，终止测试
    }
  } catch (error) {
    handleError(error, '登录接口测试');
    return; // 如果登录失败，终止测试
  }

  // 设置请求头部
  const headers = { Authorization: `Bearer ${token}` };

  // 步骤2: 获取患者列表
  try {
    console.log('\n2. 获取患者列表...');
    console.log('请求URL:', `${baseUrl}/dental/patients`);

    const patientsResponse = await axios.get(`${baseUrl}/dental/patients`, {
      headers,
    });
    console.log(
      '患者列表响应:',
      JSON.stringify(patientsResponse.data, null, 2),
    );

    // 尝试多种响应格式
    const responseData = patientsResponse.data?.data || patientsResponse.data;
    const success = responseData?.success !== false;
    const items = responseData?.data?.items || responseData?.items || [];

    if (success && items.length >= 0) {
      console.log(`✅ 成功获取患者列表，共 ${items.length} 条记录`);

      // 如果有患者记录，保存第一个患者ID用于后续测试
      if (items.length > 0) {
        testPatientId = items[0].id;
        console.log(`   使用患者ID: ${testPatientId} 进行后续测试`);
      }
    } else {
      console.log('❌ 获取患者列表失败或结构不符合预期');
    }
  } catch (error) {
    handleError(error, '获取患者列表');
  }

  // 步骤3: 创建测试患者
  try {
    console.log('\n3. 创建测试患者...');

    // 使用更多字段名变体，增强兼容性
    const testPatient = {
      name: '测试患者_' + new Date().getTime().toString().substring(8),
      gender: 'male',
      phone:
        '138' +
        Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, '0'),
      birthdate: new Date('1990-01-01').toISOString(),
      birthday: new Date('1990-01-01').toISOString(),
      address: '测试地址',
      allergies: '无',
      medicalHistory: '无特殊病史',
      notes: '自动化测试创建的患者',
    };

    console.log('请求URL:', `${baseUrl}/dental/patients`);
    console.log('发送的患者数据:', JSON.stringify(testPatient, null, 2));

    const createResponse = await axios.post(
      `${baseUrl}/dental/patients`,
      testPatient,
      { headers },
    );
    console.log('创建患者响应:', JSON.stringify(createResponse.data, null, 2));

    // 尝试多种响应格式
    const responseData = createResponse.data?.data || createResponse.data;
    const success = responseData?.success !== false;
    const newPatient = responseData?.data || responseData;

    if (success && newPatient?.id) {
      console.log('✅ 成功创建测试患者');
      // 更新测试患者ID
      testPatientId = newPatient.id;
      console.log(`   新创建的患者ID: ${testPatientId}`);
    } else {
      console.log('❌ 创建患者失败或返回格式异常');
    }
  } catch (error) {
    handleError(error, '创建患者接口测试');
  }

  // 步骤4: 通过ID获取患者详情
  if (testPatientId) {
    try {
      console.log('\n4. 获取患者详情...');
      console.log('请求URL:', `${baseUrl}/dental/patients/${testPatientId}`);

      const detailResponse = await axios.get(
        `${baseUrl}/dental/patients/${testPatientId}`,
        { headers },
      );
      console.log(
        '患者详情响应:',
        JSON.stringify(detailResponse.data, null, 2),
      );

      // 尝试多种响应格式
      const responseData = detailResponse.data?.data || detailResponse.data;
      const success = responseData?.success !== false;
      const patient = responseData?.data || responseData;

      if (success && patient) {
        console.log('✅ 成功获取患者详情');
        console.log(`   患者名称: ${patient.name}`);
      } else {
        console.log('❌ 获取患者详情失败或格式异常');
      }
    } catch (error) {
      handleError(error, '获取患者详情');
    }
  } else {
    console.log('\n4. 跳过获取患者详情测试，因为没有可用的患者ID');
  }

  // 步骤5: 更新患者信息
  if (testPatientId) {
    try {
      console.log('\n5. 更新患者信息...');

      const updateData = {
        name:
          '更新后的测试患者_' + new Date().getTime().toString().substring(8),
        notes: '这是通过自动化测试更新的患者信息',
      };

      console.log('请求URL:', `${baseUrl}/dental/patients/${testPatientId}`);
      console.log('发送的更新数据:', JSON.stringify(updateData, null, 2));

      const updateResponse = await axios.put(
        `${baseUrl}/dental/patients/${testPatientId}`,
        updateData,
        { headers },
      );
      console.log(
        '更新患者响应:',
        JSON.stringify(updateResponse.data, null, 2),
      );

      // 尝试多种响应格式
      const responseData = updateResponse.data?.data || updateResponse.data;
      const success = responseData?.success !== false;

      if (success) {
        console.log('✅ 成功更新患者信息');
      } else {
        console.log('❌ 更新患者信息失败');
      }
    } catch (error) {
      handleError(error, '更新患者接口测试');
    }
  } else {
    console.log('\n5. 跳过更新患者信息测试，因为没有可用的患者ID');
  }

  // 步骤6: 为患者创建预约
  if (testPatientId) {
    try {
      console.log('\n6. 为患者创建预约...');

      // 获取当前日期后一天作为预约日期
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);

      // 完全按照CreateAppointmentDto定义提供数据
      const appointmentData = {
        patientId: testPatientId,
        appointmentTime: tomorrow.toISOString(),
        duration: 30,
        type: 'checkup',
        reason: '初诊检查',
        status: 'scheduled',
        notes: '自动化测试创建的预约',
      };

      console.log('请求URL:', `${baseUrl}/dental/appointments`);
      console.log('发送的预约数据:', JSON.stringify(appointmentData, null, 2));

      const appointmentResponse = await axios.post(
        `${baseUrl}/dental/appointments`,
        appointmentData,
        { headers },
      );
      console.log(
        '创建预约响应:',
        JSON.stringify(appointmentResponse.data, null, 2),
      );

      // 尝试多种响应格式
      const responseData =
        appointmentResponse.data?.data || appointmentResponse.data;
      const success = responseData?.success !== false;

      if (success) {
        console.log('✅ 成功为患者创建预约');
      } else {
        console.log('❌ 创建预约失败');
      }
    } catch (error) {
      handleError(error, '创建预约接口测试');
    }
  } else {
    console.log('\n6. 跳过创建预约测试，因为没有可用的患者ID');
  }

  // 步骤7: 为患者创建医疗记录
  if (testPatientId) {
    try {
      console.log('\n7. 为患者创建医疗记录...');

      // 使用正确的字段名
      const recordData = {
        patientId: testPatientId,
        visitDate: new Date().toISOString(),
        attendingDoctor: '张医生',
        chiefComplaint: '牙痛',
        diagnosis: '牙龈炎',
        treatmentPlan: '洗牙并服用消炎药',
        medications: '阿莫西林胶囊 一日三次',
        cost: 300,
        isPaid: false,
        notes: '自动化测试创建的医疗记录',
      };

      console.log(
        '请求URL:',
        `${baseUrl}/dental/patients/${testPatientId}/records`,
      );
      console.log('发送的医疗记录数据:', JSON.stringify(recordData, null, 2));

      const recordResponse = await axios.post(
        `${baseUrl}/dental/patients/${testPatientId}/records`,
        recordData,
        { headers },
      );
      console.log(
        '创建医疗记录响应:',
        JSON.stringify(recordResponse.data, null, 2),
      );

      // 尝试多种响应格式
      const responseData = recordResponse.data?.data || recordResponse.data;
      const success = responseData?.success !== false;

      if (success) {
        console.log('✅ 成功为患者创建医疗记录');
      } else {
        console.log('❌ 创建医疗记录失败');
      }
    } catch (error) {
      handleError(error, '创建医疗记录接口测试');
    }
  } else {
    console.log('\n7. 跳过创建医疗记录测试，因为没有可用的患者ID');
  }

  console.log('\n========= 患者API接口测试完成 =========');
  console.log('测试结束时间:', new Date().toLocaleString());
}

// 运行测试
testPatientApi().catch((error) => {
  console.error('测试过程中出现未捕获的错误:');
  console.error(error.stack || error);
});
