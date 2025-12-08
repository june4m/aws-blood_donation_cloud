CREATE DATABASE IF NOT EXISTS BloodDonationSupportSystem;
USE BloodDonationSupportSystem;

-- 1.BloodType
CREATE TABLE BloodType (
    BloodType_ID VARCHAR(20) NOT NULL,
    Blood_group VARCHAR(2),
    RHFactor CHAR(1)
);
ALTER TABLE BloodType ADD CONSTRAINT PK_BloodType_BloodTypeID PRIMARY KEY (BloodType_ID);

-- 2.Component 
CREATE TABLE Component (
    Component_ID VARCHAR(20) NOT NULL,
    Component_name VARCHAR(20),
    Code VARCHAR(20)
);
ALTER TABLE Component ADD CONSTRAINT PK_Component_ComponentID PRIMARY KEY (Component_ID);

-- 3.User: admin/member/staff
CREATE TABLE Users (
    User_ID VARCHAR(20) NOT NULL,
    User_Name VARCHAR(100)NOT NULL,
    YOB DATE,
    Address VARCHAR(100),
    Phone VARCHAR(15) ,
    Email VARCHAR(100) NOT NULL,
    Gender CHAR(1),
    Password VARCHAR(225),
    BloodType_ID VARCHAR(20),
    Status VARCHAR(20),
    History LONGTEXT,
    Notification VARCHAR(200),
    User_Role VARCHAR(20),
    Account_Status_ID VARCHAR(20),
    Admin_ID VARCHAR(20),
    Patient_ID VARCHAR(20),
    isDelete TINYINT(1) NOT NULL DEFAULT 1
);
ALTER TABLE Users ADD CONSTRAINT PK_User_UserID PRIMARY KEY (User_ID);
ALTER TABLE Users ADD CONSTRAINT FK_User_BloodTypeID FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID);
ALTER TABLE Users ADD CONSTRAINT FK_User_AdminID FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID);

-- 4.BloodCompatibility: Máu tương tích
CREATE TABLE BloodCompatibility (
    Compatibility_ID VARCHAR(20) NOT NULL,
    Donor_Blood_ID VARCHAR(20),
    Receiver_Blood_ID VARCHAR(20),
    Component_ID VARCHAR(20),
    Is_Compatible INT DEFAULT 1
);
ALTER TABLE BloodCompatibility ADD CONSTRAINT PK_BloodCompatibility_CompatibilityID PRIMARY KEY (Compatibility_ID);
ALTER TABLE BloodCompatibility ADD CONSTRAINT FK_BloodCompatibility_DonorBloodID FOREIGN KEY (Donor_Blood_ID) REFERENCES BloodType(BloodType_ID);
ALTER TABLE BloodCompatibility ADD CONSTRAINT FK_BloodCompatibility_ReceiverBloodID FOREIGN KEY (Receiver_Blood_ID) REFERENCES BloodType(BloodType_ID);
ALTER TABLE BloodCompatibility ADD CONSTRAINT FK_BloodCompatibility_ComponentID FOREIGN KEY (Component_ID) REFERENCES Component(Component_ID);

-- 5.BloodUnit: lô máu
CREATE TABLE BloodUnit (
    BloodUnit_ID VARCHAR(20) NOT NULL,
    BloodType_ID VARCHAR(20),
    Volumn INT,
    Collected_Date DATE,
    Expiration_Date DATE,
    Status VARCHAR(20)
);
ALTER TABLE BloodUnit ADD CONSTRAINT PK_BloodUnit_BloodUnit_ID PRIMARY KEY (BloodUnit_ID);
ALTER TABLE BloodUnit ADD CONSTRAINT FK_BloodUnit_BloodType_ID FOREIGN KEY (BloodType_ID) REFERENCES BloodType(BloodType_ID);
ALTER TABLE BloodUnit ADD CONSTRAINT CHK_Dates CHECK (Expiration_Date > Collected_Date); -- không đc quá hạn máu

-- 6.BloodBank: Ngân hành máu( hệ thống)
CREATE TABLE BloodBank (
    BloodBank_ID VARCHAR(20) NOT NULL,
    BloodUnit_ID VARCHAR(20),
    Volume INT,
    Storage_Date DATE,
    Status VARCHAR(20),
    Last_Update DATE
);
ALTER TABLE BloodBank ADD CONSTRAINT PK_BloodBank_BloodBankID PRIMARY KEY (BloodBank_ID);
ALTER TABLE BloodBank ADD CONSTRAINT FK_BloodBank_BloodUnitID FOREIGN KEY (BloodUnit_ID) REFERENCES BloodUnit(BloodUnit_ID);

-- 7.Patient_Detail: Hồ sơ bệnh án 
CREATE TABLE Patient_Detail (
    Patient_ID VARCHAR(20) NOT NULL,
    Description VARCHAR(200),
    Status VARCHAR(20),
    MedicalHistory DATE,
    Appointment_ID VARCHAR(20)
);
ALTER TABLE Patient_Detail ADD CONSTRAINT PK_PatientDetail_PatientID PRIMARY KEY (Patient_ID);
ALTER TABLE Users ADD CONSTRAINT UQ_Users_Patient_ID UNIQUE (Patient_ID);
ALTER TABLE Users ADD CONSTRAINT FK_Users_PatientDetail FOREIGN KEY (Patient_ID) REFERENCES Patient_Detail(Patient_ID);

-- 8.Slot: slot hiến máu trong ngày
CREATE TABLE Slot (
    Slot_ID VARCHAR(20) NOT NULL,
    Slot_Date DATE,
    Start_Time TIME,
	Volume int, -- số người có thể tới hiến
	Max_Volume int default 200,
    End_Time TIME,
    Status CHAR(1),
	Admin_ID VARCHAR(20) -- CÓ ROLE NAME LÀ ADMIN
);
ALTER TABLE Slot ADD CONSTRAINT PK_Slot_AppointmentListID PRIMARY KEY (Slot_ID);
ALTER TABLE Slot ADD CONSTRAINT FK_Slot_AdminID FOREIGN KEY (Admin_ID) REFERENCES Users(User_ID);
ALTER TABLE Slot ADD CONSTRAINT CHK_Volume CHECK (Volume <= Max_Volume);-- mặc định ban đầu của slot đó là 0
ALTER TABLE Slot MODIFY Volume INT DEFAULT 0;-- volume ko được vượt quá maxvolume
ALTER TABLE Slot ADD CONSTRAINT CHK_Status CHECK (Status IN ('F', 'A'));-- status chỉ nhận F và A

-- 9.AppointmentGiving: Lịch hẹn hiến máu
CREATE TABLE AppointmentGiving (
    Appointment_ID VARCHAR(20) NOT NULL,
    Slot_ID VARCHAR(20),
	User_ID VARCHAR(20), -- Có role name là member
	Volume INT,
    Status VARCHAR(20),
    Reason_Reject LONGTEXT
);
ALTER TABLE AppointmentGiving ADD CONSTRAINT PK_AppointmentGiving_AppointmentID PRIMARY KEY (Appointment_ID);
ALTER TABLE AppointmentGiving ADD CONSTRAINT FK_AppointmentGiving_SlotID FOREIGN KEY (Slot_ID) REFERENCES Slot(Slot_ID);
ALTER TABLE AppointmentGiving ADD CONSTRAINT FK_AppointmentGiving_UserID FOREIGN KEY (User_ID) REFERENCES Users(User_ID);
ALTER TABLE AppointmentGiving ADD CONSTRAINT UQ_User_Slot UNIQUE (User_ID, Slot_ID); -- 1 cuộc hẹn chỉ có 1 member
ALTER TABLE Patient_Detail ADD CONSTRAINT FK_AppointmentDetail_AppointmentGiving FOREIGN KEY (Appointment_ID) REFERENCES AppointmentGiving(Appointment_ID);
  
-- 10.Blog:
CREATE TABLE Blog(
	Blog_ID VARCHAR(20) NOT NULL,
	Title VARCHAR(200),
	Content LONGTEXT,
	Pubished_At DATE,
	Update_At DATE,
	User_ID VARCHAR(20) -- user có role là admin
);
ALTER TABLE Blog ADD CONSTRAINT PK_Blog_BlogID PRIMARY KEY (Blog_ID);
ALTER TABLE Blog ADD CONSTRAINT FK_Users_UserID FOREIGN KEY (User_ID) REFERENCES Users(User_ID);

-- 11.PotentialDonor: Những ứng viên tiềm năng
CREATE TABLE PotentialDonor (
    Potential_ID VARCHAR(20) NOT NULL,
    User_ID VARCHAR(20),
    Status VARCHAR(20),
    Note TEXT,
    Staff_ID VARCHAR(20)
);
ALTER TABLE PotentialDonor ADD CONSTRAINT PK_Potential PRIMARY KEY (Potential_ID);
ALTER TABLE PotentialDonor ADD CONSTRAINT FK_Potential_User FOREIGN KEY (User_ID) REFERENCES Users(User_ID);
ALTER TABLE PotentialDonor ADD CONSTRAINT FK_Potential_Staff FOREIGN KEY (Staff_ID) REFERENCES Users(User_ID);

-- 12.EmergencyRequest: Yêu cầu máu khẩn cấp
CREATE TABLE EmergencyRequest (
    Emergency_ID   VARCHAR(20) NOT NULL,
    Volume         INT,
    Priority       VARCHAR(20),
    Status         VARCHAR(20),
    Needed_Before  DATE,
    Created_At     DATE,
    Updated_At     DATE,
    Potential_ID   VARCHAR(20),
    Appointment_ID VARCHAR(20),
    Staff_ID       VARCHAR(20),   -- thay cho User_ID
    Requester_ID   VARCHAR(20),   -- người yêu cầu
    sourceType     VARCHAR(50),
    reason_Need    LONGTEXT,
    reason_Reject  LONGTEXT,
    Place          VARCHAR(50),
    isDeleted      TINYINT(1) NOT NULL DEFAULT 1
);
ALTER TABLE EmergencyRequest ADD CONSTRAINT PK_EmergencyRequest PRIMARY KEY (Emergency_ID);
ALTER TABLE EmergencyRequest ADD CONSTRAINT FK_Emergency_Potential FOREIGN KEY (Potential_ID) REFERENCES PotentialDonor(Potential_ID);
ALTER TABLE EmergencyRequest ADD CONSTRAINT FK_Emergency_Appointment FOREIGN KEY (Appointment_ID) REFERENCES AppointmentGiving(Appointment_ID);
ALTER TABLE EmergencyRequest ADD CONSTRAINT FK_Emergency_Staff FOREIGN KEY (Staff_ID) REFERENCES Users(User_ID);
ALTER TABLE EmergencyRequest ADD CONSTRAINT FK_Emergency_Requester FOREIGN KEY (Requester_ID) REFERENCES Users(User_ID);
ALTER TABLE EmergencyRequest ADD CONSTRAINT CHK_EmergencyDates CHECK (Needed_Before >= Created_At);

-- 13.SummaryBlood: Thống kê lượng máu
CREATE TABLE SummaryBlood (
    SummaryBlood_ID VARCHAR(20) NOT NULL,
    Title VARCHAR(200),
    Report_Date DATE,
    Description TEXT
);
ALTER TABLE SummaryBlood ADD CONSTRAINT PK_SummaryBlood_ID PRIMARY KEY (SummaryBlood_ID);

-- 14.SummaryBloodDetail: thống kê chi tiết lượng máu
CREATE TABLE SummaryBlood_Detail (
    Report_Detail_ID VARCHAR(20) NOT NULL,
    SummaryBlood_ID VARCHAR(20),
    User_ID VARCHAR(20),
    BloodUsed INT,
    BloodReceive INT,
    Emergency_ID VARCHAR(20),
    Potential_ID VARCHAR(20),
    Member_ID VARCHAR(20),
    BloodBank_ID VARCHAR(20)
);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT PK_SummaryBloodDetail_ReportDetailID PRIMARY KEY (Report_Detail_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_SummaryBlood FOREIGN KEY (SummaryBlood_ID) REFERENCES SummaryBlood(SummaryBlood_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_User FOREIGN KEY (User_ID) REFERENCES Users(User_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_Emergency FOREIGN KEY (Emergency_ID) REFERENCES EmergencyRequest(Emergency_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_Potential FOREIGN KEY (Potential_ID) REFERENCES PotentialDonor(Potential_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_UserMember FOREIGN KEY (Member_ID) REFERENCES Users(User_ID);
ALTER TABLE SummaryBlood_Detail ADD CONSTRAINT FK_SBD_BloodBank FOREIGN KEY (BloodBank_ID) REFERENCES BloodBank(BloodBank_ID);

-- Trigger xóa lịch sử cuộc hẹn
DELIMITER $$

CREATE TRIGGER DecreaseSlotVolume AFTER DELETE ON AppointmentGiving FOR EACH ROW
BEGIN
    DECLARE v_role_name VARCHAR(20);

    -- Lấy role của user vừa bị xóa cuộc hẹn
    SELECT User_Role INTO v_role_name
    FROM Users
    WHERE User_ID = OLD.User_ID;

    IF v_role_name = 'member' THEN
        -- Giảm Volume (không cho < 0)
        UPDATE Slot
        SET Volume = CASE 
                        WHEN Volume > 0 THEN Volume - 1
                        ELSE 0
                     END
        WHERE Slot_ID = OLD.Slot_ID;

        -- Cập nhật Status theo Volume mới
        UPDATE Slot
        SET Status = CASE 
                        WHEN Volume >= Max_Volume THEN 'F'
                        ELSE 'A'
                     END
        WHERE Slot_ID = OLD.Slot_ID;
    END IF;
END$$

-- Trigger: tăng volume của bảng slot khi insert apointment giving 
CREATE TRIGGER UpdateSlotVolume
AFTER INSERT ON AppointmentGiving
FOR EACH ROW
BEGIN
    DECLARE v_role_name VARCHAR(20);

    SELECT User_Role INTO v_role_name
    FROM Users
    WHERE User_ID = NEW.User_ID;

    IF v_role_name = 'member' THEN
        UPDATE Slot
        SET Volume = Volume + 1
        WHERE Slot_ID = NEW.Slot_ID;

        UPDATE Slot
        SET Status = CASE 
                        WHEN Volume >= Max_Volume THEN 'F'
                        ELSE 'A'
                     END
        WHERE Slot_ID = NEW.Slot_ID;
    END IF;
END$$

DELIMITER ;
