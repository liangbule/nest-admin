import { registerAs } from '@nestjs/config';

/**
 * 应用程序配置
 * 提供应用程序的全局设置和参数
 * 从环境变量加载配置信息
 * 支持不同环境(开发、测试、生产)的配置切换
 */
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
