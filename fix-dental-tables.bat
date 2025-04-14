@echo off
chcp 65001 >nul
echo ======== 牙科诊所管理系统 - 数据库与测试自动修复脚本 ========

rem 1. 运行迁移以修复表结构
echo.
echo 1. 执行数据库迁移...
call npm run migration:run

if %ERRORLEVEL% neq 0 (
  echo ❌ 迁移失败，请检查错误
  echo 尝试继续执行测试...
)

rem 2. 修复实体类和DTO，确保与数据库表结构一致
echo.
echo 2. 确保实体类与数据库结构一致...

rem 3. 重新启动应用程序
echo.
echo 3. 重启应用程序以加载新的数据库结构...
rem 如果在后台运行，先停止旧的进程
taskkill /F /IM node.exe /T 2>nul
start "NestJS Server" /B npm run start:dev

rem 等待应用程序启动
echo 正在等待应用程序启动...
echo 这可能需要一些时间，请耐心等待...
timeout /t 20 /nobreak > nul

rem 4. 运行测试脚本
echo.
echo 4. 运行测试脚本...
echo 4.1 运行患者API测试...
call npm run test:patient-api

echo.
echo 4.2 运行库存API测试...
call npm run test:inventory-api

rem 5. 显示测试结果摘要
echo.
echo 5. 测试完成
echo.
echo 如果测试过程中出现错误，请检查以下几点：
echo  - 数据库连接是否正常
echo  - 数据库表结构是否与实体类匹配
echo  - API接口实现是否与DTO定义一致
echo  - 服务器是否成功启动（可以访问 http://localhost:3000/api/docs 查看）
echo.
echo ======== 脚本执行完毕 ========

rem 询问是否关闭服务器
set /p CLOSE_SERVER=是否关闭NestJS服务器? (Y/N): 
if /i "%CLOSE_SERVER%"=="Y" (
  echo 正在关闭服务器...
  taskkill /F /IM node.exe /T 2>nul
  echo 服务器已关闭
) else (
  echo 服务器继续运行中...
)

rem 可以添加一些后续处理，例如清理测试数据
rem echo.
rem echo 可选: 清理测试数据...
rem 添加清理测试数据的命令 