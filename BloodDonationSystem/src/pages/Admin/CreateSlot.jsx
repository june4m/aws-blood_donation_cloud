import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useApi from "../../hooks/useApi";

/**
 * CreateSlot – form + modal confirm (hiệu ứng Framer Motion),
 * kết hợp validate ngày, validate giờ, tạo bulk slots
 */
export default function CreateSlot() {
  const { loading, createSlot } = useApi();

  // form data
  const [formData, setFormData] = useState({
    Start_Date: "",
    End_Date: "",
    Start_Time: "",
    End_Time: "",
    Max_Volume: "",
  });

  // trạng thái hiển thị và feedback
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [creatingSlots, setCreatingSlots] = useState(false);

  // HANDLERS

  // Xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // --- Validate thời gian ---
    if (name === "Start_Time") {
      setFormData((prev) => {
        const updated = { ...prev, Start_Time: value };
        if (prev.End_Time && prev.End_Time <= value) {
          setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
          // reset End_Time nếu không hợp lệ
          return { ...updated, End_Time: "" };
        }
        setTimeError("");
        return updated;
      });
      return;
    }
    if (name === "End_Time") {
      if (formData.Start_Time && value <= formData.Start_Time) {
        setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
      } else {
        setTimeError("");
      }
      setFormData((prev) => ({ ...prev, End_Time: value }));
      return;
    }

    // --- Validate ngày ---
    if (name === "Start_Date" || name === "End_Date") {
      const startDate = name === "Start_Date" ? value : formData.Start_Date;
      const endDate = name === "End_Date" ? value : formData.End_Date;

      if (startDate && endDate && endDate < startDate) {
        setDateError("Ngày kết thúc phải sau ngày bắt đầu");
      } else {
        setDateError("");
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // --- Các field còn lại ---
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Chọn khung giờ nhanh
  const handleTimeRangeChange = (e) => {
    const timeRange = e.target.value;
    if (!timeRange) {
      setFormData((prev) => ({
        ...prev,
        Start_Time: "",
        End_Time: "",
      }));
      setTimeError("");
      return;
    }
    const [startTime, endTime] = timeRange.split("-");
    setFormData((prev) => ({
      ...prev,
      Start_Time: startTime,
      End_Time: endTime,
    }));
    setTimeError("");
  };

  // Sinh mảng các ngày từ Start_Date đến End_Date
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    const curr = new Date(startDate);
    const last = new Date(endDate);
    while (curr <= last) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Gọi API tạo slot cho từng ngày sau khi confirm
  const handleSubmit = async () => {
    // validate bắt buộc (giữ nguyên)
    if (!formData.Start_Date || !formData.End_Date) {
      setMessage({
        text: "Vui lòng chọn ngày bắt đầu và ngày kết thúc",
        type: "error",
      });
      setShowConfirm(false);
      return;
    }
    if (dateError) {
      setMessage({ text: dateError, type: "error" });
      setShowConfirm(false);
      return;
    }
    if (!formData.Start_Time || !formData.End_Time) {
      setMessage({
        text: "Vui lòng chọn khung giờ",
        type: "error",
      });
      setShowConfirm(false);
      return;
    }
    if (timeError) {
      setMessage({ text: timeError, type: "error" });
      setShowConfirm(false);
      return;
    }

    setMessage({ text: "", type: "" });
    setCreatingSlots(true);

    const datesInRange = generateDateRange(
      formData.Start_Date,
      formData.End_Date
    );

    let successCount = 0;
    const errorDetails = [];
    const totalSlots = datesInRange.length;

    // Dừng ngay khi gặp lỗi đầu tiên
    for (const date of datesInRange) {
      try {
        await createSlot({
          Slot_Date: date,
          Start_Time: formData.Start_Time,
          End_Time: formData.End_Time,
          Max_Volume: parseInt(formData.Max_Volume, 10),
        });
        successCount++;
      } catch (err) {
        console.error(`Error on ${date}:`, err);

        // Lưu lỗi đầu tiên và DỪNG
        const errorMessage =
          err.response?.data?.message || err.message || "Lỗi không xác định";
        
        setMessage({
          text: `❌ Tạo ca thất bại!\n\nLỗi tại ngày ${new Date(date).toLocaleDateString("vi-VN")} (${formData.Start_Time} - ${formData.End_Time}):\n${errorMessage}\n\n⚠️ Đã tạo thành công ${successCount} ca trước đó.`,
          type: "error",
        });
        
        setCreatingSlots(false);
        setShowConfirm(false);
        return; // DỪNG TẠI ĐÂY
      }
    }

    // Chỉ đến đây khi TẤT CẢ thành công
    setMessage({
      text: `✅ Tạo thành công tất cả ${successCount} ca hiến máu`,
      type: "success",
    });
    
    // Reset form khi thành công hoàn toàn
    setFormData({
      Start_Date: "",
      End_Date: "",
      Start_Time: "",
      End_Time: "",
      Max_Volume: "",
    });

    setCreatingSlots(false);
    setShowConfirm(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-center text-lg font-semibold text-red-600 mb-6">
        Tạo Ca Hiến Máu
      </h2>

      {/* Sửa phần hiển thị message để hỗ trợ nhiều dòng */}
      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-left whitespace-pre-line ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : message.type === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
        className="space-y-4"
      >
        {/* Ngày Bắt Đầu */}
        <div>
          <label className="block text-sm font-medium mb-1">Ngày Bắt Đầu</label>
          <input
            type="date"
            name="Start_Date"
            value={formData.Start_Date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Ngày Kết Thúc */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày Kết Thúc
          </label>
          <input
            type="date"
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            className={`w-full border ${
              dateError ? "border-red-500" : "border-gray-300"
            } rounded px-3 py-2`}
            required
            min={
              formData.Start_Date || new Date().toISOString().split("T")[0]
            }
          />
          {dateError && (
            <p className="text-red-500 text-xs mt-1">{dateError}</p>
          )}
        </div>

        {/* Khung Giờ */}
        <div>
          <label className="block text-sm font-medium mb-1">Khung Giờ</label>
          <select
            value={
              formData.Start_Time && formData.End_Time
                ? `${formData.Start_Time}-${formData.End_Time}`
                : ""
            }
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Chọn khung giờ hiến máu</option>
            <option value="07:00-11:00">07:00 - 11:00</option>
            <option value="13:00-17:00">13:00 - 17:00</option>
          </select>
        </div>

        {/* Sức Chứa Tối Đa */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sức Chứa Tối Đa (Người)
          </label>
          <input
            type="number"
            name="Max_Volume"
            value={formData.Max_Volume}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="200"
            required
            min="1"
          />
        </div>

        {/* Nút Tạo */}
        <button
          type="submit"
          disabled={loading || creatingSlots || !!dateError || !!timeError}
          className={`w-full ${
            loading || creatingSlots || dateError || timeError
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } text-white py-2 rounded transition`}
        >
          {creatingSlots ? "Đang tạo ca hiến máu..." : "Tạo Ca Hiến Máu"}
        </button>

        {/* Thông báo khoảng ngày sẽ tạo */}
        {formData.Start_Date && formData.End_Date && !dateError && (
          <p className="text-sm text-gray-600 text-center">
            Sẽ tạo ca hiến máu từ{" "}
            {new Date(formData.Start_Date).toLocaleDateString("vi-VN")} đến{" "}
            {new Date(formData.End_Date).toLocaleDateString("vi-VN")}
          </p>
        )}
      </form>

      {/* Modal Xác Nhận */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() =>
                !(loading || creatingSlots) && setShowConfirm(false)
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Xác nhận tạo ca?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Tạo ca hiến máu từ ngày <b>{formData.Start_Date}</b> đến{" "}
                  <b>{formData.End_Date}</b>, khung giờ{" "}
                  <b>
                    {formData.Start_Time} - {formData.End_Time}
                  </b>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                    onClick={() => setShowConfirm(false)}
                    disabled={loading || creatingSlots}
                  >
                    Huỷ
                  </button>
                  <button
                    className={`px-4 py-2 text-white rounded ${
                      loading || creatingSlots
                        ? "bg-blue-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={handleSubmit}
                    disabled={loading || creatingSlots}
                  >
                    {loading || creatingSlots ? "Đang tạo..." : "Xác nhận"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
