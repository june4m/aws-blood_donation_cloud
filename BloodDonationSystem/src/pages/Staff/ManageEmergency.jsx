import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const REJECT_REASONS = [
  "Không liên lạc được",
  "Không tìm được người hiến",
  "Không còn máu phù hợp để trao",
  "Lý do cần máu của bạn không phù hợp",
  "Không tìm được người hiến tiềm năng phù hợp",
  "Thông tin không rõ ràng hoặc sai lệch",
  "Khác",
];
const PRIORITY_OPTIONS = [
  { value: "High", label: "Cao" },
  { value: "Medium", label: "Trung bình" },
  { value: "Low", label: "Thấp" },
];
const SOURCE_OPTIONS = [
  { value: "donor", label: "Người hiến" },
  { value: "bank", label: "Ngân hàng máu" },
];

export default function ManageEmergencyPage() {
  const {
    loading,
    getEmergencyRequestList,
    getProfileER,
    getPotentialDonorPlus,
    sendEmergencyEmail,
    addDonorToEmergency,
    handleEmergencyRequest,
    rejectEmergencyRequest,
    getBloodBank,
  } = useApi();

  const [filter, setFilter] = useState({
    bloodGroup: "",
    rhNeeded: "",
    status: "PENDING",
  });
  const [requests, setRequests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // State cho popup thông tin người yêu cầu
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // State cho popup danh sách ưu tiên
  const [potentialList, setPotentialList] = useState([]);
  const [showPotentialPopup, setShowPotentialPopup] = useState(false);
  const [checkedDonors, setCheckedDonors] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentEmergencyId, setCurrentEmergencyId] = useState(null);

  // State cho popup từ chối
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOtherMsg, setRejectOtherMsg] = useState("");
  const [rejectRow, setRejectRow] = useState(null);

  // State tạm cho từng dòng
  const [editRows, setEditRows] = useState({});

  // State lý do cần máu của yêu cầu đang xem
  const [currentReason, setCurrentReason] = useState("");

  // State phân biệt profile người yêu cầu/người hiến
  const [profileType, setProfileType] = useState("profile");

  // State popup ngân hàng máu
  const [showBloodBank, setShowBloodBank] = useState(false);
  const [bloodBankList, setBloodBankList] = useState([]);
  const [loadingBloodBank, setLoadingBloodBank] = useState(false);

  // State thống kê tổng lưu lượng máu
  const [statDate, setStatDate] = useState("");
  const [statBloodType, setStatBloodType] = useState("");
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getEmergencyRequestList();
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch emergency requests", err);
        toast.error(
          err?.message || err?.response?.data?.message || "Có lỗi xảy ra!"
        );
      }
    })();
  }, [filter, refreshKey]);

  // Tính tổng lưu lượng máu đã sử dụng
  useEffect(() => {
    if (!statDate) {
      setTotalVolume(0);
      return;
    }
    const total = requests
      .filter(
        (item) =>
          item.Status === "Completed" &&
          item.Needed_Before &&
          item.Volume &&
          item.Place === "center" &&
          item.Needed_Before.slice(0, 10) === statDate &&
          (!statBloodType || item.BloodType === statBloodType)
      )
      .reduce((sum, item) => sum + Number(item.Volume || 0), 0);
    setTotalVolume(total);
  }, [statDate, statBloodType, requests]);

  // Sửa lại handleStatusChange
  const handleStatusChange = async (id, nextStatus) => {
    if (nextStatus === "Rejected") {
      setRejectRow(id);
      setShowRejectPopup(true);
      return;
    }
    setRefreshKey((k) => k + 1);
  };

  // Hàm xác nhận từ chối
  const handleConfirmReject = async () => {
    let reason = rejectReason === "Khác" ? rejectOtherMsg : rejectReason;
    if (!reason) {
      toast.warn("Vui lòng chọn hoặc nhập lý do từ chối!");
      return;
    }
    try {
      await rejectEmergencyRequest(rejectRow, reason);
      toast.success("Đã cập nhật trạng thái từ chối!");
      setShowRejectPopup(false);
      setRejectReason("");
      setRejectOtherMsg("");
      setRejectRow(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err?.message ||
          err?.response?.data?.message ||
          "Cập nhật trạng thái từ chối thất bại!"
      );
    }
  };

  const handleViewRequester = async (req) => {
    try {
      const res = await getProfileER(req.Requester_ID);
      setSelectedProfile(res.data[0] || null);
      setCurrentReason(req.reason_Need ?? "");
      setProfileType("requester");
    } catch (err) {
      setSelectedProfile({ error: "Không lấy được thông tin người yêu cầu" });
      setCurrentReason("");
      setProfileType("requester");
      toast.error(
        err?.message || err?.response?.data?.message || "Có lỗi xảy ra!"
      );
    }
  };

  const handleViewDonor = async (req) => {
    try {
      const res = await getProfileER(req.Donor_ID);
      setSelectedProfile(res.data[0] || null);
      setCurrentReason("");
      setProfileType("profile");
    } catch (err) {
      setSelectedProfile({ error: "Không lấy được thông tin người hiến" });
      setCurrentReason("");
      setProfileType("profile");
      toast.error(
        err?.message || err?.response?.data?.message || "Có lỗi xảy ra!"
      );
    }
  };

  // Hàm lấy danh sách potential donor
  const handleShowPotentialList = async (emergencyId) => {
    setCurrentEmergencyId(emergencyId);
    try {
      const res = await getPotentialDonorPlus(emergencyId);
      setPotentialList(res.data || []);
      setShowPotentialPopup(true);
      setCheckedDonors([]);
    } catch (err) {
      setPotentialList([]);
      setShowPotentialPopup(true);
      toast.error(
        err?.message || err?.response?.data?.message || "Có lỗi xảy ra!"
      );
    }
  };

  // Hàm xử lý check
  const handleCheckDonor = (donorId) => {
    setCheckedDonors((prev) =>
      prev.includes(donorId)
        ? prev.filter((id) => id !== donorId)
        : [...prev, donorId]
    );
  };

  // Hàm xử lý nút Add
  const handleAddDonor = async (emergencyId, potentialId) => {
    try {
      await addDonorToEmergency(emergencyId, potentialId);
      toast.success("Đã thêm vào yêu cầu!", {
        position: "top-center",
        autoClose: 2000,
      });
      setShowPotentialPopup(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(
        err?.message ||
          err?.response?.data?.message ||
          "Thêm vào yêu cầu thất bại!",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  // Hàm gửi email
  const handleSendEmail = async () => {
    if (sendingEmail) return;
    if (checkedDonors.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một người để gửi email!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setSendingEmail(true);
    let hasError = false;
    for (const donorId of checkedDonors) {
      const donor = potentialList.find((d) => d.userId === donorId);
      if (donor) {
        try {
          await sendEmergencyEmail(donor.email, donor.userName);
        } catch (err) {
          hasError = true;
          toast.error(
            err?.message ||
              err?.response?.data?.message ||
              `Gửi email thất bại cho ${donor.userName}`,
            { position: "top-center", autoClose: 2000 }
          );
        }
      }
    }
    if (!hasError) {
      toast.success("Đã gửi email cho các người được chọn!", {
        position: "top-center",
        autoClose: 2000,
      });
      setShowPotentialPopup(false);
    }
    setSendingEmail(false);
  };

  // Tạo key duy nhất cho mỗi dòng
  const getRowKey = (req) => `${req.Emergency_ID}_${req.Potential_ID ?? ""}`;

  // Sửa lại hàm thay đổi editRows
  const handleEditRowChange = (rowKey, field, value) => {
    setEditRows((prev) => ({
      ...prev,
      [rowKey]: {
        ...(prev[rowKey] || {}),
        [field]: value,
      },
    }));
  };

  // Hàm xử lý xem ngân hàng máu
  const handleShowBloodBank = async () => {
    setLoadingBloodBank(true);
    setShowBloodBank(true);
    try {
      const res = await getBloodBank();
      setBloodBankList(res.data || []);
    } catch (err) {
      setBloodBankList([]);
      toast.error(
        err?.message ||
          err?.response?.data?.message ||
          "Không lấy được dữ liệu ngân hàng máu!"
      );
    } finally {
      setLoadingBloodBank(false);
    }
  };

  useEffect(() => {
    // Tự động chọn "Trung tâm" nếu nguồn là ngân hàng máu
    requests.forEach((req) => {
      const rowKey = getRowKey(req);
      const edit = editRows[rowKey] || {};
      const tempSource = edit.sourceType ?? req.sourceType ?? "";
      const tempPlace = edit.Place ?? req.Place ?? "";
      if (tempSource === "bank" && tempPlace !== "center") {
        handleEditRowChange(rowKey, "Place", "center");
      }
    });
    // eslint-disable-next-line
  }, [editRows, requests]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-6">
        Quản lý yêu cầu máu khẩn cấp
      </h1>

      {/* Thống kê tổng lưu lượng máu + nút xem ngân hàng máu */}
      <div className="flex flex-row items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-4">
          <input
            type="date"
            className="border rounded px-3 py-2 w-[150px]"
            value={statDate}
            onChange={(e) => setStatDate(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 w-[185px]"
            value={statBloodType}
            onChange={(e) => setStatBloodType(e.target.value)}
          >
            <option value="">Tất cả nhóm máu</option>
            {BLOOD_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="text-lg font-semibold text-red-700">
            Tổng lưu lượng máu đã dùng:{" "}
            <span className="text-blue-700">{totalVolume}</span> ml
          </div>
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded shadow hover:from-pink-600 hover:to-red-700 transition"
          onClick={handleShowBloodBank}
          style={{ minWidth: 180 }}
        >
          <i className="fa fa-tint mr-2" />
          Xem ngân hàng máu
        </button>
      </div>

      {/* REQUEST TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Nhóm máu cần</th>
              <th className="px-4 py-3">Lượng máu cần (ml)</th>
              <th className="px-4 py-3">Cần khi nào</th>
              <th className="px-4 py-3">Độ ưu tiên</th>
              <th className="px-4 py-3">Nguồn cung cấp</th>
              <th className="px-4 py-3">Người ưu tiên</th>
              <th className="px-4 py-3">Địa điểm hiến máu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-6 text-gray-500">
                  {loading
                    ? "Đang tải dữ liệu..."
                    : "Không có yêu cầu phù hợp."}
                </td>
              </tr>
            )}
            {requests
              .filter((req) => req.Status !== "Rejected")
              .map((req, idx) => {
                const rowKey = getRowKey(req);
                const edit = editRows[rowKey] || {};
                const tempPriority = edit.Priority ?? req.Priority ?? "";
                const tempSource = edit.sourceType ?? req.sourceType ?? "";
                const tempPlace = edit.Place ?? req.Place ?? "";
                const tempStatus = edit.Status ?? req.Status ?? "";

                return (
                  <motion.tr
                    key={rowKey}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 flex items-center justify-between gap-2">
                      {req.User_Name}
                      <button
                        className="ml-auto text-blue-600 hover:text-blue-800"
                        title="Xem thông tin người yêu cầu"
                        onClick={() => handleViewRequester(req)}
                      >
                        <i className="fa fa-eye" />
                      </button>
                    </td>
                    <td className="px-4 py-3">{req.BloodType}</td>
                    <td className="px-4 py-3">{req.Volume}</td>
                    <td className="px-4 py-3">
                      {req.Needed_Before
                        ? new Date(req.Needed_Before).toLocaleDateString(
                            "vi-VN"
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={tempPriority}
                        onChange={(e) =>
                          handleEditRowChange(
                            rowKey,
                            "Priority",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                        disabled={req.Status === "Completed"}
                      >
                        <option value="">Chọn độ ưu tiên</option>
                        {PRIORITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={tempSource}
                        onChange={(e) =>
                          handleEditRowChange(
                            rowKey,
                            "sourceType",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                        disabled={req.Status === "Completed"}
                      >
                        <option value="">Chọn nguồn</option>
                        {SOURCE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {req.Donor_ID ? (
                        <button
                          className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs"
                          onClick={() => handleViewDonor(req)}
                        >
                          Xem hồ sơ
                        </button>
                      ) : (
                        tempSource !== "bank" && (
                          <button
                            className="px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white text-xs"
                            onClick={() =>
                              handleShowPotentialList(req.Emergency_ID)
                            }
                          >
                            Danh sách ưu tiên
                          </button>
                        )
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={tempPlace}
                        onChange={(e) =>
                          handleEditRowChange(rowKey, "Place", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                        disabled={req.Status === "Completed" || tempSource === "bank"}
                      >
                        <option value="">Chọn địa điểm</option>
                        <option value="recive house">Nhà nhận máu</option>
                        <option value="donor house">Nhà hiến máu</option>
                        <option value="center">Trung tâm</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={tempStatus}
                        onChange={(e) => {
                          handleEditRowChange(rowKey, "Status", e.target.value);
                          if (e.target.value === "Rejected") {
                            handleStatusChange(req.Emergency_ID, "Rejected");
                          }
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                        disabled={req.Status === "Completed"}
                      >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Processing">Đang xử lý</option>
                        <option value="Completed">Đã giải quyết</option>
                        <option value="Rejected">Từ chối</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {req.Status !== "Completed" && (
                        <button
                          onClick={async () => {
                            const edit = editRows[rowKey] || {};
                            const tempSource =
                              edit.sourceType ?? req.sourceType ?? "";
                            if (tempSource === "donor" && !req.Donor_ID) {
                              toast.warn(
                                "Vui lòng chọn Người hiến trước khi cập nhật!",
                                {
                                  position: "top-center",
                                  autoClose: 2000,
                                }
                              );
                              return;
                            }
                            const payload = {
                              Priority: edit.Priority ?? req.Priority,
                              sourceType: tempSource,
                              Place: edit.Place ?? req.Place,
                              Status: edit.Status ?? req.Status,
                            };
                            if (tempSource === "bank") {
                              payload.Place = null;
                            }
                            try {
                              await handleEmergencyRequest(
                                req.Emergency_ID,
                                payload
                              );
                              toast.success("Cập nhật thành công!");
                              setRefreshKey((k) => k + 1);
                              setEditRows((prev) => {
                                const copy = { ...prev };
                                delete copy[rowKey];
                                return copy;
                              });
                            } catch (err) {
                              toast.error("Cập nhật thất bại!");
                            }
                          }}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
                        >
                          Cập nhật
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Popup hiển thị profile */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-gradient-to-br from-red-100/90 via-white/90 to-pink-100/90 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] relative border-2 border-red-300 ring-4 ring-red-100/40">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={() => setSelectedProfile(null)}
              title="Đóng"
            >
              <i className="fa fa-times-circle" />
            </button>
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center shadow-lg mb-2 border-4 border-white">
                <i className="fa fa-user text-white text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-red-600 drop-shadow mb-1">
                {profileType === "requester"
                  ? "Thông tin người gửi yêu cầu"
                  : "Thông tin hồ sơ"}
              </h2>
            </div>
            {selectedProfile.error ? (
              <div className="text-red-500 text-center">
                {selectedProfile.error}
              </div>
            ) : (
              <div className="space-y-3 text-gray-700">
                <div>
                  <b className="text-red-500">Tên:</b>{" "}
                  {selectedProfile.User_Name}
                </div>
                <div>
                  <b className="text-pink-500">Địa chỉ:</b>{" "}
                  {selectedProfile.Full_Address ?? "—"}
                </div>
                <div>
                  <b className="text-rose-600">Số điện thoại:</b>{" "}
                  {selectedProfile.Phone ?? "—"}
                </div>
                <div>
                  <b className="text-pink-500">Nhóm máu:</b>
                  <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold shadow">
                    {selectedProfile.BloodGroup ?? "—"}
                  </span>
                </div>
                <div>
                  <b className="text-rose-500">Email:</b>{" "}
                  {selectedProfile.Email ?? "—"}
                </div>
                <div>
                  <b className="text-yellow-600">Giới tính:</b>
                  <span className="ml-2 font-semibold">
                    {selectedProfile.Gender === "M" ? (
                      <span className="text-blue-600">Nam ♂️</span>
                    ) : selectedProfile.Gender === "F" ? (
                      <span className="text-pink-600">Nữ ♀️</span>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div>
                  <b className="text-gray-600">Năm sinh:</b>{" "}
                  {selectedProfile.Date_Of_Birth ?? "—"}
                </div>
                {/* Chỉ hiện lý do nếu có currentReason */}
                {currentReason && (
                  <div>
                    <b className="text-amber-700">Lý do cần máu:</b>{" "}
                    {currentReason}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup danh sách ưu tiên */}
      {showPotentialPopup && (
        <div className="fixed inset-0 bg-gradient-to-br from-red-100/90 via-white/90 to-pink-100/90 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[600px] max-w-4xl w-full relative border-2 border-red-300 ring-4 ring-red-100/40">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={() => setShowPotentialPopup(false)}
              title="Đóng"
            >
              <i className="fa fa-times-circle" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <i className="fa fa-users text-red-500 text-2xl" />
              <h2 className="text-lg font-bold text-red-700 drop-shadow">
                Danh sách người ưu tiên
              </h2>
              <span className="ml-2 bg-pink-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold shadow">
                {potentialList.length} người
              </span>
            </div>
            <table className="min-w-full text-sm mb-4 rounded-xl overflow-hidden shadow">
              <thead>
                <tr className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700">
                  <th></th>
                  <th>Tên</th>
                  <th>Nhóm máu</th>
                  <th>Địa chỉ</th>
                  <th>Email</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {potentialList.map((donor) => (
                  <tr
                    key={donor.User_ID}
                    className="hover:bg-pink-50 transition"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedDonors.includes(donor.userId)}
                        onChange={() => handleCheckDonor(donor.userId)}
                        className="accent-red-500 w-4 h-4"
                      />
                    </td>
                    <td className="font-semibold text-gray-800">
                      {donor.userName}
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold shadow">
                        {donor.bloodType}
                      </span>
                    </td>
                    <td className="text-gray-600">{donor.address}</td>
                    <td className="text-rose-600">{donor.email}</td>
                    <td>
                      <button
                        className="px-3 py-1 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded shadow hover:scale-105 hover:from-red-500 hover:to-pink-600 transition font-semibold"
                        onClick={() =>
                          handleAddDonor(currentEmergencyId, donor.potentialId)
                        }
                      >
                        <i className="fa fa-plus-circle mr-1" /> Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-pink-600 hover:to-red-700 transition text-lg flex items-center justify-center gap-2"
              onClick={handleSendEmail}
              disabled={sendingEmail}
            >
              {sendingEmail ? (
                <>
                  <i className="fa fa-spinner fa-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className="fa fa-paper-plane mr-2" />
                  Gửi Email
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Popup chọn lý do từ chối */}
      {showRejectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-sm w-full relative border-2 border-red-300">
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <i className="fa fa-ban text-red-500" /> Lý do từ chối
            </h2>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (e.target.value !== "Khác") setRejectOtherMsg("");
              }}
            >
              <option value="">-- Chọn lý do --</option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {rejectReason === "Khác" && (
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Nhập lý do từ chối..."
                value={rejectOtherMsg}
                onChange={(e) => setRejectOtherMsg(e.target.value)}
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowRejectPopup(false);
                  setRejectReason("");
                  setRejectOtherMsg("");
                  setRejectRow(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                onClick={handleConfirmReject}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup ngân hàng máu */}
      {showBloodBank && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[500px] max-w-lg w-full relative border-2 border-red-300">
            <div className="flex items-center gap-3 mb-4">
              <i className="fa fa-tint text-red-500 text-2xl" />
              <h2 className="text-xl font-bold text-red-600 flex-1">
                Ngân hàng máu
              </h2>
            </div>
            {loadingBloodBank ? (
              <div className="text-center py-8 text-lg text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : bloodBankList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu.
              </div>
            ) : (
              <table className="min-w-full text-base mb-4 rounded-xl overflow-hidden shadow">
                <thead>
                  <tr className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700">
                    <th className="py-2 px-4 text-center">Nhóm máu</th>
                    <th className="py-2 px-4 text-center">Lượng máu (ml)</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodBankList.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-pink-50 transition text-center"
                    >
                      <td className="font-semibold text-gray-800 py-2 px-4">
                        {item.BloodGroup}
                      </td>
                      <td className="text-red-600 font-bold py-2 px-4">
                        {item.Volume}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setShowBloodBank(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
