# DaiVietBlood - Hệ thống Hỗ trợ Hiến máu

## 📋 Giới thiệu

DaiVietBlood là hệ thống quản lý hiến máu toàn diện, hỗ trợ kết nối người hiến máu với các cơ sở y tế, quản lý kho máu và xử lý các yêu cầu máu khẩn cấp.

## 🏗️Architecture


<img width="1121" height="581" alt="_support blood donation drawio" src="https://github.com/user-attachments/assets/062a99d5-d1de-4805-8e9d-9cfbf65d79c6" />

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Hosting**: AWS Amplify

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MySQL 8.0 (Amazon RDS)
- **Storage**: Amazon S3
- **Deployment**: AWS Lambda + API Gateway

### Infrastructure (AWS)
- **Compute**: Lambda
- **API**: API Gateway (HTTP API)
- **Database**: RDS MySQL
- **Storage**: S3
- **Frontend Hosting**: Amplify
- **CI/CD**: CodePipeline + CodeBuild
- **Monitoring**: CloudWatch

## 📁 Cấu trúc thư mục

```
aws-blood_donation_cloud/
├── BloodDonationSystem/              # Frontend (React)
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   ├── pages/                    # Page components
│   │   │   ├── Admin/                # Admin pages
│   │   │   ├── auth/                 # Authentication pages
│   │   │   └── home/                 # Public pages
│   │   ├── hooks/                    # Custom hooks (useApi)
│   │   └── App.jsx                   # Main app component
│   ├── .env                          # Environment variables
│   └── package.json
│
├── BloodDonationSupportSystemBE/     # Backend (Express + Lambda)
│   ├── src/
│   │   ├── controller/               # Request handlers
│   │   ├── services/                 # Business logic
│   │   ├── repository/               # Database queries
│   │   ├── routers/                  # API routes
│   │   ├── midleware/                # Auth middleware
│   │   ├── models/                   # Data models
│   │   ├── utils/                    # Utilities (JWT, Response)
│   │   ├── index.ts                  # Local dev entry
│   │   └── lambda.ts                 # Lambda entry
│   ├── infrastructure/
│   │   └── cloudformation/           # AWS CloudFormation templates
│   ├── buildspec.yml                 # CodeBuild config
│   ├── .env                          # Environment variables
│   └── package.json
│
├── BloodDonationSupportSystem_MySQL.sql  # Database schema
└── README.md
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Node.js 18+
- npm hoặc yarn
- MySQL 8.0 (local) hoặc AWS RDS
- AWS CLI (đã cấu hình credentials)

### 1. Clone repository

```bash
git clone https://github.com/june4m/aws-blood_donation_cloud.git
cd aws-blood_donation_cloud
```

### 2. Cài đặt Backend

```bash
cd BloodDonationSupportSystemBE
npm install
```

Tạo file `.env`:

```env
# Database
DB_SERVER=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=BloodDonationSupportSystem

# JWT
JWT_SECRET=your_jwt_secret
JWT_SECRET_ACCESS_TOKEN=your_access_token_secret
ACCESS_TOKEN_EXPIRE_IN=15m

# Email (Gmail)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# AWS S3 (optional for local)
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

Khởi tạo database:

```bash
mysql -u root -p < ../BloodDonationSupportSystem_MySQL.sql
mysql -u root -p BloodDonationSupportSystem < ../initData.sql
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### 3. Cài đặt Frontend

```bash
cd ../BloodDonationSystem
npm install
```

Tạo file `.env`:

```env
# Local development
VITE_API_URL=http://localhost:3000

# Production
# VITE_API_URL=https://your-api-gateway-url.execute-api.ap-southeast-1.amazonaws.com/dev
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 👥 Vai trò người dùng

| Vai trò | Quyền hạn |
|---------|-----------|
| **Guest** | Xem tin tức, đăng ký tài khoản |
| **Member** | Đặt lịch hiến máu, xem lịch sử, yêu cầu máu khẩn cấp |
| **Staff** | Quản lý lịch hẹn, tạo báo cáo, quản lý kho máu |
| **Admin** | Quản lý người dùng, tạo ca hiến máu, quản lý tin tức |

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `POST /api/register` - Đăng ký
- `POST /api/logout` - Đăng xuất

### Users
- `GET /api/profile/:userId` - Lấy thông tin user
- `PUT /api/updateProfile/:userId` - Cập nhật profile

### Appointments
- `GET /api/slots` - Lấy danh sách ca hiến máu
- `POST /api/appointment` - Đặt lịch hiến máu
- `GET /api/appointments/:userId` - Lịch sử đặt lịch

### Blood Bank
- `GET /api/getBloodBank` - Lấy thông tin kho máu
- `PUT /api/updateBloodUnit/:id` - Cập nhật đơn vị máu

### Blog
- `GET /api/blogs` - Lấy danh sách bài viết
- `GET /api/blogs/:blogId` - Chi tiết bài viết
- `POST /api/blogs/create` - Tạo bài viết (Admin)
- `PUT /api/blogs/:blogId` - Sửa bài viết (Admin)
- `DELETE /api/blogs/:blogId` - Xóa bài viết (Admin)

### Emergency
- `POST /api/emergency-request` - Tạo yêu cầu máu khẩn cấp
- `GET /api/emergency-requests` - Danh sách yêu cầu khẩn cấp

## 🚢 Deployment

### Backend (Lambda)

Pipeline tự động deploy khi push code lên `main` branch:

1. CodePipeline detect changes
2. CodeBuild build TypeScript → JavaScript
3. Đóng gói `dist/` + `node_modules/`
4. Upload lên Lambda

Manual deploy:

```bash
cd BloodDonationSupportSystemBE
npm run build
# Zip dist/ folder và upload lên Lambda
```

### Frontend (Amplify)

Amplify tự động build và deploy khi push code lên `main` branch.

## 📊 Monitoring

- **CloudWatch Logs**: `/aws/lambda/dev-daivietblood-backend`
- **API Gateway Metrics**: Request count, latency, errors
- **RDS Metrics**: Connections, CPU, storage

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- CORS configuration
- Environment variables cho sensitive data
- VPC cho RDS (private subnet)

## 📝 License

MIT License
