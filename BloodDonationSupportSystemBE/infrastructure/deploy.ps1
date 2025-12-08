# DaiVietBlood - AWS Infrastructure Deployment Script
# Usage: .\deploy.ps1 -Action [upload|create|update|delete|status] -Environment [dev|staging|prod]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("upload", "create", "update", "delete", "status", "individual")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "ap-southeast-1",

    [Parameter(Mandatory=$false)]
    [string]$StackName = ""
)

$ProjectName = "daivietblood"
$MasterStackName = "$Environment-$ProjectName-master"
$TemplateBucketName = "$Environment-$ProjectName-templates-$((aws sts get-caller-identity --query Account --output text).Trim())"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DaiVietBlood Infrastructure Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Template Bucket: $TemplateBucketName" -ForegroundColor Yellow
Write-Host ""

function Upload-Templates {
    Write-Host "Creating S3 bucket for templates..." -ForegroundColor Green
    
    # Check if bucket exists
    $bucketExists = aws s3api head-bucket --bucket $TemplateBucketName 2>&1
    if ($LASTEXITCODE -ne 0) {
        aws s3 mb s3://$TemplateBucketName --region $Region
        Write-Host "Bucket created: $TemplateBucketName" -ForegroundColor Green
    } else {
        Write-Host "Bucket already exists: $TemplateBucketName" -ForegroundColor Yellow
    }

    Write-Host "Uploading CloudFormation templates..." -ForegroundColor Green
    aws s3 sync ./cloudformation s3://$TemplateBucketName/cloudformation --region $Region
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Templates uploaded successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to upload templates!" -ForegroundColor Red
        exit 1
    }
}

function Deploy-IndividualStacks {
    Write-Host "Deploying individual stacks in order..." -ForegroundColor Green
    
    # Check parameters file
    if (-not (Test-Path "parameters.json")) {
        Write-Host "ERROR: parameters.json not found!" -ForegroundColor Red
        exit 1
    }
    
    $params = Get-Content "parameters.json" | ConvertFrom-Json
    $paramHash = @{}
    foreach ($p in $params) {
        $paramHash[$p.ParameterKey] = $p.ParameterValue
    }

    # 1. Networking Stack
    Write-Host "`n[1/8] Deploying Networking Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/01-networking.yaml `
        --stack-name "$Environment-$ProjectName-networking" `
        --parameter-overrides Environment=$Environment ProjectName=$ProjectName `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    # Get VPC outputs
    $VPCId = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-networking" --query "Stacks[0].Outputs[?OutputKey=='VPCId'].OutputValue" --output text --region $Region
    $PrivateSubnet1 = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-networking" --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnet1'].OutputValue" --output text --region $Region
    $PrivateSubnet2 = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-networking" --query "Stacks[0].Outputs[?OutputKey=='PrivateSubnet2'].OutputValue" --output text --region $Region

    # 2. Security Stack
    Write-Host "`n[2/8] Deploying Security Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/02-security.yaml `
        --stack-name "$Environment-$ProjectName-security" `
        --parameter-overrides Environment=$Environment ProjectName=$ProjectName VPCId=$VPCId `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    # Get Security outputs
    $LambdaSG = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-security" --query "Stacks[0].Outputs[?OutputKey=='LambdaSecurityGroupId'].OutputValue" --output text --region $Region
    $RDSSG = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-security" --query "Stacks[0].Outputs[?OutputKey=='RDSSecurityGroupId'].OutputValue" --output text --region $Region
    $LambdaRoleArn = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-security" --query "Stacks[0].Outputs[?OutputKey=='LambdaExecutionRoleArn'].OutputValue" --output text --region $Region

    # 3. Database Stack
    Write-Host "`n[3/8] Deploying Database Stack (this may take 10-15 minutes)..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/03-database.yaml `
        --stack-name "$Environment-$ProjectName-database" `
        --parameter-overrides `
            Environment=$Environment `
            ProjectName=$ProjectName `
            DBUsername=$($paramHash['DBUsername']) `
            DBPassword=$($paramHash['DBPassword']) `
            DBName=$($paramHash['DBName']) `
            PrivateSubnet1=$PrivateSubnet1 `
            PrivateSubnet2=$PrivateSubnet2 `
            RDSSecurityGroupId=$RDSSG `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    # Get Database outputs
    $RDSEndpoint = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-database" --query "Stacks[0].Outputs[?OutputKey=='RDSEndpoint'].OutputValue" --output text --region $Region
    $RDSInstanceId = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-database" --query "Stacks[0].Outputs[?OutputKey=='RDSInstanceId'].OutputValue" --output text --region $Region

    # 4. Storage Stack
    Write-Host "`n[4/8] Deploying Storage Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/04-storage.yaml `
        --stack-name "$Environment-$ProjectName-storage" `
        --parameter-overrides Environment=$Environment ProjectName=$ProjectName `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    $ArtifactBucket = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-storage" --query "Stacks[0].Outputs[?OutputKey=='ArtifactBucketName'].OutputValue" --output text --region $Region

    # 5. Compute Stack
    Write-Host "`n[5/8] Deploying Compute Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/05-compute.yaml `
        --stack-name "$Environment-$ProjectName-compute" `
        --parameter-overrides `
            Environment=$Environment `
            ProjectName=$ProjectName `
            DBEndpoint=$RDSEndpoint `
            DBUsername=$($paramHash['DBUsername']) `
            DBPassword=$($paramHash['DBPassword']) `
            DBName=$($paramHash['DBName']) `
            LambdaSecurityGroupId=$LambdaSG `
            PrivateSubnet1=$PrivateSubnet1 `
            PrivateSubnet2=$PrivateSubnet2 `
            LambdaExecutionRoleArn=$LambdaRoleArn `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    $LambdaArn = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-compute" --query "Stacks[0].Outputs[?OutputKey=='LambdaFunctionArn'].OutputValue" --output text --region $Region
    $LambdaName = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-compute" --query "Stacks[0].Outputs[?OutputKey=='LambdaFunctionName'].OutputValue" --output text --region $Region

    # 6. API Stack
    Write-Host "`n[6/8] Deploying API Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/06-api.yaml `
        --stack-name "$Environment-$ProjectName-api" `
        --parameter-overrides `
            Environment=$Environment `
            ProjectName=$ProjectName `
            LambdaFunctionArn=$LambdaArn `
            LambdaFunctionName=$LambdaName `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    $ApiUrl = aws cloudformation describe-stacks --stack-name "$Environment-$ProjectName-api" --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" --output text --region $Region

    # 7. CI/CD Stack
    Write-Host "`n[7/8] Deploying CI/CD Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/07-cicd.yaml `
        --stack-name "$Environment-$ProjectName-cicd" `
        --parameter-overrides `
            Environment=$Environment `
            ProjectName=$ProjectName `
            GitHubOwner=$($paramHash['GitHubOwner']) `
            GitHubRepo=$($paramHash['GitHubRepo']) `
            GitHubBranch=$($paramHash['GitHubBranch']) `
            GitHubOAuthToken=$($paramHash['GitHubOAuthToken']) `
            ArtifactBucketName=$ArtifactBucket `
            LambdaFunctionName=$LambdaName `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    # 8. Monitoring Stack
    Write-Host "`n[8/8] Deploying Monitoring Stack..." -ForegroundColor Cyan
    aws cloudformation deploy `
        --template-file cloudformation/08-monitoring.yaml `
        --stack-name "$Environment-$ProjectName-monitoring" `
        --parameter-overrides `
            Environment=$Environment `
            ProjectName=$ProjectName `
            LambdaFunctionName=$LambdaName `
            RDSInstanceId=$RDSInstanceId `
        --capabilities CAPABILITY_NAMED_IAM `
        --region $Region

    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "DEPLOYMENT COMPLETED!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "API Gateway URL: $ApiUrl" -ForegroundColor Cyan
    Write-Host "RDS Endpoint: $RDSEndpoint" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Import your database schema to RDS" -ForegroundColor Yellow
    Write-Host "2. Push code to GitHub to trigger CI/CD pipeline" -ForegroundColor Yellow
    Write-Host "3. Update Frontend .env with API URL" -ForegroundColor Yellow
}

function Get-StackStatus {
    Write-Host "Stack Status:" -ForegroundColor Green
    $stacks = @(
        "$Environment-$ProjectName-networking",
        "$Environment-$ProjectName-security",
        "$Environment-$ProjectName-database",
        "$Environment-$ProjectName-storage",
        "$Environment-$ProjectName-compute",
        "$Environment-$ProjectName-api",
        "$Environment-$ProjectName-cicd",
        "$Environment-$ProjectName-monitoring"
    )
    
    foreach ($stack in $stacks) {
        $status = aws cloudformation describe-stacks --stack-name $stack --query "Stacks[0].StackStatus" --output text --region $Region 2>$null
        if ($status) {
            $color = if ($status -like "*COMPLETE*") { "Green" } elseif ($status -like "*PROGRESS*") { "Yellow" } else { "Red" }
            Write-Host "  $stack : $status" -ForegroundColor $color
        } else {
            Write-Host "  $stack : NOT FOUND" -ForegroundColor Gray
        }
    }
}

function Delete-AllStacks {
    Write-Host "WARNING: This will delete ALL stacks!" -ForegroundColor Red
    $confirm = Read-Host "Type 'DELETE' to confirm"
    
    if ($confirm -eq "DELETE") {
        $stacks = @(
            "$Environment-$ProjectName-monitoring",
            "$Environment-$ProjectName-cicd",
            "$Environment-$ProjectName-api",
            "$Environment-$ProjectName-compute",
            "$Environment-$ProjectName-storage",
            "$Environment-$ProjectName-database",
            "$Environment-$ProjectName-security",
            "$Environment-$ProjectName-networking"
        )
        
        foreach ($stack in $stacks) {
            Write-Host "Deleting $stack..." -ForegroundColor Yellow
            aws cloudformation delete-stack --stack-name $stack --region $Region
            aws cloudformation wait stack-delete-complete --stack-name $stack --region $Region 2>$null
        }
        
        Write-Host "All stacks deleted!" -ForegroundColor Green
    } else {
        Write-Host "Deletion cancelled." -ForegroundColor Yellow
    }
}

# Main execution
switch ($Action) {
    "upload" { Upload-Templates }
    "individual" { Deploy-IndividualStacks }
    "create" { Deploy-IndividualStacks }
    "status" { Get-StackStatus }
    "delete" { Delete-AllStacks }
    default { Write-Host "Unknown action: $Action" -ForegroundColor Red }
}

Write-Host "`nDone!" -ForegroundColor Green
