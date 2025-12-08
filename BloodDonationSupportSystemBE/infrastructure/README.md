# DaiVietBlood - AWS Infrastructure

## Kiến trúc Nested Stacks

Infrastructure được chia thành 8 layers để tránh circular dependency và dễ quản lý:

```
┌─────────────────────────────────────────────────────────────┐
│                    08-monitoring.yaml                        │
│                    (CloudWatch Dashboard & Alarms)           │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                    07-cicd.yaml                              │
│                    (CodePipeline, CodeBuild)                 │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                    06-api.yaml                               │
│                    (API Gateway HTTP)                        │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                    05-compute.yaml                           │
│                    (Lambda Functions, EventBridge)           │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌──────────────────────┐     ┌────────────────────────────────┐
│   04-storage.yaml    │     │       03-database.yaml         │
│   (S3 Buckets)       │     │       (RDS MySQL)              │
└──────────────────────┘     └────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                    02-security.yaml                          │
│                    (IAM Roles, Security Groups)              │
└─────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────┐
│                    01-networking.yaml                        │
│                    (VPC, Subnets, Route Tables)              │
└─────────────────────────────────────────────────────────────┘
```

## Cấu trúc thư mục

```
infrastructure/
├── cloudformation/
│   ├── 00-master.yaml        # Master stack (optional - for nested deployment)
│   ├── 01-networking.yaml    # VPC, Subnets, IGW, Route Tables
│   ├── 02-security.yaml      # IAM Roles, Security Groups
│   ├── 03-database.yaml      # RDS MySQL
│   ├── 04-storage.yaml       # S3 Buckets
│   ├── 05-compute.yaml       # Lambda Functions, EventBridge
│   ├── 06-api.yaml           # API Gateway
│   ├── 07-cicd.yaml          # CodePipeline, CodeBuild
│   └── 08-monitoring.yaml    # CloudWatch Dashboard & Alarms
├── parameters.example.json   # Template cho parameters
├── deploy.ps1                # Script deploy cho Windows
└── README.md                 # File này
```

## Yêu cầu

1. **AWS CLI** đã cài đặt và cấu hình
2. **GitHub Personal Access Token** với quyền `repo` và `admin:repo_hook`
3. **PowerShell** (Windows)

## Hướng dẫn Deploy

### Bước 1: Tạo file parameters.json

```powershell
cp parameters.example.json parameters.json
```

Sửa file `parameters.json`:
```json
[
  { "ParameterKey": "Environment", "ParameterValue": "dev" },
  { "ParameterKey": "DBUsername", "ParameterValue": "nodeuser" },
  { "ParameterKey": "DBPassword", "ParameterValue": "YourSecurePassword123!" },
  { "ParameterKey": "DBName", "ParameterValue": "BloodDonationSupportSystem" },
  { "ParameterKey": "GitHubOwner", "ParameterValue": "june4m" },
  { "ParameterKey": "GitHubRepo", "ParameterValue": "BloodDonationSupportSystemBE" },
  { "ParameterKey": "GitHubBranch", "ParameterValue": "main" },
  { "ParameterKey": "GitHubOAuthToken", "ParameterValue": "ghp_xxxxxxxxxxxx" }
]
```

### Bước 2: Deploy Infrastructure

```powershell
cd infrastructure
.\deploy.ps1 -Action create -Environment dev
```

### Bước 3: Kiểm tra trạng thái

```powershell
.\deploy.ps1 -Action status -Environment dev
```

### Bước 4: Import Database Schema

Sau khi RDS được tạo, kết nối và import schema:

```bash
# Lấy RDS endpoint từ output
mysql -h <RDS_ENDPOINT> -u nodeuser -p BloodDonationSupportSystem < ../database/schema.sql
```

### Bước 5: Trigger CI/CD

Push code lên GitHub để trigger pipeline:
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
```

## Commands

| Command | Mô tả |
|---------|-------|
| `.\deploy.ps1 -Action create` | Deploy tất cả stacks |
| `.\deploy.ps1 -Action status` | Kiểm tra trạng thái các stacks |
| `.\deploy.ps1 -Action delete` | Xóa tất cả stacks |

## Outputs sau khi deploy

- **API Gateway URL**: `https://xxx.execute-api.ap-southeast-1.amazonaws.com/dev`
- **RDS Endpoint**: `xxx.xxx.ap-southeast-1.rds.amazonaws.com`
- **CloudWatch Dashboard**: Link trong AWS Console

## Chi phí ước tính (Free Tier)

| Service | Free Tier | Sau Free Tier |
|---------|-----------|---------------|
| Lambda | 400,000 GB-seconds/tháng | ~$0.20/1M requests |
| API Gateway | 1M requests/tháng | ~$3.50/1M requests |
| RDS (db.t3.micro) | 750 giờ/tháng | ~$15-20/tháng |
| S3 | 5GB storage | ~$0.023/GB |
| CodePipeline | 1 pipeline miễn phí | $1/pipeline |
| CodeBuild | 100 build minutes/tháng | ~$0.005/minute |

## Troubleshooting

### Stack bị stuck ở CREATE_IN_PROGRESS
- Kiểm tra CloudFormation Events trong AWS Console
- RDS thường mất 10-15 phút để tạo

### Lambda không kết nối được RDS
- Kiểm tra Security Group cho phép traffic từ Lambda SG
- Kiểm tra Lambda có VPC config đúng subnet

### CodePipeline fail
- Kiểm tra GitHub token còn hiệu lực
- Kiểm tra buildspec.yml syntax

## Cleanup

```powershell
.\deploy.ps1 -Action delete -Environment dev
```

**Lưu ý**: S3 buckets có `DeletionPolicy: Retain` nên cần xóa thủ công.
