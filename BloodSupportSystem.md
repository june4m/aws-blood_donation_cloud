# **DaiVietBlood – Blood Donation Support System**

## **1\. Executive Summary**

**DaiVietBlood** là nền tảng công nghệ hỗ trợ hiến máu nhân đạo và quản lý ngân hàng máu, được thiết kế để giải quyết bài toán kết nối giữa người hiến, người nhận và cơ sở y tế. Hệ thống được chuyển đổi từ mô hình chạy cục bộ (Local) sang kiến trúc **AWS Cloud** hiện đại. Dự án sử dụng **Amazon RDS** để quản lý dữ liệu y tế phức tạp, kết hợp với sức mạnh tính toán **Serverless (AWS Lambda)**. Đặc biệt, quy trình phát triển và vận hành (DevOps) được tự động hóa hoàn toàn thông qua bộ công cụ **AWS CodePipeline, CodeBuild, CodeDeploy**, và toàn bộ hạ tầng được quản lý bằng mã (Infrastructure as Code) với **AWS CloudFormation**.

## **2\. Problem Statement**

### **What’s the Problem?**

Hệ thống hiện tại chạy trên máy chủ cục bộ gặp khó khăn trong việc mở rộng khi lượng truy cập tăng cao. Việc triển khai cập nhật phần mềm (Deployment) được thực hiện thủ công, dễ dẫn đến sai sót và thời gian ngừng hoạt động (Downtime). Ngoài ra, dữ liệu hiến máu và kho máu đòi hỏi tính toàn vẹn cao và có cấu trúc quan hệ chặt chẽ, điều mà các giải pháp lưu trữ đơn giản khó đáp ứng tốt.

### **The Solution**

DaiVietBlood chuyển đổi sang nền tảng đám mây AWS toàn diện.

* **Quản lý dữ liệu:** Sử dụng **Amazon RDS** để lưu trữ và truy vấn dữ liệu quan hệ (Người dùng, Lịch sử hiến, Kho máu) đảm bảo tính nhất quán.  
* **Tự động hóa hạ tầng:** Sử dụng **AWS CloudFormation** để khởi tạo và quản lý toàn bộ tài nguyên mạng và máy chủ, loại bỏ cấu hình thủ công.  
* **Quy trình CI/CD chuyên nghiệp:** Tích hợp chuỗi **AWS CodePipeline, CodeBuild, CodeDeploy** để tự động hóa việc kiểm thử và triển khai code từ Github lên môi trường Production.  
* **Vận hành:** Ứng dụng Frontend được host trên **AWS Amplify**, Backend chạy trên **AWS Lambda** và giao tiếp qua **Amazon API Gateway**.

### **Benefits and Return on Investment**

* **Đối với đội ngũ phát triển:** Giảm 90% thời gian triển khai nhờ CI/CD pipeline tự động. Hạ tầng đồng nhất giữa Dev và Prod nhờ CloudFormation.  
* **Đối với hệ thống:** Đảm bảo an toàn dữ liệu tuyệt đối với cơ sở dữ liệu quan hệ RDS. Khả năng giám sát lỗi tức thì qua CloudWatch.  
* **Đối với người dùng:** Trải nghiệm mượt mà, hệ thống luôn sẵn sàng 24/7 nhờ kiến trúc Serverless.

## **3\. Solution Architecture**

Nền tảng áp dụng kiến trúc **Serverless kết hợp Relational Database**. Dữ liệu được lưu trữ trong **Amazon RDS** nằm trong môi trường mạng bảo mật (VPC). Logic nghiệp vụ được xử lý bởi **AWS Lambda**. Quy trình phát triển được kiểm soát bởi hệ thống CI/CD của AWS.

### **AWS Services Used**

1. **AWS CloudFormation:** Dịch vụ Infrastructure as Code (IaC) để viết template định nghĩa toàn bộ hạ tầng (VPC, RDS, Lambda, Roles), giúp triển khai tự động và nhất quán.  
2. **Amazon Cognito:** Quản lý xác thực và phân quyền người dùng (User Pools cho Member/Staff/Admin).  
3. **AWS Amplify Hosting:** Lưu trữ và phân phối giao diện Web (Frontend ReactJS).  
4. **Amazon API Gateway:** Cổng giao tiếp RESTful API an toàn giữa Client và Backend.  
5. **AWS Lambda:** Thực thi logic nghiệp vụ (Backend) mà không cần quản lý máy chủ, kết nối tới RDS để truy xuất dữ liệu.  
6. **Amazon EventBridge:** Bộ định thời (Scheduler) để chạy các tác vụ nền như gửi email nhắc hẹn, kiểm tra máu hết hạn.  
7. **Amazon RDS (Relational Database Service):** Cơ sở dữ liệu quan hệ (MySQL/PostgreSQL) lưu trữ thông tin người dùng, kho máu, lịch hẹn với cấu trúc chặt chẽ.  
8. **Amazon S3:** Lưu trữ source code (artifacts) cho quá trình build và các file tĩnh (hình ảnh/tài liệu).  
9. **AWS CodePipeline:** Điều phối quy trình CI/CD tự động từ lúc commit code đến khi deploy.  
10. **AWS CodeBuild:** Biên dịch source code, chạy các bài test (Unit Test) tự động.  
11. **AWS CodeDeploy:** Tự động triển khai code mới vào AWS Lambda hoặc cập nhật hạ tầng.  
12. **Amazon CloudWatch:** Giám sát toàn diện log hệ thống, metrics (CPU, RAM RDS, Lambda errors) và cảnh báo.

### **Component Design**

* **Infrastructure Layer:** **AWS CloudFormation** khởi tạo VPC, Subnets, Security Groups và RDS Instance để tạo nền móng vững chắc.  
* **DevOps Layer:** Khi lập trình viên đẩy code lên Git, **AWS CodePipeline** kích hoạt **CodeBuild** để kiểm tra lỗi, sau đó **CodeDeploy** cập nhật hàm **Lambda** mới nhất.  
* **Data & Logic Layer:** **AWS Lambda** (nằm trong VPC) xử lý logic và truy vấn SQL xuống **Amazon RDS**.  
* **Frontend Layer:** **AWS Amplify** đảm nhận việc hosting và phân phối nội dung tĩnh tới người dùng.  
* **Management Layer:** **Amazon CloudWatch** thu thập mọi hoạt động để giám sát sức khỏe hệ thống.

## **4\. Technical Implementation**

### **Implementation Phases**

Dự án được chia thành 4 giai đoạn chính:

1. **Thiết kế & Hạ tầng (Tuần 1-2):**  
   * Thiết kế ERD cho Database.  
   * Viết template **CloudFormation** để dựng VPC, RDS và các IAM Roles.  
2.   
3. **Phát triển Backend & DevOps (Tuần 3-4):**  
   * Thiết lập **CodePipeline, CodeBuild, CodeDeploy**.  
   * Phát triển API trên **AWS Lambda** và kết nối **Amazon RDS**.  
4.   
5. **Phát triển Frontend & Tích hợp (Tuần 5):**  
   * Xây dựng giao diện trên **AWS Amplify**.  
   * Kết nối **Amazon Cognito** và **API Gateway**.  
6.   
7. **Tự động hóa & Monitor (Tuần 6):**  
   * Cấu hình **EventBridge** cho các tác vụ định kỳ.  
   * Thiết lập Dashboard trên **CloudWatch**.  
8. 

### **Yêu cầu kỹ thuật**

* **Infrastructure:** AWS CloudFormation (YAML/JSON).  
* **Frontend:** ReactJS / Next.js (AWS Amplify).  
* **Backend:** AWS Lambda (Node.js/Python) \+ Amazon API Gateway.  
* **Database:** Amazon RDS (MySQL hoặc PostgreSQL).  
* **CI/CD:** AWS CodePipeline, AWS CodeBuild, AWS CodeDeploy.  
* **Auth:** Amazon Cognito.  
* **Monitoring:** Amazon CloudWatch.

## **5\. Timeline & Milestones**

**Project Duration:** 3 months (Internship Period)

**Month 1 – Infrastructure & Database Setup:**

* Nghiên cứu AWS CloudFormation.  
* Xây dựng kiến trúc mạng (VPC) và khởi tạo Amazon RDS.  
* **Milestone 1:** Hạ tầng AWS sẵn sàng, Database kết nối thành công.

**Month 2 – Backend Development & CI/CD:**

* Thiết lập chuỗi CI/CD với CodePipeline.  
* Phát triển các API Core (Quản lý máu, Đặt lịch) trên Lambda.  
* **Milestone 2:** Quy trình Deploy tự động hoàn tất, API hoạt động ổn định.

**Month 3 – Integration & Optimization:**

* Phát triển Frontend và tích hợp hệ thống.  
* Cấu hình EventBridge và CloudWatch Alarms.  
* **Milestone 3:** Hệ thống hoàn chỉnh, UAT và bàn giao.

## **6\. Budget Estimation**

**AWS Services:**

* **AWS CloudFormation:** Miễn phí.  
* **AWS Amplify Hosting:** Free Tier (1000 build minutes/tháng).  
* **AWS Lambda:** Free Tier (400,000 GB-seconds/tháng).  
* **Amazon API Gateway:** Free Tier (1 triệu requests/tháng).  
* **Amazon RDS:** Free Tier (750 giờ/tháng cho db.t3.micro, 20GB Storage). *Lưu ý: Sau Free Tier khoảng $15-20/tháng.*  
* **AWS CodePipeline:** $1.00/tháng cho mỗi active pipeline (Miễn phí 1 pipeline trong Free Tier).  
* **AWS CodeBuild:** Free Tier (100 build minutes/tháng).  
* **AWS CodeDeploy:** Miễn phí khi deploy vào Lambda.  
* **Amazon S3:** Free Tier (5GB storage).  
* **Amazon CloudWatch:** Free Tier (Basic metrics & 5GB logs).

**Tổng chi phí ước tính:**

* **Giai đoạn phát triển (3 tháng đầu):** \~$0.00 \- $2.00/tháng (Chủ yếu chi phí phát sinh nếu vượt quá giới hạn build time hoặc lưu trữ).  
* **Sau Free Tier:** Dự kiến $20 \- $30/tháng (Chi phí chính nằm ở RDS và NAT Gateway nếu cấu hình VPC bảo mật cao).

## **7\. Risk Assessment**

### **Risk Matrix**

* **Lỗi triển khai tự động:** Ảnh hưởng Cao, Xác suất Trung bình (do cấu hình sai buildspec).  
* **Quá tải kết nối RDS:** Ảnh hưởng Cao, Xác suất Thấp (do Lambda mở nhiều kết nối).  
* **Vượt ngân sách:** Ảnh hưởng Trung bình, Xác suất Thấp.

### **Mitigation Strategies**

* **DevOps:** Cấu hình **CodeDeploy** ở chế độ Canary hoặc Linear để deploy từ từ, dễ dàng Rollback nếu có lỗi.  
* **Database:** Sử dụng RDS Proxy (tùy chọn) hoặc quản lý connection pool tốt trong code Lambda.  
* **Cost:** Thiết lập AWS Budget Alerts để cảnh báo chi phí.

### **Contingency Plans**

* Luôn giữ lại bản Artifacts cũ trong **Amazon S3** để có thể redeploy thủ công phiên bản ổn định gần nhất nếu Pipeline gặp sự cố.

## **8\. Expected Outcomes**

### **Cải tiến kỹ thuật**

Dự án thể hiện sự chuyên nghiệp trong quy trình phát triển phần mềm (SDLC) bằng việc áp dụng **CI/CD (CodePipeline)** và **Infrastructure as Code (CloudFormation)**. Việc sử dụng **RDS** đảm bảo hệ thống có khả năng quản lý dữ liệu phức tạp và tin cậy cao hơn so với giải pháp NoSQL đơn thuần.

### **Giá trị dài hạn**

DaiVietBlood không chỉ là một sản phẩm phần mềm mà là một hình mẫu về kiến trúc Cloud hiện đại. Bộ source code CloudFormation và cấu hình Pipeline có thể tái sử dụng để triển khai nhanh chóng cho bất kỳ tổ chức y tế nào, giúp tiết kiệm hàng trăm giờ thiết lập hạ tầng thủ công.

