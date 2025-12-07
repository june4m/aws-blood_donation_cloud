import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";

const EditBloodPage = () => {
  const {
    getAppointments,
    getSlotList,
    loading,
    addAppointmentVolume,
    updateStatusAppointmentByStaff, sendRecoveryReminderEmail
  } = useApi();
  const [appointments, setAppointments] = useState([]);
  const [slotList, setSlotList] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [volumes, setVolumes] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [statDate, setStatDate] = useState("");
  const [statBloodType, setStatBloodType] = useState("");
  const [totalVolume, setTotalVolume] = useState(0);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sử dụng getAllAppointments từ code sau
        const data = await getAppointments();
        // Sort by Appointment_ID ascending (AP001, AP002, ...)
        const sortedData = (data.data || []).slice().sort((a, b) => {
          const numA = parseInt((a.Appointment_ID || "").replace(/\D/g, ""));
          const numB = parseInt((b.Appointment_ID || "").replace(/\D/g, ""));
          return numA - numB;
        });
        // Lọc trạng thái ngay khi load
        const filteredStatus = sortedData.filter(
          (item) => item.Status === "Processing" || item.Status === "Completed"
        );
        setAppointments(filteredStatus);
        setFiltered(filteredStatus);

        // Khởi tạo volumes từ dữ liệu có sẵn
        const initialVolumes = {};
        sortedData.forEach((item) => {
          initialVolumes[item.Appointment_ID] = item.Volume || "";
        });
        setVolumes(initialVolumes);

        // Lấy danh sách slots
        const slotRes = await getSlotList();
        setSlotList(slotRes.data || []);
      } catch (err) {
        setAppointments([]);
        setFiltered([]);
        setSlotList([]);
      }
    };
    fetchData();
  }, [getAppointments, getSlotList]);

  //tính tổng lượng máu
  useEffect(() => {
    if (!statDate) {
      setTotalVolume(0);
      return;
    }
    const total = appointments
      .filter(
        (item) =>
          item.Status === "Completed" &&
          item.DATE &&
          item.Volume &&
          item.DATE.slice(0, 10) === statDate &&
          (!statBloodType || // Nếu chưa chọn nhóm máu, lấy tất cả
            item.BloodType === statBloodType)
      )
      .reduce((sum, item) => sum + Number(item.Volume || 0), 0);
    setTotalVolume(total);
  }, [statDate, statBloodType, appointments]);

  const handleVolumeChange = (id, value) => {
    setVolumes((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async (id, name, date, startTime, endTime) => {
    const volume = volumes[id];

    if (!volume || isNaN(volume) || Number(volume) <= 0) {
      await Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng nhập lưu lượng hợp lệ (số > 0)!",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Đã hiểu",
      });
      return;
    }

    // Popup xác nhận
    const result = await Swal.fire({
      title: "Lưu ý quan trọng",
      html: `            
                    <div style="display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:#fee2e2;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#dc2626"/>
                    <rect x="11" y="6" width="2" height="8" rx="1" fill="white"/>
                    <rect x="11" y="16" width="2" height="2" rx="1" fill="white"/>
                </svg>
            </span>
        </div>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li><strong>Sau khi lưu, bạn KHÔNG thể thay đổi thông tin này</strong></li>
                <li>Vui lòng kiểm tra kỹ lưu lượng máu trước khi xác nhận</li>
                <li>Thông tin sẽ được ghi nhận vào hệ thống vĩnh viễn</li>
            </ul>
        </div>
            `,
      icon: undefined,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xác nhận lưu",
      cancelButtonText: "Hủy bỏ",
      width: "500px",
      padding: "0",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await addAppointmentVolume(id, String(volume)); // 1. Cập nhật volume trước
      await updateStatusAppointmentByStaff(id, "Completed"); // 2. Sau đó cập nhật status

            // Lấy thông tin appointment để lấy email và tên
            const appointment = appointments.find(item => item.Appointment_ID === id);
            const donorEmail = appointment?.Email || "";
            const donorName = appointment?.User_Name || appointment?.Name || "";

            // Gửi mail nhắc nhở phục hồi
            if (donorEmail && donorName) {
              let swalLoading;
              try {
                swalLoading = Swal.fire({
                  title: "Đang gửi email nhắc nhở...",
                  text: "Vui lòng chờ trong giây lát.",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  didOpen: () => {
                    Swal.showLoading();
                  }
                });
                await sendRecoveryReminderEmail(donorEmail, donorName);
                Swal.close();
                await Swal.fire({
                  icon: "success",
                  title: "Đã gửi email nhắc nhở phục hồi!",
                  showConfirmButton: false,
                  timer: 1200
                });
              } catch (mailErr) {
                Swal.close();
                console.error("Gửi mail nhắc nhở phục hồi thất bại:", mailErr);
                await Swal.fire({
                  icon: "error",
                  title: "Gửi email thất bại!",
                  text: "Không thể gửi email nhắc nhở phục hồi. Vui lòng thử lại.",
                  confirmButtonColor: "#dc2626"
                });
              }
            }

      // Cập nhật lại appointment trong state để hiển thị volume đã lưu
      setAppointments((prev) =>
        prev.map((item) =>
          item.Appointment_ID === id
            ? { ...item, Volume: volume, Status: "Completed" }
            : item
        )
      );

      setFiltered((prev) =>
        prev.map((item) =>
          item.Appointment_ID === id
            ? { ...item, Volume: volume, Status: "Completed" }
            : item
        )
      );

      await Swal.fire({
        title: "✅ Lưu thành công!",
        html: `
            <div style="text-align: center; padding: 20px;">
                <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="color: #16a34a; margin: 0 0 10px 0;">📊 Thông tin đã được ghi nhận</h4>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Tên:</strong> ${name}</p>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Ngày hiến:</strong> ${formatDateVN(
                      date
                    )}</p>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Khung giờ:</strong> ${formatTimeVN(
                      startTime
                    )} - ${formatTimeVN(endTime)}</p>
                    <p style="margin: 5px 0; font-size: 15px;"><strong>Lưu lượng:</strong> ${volume} ml</p>
                </div>
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #1d4ed8;">
                        <strong>💡 Lưu ý:</strong> Thông tin này đã được khóa và không thể chỉnh sửa.
                    </p>
                </div>
            </div>
        `,
        icon: "success",
        confirmButtonColor: "#16a34a",
        confirmButtonText: "Đã hiểu",
        width: "450px",
        padding: "0",
      });

      setSuccessMsg("Đã hoàn thành ca hiến máu!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      console.error("Error saving volume:", err);
      await Swal.fire({
        title: "❌ Lưu thất bại!",
        text: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!",
        icon: "error",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Thử lại",
      });
    }
  };

  // Kiểm tra xem appointment đã có volume chưa
  const hasVolume = (item) => {
    return item.Volume && item.Volume > 0;
  };

  // Helper format giờ dạng 7h00, trả về '-' nếu không hợp lệ
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

  const formatDateVN = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d)) return "-";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
        Ghi nhận lưu lượng máu người hiến
      </h2>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded shadow text-center font-semibold">
          {successMsg}
        </div>
      )}

      <div className="flex flex-row items-center gap-4 mb-6">
        {/* Nhóm filter đầu */}
        <div className="flex flex-row items-center gap-4">
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
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <div className="text-lg font-semibold text-red-700">
            Tổng lưu lượng máu:{" "}
            <span className="text-blue-700">{totalVolume}</span> ml
          </div>
        </div>
        {/* Nhóm tìm kiếm, đẩy về cuối hàng */}
        <div className="flex flex-row items-center gap-4 ml-auto">
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
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
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
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-red-100 text-red-600">
              <th className="py-3 px-4 text-left">Họ Tên</th>
              <th className="py-3 px-4 text-left">SĐT</th>
              <th className="py-3 px-4 text-left">Nhóm Máu</th>
              <th className="py-3 px-4 text-left">Ngày hiến</th>
              <th className="py-3 px-4 text-left">Khung giờ</th>
              <th className="py-3 px-4 text-left">Lưu lượng (ml)</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
              <th className="py-3 px-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              (() => {
                // Logic phân trang
                const filteredData = appointments.filter(
                  (item) =>
                    (item.Status === "Processing" ||
                      item.Status === "Completed") &&
                    (!nameSearch ||
                      (item.User_Name || item.Name || "")
                        .toLowerCase()
                        .includes(nameSearch.toLowerCase())) &&
                    (!phoneSearch ||
                      (item.Phone || "")
                        .toLowerCase()
                        .includes(phoneSearch.toLowerCase()))
                );

                const totalPages = Math.ceil(
                  filteredData.length / itemsPerPage
                );
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const currentData = filteredData.slice(startIndex, endIndex);

                return currentData.map((item) => {
                  const itemHasVolume = hasVolume(item);
                  return (
                    <tr
                      key={item.Appointment_ID}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-2 px-4">
                        {item.User_Name || item.Name}
                      </td>
                      <td className="py-2 px-4">{item.Phone}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {item.BloodType || "Chưa có"}
                        </span>
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
                      <td className="py-2 px-4">
                        {item.Status === "Completed" ? (
                          // Hiển thị volume đã lưu (chỉ đọc)
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-2 bg-green-100 text-green-800 rounded border font-medium">
                              {item.Volume} ml
                            </span>
                          </div>
                        ) : item.Status === "Processing" ? (
                          // Input để nhập volume mới (chỉ cho status 'A')
                          <input
                            type="number"
                            className="border rounded px-2 py-1 w-24 border-gray-300 focus:border-red-500 focus:outline-none"
                            min={1}
                            max={500}
                            step={1}
                            value={volumes[item.Appointment_ID] || ""}
                            onChange={(e) =>
                              handleVolumeChange(
                                item.Appointment_ID,
                                e.target.value
                              )
                            }
                            placeholder="ml"
                          />
                        ) : (
                          // Các status khác không hiển thị gì
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.Status === "Processing" && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Đang xử lý
                          </span>
                        )}
                        {(item.Status === "Completed" || itemHasVolume) && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            Đã hoàn thành
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {item.Status === "Processing" ? (
                          // Hiển thị nút Lưu cho status 'A' chưa có volume
                          <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 hover:shadow-md transition-all font-medium"
                            onClick={() =>
                              handleSave(
                                item.Appointment_ID,
                                item.User_Name || item.Name,
                                item.DATE,
                                item.Start_Time,
                                item.End_Time
                              )
                            }
                            disabled={!volumes[item.Appointment_ID]}
                          >
                            Lưu
                          </button>
                        ) : item.Status === "Completed" ? (
                          // Hiển thị trạng thái đã hoàn thành
                          <span></span>
                        ) : (
                          // Các trạng thái khác
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                });
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {(() => {
        const filteredData = appointments.filter(
          (item) =>
            (item.Status === "Processing" || item.Status === "Completed") &&
            (!nameSearch ||
              (item.User_Name || item.Name || "")
                .toLowerCase()
                .includes(nameSearch.toLowerCase())) &&
            (!phoneSearch ||
              (item.Phone || "")
                .toLowerCase()
                .includes(phoneSearch.toLowerCase()))
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

      {/* Thống kê */}
      <div className="mt-6 flex justify-center gap-4">
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <strong>📊 Tổng số ca đăng ký hiến máu:</strong> {filtered.length}
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
          <strong>✅ Đã ghi nhận:</strong>{" "}
          {
            filtered.filter(
              (item) => hasVolume(item) || item.Status === "Completed"
            ).length
          }
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          <strong>⏳ Đang xử lý:</strong>{" "}
          {
            filtered.filter(
              (item) => item.Status === "Processing" && !hasVolume(item)
            ).length
          }
        </div>
      </div>
    </div>
  );
};

export default EditBloodPage;
