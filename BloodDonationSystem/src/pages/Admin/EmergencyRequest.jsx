import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Contacted: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function EmergencyRequestHistory() {
  const {
    getInfoEmergencyRequestsByMember,
    loading,
    cancelEmergencyRequestByMember,
  } = useApi();
  const [requests, setRequests] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelId, setCancelId] = useState(null);

  const fetchHistory = async () => {
    const res = await getInfoEmergencyRequestsByMember();
    setRequests(res.data || []);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Mở popup xác nhận
  const handleCancel = (emergencyId) => {
    setCancelId(emergencyId);
    setShowConfirm(true);
  };

  // Xác nhận hủy
  const confirmCancel = async () => {
    await cancelEmergencyRequestByMember(cancelId);
    setShowConfirm(false);
    setCancelId(null);
    fetchHistory();
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full">
      <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">
        Lịch sử yêu cầu máu khẩn cấp
      </h2>
      {loading && <div className="text-center text-gray-500">Đang tải...</div>}
      {requests.length === 0 ? (
        <div className="text-center text-gray-500">
          Bạn chưa có yêu cầu khẩn cấp nào.
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm rounded-lg overflow-hidden shadow border border-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700">
                <th className="py-3 px-2 text-center">Lý do cần máu</th>
                <th className="py-3 px-2 text-center">Loại máu</th>
                <th className="py-3 px-2 text-center">Lượng (ml)</th>
                <th className="py-3 px-2 text-center">Ngày cần</th>
                <th className="py-3 px-2 text-center">Trạng thái</th>
                <th className="py-3 px-2 text-center">Ngày tạo</th>
                <th className="py-3 px-2 text-center">Lý do từ chối</th>
                <th className="py-3 px-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.Emergency_ID}
                  className="hover:bg-pink-50 transition"
                >
                  <td className="py-2 px-2 text-center">
                    {req.reason_Need ? req.reason_Need : "—"}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold shadow">
                      {req.BloodGroup}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">{req.Volume}</td>
                  <td className="py-2 px-2 text-center">
                    {req.Needed_Before?.split("T")[0]}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        statusColor[req.Status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.Status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {req.Created_At?.split("T")[0]}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {req.Status === "Rejected" ? req.reason_Reject || "—" : "—"}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {req.Status !== "Completed" &&
                      req.Status !== "Rejected" &&
                      req.Status !== "Cancelled" && (
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
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-sm w-full relative border-2 border-red-300">
            <h2 className="text-lg font-bold text-red-600 mb-4 text-center">
              Xác nhận hủy yêu cầu
            </h2>
            <p className="mb-6 text-center text-gray-700">
              Bạn có chắc chắn muốn hủy yêu cầu này không?
            </p>
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
    </div>
  );
}
