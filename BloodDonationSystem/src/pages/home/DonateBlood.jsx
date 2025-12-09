import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { DateFilter } from "../../components/DateFilter";
import Swal from "sweetalert2";

const DonateBlood = () => {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [, setIsSearching] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    error,
    getSlotList,
    registerSlot,
    getCurrentUser,
    historyAppointmentsByUser,
    historyPatientByUser,
    cancelAppointmentByUser,
  } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận giá trị từ navigation state
  useEffect(() => {
    if (location.state?.startDate || location.state?.endDate) {
      const {
        startDate: navStartDate,
        endDate: navEndDate,
        shouldFilter,
      } = location.state;
      setDateRange([navStartDate, navEndDate]);
      if (shouldFilter && slots.length > 0) {
        filterSlotsByDateWithParams(navStartDate, navEndDate);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, slots]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
          const userRes = await getCurrentUser();
          setUser(userRes.data);
        }
        const slotsRes = await getSlotList();
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [getCurrentUser, getSlotList]);

  useEffect(() => {
    if (
      localStorage.getItem("isLoggedIn") === "true" &&
      user &&
      user.user_role === "member"
    ) {
      const fetchHistory = async () => {
        try {
          const res = await historyAppointmentsByUser();
          setMyRegistrations(res.data || []);
        } catch {
          setMyRegistrations([]);
        }
      };
      fetchHistory();
    } else {
      setMyRegistrations([]);
    }
  }, [historyAppointmentsByUser, user]);

  useEffect(() => {
    if (
      location.state?.shouldFilter &&
      slots.length > 0 &&
      (location.state?.startDate || location.state?.endDate)
    ) {
      const { startDate: navStartDate, endDate: navEndDate } = location.state;
      filterSlotsByDateWithParams(navStartDate, navEndDate);
    }
  }, [slots, location.state]);

  const filterSlotsByDateWithParams = useCallback(
    (startDateStr, endDateStr) => {
      if (!startDateStr && !endDateStr) {
        setFilteredSlots(slots);
        return;
      }
      const filtered = slots.filter((slot) => {
        const slotDate = new Date(slot.Slot_Date);
        const startFilter = startDateStr ? new Date(startDateStr) : null;
        const endFilter = endDateStr ? new Date(endDateStr) : null;
        if (startFilter && endFilter) {
          return slotDate >= startFilter && slotDate <= endFilter;
        } else if (startFilter) {
          return slotDate >= startFilter;
        } else if (endFilter) {
          return slotDate <= endFilter;
        }
        return true;
      });
      setFilteredSlots(filtered);
    },
    [slots]
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Đang chờ chấp thuận";
      case "Processing":
        return "Được hiến";
      case "Completed":
        return "Đã hiến xong";
      case "Canceled":
        return "Từ chối";
      default:
        return status;
    }
  };

  const filterSlotsByDate = useCallback(() => {
    filterSlotsByDateWithParams(startDate, endDate);
  }, [filterSlotsByDateWithParams, startDate, endDate]);

  const handleSearch = () => {
    setIsSearching(true);
    try {
      filterSlotsByDate();
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async (slotId) => {
    if (!user || localStorage.getItem("isLoggedIn") !== "true") {
      const result = await Swal.fire({
        title: "Lưu ý",
        text: "Vui lòng đăng nhập để đặt lịch hiến máu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }
    if (user.user_role !== "member") {
      toast.error("Tài khoản của bạn không có quyền đăng ký hiến máu"),
        {
          position: "top-right",
          autoClose: 3000,
        };
      return;
    }
    if (!user.user_id) {
      toast.error("Không tìm thấy ID người dùng"),
        {
          position: "top-right",
          autoClose: 3000,
        };
      return;
    }
    try {
      const selectedSlot = slots.find((slot) => slot.Slot_ID === slotId);
      if (!selectedSlot) {
        toast.error("Không tìm thấy thông tin ca hiến máu!");
        return;
      }
      const result = await Swal.fire({
        title:
          '<span style="color: #dc2626;">🩸 Xác nhận đăng ký hiến máu</span>',
        html: `
          <div style="text-align: left; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 20px; font-weight: bold;">${(
                    user.full_name || "U"
                  )
                    .charAt(0)
                    .toUpperCase()}</span>
                </div>
                <div>
                  <h4 style="color: #16a34a; margin: 0; font-size: 18px;">👤 ${
                    user.full_name || "Người dùng"
                  }</h4>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${
                    user.email || "Chưa cập nhật email"
                  }</p>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                <div><strong>📱 SĐT:</strong> ${
                  user.phone || "Chưa cập nhật"
                }</div>
                <div><strong>🎂 Tuổi:</strong> ${
                  user.date_of_birth
                    ? new Date().getFullYear() -
                      new Date(user.date_of_birth).getFullYear()
                    : "Chưa rõ"
                }</div>
                <div><strong>⚧ Giới tính:</strong> ${
                  user.gender === "M"
                    ? "Nam"
                    : user.gender === "F"
                    ? "Nữ"
                    : "Chưa rõ"
                }</div>
                <div><strong>🏠 Địa chỉ:</strong> ${
                  user.address
                    ? user.address.length > 20
                      ? user.address.substring(0, 20) + "..."
                      : user.address
                    : "Chưa cập nhật"
                }</div>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h4 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px;">📅 Chi tiết ca hiến máu</h4>
              <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                <p style="margin: 8px 0; font-size: 15px;"><strong>📆 Ngày:</strong> <span style="color: #dc2626;">${formatDateVN(
                  selectedSlot.Slot_Date
                )}</span></p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>🕐 Thời gian:</strong> <span style="color: #dc2626;">${formatTimeVN(
                  selectedSlot.Start_Time
                )} - ${formatTimeVN(selectedSlot.End_Time)}</span></p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>👥 Lượt đăng ký:</strong> <span style="color: ${
                  parseInt(selectedSlot.Volume || 0) >=
                  parseInt(selectedSlot.Max_Volume || 0) * 0.8
                    ? "#dc2626"
                    : "#16a34a"
                };">${selectedSlot.Volume || 0}/${
          selectedSlot.Max_Volume || 0
        } người</span></p>
              </div>
            </div>
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
              <h4 style="color: #1d4ed8; margin: 0 0 15px 0; display: flex; align-items: center;">
                <span style="margin-right: 8px;">⚠️</span> Điều kiện hiến máu
              </h4>
              <div style="background: white; padding: 15px; border-radius: 8px;">
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li>Đến đúng giờ, muộn nhất 30 phút sau giờ bắt đầu</li>
                  <li>Không uống rượu bia, thuốc lá trong 24h trước</li>
                  <li>Ăn uống đầy đủ, uống nhiều nước trước khi đến</li>
                  <li>Nghỉ ngơi đầy đủ, không thức khuya</li>
                </ul>
              </div>
            </div>
            ${
              !user.phone || !user.address || !user.full_name
                ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>📋 Lưu ý:</strong> Một số thông tin cá nhân chưa được cập nhật. 
                  Vui lòng hoàn thiện hồ sơ để quá trình hiến máu được thuận lợi hơn.
                </p>
              </div>
            `
                : ""
            }
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "✅ Xác nhận đăng ký",
        cancelButtonText: "❌ Hủy bỏ",
        width: "700px",
        padding: "0",
      });
      if (result.isConfirmed) {
        await registerSlot(slotId, user.user_id);
        toast.success("Đăng ký hiến máu thành công!");
        const slotsRes = await getSlotList();
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);
        const regRes = await historyAppointmentsByUser();
        setMyRegistrations(regRes.data || []);
      }
    } catch (error) {
      console.error("Error registering slot:", error);
      toast.error(error?.message || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận hủy đăng ký",
        text: "Bạn có chắc chắn muốn hủy đăng ký ca hiến máu này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        await cancelAppointmentByUser(appointmentId);
        toast.success("Hủy đăng ký thành công!");
        // Cập nhật lại danh sách ca và đăng ký
        const slotsRes = await getSlotList();
        setSlots(slotsRes.data);
        setFilteredSlots(slotsRes.data);
        const regRes = await historyAppointmentsByUser();
        setMyRegistrations(regRes.data || []);
      }
    } catch (error) {
      toast.error(error?.message || "Hủy đăng ký thất bại. Vui lòng thử lại!");
    }
  };

  // Helper format ngày tiếng Việt
  const formatDateVN = (dateString) => {
    if (!dateString) return "";
    // Lấy phần ngày (YYYY-MM-DD) và parse trực tiếp để tránh lệch timezone
    const datePart = dateString.toString().slice(0, 10);
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeVN = (timeString) => {
    if (!timeString) return "-";
    if (timeString.includes("T")) {
      const tIndex = timeString.indexOf("T");
      const timePart = timeString.slice(tIndex + 1, tIndex + 6);
      const [h, m] = timePart.split(":");
      if (!h || !m) return "-";
      return `${parseInt(h, 10)}h${m}`;
    }
    const [h, m] = timeString.split(":");
    if (!h || !m) return "-";
    return `${parseInt(h, 10)}h${m}`;
  };

  const emptyStateMessage = useMemo(() => {
    return slots.length === 0
      ? "Hiện tại chưa có lịch hiến máu nào được mở."
      : "Không tìm thấy lịch hiến máu nào trong khoảng thời gian đã chọn.";
  }, [slots.length]);

  const hasAnyRegistration = useMemo(() => {
    return myRegistrations && myRegistrations.length > 0;
  }, [myRegistrations]);

  // Sắp xếp slot theo ngày tăng dần
  const sortedFilteredSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date(
      (a.Slot_Date || "").slice(0, 10) + "T00:00:00"
    ).getTime();
    const dateB = new Date(
      (b.Slot_Date || "").slice(0, 10) + "T00:00:00"
    ).getTime();
    return dateA - dateB;
  });

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSlots.length]);

  // Tính toán phân trang
  const totalSlots = sortedFilteredSlots.length;
  const totalPages = Math.ceil(totalSlots / itemsPerPage);
  const paginatedSlots = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedFilteredSlots.slice(start, start + itemsPerPage);
  }, [currentPage, sortedFilteredSlots]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
        Đăng ký hiến máu
      </h1>
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xl">
          <DateFilter
            onSearch={handleSearch}
            onDateChange={setDateRange}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow p-4">
          <p className="text-lg text-gray-600">
            {startDate || endDate
              ? "Không có lịch hiến máu nào trong khoảng thời gian đã chọn"
              : "Không có lịch hiến máu nào"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSlots.map((slot) => {
              const isSlotFull =
                slot.Status !== "A" ||
                parseInt(slot.Volume) >= parseInt(slot.Max_Volume);
              const isRegistered =
                myRegistrations &&
                myRegistrations.some((reg) => reg.Slot_ID === slot.Slot_ID);

              return (
                <div
                  key={slot.Slot_ID}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="bg-red-100 p-4">
                    <h3 className="text-xl font-semibold text-red-800">
                      Lịch hiến máu: {formatDateVN(slot.Slot_Date)}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Thời gian: </span>
                        {slot.Start_Time && slot.End_Time
                          ? `${formatTimeVN(slot.Start_Time)} - ${formatTimeVN(
                              slot.End_Time
                            )}`
                          : "-"}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">
                          Số lượng đã đăng ký:{" "}
                        </span>
                        <span
                          className={
                            parseInt(slot.Volume) >= parseInt(slot.Max_Volume)
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {slot.Volume || 0}/{slot.Max_Volume || 0}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Trạng thái: </span>
                        {slot.Status === "A" ? (
                          <span className="text-green-600 font-medium">
                            Đang mở đăng ký
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Đã đầy
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      disabled={loading || (isSlotFull && !isRegistered)}
                      className={`w-full py-2 px-4 rounded transition duration-300 flex items-center justify-center font-semibold
                        ${
                          isSlotFull && !isRegistered
                            ? "bg-yellow-200 text-yellow-700 cursor-not-allowed"
                            : isRegistered
                            ? "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      title={
                        isRegistered
                          ? "Bạn đã đăng ký ca này. Nhấn để hủy đăng ký."
                          : isSlotFull
                          ? "Ca này đã đầy, vui lòng chọn ca khác."
                          : ""
                      }
                      onClick={() => {
                        if (isRegistered) {
                          const appointment = myRegistrations.find(
                            (reg) => reg.Slot_ID === slot.Slot_ID
                          );
                          if (appointment)
                            handleCancelAppointment(appointment.Appointment_ID);
                        } else {
                          handleRegister(slot.Slot_ID);
                        }
                      }}
                    >
                      {isRegistered ? (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Hủy đăng ký
                        </>
                      ) : loading ? (
                        "Đang đăng ký..."
                      ) : isSlotFull ? (
                        "Đã đầy"
                      ) : (
                        "Đăng ký"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) =>
                  totalPages <= 5
                    ? true
                    : Math.abs(n - currentPage) <= 2 ||
                      n === 1 ||
                      n === totalPages
                )
                .map((n, idx, arr) => {
                  const isEllipsis = idx > 0 && n - arr[idx - 1] > 1;
                  return (
                    <span key={n} className="flex">
                      {isEllipsis && <span className="px-2">…</span>}
                      <button
                        onClick={() => setCurrentPage(n)}
                        className={`px-3 py-1 border rounded ${
                          n === currentPage
                            ? "bg-[#D32F2F] text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  );
                })}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
      {/* Popup xem hồ sơ bệnh án */}
      {/* ... giữ nguyên popup nếu cần ... */}
    </div>
  );
};

export default DonateBlood;
