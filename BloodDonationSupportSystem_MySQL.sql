-- =============================================
-- Blood Donation Support System - MySQL Version
-- Converted from SQL Server
-- =============================================

DROP DATABASE IF EXISTS BloodDonationSupportSystem;
CREATE DATABASE BloodDonationSupportSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE BloodDonationSupportSystem;

-- =============================================
-- 1. BloodType (không có FK, tạo trước)
-- =============================================
CREATE TABLE BloodType (
    BloodType_ID VARCHAR(20) NOT NULL,
    Blood_group VARCHAR(2) NULL,
    RHFactor CHAR(1) NULL,
    PRIMARY KEY (BloodType_ID)
) ENGINE=InnoDB;

-- =============================================
-- 2. Component (không có FK, tạo trước)
-- =============================================
CREATE TABLE Component (
    Component_ID VARCHAR(20) NOT NULL,
    Component_name VARCHAR(20) NULL,
    Code VARCHAR(20) NULL,
    PRIMARY KEY (Component_ID)
) ENGINE=InnoDB;

-- =============================================
-- 3. Users (tự tham chiếu Admin_ID, Patient_ID sẽ thêm FK sau)
-- =============================================
CREATE TABLE Users (
    User_ID VARCHAR(20) NOT NULL,
    User_Name VARCHAR(100) NOT NULL,
    YOB DATE NULL,
    Address VARCHAR(100) NULL,
    Phone VARCHAR(15) NULL,
    Email VARCHAR(100) NOT NULL,
    Gender CHAR(1) NULL,
    Password VARCHAR(225) NULL,
    BloodType_ID VARCHAR(20) NULL,
    Status VARCHAR(20) NULL,
    History TEXT NULL,
    Notification VARCHAR(200) NULL,
    User_Role VARCHAR(20) NULL,
    Account_Status_ID VARCHAR(20) NULL,
    Admin_ID VARCHAR(20) NULL,
    Donation_Count INT NOT NULL DEFAULT 0,
    isDelete TINYINT(1) NOT NULL DEFAULT 1,
    Patient_ID VARCHAR(20) NULL,
    PRIMARY KEY (User_ID),
    CONSTRAINT FK_User_BloodTypeID FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID),
    CONSTRAINT FK_User_AdminID FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;


-- =============================================
-- 4. Slot
-- =============================================
CREATE TABLE Slot (
    Slot_ID VARCHAR(20) NOT NULL,
    Slot_Date DATE NULL,
    Start_Time TIME NULL,
    Volume INT NULL DEFAULT 0,
    Max_Volume INT NULL DEFAULT 200,
    End_Time TIME NULL,
    Status CHAR(1) NULL,
    Admin_ID VARCHAR(20) NULL,
    PRIMARY KEY (Slot_ID),
    CONSTRAINT FK_Slot_AdminID FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID),
    CONSTRAINT CHK_Status CHECK (Status IN ('A', 'F')),
    CONSTRAINT CHK_Volume CHECK (Volume <= Max_Volume)
) ENGINE=InnoDB;

-- =============================================
-- 5. AppointmentGiving
-- =============================================
CREATE TABLE AppointmentGiving (
    Appointment_ID VARCHAR(20) NOT NULL,
    Slot_ID VARCHAR(20) NULL,
    User_ID VARCHAR(20) NULL,
    Volume INT NULL,
    Status VARCHAR(20) NULL,
    Reason_Reject TEXT NULL,
    PRIMARY KEY (Appointment_ID),
    UNIQUE KEY UQ_User_Slot (User_ID, Slot_ID),
    CONSTRAINT FK_AppointmentGiving_SlotID FOREIGN KEY (Slot_ID) REFERENCES Slot(Slot_ID),
    CONSTRAINT FK_AppointmentGiving_UserID FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

-- =============================================
-- 6. Patient_Detail
-- =============================================
CREATE TABLE Patient_Detail (
    Patient_ID VARCHAR(20) NOT NULL,
    Description VARCHAR(200) NULL,
    Status VARCHAR(20) NULL,
    MedicalHistory DATE NULL,
    Appointment_ID VARCHAR(20) NULL,
    PRIMARY KEY (Patient_ID),
    CONSTRAINT FK_AppointmentDetail_AppointmentGiving FOREIGN KEY (Appointment_ID) REFERENCES AppointmentGiving(Appointment_ID)
) ENGINE=InnoDB;

-- Thêm FK cho Users.Patient_ID
ALTER TABLE Users ADD CONSTRAINT FK_Users_PatientDetail FOREIGN KEY (Patient_ID) REFERENCES Patient_Detail(Patient_ID);

-- =============================================
-- 7. Blog
-- =============================================
CREATE TABLE Blog (
    Blog_ID VARCHAR(20) NOT NULL,
    Title VARCHAR(200) NULL,
    Content TEXT NULL,
    Pubished_At DATE NULL,
    Update_At DATE NULL,
    Admin_ID VARCHAR(20) NULL,
    Image_url TEXT NULL,
    PRIMARY KEY (Blog_ID),
    CONSTRAINT FK_Blog_AdminID FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

-- =============================================
-- 8. BloodBank (cấu trúc mới - theo BloodType_ID)
-- =============================================
CREATE TABLE BloodBank (
    BloodType_ID VARCHAR(20) NOT NULL,
    Volume INT NULL,
    Last_Update DATE NULL,
    PRIMARY KEY (BloodType_ID),
    CONSTRAINT FK_BloodBank_BloodType FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID)
) ENGINE=InnoDB;

-- =============================================
-- 9. BloodCompatibility
-- =============================================
CREATE TABLE BloodCompatibility (
    Compatibility_ID VARCHAR(20) NOT NULL,
    Donor_Blood_ID VARCHAR(20) NULL,
    Receiver_Blood_ID VARCHAR(20) NULL,
    Component_ID VARCHAR(20) NULL,
    Is_Compatible INT NULL DEFAULT 1,
    PRIMARY KEY (Compatibility_ID),
    CONSTRAINT FK_BloodCompatibility_ComponentID FOREIGN KEY (Component_ID) REFERENCES Component(Component_ID),
    CONSTRAINT FK_BloodCompatibility_DonorBloodID FOREIGN KEY (Donor_Blood_ID) REFERENCES BloodType(BloodType_ID),
    CONSTRAINT FK_BloodCompatibility_ReceiverBloodID FOREIGN KEY (Receiver_Blood_ID) REFERENCES BloodType(BloodType_ID)
) ENGINE=InnoDB;

-- =============================================
-- 10. BloodUnit
-- =============================================
CREATE TABLE BloodUnit (
    BloodUnit_ID VARCHAR(20) NOT NULL,
    BloodType_ID VARCHAR(20) NULL,
    Volumn INT NULL,
    Collected_Date DATE NULL,
    Expiration_Date DATE NULL,
    Status VARCHAR(20) NULL,
    Staff_ID VARCHAR(20) NULL,
    PRIMARY KEY (BloodUnit_ID),
    CONSTRAINT FK_BloodUnit_BloodType_ID FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID),
    CONSTRAINT CHK_Dates CHECK (Expiration_Date > Collected_Date)
) ENGINE=InnoDB;


-- =============================================
-- 11. PotentialDonor
-- =============================================
CREATE TABLE PotentialDonor (
    Potential_ID VARCHAR(20) NOT NULL,
    User_ID VARCHAR(20) NULL,
    Status VARCHAR(20) NULL,
    Note TEXT NULL,
    Admin_ID VARCHAR(20) NULL,
    PRIMARY KEY (Potential_ID),
    CONSTRAINT FK_Potential_Staff FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID),
    CONSTRAINT FK_Potential_User FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

-- =============================================
-- 12. EmergencyRequest
-- =============================================
CREATE TABLE EmergencyRequest (
    Emergency_ID VARCHAR(20) NOT NULL,
    Volume INT NULL,
    Priority VARCHAR(20) NULL,
    Status VARCHAR(20) NULL,
    Needed_Before DATE NULL,
    Created_At DATE NULL,
    Updated_At DATE NULL,
    Potential_ID VARCHAR(20) NULL,
    Appointment_ID VARCHAR(20) NULL,
    Staff_ID VARCHAR(20) NULL,
    BloodType_ID VARCHAR(20) NULL,
    Requester_ID VARCHAR(20) NOT NULL,
    reason_Need TEXT NULL,
    sourceType VARCHAR(50) NULL,
    Place VARCHAR(50) NULL,
    isDeleted TINYINT(1) NOT NULL DEFAULT 1,
    reason_Reject TEXT NULL,
    PRIMARY KEY (Emergency_ID),
    CONSTRAINT FK_BloodTypeID FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID),
    CONSTRAINT FK_Emergency_Appointment FOREIGN KEY (Appointment_ID) REFERENCES AppointmentGiving(Appointment_ID),
    CONSTRAINT FK_Emergency_Potential FOREIGN KEY (Potential_ID) REFERENCES PotentialDonor(Potential_ID),
    CONSTRAINT FK_Emergency_User FOREIGN KEY (Staff_ID) REFERENCES Users(User_ID),
    CONSTRAINT FK_EmergencyRequest_RequesterID FOREIGN KEY (Requester_ID) REFERENCES Users(User_ID),
    CONSTRAINT CHK_EmergencyDates CHECK (Needed_Before >= Created_At)
) ENGINE=InnoDB;

-- =============================================
-- 13. SummaryBlood
-- =============================================
CREATE TABLE SummaryBlood (
    SummaryBlood_ID VARCHAR(20) NOT NULL,
    Title VARCHAR(200) NULL,
    Report_Date DATE NULL,
    Description TEXT NULL,
    Staff_ID VARCHAR(20) NULL,
    Status VARCHAR(20) NULL DEFAULT 'Submitted',
    PRIMARY KEY (SummaryBlood_ID),
    CONSTRAINT FK_SummaryBlood_Users FOREIGN KEY (Staff_ID) REFERENCES Users(User_ID)
) ENGINE=InnoDB;

-- =============================================
-- 14. SummaryBlood_Detail
-- =============================================
CREATE TABLE SummaryBlood_Detail (
    Report_Detail_ID VARCHAR(20) NOT NULL,
    VolumeIn INT NULL,
    VolumeOut INT NULL,
    Note TEXT NULL,
    SummaryBlood_ID VARCHAR(20) NULL,
    PRIMARY KEY (Report_Detail_ID),
    CONSTRAINT FK_SBD_SummaryBlood FOREIGN KEY (SummaryBlood_ID) REFERENCES SummaryBlood(SummaryBlood_ID)
) ENGINE=InnoDB;

-- =============================================
-- Lưu ý các thay đổi từ SQL Server sang MySQL:
-- =============================================
-- 1. [dbo]. prefix được bỏ
-- 2. NVARCHAR -> VARCHAR (MySQL dùng utf8mb4 nên VARCHAR đã hỗ trợ Unicode)
-- 3. NVARCHAR(MAX) -> TEXT
-- 4. BIT -> TINYINT(1)
-- 5. TIME(7) -> TIME
-- 6. GO statements được bỏ
-- 7. SET ANSI_NULLS, SET QUOTED_IDENTIFIER được bỏ
-- 8. WITH (PAD_INDEX...) được bỏ
-- 9. ON [PRIMARY] TEXTIMAGE_ON [PRIMARY] được bỏ
-- 10. ENGINE=InnoDB được thêm cho hỗ trợ FK và transactions
-- 11. CHARACTER SET utf8mb4 để hỗ trợ tiếng Việt
