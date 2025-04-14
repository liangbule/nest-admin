/**
 * 患者和预约模块测试脚本
 * 测试牙科诊所管理系统中患者管理和预约管理相关功能
 */
import { DentalClinicApiService } from './shared/client';
import axios, { AxiosInstance } from 'axios';
import {
  PatientGender,
  PatientStatus,
  AppointmentStatus,
  AppointmentType,
  UserRole,
} from './shared/interfaces';

// 创建API服务实例
const apiService = new DentalClinicApiService({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  handleError: true,
});

// 声明一个axios实例变量
let apiClient: AxiosInstance;

// 全局变量，存储测试中创建的数据ID
let patientId: string;
let doctorId: string;
let appointmentId: string;

// 测试患者模块
async function testPatientModule() {
  console.log('\n====== 测试患者模块 ======');

  try {
    // 登录
    console.log('登录系统...');
    await apiService.auth.login({
      username: 'testuser11',
      password: '123456',
    });

    // 创建测试患者
    console.log('测试创建患者...');
    const createPatientResponse = await apiClient.post('/patients', {
      name: '张三',
      gender: PatientGender.MALE,
      birthday: '1990-01-01',
      phone: '13800138001',
      address: '北京市朝阳区',
      medicalHistory: '无特殊病史',
    });

    console.log(
      '创建患者结果:',
      createPatientResponse.data.success ? '成功' : '失败',
    );

    if (createPatientResponse.data.success && createPatientResponse.data.data) {
      patientId = createPatientResponse.data.data.id;
      console.log('创建的患者ID:', patientId);

      // 查询患者
      console.log('测试查询患者...');
      const getPatientResponse = await apiClient.get(`/patients/${patientId}`);
      console.log(
        '查询患者结果:',
        getPatientResponse.data.success ? '成功' : '失败',
      );

      if (getPatientResponse.data.success) {
        console.log('患者信息:', {
          id: getPatientResponse.data.data.id,
          name: getPatientResponse.data.data.name,
          gender: getPatientResponse.data.data.gender,
          age: getPatientResponse.data.data.age,
        });
      }

      // 更新患者
      console.log('测试更新患者...');
      const updatePatientResponse = await apiClient.put(
        `/patients/${patientId}`,
        {
          address: '上海市浦东新区',
          phone: '13900139001',
        },
      );
      console.log(
        '更新患者结果:',
        updatePatientResponse.data.success ? '成功' : '失败',
      );

      // 获取患者列表
      console.log('测试获取患者列表...');
      const listPatientsResponse = await apiClient.get('/patients', {
        params: {
          gender: PatientGender.MALE,
          page: 1,
          limit: 10,
        },
      });
      console.log(
        '获取患者列表结果:',
        listPatientsResponse.data.success ? '成功' : '失败',
      );

      if (listPatientsResponse.data.success) {
        console.log('患者总数:', listPatientsResponse.data.data.total);
        console.log(
          '患者列表数量:',
          listPatientsResponse.data.data.list.length,
        );
      }
    }
  } catch (error) {
    console.error('患者模块测试失败:', error.message);
  }
}

// 创建一个测试医生用户
async function createTestDoctor() {
  try {
    const createDoctorResponse = await apiClient.post('/users', {
      username: 'testdoctor2',
      password: 'password123',
      realName: '李医生',
      phone: '13800138002',
      role: UserRole.DOCTOR,
      status: 'active',
    });

    if (createDoctorResponse.data.success && createDoctorResponse.data.data) {
      doctorId = createDoctorResponse.data.data.id;
      console.log('创建测试医生成功, ID:', doctorId);
    }
  } catch (error) {
    console.error('创建测试医生失败:', error.message);
  }
}

// 测试预约模块
async function testAppointmentModule() {
  console.log('\n====== 测试预约模块 ======');

  try {
    // 确保有医生和患者
    if (!doctorId || !patientId) {
      console.log('缺少医生或患者ID，无法测试预约模块');
      return;
    }

    // 创建预约
    console.log('测试创建预约...');
    const createAppointmentResponse = await apiClient.post('/appointments', {
      patientId: patientId,
      doctorId: doctorId,
      date: '2025-05-01',
      time: '10:00',
      duration: 30,
      type: AppointmentType.CHECKUP,
      notes: '牙齿常规检查',
    });

    console.log(
      '创建预约结果:',
      createAppointmentResponse.data.success ? '成功' : '失败',
    );

    if (
      createAppointmentResponse.data.success &&
      createAppointmentResponse.data.data
    ) {
      appointmentId = createAppointmentResponse.data.data.id;
      console.log('创建的预约ID:', appointmentId);

      // 查询预约
      console.log('测试查询预约...');
      const getAppointmentResponse = await apiClient.get(
        `/appointments/${appointmentId}`,
      );
      console.log(
        '查询预约结果:',
        getAppointmentResponse.data.success ? '成功' : '失败',
      );

      if (getAppointmentResponse.data.success) {
        console.log('预约信息:', {
          id: getAppointmentResponse.data.data.id,
          patientName: getAppointmentResponse.data.data.patientName,
          doctorName: getAppointmentResponse.data.data.doctorName,
          date: getAppointmentResponse.data.data.date,
          time: getAppointmentResponse.data.data.time,
        });
      }

      // 更新预约
      console.log('测试更新预约...');
      const updateAppointmentResponse = await apiClient.put(
        `/appointments/${appointmentId}`,
        {
          time: '14:30',
          status: AppointmentStatus.CONFIRMED,
        },
      );
      console.log(
        '更新预约结果:',
        updateAppointmentResponse.data.success ? '成功' : '失败',
      );

      // 获取预约列表
      console.log('测试获取预约列表...');
      const listAppointmentsResponse = await apiClient.get('/appointments', {
        params: {
          doctorId: doctorId,
          startDate: '2025-05-01',
          endDate: '2025-05-31',
          status: AppointmentStatus.CONFIRMED,
          page: 1,
          limit: 10,
        },
      });
      console.log(
        '获取预约列表结果:',
        listAppointmentsResponse.data.success ? '成功' : '失败',
      );

      if (listAppointmentsResponse.data.success) {
        console.log('预约总数:', listAppointmentsResponse.data.data.total);
        console.log(
          '预约列表数量:',
          listAppointmentsResponse.data.data.list.length,
        );
      }

      // 获取指定日期的预约
      console.log('测试获取指定日期的预约...');
      const getDateAppointmentsResponse = await apiClient.get(
        '/appointments/date/2025-05-01',
      );
      console.log(
        '获取指定日期预约结果:',
        getDateAppointmentsResponse.data.success ? '成功' : '失败',
      );

      if (getDateAppointmentsResponse.data.success) {
        console.log(
          '当日预约数量:',
          getDateAppointmentsResponse.data.data.length,
        );
      }
    }
  } catch (error) {
    console.error('预约模块测试失败:', error.message);
  }
}

// 清理测试数据
async function cleanupTestData() {
  console.log('\n====== 清理测试数据 ======');

  try {
    // 删除预约
    if (appointmentId) {
      console.log('删除测试预约...');
      const deleteAppointmentResponse = await apiClient.delete(
        `/appointments/${appointmentId}`,
      );
      console.log(
        '删除预约结果:',
        deleteAppointmentResponse.data.success ? '成功' : '失败',
      );
    }

    // 删除患者
    if (patientId) {
      console.log('删除测试患者...');
      const deletePatientResponse = await apiClient.delete(
        `/patients/${patientId}`,
      );
      console.log(
        '删除患者结果:',
        deletePatientResponse.data.success ? '成功' : '失败',
      );
    }

    // 删除医生
    if (doctorId) {
      console.log('删除测试医生...');
      const deleteDoctorResponse = await apiClient.delete(`/users/${doctorId}`);
      console.log(
        '删除医生结果:',
        deleteDoctorResponse.data.success ? '成功' : '失败',
      );
    }
  } catch (error) {
    console.error('清理测试数据失败:', error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('开始测试牙科诊所管理系统患者和预约模块...');

  try {
    // 登录
    const loginResponse = await apiService.auth.login({
      username: 'admin',
      password: 'admin123',
    });

    // 从登录响应中获取token
    const token = loginResponse.data?.token || '';

    // 创建一个axios实例便于直接调用API
    apiClient = axios.create({
      baseURL: 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // 运行测试函数
    await createTestDoctor();
    await testPatientModule();
    await testAppointmentModule();

    // 清理测试数据
    await cleanupTestData();

    console.log('\n所有测试已完成！');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 执行测试
runTests().catch((error) => {
  console.error('测试脚本执行失败:', error);
});
