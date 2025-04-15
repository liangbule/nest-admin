import axios from 'axios';
import * as chalk from 'chalk';

/**
 * 牙科诊所API综合测试套件
 * 测试所有关键接口，确保系统各模块功能正常
 */

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  username: 'admin',
  password: 'admin',
};

// Test data
const testPatient = {
  name: 'Test Patient',
  gender: 'Male',
  age: 35,
  phone: '13800138000',
  address: 'Test Address',
};

const testAppointment = {
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  patientId: '',
  description: 'Comprehensive Test Appointment',
  status: 'scheduled',
};

const testMedicalRecord = {
  diagnosis: 'Test Diagnosis',
  treatment: 'Test Treatment',
  notes: 'Created by comprehensive test',
};

const testInventoryItem = {
  name: 'Test Supply',
  category: 'Medical',
  quantity: 100,
  unit: 'pcs',
  threshold: 20,
};

// Utility functions
const log = {
  info: (message: string) => console.log(chalk.blue(`[INFO] ${message}`)),
  success: (message: string) =>
    console.log(chalk.green(`[SUCCESS] ${message}`)),
  warning: (message: string) =>
    console.log(chalk.yellow(`[WARNING] ${message}`)),
  error: (message: string) => console.log(chalk.red(`[ERROR] ${message}`)),
  section: (message: string) =>
    console.log(chalk.magenta(`\n=== ${message} ===`)),
};

let authToken = '';
let createdPatientId = '';
let createdAppointmentId = '';
let createdMedicalRecordId = '';
let createdInventoryId = '';

// API client with authentication
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

// Test suites
async function testAuthentication() {
  log.section('Testing Authentication');

  try {
    const response = await apiClient.post('/auth/login', TEST_USER);
    authToken = response.data.data.token;

    if (!authToken) {
      log.error('Authentication failed - no token received');
      process.exit(1);
    }

    log.success('Authentication successful');
    return true;
  } catch (error) {
    log.error(`Authentication failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    process.exit(1);
  }
}

async function testPatientManagement() {
  log.section('Testing Patient Management');

  try {
    // Create patient
    log.info('Creating test patient...');
    const createResponse = await apiClient.post(
      '/dental/patients',
      testPatient,
    );
    createdPatientId = createResponse.data.data.id;
    log.success(`Patient created with ID: ${createdPatientId}`);

    // Get patient list
    log.info('Retrieving patient list...');
    const listResponse = await apiClient.get('/dental/patients');
    log.success(`Retrieved ${listResponse.data.data.length} patients`);

    // Get patient by ID
    log.info(`Retrieving patient with ID: ${createdPatientId}`);
    const getResponse = await apiClient.get(
      `/dental/patients/${createdPatientId}`,
    );
    log.success(`Retrieved patient: ${getResponse.data.data.name}`);

    // Update patient
    log.info('Updating test patient...');
    const updateResponse = await apiClient.put(
      `/dental/patients/${createdPatientId}`,
      {
        ...testPatient,
        name: 'Updated Test Patient',
      },
    );
    log.success(`Patient updated: ${updateResponse.data.data.name}`);

    return true;
  } catch (error) {
    log.error(`Patient management test failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testAppointmentManagement() {
  log.section('Testing Appointment Management');

  try {
    // Create appointment
    log.info('Creating test appointment...');
    const appointmentData = { ...testAppointment, patientId: createdPatientId };
    const createResponse = await apiClient.post(
      '/dental/appointments',
      appointmentData,
    );
    createdAppointmentId = createResponse.data.data.id;
    log.success(`Appointment created with ID: ${createdAppointmentId}`);

    // Get appointment list
    log.info('Retrieving appointment list...');
    const listResponse = await apiClient.get('/dental/appointments');
    log.success(`Retrieved ${listResponse.data.data.length} appointments`);

    // Get appointments by date
    log.info(`Retrieving appointments for date: ${testAppointment.date}`);
    const dateResponse = await apiClient.get(
      `/dental/appointments/date/${testAppointment.date}`,
    );
    log.success(
      `Retrieved ${dateResponse.data.data.length} appointments for the date`,
    );

    // Update appointment
    log.info('Updating test appointment...');
    const updateResponse = await apiClient.put(
      `/dental/appointments/${createdAppointmentId}`,
      {
        ...appointmentData,
        status: 'confirmed',
      },
    );
    log.success(`Appointment updated: ${updateResponse.data.data.status}`);

    return true;
  } catch (error) {
    log.error(`Appointment management test failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testMedicalRecords() {
  log.section('Testing Medical Records');

  try {
    // Create medical record
    log.info('Creating test medical record...');
    const createResponse = await apiClient.post(
      `/dental/patients/${createdPatientId}/records`,
      testMedicalRecord,
    );
    createdMedicalRecordId = createResponse.data.data.id;
    log.success(`Medical record created with ID: ${createdMedicalRecordId}`);

    // Get medical records for patient
    log.info(`Retrieving medical records for patient: ${createdPatientId}`);
    const listResponse = await apiClient.get(
      `/dental/patients/${createdPatientId}/records`,
    );
    log.success(`Retrieved ${listResponse.data.data.length} medical records`);

    // Update medical record
    log.info('Updating test medical record...');
    const updateResponse = await apiClient.put(
      `/dental/records/${createdMedicalRecordId}`,
      {
        ...testMedicalRecord,
        notes: 'Updated by comprehensive test',
      },
    );
    log.success(`Medical record updated: ${updateResponse.data.data.notes}`);

    return true;
  } catch (error) {
    log.error(`Medical records test failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function testInventoryManagement() {
  log.section('Testing Inventory Management');

  try {
    // Create inventory item
    log.info('Creating test inventory item...');
    const createResponse = await apiClient.post(
      '/dental/inventory',
      testInventoryItem,
    );
    createdInventoryId = createResponse.data.data.id;
    log.success(`Inventory item created with ID: ${createdInventoryId}`);

    // Get inventory list
    log.info('Retrieving inventory list...');
    const listResponse = await apiClient.get('/dental/inventory');
    log.success(`Retrieved ${listResponse.data.data.length} inventory items`);

    // Get inventory item by ID
    log.info(`Retrieving inventory item with ID: ${createdInventoryId}`);
    const getResponse = await apiClient.get(
      `/dental/inventory/${createdInventoryId}`,
    );
    log.success(`Retrieved inventory item: ${getResponse.data.data.name}`);

    // Create inventory inbound record
    log.info('Creating inventory inbound record...');
    const inboundResponse = await apiClient.post('/dental/inventory/in', {
      inventoryId: createdInventoryId,
      quantity: 50,
      unitPrice: 10,
      supplier: 'Test Supplier',
      date: new Date().toISOString().split('T')[0],
      notes: 'Test inbound record',
    });
    log.success(
      `Inbound record created with ID: ${inboundResponse.data.data.id}`,
    );

    // Create inventory outbound record
    log.info('Creating inventory outbound record...');
    const outboundResponse = await apiClient.post('/dental/inventory/out', {
      inventoryId: createdInventoryId,
      quantity: 20,
      receiver: 'Test Department',
      date: new Date().toISOString().split('T')[0],
      notes: 'Test outbound record',
    });
    log.success(
      `Outbound record created with ID: ${outboundResponse.data.data.id}`,
    );

    // Get inventory statistics
    log.info('Retrieving inventory statistics...');
    const statsResponse = await apiClient.get('/dental/inventory/statistics');
    log.success('Retrieved inventory statistics');

    return true;
  } catch (error) {
    log.error(`Inventory management test failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

async function cleanup() {
  log.section('Cleaning up test data');

  try {
    // Delete in reverse order of creation to avoid foreign key constraints
    if (createdInventoryId) {
      log.info(`Deleting inventory item: ${createdInventoryId}`);
      await apiClient.delete(`/dental/inventory/${createdInventoryId}`);
      log.success('Inventory item deleted');
    }

    if (createdMedicalRecordId) {
      log.info(`Deleting medical record: ${createdMedicalRecordId}`);
      await apiClient.delete(`/dental/records/${createdMedicalRecordId}`);
      log.success('Medical record deleted');
    }

    if (createdAppointmentId) {
      log.info(`Deleting appointment: ${createdAppointmentId}`);
      await apiClient.delete(`/dental/appointments/${createdAppointmentId}`);
      log.success('Appointment deleted');
    }

    if (createdPatientId) {
      log.info(`Deleting patient: ${createdPatientId}`);
      await apiClient.delete(`/dental/patients/${createdPatientId}`);
      log.success('Patient deleted');
    }

    return true;
  } catch (error) {
    log.error(`Cleanup failed: ${error.message}`);
    if (error.response) {
      log.error(
        `Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    return false;
  }
}

// Run all tests
async function runTests() {
  log.section('STARTING COMPREHENSIVE API TESTS');

  try {
    // Authentication must succeed for other tests
    const authResult = await testAuthentication();
    if (!authResult) return;

    // Run main test suites
    const patientResult = await testPatientManagement();
    const appointmentResult = await testAppointmentManagement();
    const medicalRecordResult = await testMedicalRecords();
    const inventoryResult = await testInventoryManagement();

    // Clean up regardless of test results
    await cleanup();

    // Report overall results
    log.section('TEST SUMMARY');
    log.info(`Authentication: ${authResult ? 'PASSED' : 'FAILED'}`);
    log.info(`Patient Management: ${patientResult ? 'PASSED' : 'FAILED'}`);
    log.info(
      `Appointment Management: ${appointmentResult ? 'PASSED' : 'FAILED'}`,
    );
    log.info(`Medical Records: ${medicalRecordResult ? 'PASSED' : 'FAILED'}`);
    log.info(`Inventory Management: ${inventoryResult ? 'PASSED' : 'FAILED'}`);

    const allPassed =
      authResult &&
      patientResult &&
      appointmentResult &&
      medicalRecordResult &&
      inventoryResult;

    if (allPassed) {
      log.section('ALL TESTS PASSED');
      process.exit(0);
    } else {
      log.section('TESTS COMPLETED WITH FAILURES');
      process.exit(1);
    }
  } catch (error) {
    log.error(`Test execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Execute the tests
runTests();
