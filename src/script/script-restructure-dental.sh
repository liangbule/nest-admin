#!/bin/bash
# 牙科诊所管理系统重构脚本
# 此脚本自动执行项目重构的初始步骤，包括创建目录结构和移动文件

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在正确的目录中
if [ ! -d "src/modules/dental" ]; then
  echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
  exit 1
fi

echo -e "${GREEN}开始牙科诊所管理系统代码重构...${NC}"

# 阶段1: 创建备份
echo -e "${YELLOW}阶段1: 创建备份...${NC}"
mkdir -p backup/dental
cp -R src/modules/dental/* backup/dental/
echo -e "${GREEN}✓ 备份已创建在 backup/dental/${NC}"

# 阶段2: 创建新目录结构
echo -e "${YELLOW}阶段2: 创建新目录结构...${NC}"
mkdir -p src/modules/dental/core/interfaces
mkdir -p src/modules/dental/docs
mkdir -p src/modules/dental/patient/dto src/modules/dental/patient/entities
mkdir -p src/modules/dental/appointment/dto src/modules/dental/appointment/entities
mkdir -p src/modules/dental/medical-record/dto src/modules/dental/medical-record/entities
mkdir -p src/modules/dental/followup/dto src/modules/dental/followup/entities
mkdir -p src/modules/dental/inventory/dto src/modules/dental/inventory/entities
echo -e "${GREEN}✓ 新目录结构已创建${NC}"

# 阶段3: 移动实体文件
echo -e "${YELLOW}阶段3: 移动实体文件...${NC}"
# 患者实体
cp src/modules/dental/entities/patient.entity.ts src/modules/dental/patient/entities/
# 预约实体
cp src/modules/dental/entities/appointment.entity.ts src/modules/dental/appointment/entities/
# 病历实体
cp src/modules/dental/entities/medical-record.entity.ts src/modules/dental/medical-record/entities/
# 随访实体
cp src/modules/dental/entities/followup.entity.ts src/modules/dental/followup/entities/
# 库存相关实体
cp src/modules/dental/entities/inventory.entity.ts src/modules/dental/inventory/entities/
cp src/modules/dental/entities/inventory-in-record.entity.ts src/modules/dental/inventory/entities/
cp src/modules/dental/entities/inventory-out-record.entity.ts src/modules/dental/inventory/entities/
cp src/modules/dental/entities/stock-take.entity.ts src/modules/dental/inventory/entities/
cp src/modules/dental/entities/stock-take-item.entity.ts src/modules/dental/inventory/entities/
echo -e "${GREEN}✓ 实体文件已移动${NC}"

# 阶段4: 移动DTO文件
echo -e "${YELLOW}阶段4: 移动DTO文件...${NC}"
# 患者DTO
cp src/modules/dental/dto/patient.dto.ts src/modules/dental/patient/dto/
# 预约DTO
cp src/modules/dental/dto/appointment.dto.ts src/modules/dental/appointment/dto/
# 病历DTO
cp src/modules/dental/dto/medical-record.dto.ts src/modules/dental/medical-record/dto/
# 随访DTO
cp src/modules/dental/dto/followup.dto.ts src/modules/dental/followup/dto/
# 库存相关DTO
cp src/modules/dental/dto/inventory.dto.ts src/modules/dental/inventory/dto/
cp src/modules/dental/dto/inventory-in-record.dto.ts src/modules/dental/inventory/dto/
cp src/modules/dental/dto/inventory-out-record.dto.ts src/modules/dental/inventory/dto/
cp src/modules/dental/dto/stock-take.dto.ts src/modules/dental/inventory/dto/
echo -e "${GREEN}✓ DTO文件已移动${NC}"

# 阶段5: 移动文档文件
echo -e "${YELLOW}阶段5: 移动文档文件...${NC}"
cp src/modules/dental/README.md src/modules/dental/docs/
cp src/modules/dental/SWAGGER_GUIDE.md src/modules/dental/docs/
# 复制新创建的API文档
if [ -f "src/API_DOCUMENTATION.md" ]; then
  cp src/API_DOCUMENTATION.md src/modules/dental/docs/API_DOCUMENTATION.md
fi
# 复制重构计划文档
if [ -f "src/dental-api-structure.md" ]; then
  cp src/dental-api-structure.md src/modules/dental/docs/restructure-plan.md
fi
echo -e "${GREEN}✓ 文档文件已移动${NC}"

# 阶段6: 移动控制器文件
echo -e "${YELLOW}阶段6: 移动库存控制器...${NC}"
cp src/modules/dental/inventory.controller.ts src/modules/dental/inventory/inventory.controller.ts
echo -e "${GREEN}✓ 库存控制器已移动${NC}"

# 阶段7: 移动核心模块文件
echo -e "${YELLOW}阶段7: 移动核心模块文件...${NC}"
cp src/modules/dental/dental.module.ts src/modules/dental/core/dental.module.ts
echo -e "${GREEN}✓ 核心模块文件已移动${NC}"

# 创建common.interface.ts
echo -e "${YELLOW}创建共享接口文件...${NC}"
cat > src/modules/dental/core/interfaces/common.interface.ts << 'EOF'
/**
 * 牙科诊所管理系统共享接口定义
 * 用于定义跨模块共享的接口
 */

// 通用分页查询参数接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 通用分页响应元数据接口
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 通用分页响应数据接口
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// 通用API响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
EOF
echo -e "${GREEN}✓ 共享接口文件已创建${NC}"

echo -e "${GREEN}初始化重构完成!${NC}"
echo -e "${YELLOW}注意: 此脚本只执行了初始的目录创建和文件复制。${NC}"
echo -e "${YELLOW}接下来需要手动完成以下工作:${NC}"
echo "1. 创建分离的控制器文件 (patient.controller.ts, appointment.controller.ts, 等)"
echo "2. 创建分离的服务文件 (patient.service.ts, appointment.service.ts, 等)"
echo "3. 更新模块定义文件以导入新的控制器和服务"
echo "4. 修复所有文件中的导入路径"
echo "5. 进行测试以确保功能正常"
echo -e "${GREEN}详细实施步骤请参考: src/modules/dental/docs/restructure-plan.md${NC}" 