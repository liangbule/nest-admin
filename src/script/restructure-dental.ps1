# PowerShell script to restructure dental module
# This script mimics the functionality of the Bash script for Windows environments

# Functions for colored output
function Write-Green {
    param([string]$text)
    Write-Host $text -ForegroundColor Green
}

function Write-Yellow {
    param([string]$text)
    Write-Host $text -ForegroundColor Yellow
}

function Write-Red {
    param([string]$text)
    Write-Host $text -ForegroundColor Red
}

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "src\modules\dental")) {
    Write-Red "Error: Please run this script from the project root directory"
    exit 1
}

# Create backup
Write-Yellow "Creating backup of dental module..."
$backupDir = "src\modules\dental-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
Copy-Item -Path "src\modules\dental\*" -Destination $backupDir -Recurse -Force
Write-Green "✓ Backup created at $backupDir"

# Create new directory structure
Write-Yellow "Creating new directory structure..."
$newDirs = @(
    "src\modules\dental\common",
    "src\modules\dental\inventory",
    "src\modules\dental\inventory\dto",
    "src\modules\dental\inventory\entities",
    "src\modules\dental\patient",
    "src\modules\dental\patient\dto",
    "src\modules\dental\patient\entities",
    "src\modules\dental\appointment",
    "src\modules\dental\appointment\dto",
    "src\modules\dental\appointment\entities",
    "src\modules\dental\docs"
)

foreach ($dir in $newDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
        Write-Green "✓ Created directory: $dir"
    }
}

# Move entity files
Write-Yellow "Moving entity files..."
$entityMapping = @{
    "src\modules\dental\entities\inventory.entity.ts" = "src\modules\dental\inventory\entities\inventory.entity.ts";
    "src\modules\dental\entities\inventory-in-record.entity.ts" = "src\modules\dental\inventory\entities\inventory-in-record.entity.ts";
    "src\modules\dental\entities\inventory-out-record.entity.ts" = "src\modules\dental\inventory\entities\inventory-out-record.entity.ts";
    "src\modules\dental\entities\stock-take.entity.ts" = "src\modules\dental\inventory\entities\stock-take.entity.ts";
    "src\modules\dental\entities\stock-take-item.entity.ts" = "src\modules\dental\inventory\entities\stock-take-item.entity.ts";
    "src\modules\dental\entities\patient.entity.ts" = "src\modules\dental\patient\entities\patient.entity.ts";
    "src\modules\dental\entities\appointment.entity.ts" = "src\modules\dental\appointment\entities\appointment.entity.ts"
}

foreach ($source in $entityMapping.Keys) {
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $entityMapping[$source] -Force
        Write-Green "✓ Moved: $source to $($entityMapping[$source])"
    } else {
        Write-Yellow "! File not found: $source"
    }
}

# Move DTO files
Write-Yellow "Moving DTO files..."
$dtoMapping = @{
    "src\modules\dental\dto\inventory.dto.ts" = "src\modules\dental\inventory\dto\inventory.dto.ts";
    "src\modules\dental\dto\inventory-in-record.dto.ts" = "src\modules\dental\inventory\dto\inventory-in-record.dto.ts";
    "src\modules\dental\dto\inventory-out-record.dto.ts" = "src\modules\dental\inventory\dto\inventory-out-record.dto.ts";
    "src\modules\dental\dto\stock-take.dto.ts" = "src\modules\dental\inventory\dto\stock-take.dto.ts";
    "src\modules\dental\dto\patient.dto.ts" = "src\modules\dental\patient\dto\patient.dto.ts";
    "src\modules\dental\dto\appointment.dto.ts" = "src\modules\dental\appointment\dto\appointment.dto.ts"
}

foreach ($source in $dtoMapping.Keys) {
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $dtoMapping[$source] -Force
        Write-Green "✓ Moved: $source to $($dtoMapping[$source])"
    } else {
        Write-Yellow "! File not found: $source"
    }
}

# Move documentation files
Write-Yellow "Moving documentation files..."
if (Test-Path "src\modules\dental\dental.docs.ts") {
    Copy-Item -Path "src\modules\dental\dental.docs.ts" -Destination "src\modules\dental\docs\dental.docs.ts" -Force
    Write-Green "✓ Moved documentation file"
}

# Move inventory controller
Write-Yellow "Moving inventory controller..."
if (Test-Path "src\modules\dental\inventory.controller.ts") {
    Copy-Item -Path "src\modules\dental\inventory.controller.ts" -Destination "src\modules\dental\inventory\inventory.controller.ts" -Force
    Write-Green "✓ Moved inventory controller"
}

# Create common interface file
Write-Yellow "Creating common interface file..."
$commonInterfaceContent = @'
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ResponseWithMessage {
  message: string;
}
'@
Set-Content -Path "src\modules\dental\common\common.interface.ts" -Value $commonInterfaceContent
Write-Green "✓ Created common interface file"

# Create patient controller template
Write-Yellow "Creating patient controller template..."
$patientControllerContent = @'
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './dto/patient.dto';

@ApiTags('Patients')
@Controller('dental/patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  // TODO: Copy patient-related methods from the original dental.controller.ts to here
  // Related methods include: getPatients, getPatient, createPatient, updatePatient, deletePatient
}
'@
Set-Content -Path "src\modules\dental\patient\patient.controller.ts" -Value $patientControllerContent
Write-Green "✓ Patient controller template created"

# Create patient service template
Write-Yellow "Creating patient service template..."
$patientServiceContent = @'
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}
  // TODO: Copy patient-related methods from the original dental.service.ts to here
  // Related methods include: getPatients, getPatient, createPatient, updatePatient, deletePatient
}
'@
Set-Content -Path "src\modules\dental\patient\patient.service.ts" -Value $patientServiceContent
Write-Green "✓ Patient service template created"

Write-Green "============================================"
Write-Green "Restructuring initialization complete!"
Write-Green "============================================"
Write-Yellow "Next steps (manual):"
Write-Yellow "1. Extract relevant code from dental.controller.ts to the new controller files"
Write-Yellow "2. Extract relevant code from dental.service.ts to the new service files"
Write-Yellow "3. Update dental.module.ts to import and register the new controllers and services"
Write-Yellow "4. Fix import paths in all files to match the new structure"
Write-Yellow "5. Test functionality after refactoring"
Write-Green "============================================" 