# 工具脚本目录

本目录包含牙科诊所管理系统的各种实用工具脚本，用于辅助开发、测试和部署过程。

## 工具脚本清单

| 文件名 | 描述 |
|------|------|
| `restructure-dental.ps1` | 牙科模块重构工具，用于重新组织代码结构 |
| `generate-dto.ts` | DTO类生成工具，根据实体类自动生成DTO |
| `generate-swagger.ts` | Swagger文档生成工具 |
| `database-backup.ts` | 数据库备份工具 |
| `init-test-data.ts` | 测试数据初始化工具 |
| `migration-helper.ts` | 数据库迁移辅助工具 |
| `jwt-helper.ts` | JWT工具函数 |
| `logger.ts` | 自定义日志工具 |
| `validators.ts` | 通用数据验证工具 |

## 使用方法

### PowerShell脚本

执行PowerShell脚本需要确保你有足够的执行权限。对于Windows系统，可能需要以管理员身份运行PowerShell。

```powershell
# 执行重构脚本
.\src\utils\restructure-dental.ps1
```

### TypeScript工具

TypeScript工具可以通过ts-node直接运行：

```bash
# 生成DTO
npx ts-node src/utils/generate-dto.ts

# 初始化测试数据
npx ts-node src/utils/init-test-data.ts

# 生成Swagger文档
npx ts-node src/utils/generate-swagger.ts
```

## 开发新工具

当需要开发新的工具脚本时，请遵循以下指南：

1. 使用有意义的文件名，清晰表明工具的用途
2. 在脚本开头添加详细的注释，说明工具的功能、使用方法和参数
3. 包含适当的错误处理和日志输出
4. 提供命令行参数支持（如适用）
5. 更新本README文件，添加新工具的说明

## 工具开发模板

### TypeScript工具模板

```typescript
/**
 * 工具名称：XXX工具
 * 
 * 功能描述：
 * 此工具用于...
 * 
 * 使用方法：
 * npx ts-node src/utils/tool-name.ts [参数]
 * 
 * 参数说明：
 * --param1: 参数1说明
 * --param2: 参数2说明
 */

// 导入依赖
import * as fs from 'fs';
import * as path from 'path';

// 解析命令行参数
const args = process.argv.slice(2);
const param1 = args.find(arg => arg.startsWith('--param1='))?.split('=')[1] || 'default';

// 主函数
async function main() {
  console.log('开始执行...');
  
  try {
    // 工具逻辑
    console.log(`使用参数: ${param1}`);
    
    // ...
    
    console.log('执行完成');
  } catch (error) {
    console.error('执行过程中出现错误:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
```

### PowerShell脚本模板

```powershell
<#
.SYNOPSIS
工具简短描述

.DESCRIPTION
工具详细描述，包括功能和使用场景

.PARAMETER Param1
参数1的说明

.PARAMETER Param2
参数2的说明

.EXAMPLE
.\tool-name.ps1 -Param1 value1 -Param2 value2

.NOTES
作者: Your Name
日期: YYYY-MM-DD
#>

param (
    [string]$Param1 = "默认值",
    [string]$Param2 = "默认值"
)

# 函数定义
function Show-Message {
    param (
        [string]$Message,
        [string]$Type = "Info"
    )
    
    switch ($Type) {
        "Info" { Write-Host $Message -ForegroundColor Cyan }
        "Success" { Write-Host $Message -ForegroundColor Green }
        "Warning" { Write-Host $Message -ForegroundColor Yellow }
        "Error" { Write-Host $Message -ForegroundColor Red }
    }
}

# 主逻辑
try {
    Show-Message "开始执行脚本..." "Info"
    Show-Message "参数值: $Param1, $Param2" "Info"
    
    # 脚本逻辑
    # ...
    
    Show-Message "脚本执行完成" "Success"
} catch {
    Show-Message "脚本执行出错: $_" "Error"
    exit 1
}
```

## 注意事项

1. 工具脚本应当提供清晰的帮助信息和使用说明
2. 对于可能修改代码或数据的工具，应当在执行前进行备份
3. 高风险操作应该提供确认机制，避免意外执行
4. 保持工具的模块化和可复用性
5. 在脚本执行过程中提供足够的进度反馈 