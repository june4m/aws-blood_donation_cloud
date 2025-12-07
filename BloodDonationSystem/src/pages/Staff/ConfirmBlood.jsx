import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useApi from "../../hooks/useApi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

const ConfirmBloodPage = () => {
  const [confirmList, setConfirmList] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  // Thêm state cho bệnh án cũ nhất
  const [latestPatientDetail, setLatestPatientDetail] = useState(null);

  // Thêm state cho popup thêm bệnh nhân
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [addPatientDescription, setAddPatientDescription] = useState("");
  const [addPatientStatus, setAddPatientStatus] = useState("");
  const [addPatientAppointmentId, setAddPatientAppointmentId] = useState(null);
  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [slotList, setSlotList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [viewDeclaration, setViewDeclaration] = useState(null);
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [bloodTypeMap, setBloodTypeMap] = useState({}); // Lưu nhóm máu staff chọn
  const [showBloodTypePrompt, setShowBloodTypePrompt] = useState(false);
  const [pendingBloodType, setPendingBloodType] = useState("");
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [showBloodTypeConfirm, setShowBloodTypeConfirm] = useState(false);
  const {
    getSlotList,
    getAppointments,
    addPatientDetail,
    confirmBloodTypeByStaff,
    updateStatusAppointmentByStaff,
    rejectAppointment,
    historyPatientByUser,
    updatePatientByStaff,
    getLatestPatientDetail,
  } = useApi();

  // State cho popup chỉnh sửa bệnh án
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editPatientDescription, setEditPatientDescription] = useState("");
  const [editPatientStatus, setEditPatientStatus] = useState("");
  const [editPatientAppointmentId, setEditPatientAppointmentId] =
    useState(null);
  const [editPatientLoading, setEditPatientLoading] = useState(false);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch danh sách xác nhận từ BE
  const fetchConfirmList = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      console.log("Kết quả getAppointments:", data);
      setConfirmList(data.data || []);
      if (!data.data || data.data.length === 0) {
        console.warn("[BUG][FE] API trả về rỗng hoặc không có dữ liệu!");
      }
    } catch (err) {
      setConfirmList([]);
      console.error("[BUG][FE] Lỗi fetch API getAppointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách slot từ BE
  const fetchSlotList = async () => {
    try {
      const res = await getSlotList();
      setSlotList(res.data || []);
    } catch (err) {
      setSlotList([]);
      console.error("[BUG][FE] Lỗi fetch API /api/getSlotList:", err);
    }
  };

  useEffect(() => {
    fetchConfirmList();
    fetchSlotList();
  }, []);

  const handleConfirm = (id) => {
    setSelectedId(id);
    setShowApproveModal(true);
  };

  const handleApproveClose = () => {
    setShowApproveModal(false);
    setSelectedId(null);
  };

  const handleReject = (id) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };
  const handleRejectModalClose = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedId(null);
  };
  const handleRejectModalSubmit = () => {
    setShowRejectConfirm(true);
  };
  const handleRejectConfirmClose = () => {
    setShowRejectConfirm(false);
  };

  const handleEditCancel = () => {
    setShowEditConfirm(false);
    setEditingId(null); // Đảm bảo reset về nút "Chỉnh sửa"
  };

  // Hàm mở popup thêm bệnh nhân (CHỈNH LẠI)
  const handleOpenAddPatient = async (appointmentId) => {
    const appointment = confirmList.find(
      (item) => item.Appointment_ID === appointmentId
    );
    console.log(appointment);

    if (!appointment?.BloodType) {
      setPendingAppointment(appointment);
      setShowBloodTypePrompt(true);
    } else {
      setAddPatientAppointmentId(appointmentId);
      // Gọi API lấy bệnh án cũ nhất qua useApi
      try {
        const res = await getLatestPatientDetail(appointment.User_ID);
        const detail = res.data || null;
        setLatestPatientDetail(detail);
        // Nếu có bệnh án cũ thì set luôn vào input
        setAddPatientDescription(detail?.Description || "");
        setAddPatientStatus(detail?.Status || "");
      } catch {
        setLatestPatientDetail(null);
        setAddPatientDescription("");
        setAddPatientStatus("");
      }
      setShowAddPatientModal(true);
    }
  };

  // Xác nhận chọn nhóm máu xong, hiện popup xác nhận lại
  const handleBloodTypePromptConfirm = () => {
    if (!pendingBloodType) return;
    setShowBloodTypePrompt(false);
    setShowBloodTypeConfirm(true);
  };

  // Gửi xác nhận nhóm máu
  const handleBloodTypeConfirm = async () => {
    setShowBloodTypeConfirm(false);
    setLoading(true);
    try {
      await confirmBloodTypeByStaff(
        pendingAppointment.User_ID, // userId truyền vào param
        pendingBloodType // bloodType truyền vào body
      );
      await fetchConfirmList(); // render lại danh sách
      // KHÔNG mở popup thêm bệnh án ở đây nữa!
      // Nếu muốn mở, hãy để staff tự bấm nút "Thêm" ở cột "Hồ sơ bệnh án"
    } catch (err) {
      alert("Có lỗi khi xác nhận nhóm máu!");
    } finally {
      setLoading(false);
      setPendingBloodType("");
      setPendingAppointment(null);
    }
  };

  // Helper format ngày dạng dd/mm/yyyy
  const formatDateVN = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTimeVN = (timeString) => {
    if (!timeString) return "-";
    // Lấy phần sau chữ T, ví dụ: "13:00:00.000Z"
    const tIndex = timeString.indexOf("T");
    if (tIndex === -1) return "-";
    const timePart = timeString.slice(tIndex + 1, tIndex + 6); // "13:00"
    const [h, m] = timePart.split(":");
    if (!h || !m) return "-";
    return `${parseInt(h, 10)}h${m}`;
  };
  const handleAddPatientSubmit = async () => {
    setAddPatientLoading(true);
    try {
      await addPatientDetail(
        addPatientAppointmentId,
        addPatientDescription,
        addPatientStatus
      );
      toast.success("Thêm hồ sơ thành công!");
      await fetchConfirmList();
    } catch (err) {
      toast.error(err?.message || "Thêm hồ sơ thất bại!");
    } finally {
      setShowAddPatientModal(false);
      setAddPatientDescription("");
      setAddPatientStatus("");
      setAddPatientAppointmentId(null);
      setAddPatientLoading(false);
    }
  };

  const rejectReasons = [
    "Không đủ điều kiện sức khỏe",
    "Không đạt yêu cầu về tuổi/cân nặng",
    "Đang mắc bệnh truyền nhiễm",
    "Lý do khác",
  ];

  const handleApproveSubmit = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      await updateStatusAppointmentByStaff(selectedId, "Processing");
      await fetchConfirmList();
      toast.success("Chấp thuận thành công!");
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setShowApproveModal(false);
      setSelectedId(null);
      setEditingId(null); // Thêm dòng này để reset về nút "Chỉnh sửa"
      setLoading(false);
    }
  };

  // Thêm state mới ở đầu file:
  const [rejectOtherMsg, setRejectOtherMsg] = useState("");

  // Thay đổi phần modal nhập lý do từ chối:
  {
    showRejectModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Nhập lý do từ chối</h2>
          <select
            className="w-full border rounded p-2 mb-2"
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              if (e.target.value !== "Lý do khác") setRejectOtherMsg("");
            }}
          >
            <option value="">-- Chọn lý do --</option>
            {rejectReasons.map((reason, idx) => (
              <option key={idx} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          {rejectReason === "Lý do khác" && (
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              value={rejectOtherMsg}
              onChange={(e) => setRejectOtherMsg(e.target.value)}
              placeholder="Nhập lý do..."
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handleRejectModalClose}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleRejectModalSubmit}
              disabled={
                !rejectReason.trim() ||
                (rejectReason === "Lý do khác" && !rejectOtherMsg.trim())
              }
            >
              Từ chối
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Khi submit, lấy lý do:
  const handleRejectConfirmSubmit = async () => {
    if (!selectedId) return;
    const reason =
      rejectReason === "Lý do khác" ? rejectOtherMsg : rejectReason;
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await rejectAppointment(selectedId, reason);
      toast.success("Đã từ chối ca hiến máu này!"); // Hiện toast khi xác nhận từ chối
      setShowRejectConfirm(false);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedId(null);
      setEditingId(null); // Thêm dòng này để reset về nút "Chỉnh sửa"
      await fetchConfirmList();
    } catch (err) {
      toast.error(err?.message || "Từ chối thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở popup chỉnh sửa bệnh án
  const handleOpenEditPatient = async (appointmentId) => {
    setEditPatientAppointmentId(appointmentId);
    setEditPatientLoading(true);
    try {
      const res = await historyPatientByUser(appointmentId);
      console.log("Dữ liệu bệnh án chỉnh sửa:", res);
      setEditPatientDescription(res.data?.Description || "");
      setEditPatientStatus(res.data?.Status || "");
      setShowEditPatientModal(true);
    } catch {
      toast.error("Không lấy được thông tin bệnh án!");
    } finally {
      setEditPatientLoading(false);
    }
  };

  // Hàm submit cập nhật bệnh án
  const handleEditPatientSubmit = async () => {
    setEditPatientLoading(true);
    try {
      await updatePatientByStaff(
        editPatientAppointmentId,
        editPatientDescription,
        editPatientStatus
      );
      setShowEditPatientModal(false);
      setEditPatientAppointmentId(null);
      await fetchConfirmList();
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (err) {
      toast.error(err?.message || "Cập nhật thất bại!");
    } finally {
      setEditPatientLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center text-[#D32F2F] mb-6">
          Quản lý đăng ký hiến máu người dùng
        </h1>
        {/* Ô search theo ID */}
        <div className="mb-4 flex justify-end gap-4">
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:border-[#D32F2F] shadow-sm transition-all"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm theo số điện thoại"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:border-[#D32F2F] shadow-sm transition-all"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full w-full table-auto">
            <thead className="bg-[#F1F1F1]">
              <tr>
                <th className="px-3 py-2 text-center text-[#D32F2F]">Họ tên</th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Số điện thoại
                </th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Nhóm máu
                </th>{" "}
                {/* Thêm dòng này */}
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Hồ sơ bệnh án
                </th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Ngày hiến
                </th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Khung giờ
                </th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-center text-[#D32F2F]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="border-t min-h-[300px] align-middle">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-24 text-lg text-gray-400 align-middle"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : confirmList.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-24 text-lg text-gray-400 align-middle"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                (() => {
                  // Logic phân trang
                  const filteredData = confirmList.filter(
                    (item) =>
                      (item.Status === "Pending" ||
                        item.Status === "Processing") &&
                      (!searchName ||
                        (item.Name &&
                          item.Name.toLowerCase().includes(
                            searchName.toLowerCase()
                          ))) &&
                      (!searchPhone ||
                        (item.Phone &&
                          item.Phone.toLowerCase().includes(
                            searchPhone.toLowerCase()
                          )))
                  );

                  const totalPages = Math.ceil(
                    filteredData.length / itemsPerPage
                  );
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const currentData = filteredData.slice(startIndex, endIndex);

                  return currentData.map((item) => (
                    <tr
                      key={item.Appointment_ID}
                      className="hover:bg-[#FFF5F5] transition-all border-b border-gray-100"
                    >
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        {item.Name}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.Phone || item.phone || "-"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {item.BloodType ? (
                          item.BloodType
                        ) : (
                          <span className="text-gray-400 italic">
                            Chưa xác định
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className={`bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-blue-100 hover:border-blue-300 transition
    ${item.Status === "Processing" ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() =>
                              handleOpenAddPatient(item.Appointment_ID)
                            }
                            disabled={item.Status === "Processing"}
                          >
                            Thêm
                          </button>
                          <button
                            className="bg-white border border-blue-500 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-blue-50 hover:text-blue-800 transition"
                            onClick={() =>
                              handleOpenEditPatient(item.Appointment_ID)
                            }
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {formatDateVN(item.DATE)}
                      </td>
                      <td className="px-3 py-2 text-center  whitespace-nowrap">
                        {item.Start_Time && item.End_Time
                          ? `${formatTimeVN(item.Start_Time)} - ${formatTimeVN(
                            item.End_Time
                          )}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 text-center ">
                        {item.Status === "Pending" && (
                          <span className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold text-xs">
                            Đang chờ chấp thuận
                          </span>
                        )}
                        {item.Status === "Processing" && (
                          <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs">
                            Đang xử lý
                          </span>
                        )}
                        {/* Có thể bổ sung các trạng thái khác nếu cần */}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {editingId === item.Appointment_ID ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              className="bg-green-600 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:bg-green-700 transition-all duration-150 w-20 text-center text-sm"
                              onClick={() => handleConfirm(item.Appointment_ID)}
                            >
                              Chấp thuận
                            </button>
                            <button
                              className="bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:bg-red-700 transition-all duration-150 w-20 text-center text-sm"
                              onClick={() => handleReject(item.Appointment_ID)}
                            >
                              Từ chối
                            </button>
                            <button
                              className="bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md font-semibold shadow-sm hover:bg-gray-400 transition-all duration-150 w-20 text-center text-sm"
                              onClick={() => setEditingId(null)}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition-all duration-150 w-20 text-center text-sm"
                            onClick={() => setEditingId(item.Appointment_ID)}
                          >
                            Chỉnh sửa
                          </button>
                        )}
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {(() => {
          const filteredData = confirmList.filter(
            (item) =>
              (item.Status === "Pending" || item.Status === "Processing") &&
              (!searchName ||
                (item.Name &&
                  item.Name.toLowerCase().includes(
                    searchName.toLowerCase()
                  ))) &&
              (!searchPhone ||
                (item.Phone &&
                  item.Phone.toLowerCase().includes(searchPhone.toLowerCase())))
          );
          const totalPages = Math.ceil(filteredData.length / itemsPerPage);

          return totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : null;
        })()}
      </div>
      {/* Modal xác nhận đồng ý */}
      {showApproveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn chắc chắn muốn thực hiện hành động này không?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleApproveClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleApproveSubmit}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal nhập lý do từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Nhập lý do từ chối</h2>
            <select
              className="w-full border rounded p-2 mb-2"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (e.target.value !== "Lý do khác") setRejectOtherMsg("");
              }}
            >
              <option value="">-- Chọn lý do --</option>
              {rejectReasons.map((reason, idx) => (
                <option key={idx} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {rejectReason === "Lý do khác" && (
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                value={rejectOtherMsg}
                onChange={(e) => setRejectOtherMsg(e.target.value)}
                placeholder="Nhập lý do..."
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleRejectModalClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleRejectModalSubmit}
                disabled={
                  !rejectReason.trim() ||
                  (rejectReason === "Lý do khác" && !rejectOtherMsg.trim())
                }
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận lại khi từ chối */}
      {showRejectConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn chắc chắn muốn từ chối ca hiến máu này?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleRejectConfirmClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleRejectConfirmSubmit}
              >
                Đồng ý từ chối
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận chỉnh sửa */}
      {showEditConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn có chắc muốn chuyển về trạng thái chờ xác nhận để chỉnh sửa
              không?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleEditCancel}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleEditConfirm}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeclarationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-center text-red-700">
              Khai báo y tế
            </h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-2">
              {(() => {
                let declaration = viewDeclaration;
                if (typeof declaration === "string") {
                  try {
                    declaration = JSON.parse(declaration);
                  } catch { }
                }
                if (!declaration || typeof declaration !== "object") {
                  return (
                    <div className="text-gray-500 text-center">
                      Không có dữ liệu khai báo y tế.
                    </div>
                  );
                }
                return (
                  <ul className="space-y-3">
                    {Object.entries(declaration).map(
                      ([question, answer], idx) => (
                        <li
                          key={idx}
                          className="bg-white rounded shadow p-3 flex flex-col"
                        >
                          <span className="font-medium text-gray-800 mb-1">
                            {question}
                          </span>
                          <span className="text-blue-700 font-semibold">
                            {answer}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                );
              })()}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={() => setShowDeclarationModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal thêm bệnh án */}
      {showAddPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">
              Thêm hồ sơ bệnh án
            </h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Mô tả</label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={addPatientDescription}
                onChange={(e) => setAddPatientDescription(e.target.value)}
                placeholder="Nhập mô tả bệnh án..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Trạng thái</label>
              <select
                className="w-full border rounded p-2"
                value={addPatientStatus}
                onChange={(e) => setAddPatientStatus(e.target.value)}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang điều trị">Đang điều trị</option>
                <option value="Đã khỏi">Đã khỏi</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowAddPatientModal(false)}
                disabled={addPatientLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAddPatientSubmit}
                disabled={
                  addPatientLoading ||
                  !addPatientDescription ||
                  !addPatientStatus
                }
              >
                {addPatientLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal chọn nhóm máu */}
      {showBloodTypePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Người này chưa có nhóm máu. Vui lòng chọn nhóm máu:
            </h2>
            <select
              className="w-full border rounded p-2 mb-4"
              value={pendingBloodType}
              onChange={(e) => setPendingBloodType(e.target.value)}
            >
              <option value="">-- Chọn nhóm máu --</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowBloodTypePrompt(false);
                  setPendingBloodType("");
                  setPendingAppointment(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={!pendingBloodType}
                onClick={handleBloodTypePromptConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận nhóm máu */}
      {showBloodTypeConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Bạn có chắc chắn xác nhận nhóm máu{" "}
              <span className="text-red-600">{pendingBloodType}</span> cho người
              này không?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowBloodTypeConfirm(false);
                  setPendingBloodType("");
                  setPendingAppointment(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleBloodTypeConfirm}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal chỉnh sửa bệnh án */}
      {showEditPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">
              Chỉnh sửa hồ sơ bệnh án
            </h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Mô tả</label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={editPatientDescription}
                onChange={(e) => setEditPatientDescription(e.target.value)}
                placeholder="Nhập mô tả bệnh án..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Trạng thái</label>
              <select
                className="w-full border rounded p-2"
                value={editPatientStatus}
                onChange={(e) => setEditPatientStatus(e.target.value)}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang điều trị">Đang điều trị</option>
                <option value="Đã khỏi">Đã khỏi</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowEditPatientModal(false)}
                disabled={editPatientLoading}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleEditPatientSubmit}
                disabled={
                  editPatientLoading ||
                  !editPatientDescription ||
                  !editPatientStatus
                }
              >
                {editPatientLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmBloodPage;
