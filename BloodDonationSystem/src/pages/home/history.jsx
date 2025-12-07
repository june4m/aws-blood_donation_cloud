import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { toast } from "react-toastify";

const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    Contacted: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700"
};
const statusLabel = {
    Pending: "Đang chờ",
    Contacted: "Đã liên hệ",
    Completed: "Đã hoàn thành",
    Rejected: "Đã từ chối"
};

export default function History() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "";
    const {
        getInfoEmergencyRequestsByMember,
        historyAppointmentsByUser,
        loading,
        cancelEmergencyRequestByMember,
        historyPatientByUser
    } = useApi();
    const [requests, setRequests] = useState([]);
    const [donateHistory, setDonateHistory] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [cancelId, setCancelId] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [patientInfo, setPatientInfo] = useState(null);
    const [patientLoading, setPatientLoading] = useState(false);

    useEffect(() => {
        getInfoEmergencyRequestsByMember().then(res => setRequests(res.data || []));
        historyAppointmentsByUser().then(res => setDonateHistory(res.data || []));
    }, [getInfoEmergencyRequestsByMember, historyAppointmentsByUser]);

    // Popup xác nhận hủy khẩn cấp
    const handleCancel = (emergencyId) => {
        setCancelId(emergencyId);
        setShowConfirm(true);
    };
    const confirmCancel = async () => {
        try {
            await cancelEmergencyRequestByMember(cancelId);
            setRequests(prevRequests => prevRequests.filter(req => req.Emergency_ID !== cancelId));
            setShowConfirm(false);
            setCancelId(null);
            toast.success("Hủy yêu cầu thành công!"); // Sử dụng toast.success
        } catch (error) {
            console.error("Lỗi khi hủy yêu cầu:", error);
            try {
                const updatedRequests = await getInfoEmergencyRequestsByMember();
                const currentRequests = updatedRequests.data || [];
                const requestStillExists = currentRequests.some(req => req.Emergency_ID === cancelId);
                if (!requestStillExists) {
                    setRequests(currentRequests);
                    setShowConfirm(false);
                    setCancelId(null);
                    toast.success("Hủy yêu cầu thành công!"); // Sử dụng toast.success
                } else {
                    toast.error("Có lỗi xảy ra khi hủy yêu cầu!"); // Sử dụng toast.error
                }
            } catch (refreshError) {
console.error("Lỗi khi refresh danh sách:", refreshError);
                toast.error("Có lỗi xảy ra khi hủy yêu cầu!"); // Sử dụng toast.error
            }
        }
    };

    // Popup xem hồ sơ bệnh án
    const handleViewPatient = async (appointmentId) => {
        setPatientLoading(true);
        setShowPatientModal(true);
        try {
            const res = await historyPatientByUser(appointmentId);
            setPatientInfo(res.data || null);
        } catch {
            setPatientInfo(null);
        } finally {
            setPatientLoading(false);
        }
    };

    // Helper format
    const formatDateVN = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
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
    const getStatusLabel = (status) => {
        switch (status) {
            case "Pending": return "Đang chờ chấp thuận";
            case "Processing": return "Được hiến";
            case "Completed": return "Đã hiến xong";
            case "Canceled": return "Từ chối";
            default: return status;
        }
    };

    // Quyết định hiển thị bảng nào
    const showDonate = type === "donate" || type === "all";
    const showEmergency = type === "emergency" || type === "all";

    return (
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
            {/* Đã xóa dropdown chọn loại lịch sử, giữ lại các phần còn lại */}
            <div className="flex mb-4">
                <select
                    className="bg-white border-2 border-gray-400 text-black px-6 py-2 rounded shadow font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition h-[48px] min-w-[220px] max-w-full md:w-auto"
                    value={type === 'donate' ? 'donate' : type === 'emergency' ? 'emergency' : ''}
                    onChange={e => {
                        const value = e.target.value;
                        if (value === "donate") {
                            navigate("/history?type=donate");
                        } else if (value === "emergency") {
                            navigate("/history?type=emergency");
                        }
                    }}
                >
                    <option value="donate">Lịch sử hiến máu</option>
<option value="emergency">Lịch sử hiến máu khẩn cấp</option>
                </select>
            </div>
            {(type === 'donate' || type === 'emergency' || type === 'all') ? (
                <>
                    {/* Tiêu đề động */}
                    {type === "donate" && (
                        <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Lịch sử hiến máu của bạn</h2>
                    )}
                    {type === "emergency" && (
                        <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Lịch sử hiến máu khẩn cấp</h2>
                    )}
                    {type === "all" && null}
                    {loading && <div className="text-center text-gray-500">Đang tải....</div>}
                    {/* Lịch sử đăng ký hiến máu của bạn */}
                    {showDonate && (
                        <>
                            {type === "all" && (
                                <h3 className="text-xl font-bold text-red-600 mb-4 mt-6 text-center">Lịch sử đăng ký hiến máu của bạn</h3>
                            )}
                            {donateHistory.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">Bạn chưa đăng ký hiến máu nào.</div>
                            ) : (
                                <div className="overflow-x-auto mb-8">
                                    <table className="w-full table-auto bg-white rounded-xl shadow-lg border border-gray-200 text-base">
                                        <thead className="bg-red-100">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold text-center">Ngày</th>
                                                <th className="px-6 py-3 font-semibold text-center">Khung giờ</th>
                                                <th className="px-6 py-3 font-semibold text-center">Lượng máu (ml)</th>
                                                <th className="px-6 py-3 font-semibold text-center">Trạng thái</th>
                                                <th className="px-6 py-3 font-semibold text-center">Lý do từ chối</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donateHistory.map((reg) => {
                                                let statusColor = "text-gray-700 bg-gray-50";
                                                if (reg.Status === "Pending") statusColor = "text-yellow-700 bg-yellow-50";
                                                else if (reg.Status === "Processing") statusColor = "text-blue-700 bg-blue-50";
                                                else if (reg.Status === "Completed") statusColor = "text-green-700 bg-green-50";
else if (reg.Status === "Canceled") statusColor = "text-red-700 bg-red-50";
                                                return (
                                                    <tr key={reg.Appointment_ID} className="border-b hover:bg-gray-100 transition">
                                                        <td className="px-6 py-3 font-medium text-center">{formatDateVN(reg.Slot_Date)}</td>
                                                        <td className="px-6 py-3 font-mono text-blue-700 text-center">
                                                            {reg.Start_Time && reg.End_Time ? `${formatTimeVN(reg.Start_Time)} - ${formatTimeVN(reg.End_Time)}` : "-"}
                                                        </td>
                                                        <td className="px-6 py-3 font-semibold text-center">
                                                            {reg.Status === "Completed" && reg.Volume ? (
                                                                <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full">{reg.Volume} ml</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className={`px-6 py-3 font-semibold rounded text-center ${statusColor}`}>{getStatusLabel(reg.Status)}</td>
                                                        <td className="px-6 py-3 whitespace-pre-line text-center">
                                                            {reg.Status === "Canceled" && reg.Reason_Reject ? (
                                                                reg.Reason_Reject
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="text-xs text-gray-500 mt-2 text-right pr-2">
                                        * Lượng máu chỉ hiển thị khi trạng thái là <span className="text-green-700 font-semibold">Đã hiến xong</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {/* Lịch sử hiến máu khẩn cấp */}
{showEmergency && (
                        <>
                            {type === "all" && (
                                <h3 className="text-xl font-bold text-red-600 mb-4 mt-6 text-center">Lịch sử hiến máu khẩn cấp</h3>
                            )}
                            {requests.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">Bạn chưa có yêu cầu khẩn cấp nào.</div>
                            ) : (
                                <div className="overflow-x-auto mb-8">
                                    <table className="min-w-full text-base md:text-lg rounded-lg overflow-hidden shadow border border-gray-200">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700">
                                                <th className="py-3 px-2 text-center font-semibold">Lý do cần máu</th>
                                                <th className="py-3 px-2 text-center font-semibold">Loại máu</th>
                                                <th className="py-3 px-2 text-center font-semibold">Lượng (ml)</th>
                                                <th className="py-3 px-2 text-center font-semibold">Ngày cần</th>
                                                <th className="py-3 px-2 text-center font-semibold">Trạng thái</th>
                                                <th className="py-3 px-2 text-center font-semibold">Ngày tạo</th>
                                                <th className="py-3 px-2 text-center font-semibold w-48">Lý do từ chối</th> {/* Giới hạn độ rộng */}
                                                <th className="py-3 px-2 text-center font-semibold">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map((req) => (
                                                <tr key={req.Emergency_ID} className="hover:bg-pink-50 transition">
                                                    <td className="py-2 px-2 text-center">{req.reason_Need ? req.reason_Need : "—"}</td>
                                                    <td className="py-2 px-2 text-center">
                                                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold shadow">{req.BloodGroup}</span>
                                                    </td>
                                                    <td className="py-2 px-2 text-center">{req.Volume}</td>
                                                    <td className="py-2 px-2 text-center">{req.Needed_Before?.split("T")[0]}</td>
                                                    <td className="py-2 px-2 text-center">
<span className={`px-3 py-1 rounded-full font-semibold ${statusColor[req.Status] || "bg-gray-100 text-gray-700"}`}>
                                                            {statusLabel[req.Status] || req.Status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-2 text-center">{req.Created_At?.split("T")[0]}</td>
                                                    <td className="py-2 px-2 text-center break-words whitespace-pre-line w-48">
                                                        {req.Status === "Rejected" ? (req.reason_Reject || "—") : "—"}
                                                    </td>
                                                    <td className="py-2 px-2 text-center">
                                                        {req.Status !== "Completed" && req.Status !== "Rejected" && req.Status !== "Cancelled" && (
                                                            <button
                                                                className="px-4 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow hover:scale-105 hover:from-pink-600 hover:to-red-700 transition font-semibold"
                                                                onClick={() => handleCancel(req.Emergency_ID)}
                                                            >
                                                                Hủy yêu cầu
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : null}
            {/* Popup xác nhận hủy */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-sm w-full relative border-2 border-red-300">
                        <h2 className="text-lg font-bold text-red-600 mb-4 text-center">Xác nhận hủy yêu cầu</h2>
                        <p className="mb-6 text-center text-gray-700">Bạn có chắc chắn muốn hủy yêu cầu này không?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowConfirm(false)}
                            >
Đóng
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold"
                                onClick={confirmCancel}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Popup xem hồ sơ bệnh án */}
            {showPatientModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4 text-center text-blue-700">Hồ sơ bệnh án</h2>
                        {patientLoading ? (
                            <div className="text-center text-gray-500 py-8">Đang tải...</div>
                        ) : patientInfo ? (
                            <>
                                <div className="mb-3">
                                    <span className="font-semibold">Mô tả:</span>
                                    <div className="text-gray-800 mt-1">{patientInfo.Description || <span className="italic text-gray-400">Chưa có mô tả</span>}</div>
                                </div>
                                <div className="mb-3">
                                    <span className="font-semibold">Trạng thái:</span>
                                    <div className="text-gray-800 mt-1">{patientInfo.Status || <span className="italic text-gray-400">Chưa cập nhật</span>}</div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-400 py-8">Không có dữ liệu bệnh án.</div>
                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                onClick={() => setShowPatientModal(false)}
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