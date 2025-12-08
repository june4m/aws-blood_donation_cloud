-- Blood Type
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT001', 'A',  '+');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT002', 'A',  '-');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT003', 'B',  '+');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT004', 'B',  '-');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT005', 'AB', '+');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT006', 'AB', '-');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT007', 'O',  '+');
INSERT INTO BloodType (BloodType_ID, Blood_group, RHFactor) VALUES ('BT008', 'O',  '-');

-- Component: 
INSERT INTO Component (Component_ID, Component_name, Code) VALUES ('CP001', 'Hồng cầu',   'RBC'); -- Red Blood CeelAppointment_ID
INSERT INTO Component (Component_ID, Component_name, Code) VALUES ('CP002', 'Huyết tương','FFP'); -- Fresh Frozen Plasma
INSERT INTO Component (Component_ID, Component_name, Code) VALUES ('CP003', 'Tiểu cầu',   'PLT'); -- Platelets
INSERT INTO Component (Component_ID, Component_name, Code) VALUES ('CP004', 'Toàn phần',  'WB');  -- Whole Blood

-- BloodCompatibility: 
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI001', 'CP001', 'BT008', 'BT008', 1); -- RCB O- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI002', 'CP001', 'BT008', 'BT007', 1); -- RCB O- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI003', 'CP001', 'BT008', 'BT002', 1); -- RCB O- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI004', 'CP001', 'BT008', 'BT001', 1); -- RCB O- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI005', 'CP001', 'BT008', 'BT004', 1); -- RCB O- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI006', 'CP001', 'BT008', 'BT003', 1); -- RCB O- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI007', 'CP001', 'BT008', 'BT006', 1); -- RCB O- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI008', 'CP001', 'BT008', 'BT005', 1); -- RCB O- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI009', 'CP001', 'BT007', 'BT008', 0); -- RCB O+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI010', 'CP001', 'BT007', 'BT007', 1); -- RCB O+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI011', 'CP001', 'BT007', 'BT002', 0); -- RCB O+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI012', 'CP001', 'BT007', 'BT001', 1); -- RCB O+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI013', 'CP001', 'BT007', 'BT004', 0); -- RCB O+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI014', 'CP001', 'BT007', 'BT003', 1); -- RCB O+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI015', 'CP001', 'BT007', 'BT006', 0); -- RCB O+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI016', 'CP001', 'BT007', 'BT005', 1); -- RCB O+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI017', 'CP001', 'BT002', 'BT008', 0); -- RCB A- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI018', 'CP001', 'BT002', 'BT007', 0); -- RCB A- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI019', 'CP001', 'BT002', 'BT002', 1); -- RCB A- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI020', 'CP001', 'BT002', 'BT001', 1); -- RCB A- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI021', 'CP001', 'BT002', 'BT004', 0); -- RCB A- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI022', 'CP001', 'BT002', 'BT003', 0); -- RCB A- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI023', 'CP001', 'BT002', 'BT006', 1); -- RCB A- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI024', 'CP001', 'BT002', 'BT005', 1); -- RCB A- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI025', 'CP001', 'BT001', 'BT008', 0); -- RCB A+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI026', 'CP001', 'BT001', 'BT007', 0); -- RCB A+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI027', 'CP001', 'BT001', 'BT002', 0); -- RCB A+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI028', 'CP001', 'BT001', 'BT001', 1); -- RCB A+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI029', 'CP001', 'BT001', 'BT004', 0); -- RCB A+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI030', 'CP001', 'BT001', 'BT003', 0); -- RCB A+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI031', 'CP001', 'BT001', 'BT006', 0); -- RCB A+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI032', 'CP001', 'BT001', 'BT005', 1); -- RCB A+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI033', 'CP001', 'BT004', 'BT008', 0); -- RCB B- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI034', 'CP001', 'BT004', 'BT007', 0); -- RCB B- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI035', 'CP001', 'BT004', 'BT002', 0); -- RCB B- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI036', 'CP001', 'BT004', 'BT001', 0); -- RCB B- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI037', 'CP001', 'BT004', 'BT004', 1); -- RCB B- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI038', 'CP001', 'BT004', 'BT003', 1); -- RCB B- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI039', 'CP001', 'BT004', 'BT006', 1); -- RCB B- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI040', 'CP001', 'BT004', 'BT005', 1); -- RCB B- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI041', 'CP001', 'BT003', 'BT008', 0); -- RCB B+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI042', 'CP001', 'BT003', 'BT007', 0); -- RCB B+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI043', 'CP001', 'BT003', 'BT002', 0); -- RCB B+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI044', 'CP001', 'BT003', 'BT001', 0); -- RCB B+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI045', 'CP001', 'BT003', 'BT004', 0); -- RCB B+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI046', 'CP001', 'BT003', 'BT003', 1); -- RCB B+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI047', 'CP001', 'BT003', 'BT006', 0); -- RCB B+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI048', 'CP001', 'BT003', 'BT005', 1); -- RCB B+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI049', 'CP001', 'BT006', 'BT008', 0); -- RCB AB- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI050', 'CP001', 'BT006', 'BT007', 0); -- RCB AB- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI051', 'CP001', 'BT006', 'BT002', 0); -- RCB AB- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI052', 'CP001', 'BT006', 'BT001', 0); -- RCB AB- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI053', 'CP001', 'BT006', 'BT004', 0); -- RCB AB- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI054', 'CP001', 'BT006', 'BT003', 0); -- RCB AB- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI055', 'CP001', 'BT006', 'BT006', 1); -- RCB AB- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI056', 'CP001', 'BT006', 'BT005', 1); -- RCB AB- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI057', 'CP001', 'BT005', 'BT008', 0); -- RCB AB+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI058', 'CP001', 'BT005', 'BT007', 0); -- RCB AB+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI059', 'CP001', 'BT005', 'BT002', 0); -- RCB AB+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI060', 'CP001', 'BT005', 'BT001', 0); -- RCB AB+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI061', 'CP001', 'BT005', 'BT004', 0); -- RCB AB+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI062', 'CP001', 'BT005', 'BT003', 0); -- RCB AB+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI063', 'CP001', 'BT005', 'BT006', 0); -- RCB AB+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI064', 'CP001', 'BT005', 'BT005', 1); -- RCB AB+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI065', 'CP002', 'BT008', 'BT008', 1); -- FFP O- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI066', 'CP002', 'BT008', 'BT007', 0); -- FFP O- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI067', 'CP002', 'BT008', 'BT002', 0); -- FFP O- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI068', 'CP002', 'BT008', 'BT001', 0); -- FFP O- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI069', 'CP002', 'BT008', 'BT004', 0); -- FFP O- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI070', 'CP002', 'BT008', 'BT003', 0); -- FFP O- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI071', 'CP002', 'BT008', 'BT006', 0); -- FFP O- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI072', 'CP002', 'BT008', 'BT005', 0); -- FFP O- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI073', 'CP002', 'BT008', 'BT008', 1); -- FFP O+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI074', 'CP002', 'BT007', 'BT007', 1); -- FFP O+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI075', 'CP002', 'BT007', 'BT002', 0); -- FFP O+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI076', 'CP002', 'BT007', 'BT001', 0); -- FFP O+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI077', 'CP002', 'BT007', 'BT004', 0); -- FFP O+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI078', 'CP002', 'BT007', 'BT003', 0); -- FFP O+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI079', 'CP002', 'BT007', 'BT006', 0); -- FFP O+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI080', 'CP002', 'BT007', 'BT005', 0); -- FFP O+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI081', 'CP002', 'BT008', 'BT008', 1); -- FFP A- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI082', 'CP002', 'BT008', 'BT007', 0); -- FFP A- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI083', 'CP002', 'BT008', 'BT002', 1); -- FFP A- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI084', 'CP002', 'BT008', 'BT001', 0); -- FFP A- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI085', 'CP002', 'BT008', 'BT004', 0); -- FFP A- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI086', 'CP002', 'BT008', 'BT003', 0); -- FFP A- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI087', 'CP002', 'BT008', 'BT006', 0); -- FFP A- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI088', 'CP002', 'BT008', 'BT005', 0); -- FFP A- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI089', 'CP002', 'BT007', 'BT008', 1); -- FFP A+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI090', 'CP002', 'BT007', 'BT007', 1); -- FFP A+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI091', 'CP002', 'BT007', 'BT002', 1); -- FFP A+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI092', 'CP002', 'BT007', 'BT001', 1); -- FFP A+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI093', 'CP002', 'BT007', 'BT004', 0); -- FFP A+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI094', 'CP002', 'BT007', 'BT003', 0); -- FFP A+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI095', 'CP002', 'BT007', 'BT006', 0); -- FFP A+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI096', 'CP002', 'BT007', 'BT005', 0); -- FFP A+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI097', 'CP002', 'BT004', 'BT008', 1); -- FFP B- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI098', 'CP002', 'BT004', 'BT007', 0); -- FFP B- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI099', 'CP002', 'BT004', 'BT002', 0); -- FFP B- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI100', 'CP002', 'BT004', 'BT001', 0); -- FFP B- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI101', 'CP002', 'BT004', 'BT004', 1); -- FFP B- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI102', 'CP002', 'BT004', 'BT003', 0); -- FFP B- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI103', 'CP002', 'BT004', 'BT006', 0); -- FFP B- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI104', 'CP002', 'BT004', 'BT005', 0); -- FFP B- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI105', 'CP002', 'BT003', 'BT008', 1); -- FFP B+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI106', 'CP002', 'BT003', 'BT007', 1); -- FFP B+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI107', 'CP002', 'BT003', 'BT002', 0); -- FFP B+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI108', 'CP002', 'BT003', 'BT001', 0); -- FFP B+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI109', 'CP002', 'BT003', 'BT004', 1); -- FFP B+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI110', 'CP002', 'BT003', 'BT003', 1); -- FFP B+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI111', 'CP002', 'BT003', 'BT006', 0); -- FFP B+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI112', 'CP002', 'BT003', 'BT005', 0); -- FFP B+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI113', 'CP002', 'BT006', 'BT008', 1); -- FFP AB- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI114', 'CP002', 'BT006', 'BT007', 1); -- FFP AB- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI115', 'CP002', 'BT006', 'BT002', 1); -- FFP AB- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI116', 'CP002', 'BT006', 'BT001', 1); -- FFP AB- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI117', 'CP002', 'BT006', 'BT004', 1); -- FFP AB- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI118', 'CP002', 'BT006', 'BT003', 1); -- FFP AB- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI119', 'CP002', 'BT006', 'BT006', 1); -- FFP AB- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI120', 'CP002', 'BT006', 'BT005', 0); -- FFP AB- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI121', 'CP002', 'BT005', 'BT008', 1); -- FFP AB+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI122', 'CP002', 'BT005', 'BT007', 1); -- FFP AB+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI123', 'CP002', 'BT005', 'BT002', 1); -- FFP AB+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI124', 'CP002', 'BT005', 'BT001', 1); -- FFP AB+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI125', 'CP002', 'BT005', 'BT004', 1); -- FFP AB+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI126', 'CP002', 'BT005', 'BT003', 1); -- FFP AB+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI127', 'CP002', 'BT005', 'BT006', 1); -- FFP AB+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI128', 'CP002', 'BT005', 'BT005', 1); -- FFP AB+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI129', 'CP003', 'BT008', 'BT008', 1); -- PLT O- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI130', 'CP003', 'BT008', 'BT007', 1); -- PLT O- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI131', 'CP003', 'BT008', 'BT002', 1); -- PLT O- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI132', 'CP003', 'BT008', 'BT001', 1); -- PLT O- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI133', 'CP003', 'BT008', 'BT004', 1); -- PLT O- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI134', 'CP003', 'BT008', 'BT003', 1); -- PLT O- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI135', 'CP003', 'BT008', 'BT006', 1); -- PLT O- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI136', 'CP003', 'BT008', 'BT005', 1); -- PLT O- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI137', 'CP003', 'BT007', 'BT008', 0); -- PLT O+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI138', 'CP003', 'BT007', 'BT007', 1); -- PLT O+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI139', 'CP003', 'BT007', 'BT002', 0); -- PLT O+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI140', 'CP003', 'BT007', 'BT001', 1); -- PLT O+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI141', 'CP003', 'BT007', 'BT004', 0); -- PLT O+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI142', 'CP003', 'BT007', 'BT003', 1); -- PLT O+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI143', 'CP003', 'BT007', 'BT006', 0); -- PLT O+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI144', 'CP003', 'BT007', 'BT005', 1); -- PLT O+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI145', 'CP003', 'BT002', 'BT008', 0); -- PLT A- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI146', 'CP003', 'BT002', 'BT007', 0); -- PLT A- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI147', 'CP003', 'BT002', 'BT002', 1); -- PLT A- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI148', 'CP003', 'BT002', 'BT001', 1); -- PLT A- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI149', 'CP003', 'BT002', 'BT004', 0); -- PLT A- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI150', 'CP003', 'BT002', 'BT003', 0); -- PLT A- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI151', 'CP003', 'BT002', 'BT006', 1); -- PLT A- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI152', 'CP003', 'BT002', 'BT005', 1); -- PLT A- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI153', 'CP003', 'BT001', 'BT008', 0); -- PLT A+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI154', 'CP003', 'BT001', 'BT007', 0); -- PLT A+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI155', 'CP003', 'BT001', 'BT002', 0); -- PLT A+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI156', 'CP003', 'BT001', 'BT001', 1); -- PLT A+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI157', 'CP003', 'BT001', 'BT004', 0); -- PLT A+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI158', 'CP003', 'BT001', 'BT003', 0); -- PLT A+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI159', 'CP003', 'BT001', 'BT006', 0); -- PLT A+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI160', 'CP003', 'BT001', 'BT005', 1); -- PLT A+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI161', 'CP003', 'BT004', 'BT008', 0); -- PLT B- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI162', 'CP003', 'BT004', 'BT007', 0); -- PLT B- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI163', 'CP003', 'BT004', 'BT002', 0); -- PLT B- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI164', 'CP003', 'BT004', 'BT001', 0); -- PLT B- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI165', 'CP003', 'BT004', 'BT004', 1); -- PLT B+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI166', 'CP003', 'BT004', 'BT003', 1); -- PLT B+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI167', 'CP003', 'BT004', 'BT006', 1); -- PLT B+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI168', 'CP003', 'BT004', 'BT005', 1); -- PLT B+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI169', 'CP003', 'BT003', 'BT008', 0); -- PLT B+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI170', 'CP003', 'BT003', 'BT007', 0); -- PLT B+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI171', 'CP003', 'BT003', 'BT002', 0); -- PLT B+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI172', 'CP003', 'BT003', 'BT001', 0); -- PLT B+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI173', 'CP003', 'BT003', 'BT004', 0); -- PLT B+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI174', 'CP003', 'BT003', 'BT003', 1); -- PLT B+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI175', 'CP003', 'BT003', 'BT006', 0); -- PLT B+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI176', 'CP003', 'BT003', 'BT005', 1); -- PLT B+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI177', 'CP003', 'BT006', 'BT008', 0); -- PLT AB- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI178', 'CP003', 'BT006', 'BT007', 0); -- PLT AB- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI179', 'CP003', 'BT006', 'BT002', 0); -- PLT AB- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI180', 'CP003', 'BT006', 'BT001', 0); -- PLT AB- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI181', 'CP003', 'BT006', 'BT004', 0); -- PLT AB- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI182', 'CP003', 'BT006', 'BT003', 0); -- PLT AB- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI183', 'CP003', 'BT006', 'BT006', 1); -- PLT AB- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI184', 'CP003', 'BT006', 'BT005', 1); -- PLT AB- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI185', 'CP003', 'BT005', 'BT008', 0); -- PLT AB+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI186', 'CP003', 'BT005', 'BT007', 0); -- PLT AB+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI187', 'CP003', 'BT005', 'BT002', 0); -- PLT AB+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI188', 'CP003', 'BT005', 'BT001', 0); -- PLT AB+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI189', 'CP003', 'BT005', 'BT004', 0); -- PLT AB+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI190', 'CP003', 'BT005', 'BT003', 0); -- PLT AB+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI191', 'CP003', 'BT005', 'BT006', 0); -- PLT AB+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI192', 'CP003', 'BT005', 'BT005', 1); -- PLT AB+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI193', 'CP004', 'BT008', 'BT008', 1); -- WB O- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI194', 'CP004', 'BT008', 'BT007', 1); -- WB O- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI195', 'CP004', 'BT008', 'BT002', 1); -- WB O- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI196', 'CP004', 'BT008', 'BT001', 1); -- WB O- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI197', 'CP004', 'BT008', 'BT004', 1); -- WB O- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI198', 'CP004', 'BT008', 'BT003', 1); -- WB O- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI199', 'CP004', 'BT008', 'BT006', 1); -- WB O- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI200', 'CP004', 'BT008', 'BT005', 1); -- WB O- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI201', 'CP004', 'BT007', 'BT008', 0); -- WB O+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI202', 'CP004', 'BT007', 'BT007', 1); -- WB O+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI203', 'CP004', 'BT007', 'BT002', 0); -- WB O+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI204', 'CP004', 'BT007', 'BT001', 1); -- WB O+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI205', 'CP004', 'BT007', 'BT004', 0); -- WB O+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI206', 'CP004', 'BT007', 'BT003', 1); -- WB O+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI207', 'CP004', 'BT007', 'BT006', 0); -- WB O+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI208', 'CP004', 'BT007', 'BT005', 1); -- WB O+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI209', 'CP004', 'BT002', 'BT008', 0); -- WB A- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI210', 'CP004', 'BT002', 'BT007', 0); -- WB A- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI211', 'CP004', 'BT002', 'BT002', 1); -- WB A- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI212', 'CP004', 'BT002', 'BT001', 1); -- WB A- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI213', 'CP004', 'BT002', 'BT004', 0); -- WB A- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI214', 'CP004', 'BT002', 'BT003', 0); -- WB A- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI215', 'CP004', 'BT002', 'BT006', 1); -- WB A- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI216', 'CP004', 'BT002', 'BT005', 1); -- WB A- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI217', 'CP004', 'BT001', 'BT008', 0); -- WB A+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI218', 'CP004', 'BT001', 'BT007', 0); -- WB A+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI219', 'CP004', 'BT001', 'BT002', 0); -- WB A+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI220', 'CP004', 'BT001', 'BT001', 1); -- WB A+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI221', 'CP004', 'BT001', 'BT004', 0); -- WB A+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI222', 'CP004', 'BT001', 'BT003', 0); -- WB A+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI223', 'CP004', 'BT001', 'BT006', 0); -- WB A+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI224', 'CP004', 'BT001', 'BT005', 1); -- WB A+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI225', 'CP004', 'BT004', 'BT008', 0); -- WB B- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI226', 'CP004', 'BT004', 'BT007', 0); -- WB B- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI227', 'CP004', 'BT004', 'BT002', 0); -- WB B- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI228', 'CP004', 'BT004', 'BT001', 0); -- WB B- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI229', 'CP004', 'BT004', 'BT004', 1); -- WB B- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI230', 'CP004', 'BT004', 'BT003', 1); -- WB B- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI231', 'CP004', 'BT004', 'BT006', 1); -- WB B- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI232', 'CP004', 'BT004', 'BT005', 1); -- WB B- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI233', 'CP004', 'BT003', 'BT008', 0); -- WB B+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI234', 'CP004', 'BT003', 'BT007', 0); -- WB B+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI235', 'CP004', 'BT003', 'BT002', 0); -- WB B+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI236', 'CP004', 'BT003', 'BT001', 0); -- WB B+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI237', 'CP004', 'BT003', 'BT004', 0); -- WB B+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI238', 'CP004', 'BT003', 'BT003', 1); -- WB B+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI239', 'CP004', 'BT003', 'BT006', 0); -- WB B+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI240', 'CP004', 'BT003', 'BT005', 1); -- WB B+ sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI241', 'CP004', 'BT006', 'BT008', 0); -- WB AB- sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI242', 'CP004', 'BT006', 'BT007', 0); -- WB AB- sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI243', 'CP004', 'BT006', 'BT002', 0); -- WB AB- sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI244', 'CP004', 'BT006', 'BT001', 0); -- WB AB- sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI245', 'CP004', 'BT006', 'BT004', 0); -- WB AB- sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI246', 'CP004', 'BT006', 'BT003', 0); -- WB AB- sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI247', 'CP004', 'BT006', 'BT006', 1); -- WB AB- sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI248', 'CP004', 'BT006', 'BT005', 1); -- WB AB- sang AB+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI249', 'CP004', 'BT005', 'BT008', 0); -- WB AB+ sang O-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI250', 'CP004', 'BT005', 'BT007', 0); -- WB AB+ sang O+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI251', 'CP004', 'BT005', 'BT002', 0); -- WB AB+ sang A-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI252', 'CP004', 'BT005', 'BT001', 0); -- WB AB+ sang A+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI253', 'CP004', 'BT005', 'BT004', 0); -- WB AB+ sang B-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI254', 'CP004', 'BT005', 'BT003', 0); -- WB AB+ sang B+
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI255', 'CP004', 'BT005', 'BT006', 0); -- WB AB+ sang AB-
INSERT INTO BloodCompatibility (Compatibility_ID, Component_ID, Donor_Blood_ID, Receiver_Blood_ID, Is_Compatible) VALUES ('CI256', 'CP004', 'BT005', 'BT005', 1); -- WB AB+ sang AB+

-- BloodUnit:
INSERT INTO BloodUnit (BloodUnit_ID, BloodType_ID, Volumn, Collected_Date, Expiration_Date, Status) VALUES ('BU001', 'BT001', 450, '2025-05-20', '2025-07-15', 'Available');
INSERT INTO BloodUnit (BloodUnit_ID, BloodType_ID, Volumn, Collected_Date, Expiration_Date, Status) VALUES ('BU002', 'BT004', 350, '2025-05-10', '2025-07-05', 'Used');
INSERT INTO BloodUnit (BloodUnit_ID, BloodType_ID, Volumn, Collected_Date, Expiration_Date, Status) VALUES ('BU003', 'BT007', 500, '2025-04-25', '2025-06-20', 'Expired');

-- BloodBank
INSERT INTO BloodBank (BloodBank_ID, BloodUnit_ID, Volume, Storage_Date, Status, Last_Update) VALUES ('BB001', 'BU001', 450, '2025-05-21', 'Stored', '2025-05-21');
INSERT INTO BloodBank (BloodBank_ID, BloodUnit_ID, Volume, Storage_Date, Status, Last_Update) VALUES ('BB002', 'BU002', 350, '2025-05-11', 'Used', '2025-05-15');
INSERT INTO BloodBank (BloodBank_ID, BloodUnit_ID, Volume, Storage_Date, Status, Last_Update) VALUES ('BB003', 'BU003', 500, '2025-04-26', 'Expired', '2025-06-01');

-- Users
-- Admin
INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U001', 'Lê Hoàng Anh', '2003-03-02', 'Đà Lạt', '0348663805', 'anhlh@gmail.com', 'M', 'adminpass', NULL, 'Active', NULL, NULL, 'admin', NULL);

-- Staff
INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U002', 'Đoàn Công Minh', '2004-06-04', 'TP.HCM', '0912345678', 'minhdc@gmail.com', 'M', 'staffpass', NULL, 'Active', NULL, NULL, 'staff', 'U001');

-- Member 1
INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U003', 'Nguyễn Quốc Đoàn', '2004-08-05', 'TP.HCM', '0923456789', 'doannq@gmail.com', 'M', 'memberpass1', 'BT001', 'Active', NULL, NULL, 'member', 'U001');

-- Member 2
INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U004', 'Phạm Thị D', '1998-12-10', 'TP.HCM', '0934567890', 'dpt@gmail.com', 'F', 'memberpass2', 'BT008', 'Active', NULL, NULL, 'member', 'U001');

-- Member 3
INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U005', 'Lê Văn E', '2001-09-10', 'TP.HCM', '0936667890', 'elv@gmail.com', 'M', 'memberpass3', 'BT007', 'Active', NULL, NULL, 'member', 'U001');

INSERT INTO Users (User_ID, User_Name, YOB, Address, Phone, Email, Gender, Password, BloodType_ID, Status, History, Notification, User_Role, Admin_ID)
VALUES ('U006', 'Nguyễn Hi Hi', '2001-09-10', 'TP.HCM', '0936667432', 'abc@gmail.com', 'M', 'memberpass4', 'BT007', 'Active', NULL, NULL, 'member', 'U001');

-- PatientDetail
INSERT INTO Patient_Detail (Patient_ID, Description, Status, MedicalHistory) VALUES ('P001', 'Tiểu đường tuýp 2', 'Under Treatment', '2024-06-15');
INSERT INTO Patient_Detail (Patient_ID, Description, Status, MedicalHistory) VALUES ('P002', 'Thiếu máu nhẹ', 'Stable', '2024-01-01');
INSERT INTO Patient_Detail (Patient_ID, Description, Status, MedicalHistory) VALUES ('P003', 'Rối loạn đông máu (Hemophilia)', 'Under Observation', '2024-10-20');

-- Slot
INSERT INTO Slot (Slot_ID, Slot_Date, Start_Time, Volume, Max_Volume, End_Time, Status, Admin_ID)
VALUES 
('S001', '2025-06-10', '08:00:00', 0, 200, '10:00:00', 'A', 'U001'),
('S002', '2025-06-10', '13:00:00', 0, 200, '15:00:00', 'A', 'U001');

-- Appointment (A: active C: cancel)
INSERT INTO AppointmentGiving (Appointment_ID, Slot_ID, User_ID, Status)
VALUES 
('AP001', 'S001', 'U003', 'A'), -- U003: Member 
('AP002', 'S002', 'U004', 'A'), -- U004: Member
('AP003', 'S001', 'U005', 'C'), -- U005: Member
('AP004', 'S002', 'U006', 'A'); -- U006: Member

-- Blog
INSERT INTO Blog (Blog_ID, Title, Content, Pubished_At, Update_At, User_ID)
VALUES ('BL001', 'Ngày hội hiến máu toàn quốc','Sự kiện thu hút hàng ngàn người tham gia...', '2025-05-20', '2025-05-25', 'U001');
INSERT INTO Blog (Blog_ID, Title, Content, Pubished_At, Update_At, User_ID)
VALUES ('BL002','Tôi đã cứu người nhờ hiến máu','Câu chuyện xúc động của một người hiến máu...', '2025-06-01', '2025-06-01', 'U002');
INSERT INTO Blog (Blog_ID, Title, Content, Pubished_At, Update_At, User_ID)
VALUES ('BL003','Tìm hiểu về nhóm máu hiếm','Nhóm máu hiếm rất quan trọng trong y học...', '2025-06-04', '2025-06-05', 'U002');

-- PotentialDonor
INSERT INTO PotentialDonor (Potential_ID, User_ID, Status, Note,  Staff_ID)
VALUES ('PD001', 'U003','Pending','Thể trạng ổn định, cần kiểm tra thêm.', 'U002');
INSERT INTO PotentialDonor (Potential_ID, User_ID, Status, Note,  Staff_ID)
VALUES ('PD002', 'U004','Approved','Phù hợp để mời hiến máu lần tới.', 'U002');
INSERT INTO PotentialDonor (Potential_ID, User_ID, Status, Note,  Staff_ID)
VALUES ('PD003', 'U005','Rejected','Mắc bệnh mãn tính, không thể hiến.', 'U002');

-- EmergencyRequest
INSERT INTO EmergencyRequest (Emergency_ID, Volume, Priority, Status, Needed_Before, Created_At, Updated_At,Potential_ID, Appointment_ID,Staff_ID, Requester_ID,sourceType, reason_Need, reason_Reject, Place, isDeleted)
VALUES 
('ER001', 500, 'High', 'Pending',  '2025-06-10', '2025-06-05', '2025-06-05', 'PD001', 'AP001', 'U002',  NULL, 'Hospital', 'Cần bổ sung máu nhóm O cho ca phẫu thuật khẩn',  NULL, 'TP.HCM', 1),
('ER002', 300, 'Medium', 'Completed', '2025-06-08', '2025-06-04', '2025-06-08', 'PD002', 'AP002', 'U002', NULL, 'Hospital', 'Hỗ trợ thêm máu cho bệnh nhân nội trú', NULL, 'TP.HCM', 1),
('ER003', 450, 'High', 'Pending',  '2025-06-12', '2025-06-05', '2025-06-05', 'PD003', 'AP003', 'U002', NULL, 'Hospital', 'Yêu cầu bổ sung máu nhóm O cho cấp cứu', NULL, 'TP.HCM', 1);
-- SummaryBlood
INSERT INTO SummaryBlood (SummaryBlood_ID, Title, Report_Date, Description)
VALUES ('SB001','May Report', '2025-05-31','Tổng hợp lượng máu nhận và sử dụng trong tháng 5.');
INSERT INTO SummaryBlood (SummaryBlood_ID, Title, Report_Date, Description)
VALUES ('SB002','Report week 1 of June', '2025-06-07','Lượng máu tăng nhẹ so với tuần trước.');
INSERT INTO SummaryBlood (SummaryBlood_ID, Title, Report_Date, Description)
VALUES ('SB003','Emergency situation', '2025-06-05','Cần thêm máu nhóm O tại TP HCM.');

-- SummaryBlood_Detail
INSERT INTO SummaryBlood_Detail (Report_Detail_ID, SummaryBlood_ID, User_ID, BloodUsed, BloodReceive, Emergency_ID, Potential_ID, Member_ID, BloodBank_ID)
VALUES ('SBD001', 'SB001', 'U002', 300, 500, 'ER001', 'PD001', 'U003', 'BB001');
INSERT INTO SummaryBlood_Detail (Report_Detail_ID, SummaryBlood_ID, User_ID, BloodUsed, BloodReceive, Emergency_ID, Potential_ID, Member_ID, BloodBank_ID)
VALUES ('SBD002', 'SB002', 'U002', 200, 300, 'ER002', 'PD002', 'U004', 'BB002');
INSERT INTO SummaryBlood_Detail (Report_Detail_ID, SummaryBlood_ID, User_ID, BloodUsed, BloodReceive, Emergency_ID, Potential_ID, Member_ID, BloodBank_ID)
VALUES ('SBD003', 'SB003', 'U002', 250, 450, 'ER003', 'PD003', 'U005', 'BB003');
